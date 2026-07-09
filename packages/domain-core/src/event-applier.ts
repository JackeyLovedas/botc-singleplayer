import { DomainError, assertNever } from "./errors.js";
import type { DomainErrorCode } from "./errors.js";
import { RULES_BASELINE_VERSION, SUPPORTED_DOMAIN_EVENT_VERSION, isCanonicalPlayerCounts } from "./events.js";
import type {
  AnyDomainEventEnvelope,
  CharactersAssignedPayload,
  DemonInformationDeliveredPayload,
  DomainEventEnvelope,
  FirstNightInitializedPayload,
  FirstNightTaskPlanCreatedPayload,
  InitialPrivateKnowledgeEstablishedPayload,
  MinionInformationDeliveredPayload,
  PlayerRosterCreatedPayload,
  ScheduledTaskSettledPayload,
  SetupGeneratedPayload
} from "./events.js";
import type { GameState } from "./game-state.js";
import type { RoleId } from "./ids.js";
import { evaluatePhaseTransition } from "./phase-transition-policy.js";
import {
  appendFirstNightActionOpportunity,
  closeFirstNightActionOpportunity,
  hasClosedPhilosopherOpportunityForSettlement,
  validateFirstNightActionOpportunityCreatedPayload,
  validatePhilosopherActionDeferredPayload
} from "./first-night-action-opportunity.js";
import {
  SUPPORTED_ASSIGNMENT_ALGORITHM_VERSION,
  SUPPORTED_ASSIGNMENT_RANDOM_STREAM,
  validateCharacterAssignments
} from "./character-assignment.js";
import { deriveInitialCurrentCharacterStateSet } from "./current-character-state.js";
import {
  cloneFirstNightTaskProgress,
  getNextUnsettledFirstNightTask,
  isFirstNightTaskSettled,
  validateFirstNightTaskProgress,
  validateFirstNightTaskPlanCreatedPayload,
  validateScheduledTaskSettledPayloadShape,
} from "./first-night-task-plan.js";
import {
  validateDemonInformationDeliveredAtSettlement,
  validateMinionInformationDeliveredAtSettlement
} from "./first-night-team-information.js";
import {
  appendAbilityImpairment,
  appendFirstNightTaskInsertion,
  appendPhilosopherAbilityChoice,
  appendPhilosopherGrantedAbility,
  applyFirstNightTaskInsertionToPlan,
  hasPhilosopherAbilityGrantForSettlement,
  validateAbilityImpairmentAppliedPayload,
  validateFirstNightTaskInsertedPayload,
  validatePhilosopherAbilityChosenPayload,
  validatePhilosopherAbilityGrantedPayload
} from "./philosopher-ability.js";
import {
  SUPPORTED_FIRST_NIGHT_INITIALIZATION_VERSION,
  isPlainRecord,
  validateFirstNightInitializedPayloadShape,
  validateInitialOwnCharacterKnowledgePayload
} from "./initial-private-knowledge.js";
import {
  SUPPORTED_ROSTER_VERSION,
  validatePlayerRoster
} from "./player-roster.js";
import {
  BASE_TWELVE_PLAYER_COUNTS,
  CHARACTER_TYPES,
  SUPPORTED_RANDOM_ALGORITHM_VERSION,
  SUPPORTED_ROLE_CATALOG_SIGNATURE,
  SUPPORTED_ROLE_CATALOG_SIGNATURE_ALGORITHM,
  SUPPORTED_ROLE_CATALOG_VERSION,
  SUPPORTED_SCRIPT_ID,
  SUPPORTED_SCRIPT_EDITION,
  SUPPORTED_SETUP_ALGORITHM_VERSION,
  SUPPORTED_SETUP_RANDOM_STREAM,
  calculateRoleCatalogSignature,
  compareRoleSetupSnapshot,
  isStableRoleIdList,
  isSupportedScriptMetadata,
  isZeroSetupModifier,
  sameRoleSetupSnapshot,
  validateRoleSetupSnapshot
} from "./setup-types.js";
import type { RoleCountSet, RoleSetupSnapshot } from "./setup-types.js";

const countRolesByType = (roles: readonly RoleSetupSnapshot[]): RoleCountSet => ({
  TOWNSFOLK: roles.filter((role) => role.characterType === "TOWNSFOLK").length,
  OUTSIDER: roles.filter((role) => role.characterType === "OUTSIDER").length,
  MINION: roles.filter((role) => role.characterType === "MINION").length,
  DEMON: roles.filter((role) => role.characterType === "DEMON").length
});

const countTotal = (counts: RoleCountSet): number => counts.TOWNSFOLK + counts.OUTSIDER + counts.MINION + counts.DEMON;

const sameCounts = (left: RoleCountSet, right: RoleCountSet): boolean =>
  CHARACTER_TYPES.every((type) => left[type] === right[type]);

const allRoleIdsUnique = (roles: readonly RoleSetupSnapshot[]): boolean => {
  const roleIds = new Set(roles.map((role) => role.roleId));
  return roleIds.size === roles.length;
};

const roleIdsEqualAsSets = (left: readonly RoleId[], right: readonly RoleId[]): boolean => {
  if (left.length !== right.length) {
    return false;
  }

  const rightSet = new Set(right);
  return left.every((roleIdValue) => rightSet.has(roleIdValue));
};

const hasCanonicalRoleOrder = (roles: readonly RoleSetupSnapshot[]): boolean =>
  roles.every((role, index) => index === 0 || compareRoleSetupSnapshot(roles[index - 1] ?? role, role) < 0);

const hasCanonicalRoleIdOrder = (roles: readonly RoleSetupSnapshot[]): boolean =>
  roles.every((role, index) => index === 0 || (roles[index - 1]?.roleId ?? "") < role.roleId);

const hasUniqueRoleIds = (roles: readonly RoleSetupSnapshot[]): boolean =>
  new Set(roles.map((role) => role.roleId)).size === roles.length;

const expectedPostCountsForDemon = (demon: RoleSetupSnapshot): RoleCountSet => ({
  TOWNSFOLK: BASE_TWELVE_PLAYER_COUNTS.TOWNSFOLK + demon.setupModifier.townsfolkDelta,
  OUTSIDER: BASE_TWELVE_PLAYER_COUNTS.OUTSIDER + demon.setupModifier.outsiderDelta,
  MINION: BASE_TWELVE_PLAYER_COUNTS.MINION,
  DEMON: BASE_TWELVE_PLAYER_COUNTS.DEMON
});

const validateRoleCatalogSnapshot = (payload: SetupGeneratedPayload): ReadonlyMap<RoleId, RoleSetupSnapshot> => {
  const snapshot = payload.roleCatalogSnapshot;
  if (
    snapshot.scriptId !== payload.scriptId ||
    snapshot.edition !== SUPPORTED_SCRIPT_EDITION ||
    snapshot.roleCatalogVersion !== payload.roleCatalogVersion ||
    snapshot.roleCatalogVersion !== SUPPORTED_ROLE_CATALOG_VERSION
  ) {
    throw new DomainError("InvalidSetupGeneratedPayload", "SetupGenerated roleCatalogSnapshot metadata must match supported catalog metadata");
  }

  if (payload.roleCatalogSignatureAlgorithm !== SUPPORTED_ROLE_CATALOG_SIGNATURE_ALGORITHM) {
    throw new DomainError("InvalidSetupGeneratedPayload", "SetupGenerated roleCatalogSignatureAlgorithm must be supported");
  }

  if (snapshot.roles.length !== 25) {
    throw new DomainError("InvalidSetupGeneratedPayload", "SetupGenerated roleCatalogSnapshot must contain 25 roles");
  }

  if (!hasUniqueRoleIds(snapshot.roles)) {
    throw new DomainError("InvalidSetupGeneratedPayload", "SetupGenerated roleCatalogSnapshot role ids must be unique");
  }

  if (!hasCanonicalRoleOrder(snapshot.roles)) {
    throw new DomainError("InvalidSetupGeneratedPayload", "SetupGenerated roleCatalogSnapshot must use canonical role order");
  }

  if (snapshot.roles.some((role) => !validateRoleSetupSnapshot(role))) {
    throw new DomainError("InvalidSetupGeneratedPayload", "SetupGenerated roleCatalogSnapshot contains invalid role metadata");
  }

  const catalogCounts = countRolesByType(snapshot.roles);
  const expectedCatalogCounts: RoleCountSet = {
    TOWNSFOLK: 13,
    OUTSIDER: 4,
    MINION: 4,
    DEMON: 4
  };
  if (!sameCounts(catalogCounts, expectedCatalogCounts)) {
    throw new DomainError("InvalidSetupGeneratedPayload", "SetupGenerated roleCatalogSnapshot must contain 13/4/4/4 roles");
  }

  const recalculatedSignature = calculateRoleCatalogSignature(snapshot);
  if (
    snapshot.canonicalSignature !== payload.roleCatalogSignature ||
    payload.roleCatalogSignature !== recalculatedSignature ||
    payload.roleCatalogSignature !== SUPPORTED_ROLE_CATALOG_SIGNATURE
  ) {
    throw new DomainError("InvalidSetupGeneratedPayload", "SetupGenerated role catalog signature must match the supported exact catalog");
  }

  return new Map(snapshot.roles.map((role) => [role.roleId, role]));
};

const requireCatalogRole = (
  catalogById: ReadonlyMap<RoleId, RoleSetupSnapshot>,
  role: RoleSetupSnapshot,
  message: string
): void => {
  const catalogRole = catalogById.get(role.roleId);
  if (catalogRole === undefined || !sameRoleSetupSnapshot(role, catalogRole)) {
    throw new DomainError("InvalidSetupGeneratedPayload", message);
  }
};

const validateConstraintsSnapshot = (
  payload: SetupGeneratedPayload,
  catalogById: ReadonlyMap<RoleId, RoleSetupSnapshot>
): void => {
  const { lockedRoleIds, excludedRoleIds, exactRoleIds } = payload.constraintsSnapshot;
  if (!isStableRoleIdList(lockedRoleIds) || !isStableRoleIdList(excludedRoleIds) || !isStableRoleIdList(exactRoleIds)) {
    throw new DomainError("InvalidSetupGeneratedPayload", "SetupGenerated constraintsSnapshot lists must be unique and ASCII sorted");
  }

  const allConstraintIds = [...lockedRoleIds, ...excludedRoleIds, ...exactRoleIds];
  if (allConstraintIds.some((roleIdValue) => !catalogById.has(roleIdValue))) {
    throw new DomainError("InvalidSetupGeneratedPayload", "SetupGenerated constraintsSnapshot roles must exist in roleCatalogSnapshot");
  }

  const excluded = new Set(excludedRoleIds);
  if (lockedRoleIds.some((roleIdValue) => excluded.has(roleIdValue))) {
    throw new DomainError("InvalidSetupGeneratedPayload", "SetupGenerated locked and excluded constraints must not overlap");
  }

  const actualRoleIds = payload.actualRoles.map((role) => role.roleId);
  const actualRoleIdSet = new Set(actualRoleIds);
  const bluffRoleIdSet = new Set(payload.demonBluffs.map((role) => role.roleId));

  if (lockedRoleIds.some((roleIdValue) => !actualRoleIdSet.has(roleIdValue))) {
    throw new DomainError("InvalidSetupGeneratedPayload", "SetupGenerated locked roles must appear in actualRoles");
  }

  if (excludedRoleIds.some((roleIdValue) => actualRoleIdSet.has(roleIdValue) || bluffRoleIdSet.has(roleIdValue))) {
    throw new DomainError("InvalidSetupGeneratedPayload", "SetupGenerated excluded roles must not appear in actualRoles or demonBluffs");
  }

  if (exactRoleIds.length > 0) {
    if (exactRoleIds.length !== 12 || lockedRoleIds.length > 0 || excludedRoleIds.length > 0) {
      throw new DomainError("InvalidSetupGeneratedPayload", "SetupGenerated exactRoleIds must be the only constraints and contain 12 roles");
    }

    if (!roleIdsEqualAsSets(exactRoleIds, actualRoleIds)) {
      throw new DomainError("InvalidSetupGeneratedPayload", "SetupGenerated exactRoleIds must match actualRoles");
    }
  }
};

const validateSetupGeneratedPayload = (state: GameState, payload: SetupGeneratedPayload): void => {
  if (state.phase !== "SETUP_GENERATION") {
    throw new DomainError("InvalidSetupGeneratedPayload", "SetupGenerated can only be applied during SETUP_GENERATION");
  }

  if (state.selectedScript === undefined) {
    throw new DomainError("InvalidSetupGeneratedPayload", "SetupGenerated requires a selected script");
  }

  if (!isSupportedScriptMetadata(state.selectedScript.scriptId, state.selectedScript.scriptName, state.selectedScript.edition)) {
    throw new DomainError("InvalidSetupGeneratedPayload", "SetupGenerated requires Sects & Violets as the selected script");
  }

  if (state.setup !== undefined) {
    throw new DomainError("DuplicateSetupGenerated", "SetupGenerated cannot overwrite existing setup");
  }

  if (payload.scriptId !== SUPPORTED_SCRIPT_ID) {
    throw new DomainError("InvalidSetupGeneratedPayload", "SetupGenerated scriptId must be sects-and-violets");
  }

  if (payload.setupAlgorithmVersion !== SUPPORTED_SETUP_ALGORITHM_VERSION ||
    payload.randomAlgorithmVersion !== SUPPORTED_RANDOM_ALGORITHM_VERSION ||
    payload.randomStream !== SUPPORTED_SETUP_RANDOM_STREAM ||
    payload.roleCatalogVersion !== SUPPORTED_ROLE_CATALOG_VERSION) {
    throw new DomainError("InvalidSetupGeneratedPayload", "SetupGenerated setup algorithm and catalog versions must be supported");
  }

  const catalogById = validateRoleCatalogSnapshot(payload);

  if (!sameCounts(payload.preModifierCounts, BASE_TWELVE_PLAYER_COUNTS)) {
    throw new DomainError("InvalidSetupGeneratedPayload", "SetupGenerated preModifierCounts must be 7/2/2/1");
  }

  if (countTotal(payload.postModifierCounts) !== 12 || CHARACTER_TYPES.some((type) => payload.postModifierCounts[type] < 0)) {
    throw new DomainError("InvalidSetupGeneratedPayload", "SetupGenerated postModifierCounts must be non-negative and total 12");
  }

  if (payload.actualRoles.length !== 12) {
    throw new DomainError("InvalidSetupGeneratedPayload", "SetupGenerated actualRoles must contain 12 roles");
  }

  if (!allRoleIdsUnique(payload.actualRoles)) {
    throw new DomainError("InvalidSetupGeneratedPayload", "SetupGenerated actualRoles must be unique");
  }

  if (!hasCanonicalRoleOrder(payload.actualRoles)) {
    throw new DomainError("InvalidSetupGeneratedPayload", "SetupGenerated actualRoles must use canonical role order");
  }

  if (payload.actualRoles.some((role) => !validateRoleSetupSnapshot(role)) || !validateRoleSetupSnapshot(payload.demonRole)) {
    throw new DomainError("InvalidSetupGeneratedPayload", "SetupGenerated role snapshots must contain valid setup metadata");
  }

  for (const role of payload.actualRoles) {
    requireCatalogRole(catalogById, role, "SetupGenerated actualRoles must match roleCatalogSnapshot");
  }

  requireCatalogRole(catalogById, payload.demonRole, "SetupGenerated demonRole must match roleCatalogSnapshot");

  const actualCounts = countRolesByType(payload.actualRoles);
  if (!sameCounts(actualCounts, payload.postModifierCounts)) {
    throw new DomainError("InvalidSetupGeneratedPayload", "SetupGenerated actual role counts must match postModifierCounts");
  }

  if (actualCounts.DEMON !== 1 || actualCounts.MINION !== 2) {
    throw new DomainError("InvalidSetupGeneratedPayload", "SetupGenerated must contain exactly 1 demon and 2 minions");
  }

  const actualRoleIds = new Set(payload.actualRoles.map((role) => role.roleId));
  const actualDemons = payload.actualRoles.filter((role) => role.characterType === "DEMON");
  const [actualDemon] = actualDemons;
  if (actualDemons.length !== 1 || actualDemon === undefined || !sameRoleSetupSnapshot(payload.demonRole, actualDemon)) {
    throw new DomainError("InvalidSetupGeneratedPayload", "SetupGenerated demonRole must deeply match the demon in actualRoles");
  }

  const expectedPostCounts = expectedPostCountsForDemon(payload.demonRole);
  if (!sameCounts(payload.postModifierCounts, expectedPostCounts)) {
    throw new DomainError("InvalidSetupGeneratedPayload", "SetupGenerated postModifierCounts must match demon setup modifier");
  }

  const demonModifierIsZero = isZeroSetupModifier(payload.demonRole.setupModifier);
  if (demonModifierIsZero && payload.setupModifiersApplied.length !== 0) {
    throw new DomainError("InvalidSetupGeneratedPayload", "SetupGenerated must not apply zero setup modifiers");
  }

  if (!demonModifierIsZero) {
    const [applied] = payload.setupModifiersApplied;
    if (
      payload.setupModifiersApplied.length !== 1 ||
      applied === undefined ||
      applied.roleId !== payload.demonRole.roleId ||
      applied.outsiderDelta !== payload.demonRole.setupModifier.outsiderDelta ||
      applied.townsfolkDelta !== payload.demonRole.setupModifier.townsfolkDelta
    ) {
      throw new DomainError("InvalidSetupGeneratedPayload", "SetupGenerated setup modifiers must match the demon role");
    }
  }

  if (payload.demonBluffs.length !== 3) {
    throw new DomainError("InvalidSetupGeneratedPayload", "SetupGenerated demonBluffs must contain 3 roles");
  }

  if (!allRoleIdsUnique(payload.demonBluffs)) {
    throw new DomainError("InvalidSetupGeneratedPayload", "SetupGenerated demonBluffs must be unique");
  }

  if (!hasCanonicalRoleIdOrder(payload.demonBluffs)) {
    throw new DomainError("InvalidSetupGeneratedPayload", "SetupGenerated demonBluffs must use canonical roleId order");
  }

  if (
    payload.demonBluffs.some(
      (role) =>
        !validateRoleSetupSnapshot(role) ||
        role.defaultAlignment !== "GOOD" ||
        actualRoleIds.has(role.roleId)
    )
  ) {
    throw new DomainError("InvalidSetupGeneratedPayload", "SetupGenerated demonBluffs must be good, Sects & Violets, and not actual roles");
  }

  for (const role of payload.demonBluffs) {
    requireCatalogRole(catalogById, role, "SetupGenerated demonBluffs must match roleCatalogSnapshot");
  }

  if (
    payload.validationSummary.actualRoleCount !== 12 ||
    payload.validationSummary.demonBluffCount !== 3 ||
    !payload.validationSummary.roleIdsUnique ||
    payload.validationSummary.demonRoleCount !== 1 ||
    payload.validationSummary.minionRoleCount !== 2 ||
    !payload.validationSummary.actualRolesMatchPostModifierCounts
  ) {
    throw new DomainError("InvalidSetupGeneratedPayload", "SetupGenerated validationSummary must match payload invariants");
  }

  validateConstraintsSnapshot(payload, catalogById);
};

const validatePlayerRosterCreatedPayload = (state: GameState, payload: PlayerRosterCreatedPayload): void => {
  if (state.phase !== "CHARACTER_ASSIGNMENT") {
    throw new DomainError("InvalidPlayerRosterCreatedPayload", "PlayerRosterCreated can only be applied during CHARACTER_ASSIGNMENT");
  }

  if (state.setup === undefined) {
    throw new DomainError("InvalidPlayerRosterCreatedPayload", "PlayerRosterCreated requires generated setup");
  }

  if (state.roster !== undefined) {
    throw new DomainError("DuplicatePlayerRosterCreated", "PlayerRosterCreated cannot overwrite an existing roster");
  }

  if (state.assignment !== undefined) {
    throw new DomainError("InvalidPlayerRosterCreatedPayload", "PlayerRosterCreated cannot be applied after character assignment");
  }

  if (payload.rosterVersion !== SUPPORTED_ROSTER_VERSION) {
    throw new DomainError("InvalidPlayerRosterCreatedPayload", "PlayerRosterCreated rosterVersion must be supported");
  }

  const rosterValidation = validatePlayerRoster(payload.entries);
  if (!rosterValidation.valid) {
    throw new DomainError("InvalidPlayerRosterCreatedPayload", rosterValidation.reason);
  }
};

const validateCharactersAssignedPayload = (state: GameState, payload: CharactersAssignedPayload): void => {
  if (state.phase !== "CHARACTER_ASSIGNMENT") {
    throw new DomainError("InvalidCharactersAssignedPayload", "CharactersAssigned can only be applied during CHARACTER_ASSIGNMENT");
  }

  if (state.setup === undefined) {
    throw new DomainError("InvalidCharactersAssignedPayload", "CharactersAssigned requires generated setup");
  }

  if (state.roster === undefined) {
    throw new DomainError("InvalidCharactersAssignedPayload", "CharactersAssigned requires a player roster");
  }

  if (state.assignment !== undefined) {
    throw new DomainError("DuplicateCharactersAssigned", "CharactersAssigned cannot overwrite an existing assignment");
  }

  if (payload.rosterVersion !== state.roster.rosterVersion) {
    throw new DomainError("InvalidCharactersAssignedPayload", "CharactersAssigned rosterVersion must match the applied player roster");
  }

  if (
    payload.rosterVersion !== SUPPORTED_ROSTER_VERSION ||
    payload.assignmentAlgorithmVersion !== SUPPORTED_ASSIGNMENT_ALGORITHM_VERSION ||
    payload.randomAlgorithmVersion !== SUPPORTED_RANDOM_ALGORITHM_VERSION ||
    payload.randomStream !== SUPPORTED_ASSIGNMENT_RANDOM_STREAM
  ) {
    throw new DomainError("InvalidCharactersAssignedPayload", "CharactersAssigned version fields must be supported");
  }

  if (payload.roleCatalogSignature !== state.setup.roleCatalogSignature) {
    throw new DomainError("InvalidCharactersAssignedPayload", "CharactersAssigned roleCatalogSignature must match setup");
  }

  const assignmentValidation = validateCharacterAssignments({
    assignments: payload.assignments,
    roster: state.roster.entries,
    actualRoles: state.setup.actualRoles,
    roleCatalogRoles: state.setup.roleCatalogSnapshot.roles
  });
  if (!assignmentValidation.valid) {
    throw new DomainError("InvalidCharactersAssignedPayload", assignmentValidation.reason);
  }
};

const validateFirstNightInitializedPayload = (state: GameState, payload: FirstNightInitializedPayload): void => {
  const shapeValidation = validateFirstNightInitializedPayloadShape(payload);
  if (!shapeValidation.valid) {
    throw new DomainError("InvalidFirstNightInitializedPayload", shapeValidation.reason);
  }

  if (state.phase !== "FIRST_NIGHT" || state.nightNumber !== 1 || state.dayNumber !== 0) {
    throw new DomainError("InvalidFirstNightInitializedPayload", "FirstNightInitialized requires FIRST_NIGHT night 1 before day 1");
  }

  if (state.setup === undefined || state.roster === undefined || state.assignment === undefined) {
    throw new DomainError("InvalidFirstNightInitializedPayload", "FirstNightInitialized requires setup, roster, and character assignment facts");
  }

  if (state.firstNight !== undefined) {
    throw new DomainError("DuplicateFirstNightInitialized", "FirstNightInitialized cannot overwrite existing first night state");
  }

  if (state.initialPrivateKnowledge !== undefined) {
    throw new DomainError("InvalidFirstNightInitializedPayload", "FirstNightInitialized cannot be applied after initial private knowledge");
  }

  if (payload.initializationVersion !== SUPPORTED_FIRST_NIGHT_INITIALIZATION_VERSION || payload.nightNumber !== 1) {
    throw new DomainError("InvalidFirstNightInitializedPayload", "FirstNightInitialized version and nightNumber must be supported");
  }

  if (
    payload.rosterVersion !== state.roster.rosterVersion ||
    payload.assignmentAlgorithmVersion !== state.assignment.assignmentAlgorithmVersion ||
    payload.roleCatalogSignature !== state.setup.roleCatalogSignature ||
    payload.roleCatalogSignature !== state.assignment.roleCatalogSignature
  ) {
    throw new DomainError("InvalidFirstNightInitializedPayload", "FirstNightInitialized metadata must match roster, assignment, and setup facts");
  }
};

const validateInitialPrivateKnowledgeEstablishedPayload = (
  state: GameState,
  payload: InitialPrivateKnowledgeEstablishedPayload
): void => {
  if (state.phase !== "FIRST_NIGHT" || state.nightNumber !== 1 || state.dayNumber !== 0) {
    throw new DomainError(
      "InvalidInitialPrivateKnowledgeEstablishedPayload",
      "InitialPrivateKnowledgeEstablished requires FIRST_NIGHT night 1 before day 1"
    );
  }

  if (state.setup === undefined || state.roster === undefined || state.assignment === undefined) {
    throw new DomainError(
      "InvalidInitialPrivateKnowledgeEstablishedPayload",
      "InitialPrivateKnowledgeEstablished requires setup, roster, and character assignment facts"
    );
  }

  if (state.firstNight === undefined) {
    throw new DomainError(
      "InvalidInitialPrivateKnowledgeEstablishedPayload",
      "InitialPrivateKnowledgeEstablished requires FirstNightInitialized in the rebuilt state"
    );
  }

  if (state.initialPrivateKnowledge !== undefined) {
    throw new DomainError(
      "DuplicateInitialPrivateKnowledgeEstablished",
      "InitialPrivateKnowledgeEstablished cannot overwrite existing initial private knowledge"
    );
  }

  const validation = validateInitialOwnCharacterKnowledgePayload(payload, {
    roster: state.roster.entries,
    assignment: state.assignment.assignments,
    setup: state.setup,
    rosterVersion: state.roster.rosterVersion,
    assignmentAlgorithmVersion: state.assignment.assignmentAlgorithmVersion,
    roleCatalogSignature: state.setup.roleCatalogSignature
  });
  if (!validation.valid) {
    throw new DomainError("InvalidInitialPrivateKnowledgeEstablishedPayload", validation.reason);
  }
};

const validateFirstNightTaskPlanCreatedPayloadForState = (
  state: GameState,
  payload: FirstNightTaskPlanCreatedPayload
): void => {
  if (state.phase !== "FIRST_NIGHT" || state.nightNumber !== 1 || state.dayNumber !== 0) {
    throw new DomainError(
      "InvalidFirstNightTaskPlanCreatedPayload",
      "FirstNightTaskPlanCreated requires FIRST_NIGHT night 1 before day 1"
    );
  }

  if (state.setup === undefined || state.roster === undefined || state.assignment === undefined) {
    throw new DomainError(
      "InvalidFirstNightTaskPlanCreatedPayload",
      "FirstNightTaskPlanCreated requires setup, roster, and character assignment facts"
    );
  }

  if (state.firstNight === undefined) {
    throw new DomainError(
      "InvalidFirstNightTaskPlanCreatedPayload",
      "FirstNightTaskPlanCreated requires FirstNightInitialized in the rebuilt state"
    );
  }

  if (state.initialPrivateKnowledge === undefined) {
    throw new DomainError(
      "InvalidFirstNightTaskPlanCreatedPayload",
      "FirstNightTaskPlanCreated requires InitialPrivateKnowledgeEstablished in the rebuilt state"
    );
  }

  if (state.firstNightTaskPlan !== undefined) {
    throw new DomainError(
      "DuplicateFirstNightTaskPlanCreated",
      "FirstNightTaskPlanCreated cannot overwrite an existing first-night task plan"
    );
  }

  const validation = validateFirstNightTaskPlanCreatedPayload(payload, {
    setup: state.setup,
    roster: state.roster.entries,
    assignment: state.assignment.assignments,
    firstNight: state.firstNight,
    initialPrivateKnowledge: state.initialPrivateKnowledge
  });
  if (!validation.valid) {
    throw new DomainError("InvalidFirstNightTaskPlanCreatedPayload", validation.reason);
  }
};

const validateMinionInformationDeliveredPayloadForState = (
  state: GameState,
  payload: MinionInformationDeliveredPayload
): void => {
  if (state.phase !== "FIRST_NIGHT" || state.nightNumber !== 1 || state.dayNumber !== 0) {
    throw new DomainError(
      "InvalidMinionInformationDeliveredPayload",
      "MinionInformationDelivered requires FIRST_NIGHT night 1 before day 1"
    );
  }

  if (state.setup === undefined || state.roster === undefined || state.currentCharacterState === undefined || state.firstNightTaskPlan === undefined) {
    throw new DomainError(
      "InvalidMinionInformationDeliveredPayload",
      "MinionInformationDelivered requires setup, roster, current character state, and first-night task plan"
    );
  }

  if (state.minionInformation !== undefined) {
    throw new DomainError("DuplicateMinionInformationDelivered", "MinionInformationDelivered cannot be applied twice");
  }

  const validation = validateMinionInformationDeliveredAtSettlement(payload, {
    currentCharacterState: state.currentCharacterState,
    roster: state.roster.entries,
    rosterVersion: state.roster.rosterVersion,
    setup: state.setup,
    firstNightTaskPlan: state.firstNightTaskPlan,
    firstNightTaskProgress: state.firstNightTaskProgress
  });
  if (!validation.valid) {
    throw new DomainError("InvalidMinionInformationDeliveredPayload", validation.reason);
  }
};

const validateDemonInformationDeliveredPayloadForState = (
  state: GameState,
  payload: DemonInformationDeliveredPayload
): void => {
  if (state.phase !== "FIRST_NIGHT" || state.nightNumber !== 1 || state.dayNumber !== 0) {
    throw new DomainError(
      "InvalidDemonInformationDeliveredPayload",
      "DemonInformationDelivered requires FIRST_NIGHT night 1 before day 1"
    );
  }

  if (state.setup === undefined || state.roster === undefined || state.currentCharacterState === undefined || state.firstNightTaskPlan === undefined) {
    throw new DomainError(
      "InvalidDemonInformationDeliveredPayload",
      "DemonInformationDelivered requires setup, roster, current character state, and first-night task plan"
    );
  }

  if (state.demonInformation !== undefined) {
    throw new DomainError("DuplicateDemonInformationDelivered", "DemonInformationDelivered cannot be applied twice");
  }

  const validation = validateDemonInformationDeliveredAtSettlement(payload, {
    currentCharacterState: state.currentCharacterState,
    roster: state.roster.entries,
    rosterVersion: state.roster.rosterVersion,
    setup: state.setup,
    firstNightTaskPlan: state.firstNightTaskPlan,
    firstNightTaskProgress: state.firstNightTaskProgress
  });
  if (!validation.valid) {
    throw new DomainError("InvalidDemonInformationDeliveredPayload", validation.reason);
  }
};

const validateFirstNightActionOpportunityCreatedPayloadForState = (
  state: GameState,
  payload: DomainEventEnvelope<"FirstNightActionOpportunityCreated">["payload"]
): void => {
  if (state.phase !== "FIRST_NIGHT" || state.nightNumber !== 1 || state.dayNumber !== 0) {
    throw new DomainError(
      "InvalidFirstNightActionOpportunityCreatedPayload",
      "FirstNightActionOpportunityCreated requires FIRST_NIGHT night 1 before day 1"
    );
  }

  if (state.firstNightTaskPlan === undefined || state.currentCharacterState === undefined) {
    throw new DomainError(
      "InvalidFirstNightActionOpportunityCreatedPayload",
      "FirstNightActionOpportunityCreated requires first-night task plan and current character state"
    );
  }

  const validation = validateFirstNightActionOpportunityCreatedPayload(payload, {
    taskId: payload.taskId,
    firstNightTaskPlan: state.firstNightTaskPlan,
    firstNightTaskProgress: state.firstNightTaskProgress,
    currentCharacterState: state.currentCharacterState,
    firstNightActionOpportunities: state.firstNightActionOpportunities
  });
  if (!validation.valid) {
    throw new DomainError("InvalidFirstNightActionOpportunityCreatedPayload", validation.reason);
  }
};

const validatePhilosopherActionDeferredPayloadForState = (
  state: GameState,
  payload: DomainEventEnvelope<"PhilosopherActionDeferred">["payload"]
): void => {
  if (state.phase !== "FIRST_NIGHT" || state.nightNumber !== 1 || state.dayNumber !== 0) {
    throw new DomainError(
      "InvalidPhilosopherActionDeferredPayload",
      "PhilosopherActionDeferred requires FIRST_NIGHT night 1 before day 1"
    );
  }

  if (state.firstNightTaskPlan === undefined || state.currentCharacterState === undefined) {
    throw new DomainError(
      "InvalidPhilosopherActionDeferredPayload",
      "PhilosopherActionDeferred requires first-night task plan and current character state"
    );
  }

  const validation = validatePhilosopherActionDeferredPayload(payload, {
    taskId: payload.taskId,
    firstNightTaskPlan: state.firstNightTaskPlan,
    firstNightTaskProgress: state.firstNightTaskProgress,
    currentCharacterState: state.currentCharacterState,
    firstNightActionOpportunities: state.firstNightActionOpportunities
  });
  if (!validation.valid) {
    throw new DomainError("InvalidPhilosopherActionDeferredPayload", validation.reason);
  }
};

const validatePhilosopherAbilityChosenPayloadForState = (
  state: GameState,
  payload: DomainEventEnvelope<"PhilosopherAbilityChosen">["payload"]
): void => {
  if (state.phase !== "FIRST_NIGHT" || state.nightNumber !== 1 || state.dayNumber !== 0) {
    throw new DomainError(
      "InvalidPhilosopherAbilityChosenPayload",
      "PhilosopherAbilityChosen requires FIRST_NIGHT night 1 before day 1"
    );
  }

  if (state.firstNightTaskPlan === undefined || state.currentCharacterState === undefined || state.setup === undefined) {
    throw new DomainError(
      "InvalidPhilosopherAbilityChosenPayload",
      "PhilosopherAbilityChosen requires setup, first-night task plan, and current character state"
    );
  }

  const validation = validatePhilosopherAbilityChosenPayload(payload, {
    taskId: payload.taskId,
    firstNightTaskPlan: state.firstNightTaskPlan,
    firstNightTaskProgress: state.firstNightTaskProgress,
    currentCharacterState: state.currentCharacterState,
    firstNightActionOpportunities: state.firstNightActionOpportunities,
    setup: state.setup
  });
  if (!validation.valid) {
    throw new DomainError("InvalidPhilosopherAbilityChosenPayload", validation.reason);
  }
};

const validatePhilosopherAbilityGrantedPayloadForState = (
  state: GameState,
  payload: DomainEventEnvelope<"PhilosopherAbilityGranted">["payload"]
): void => {
  const validation = validatePhilosopherAbilityGrantedPayload(payload, {
    choices: state.philosopherAbilityChoices,
    grants: state.philosopherGrantedAbilities
  });
  if (!validation.valid) {
    throw new DomainError("InvalidPhilosopherAbilityGrantedPayload", validation.reason);
  }
};

const validateAbilityImpairmentAppliedPayloadForState = (
  state: GameState,
  payload: DomainEventEnvelope<"AbilityImpairmentApplied">["payload"]
): void => {
  if (state.currentCharacterState === undefined) {
    throw new DomainError("InvalidAbilityImpairmentAppliedPayload", "AbilityImpairmentApplied requires current character state");
  }

  const validation = validateAbilityImpairmentAppliedPayload(payload, {
    currentCharacterState: state.currentCharacterState,
    grants: state.philosopherGrantedAbilities
  });
  if (!validation.valid) {
    throw new DomainError("InvalidAbilityImpairmentAppliedPayload", validation.reason);
  }
};

const validateFirstNightTaskInsertedPayloadForState = (
  state: GameState,
  payload: DomainEventEnvelope<"FirstNightTaskInserted">["payload"]
): void => {
  if (state.firstNightTaskPlan === undefined) {
    throw new DomainError("InvalidFirstNightTaskInsertedPayload", "FirstNightTaskInserted requires first-night task plan");
  }

  const validation = validateFirstNightTaskInsertedPayload(payload, {
    firstNightTaskPlan: state.firstNightTaskPlan,
    grants: state.philosopherGrantedAbilities,
    insertions: state.firstNightTaskInsertions
  });
  if (!validation.valid) {
    throw new DomainError("InvalidFirstNightTaskInsertedPayload", validation.reason);
  }
};

const validateScheduledTaskSettledPayloadForState = (
  state: GameState,
  payload: ScheduledTaskSettledPayload
): void => {
  if (state.phase !== "FIRST_NIGHT" || state.nightNumber !== 1 || state.dayNumber !== 0) {
    throw new DomainError(
      "InvalidScheduledTaskSettledPayload",
      "ScheduledTaskSettled requires FIRST_NIGHT night 1 before day 1"
    );
  }

  if (state.firstNightTaskPlan === undefined) {
    throw new DomainError("InvalidScheduledTaskSettledPayload", "ScheduledTaskSettled requires first-night task plan");
  }

  const shapeValidation = validateScheduledTaskSettledPayloadShape(payload);
  if (!shapeValidation.valid) {
    throw new DomainError("InvalidScheduledTaskSettledPayload", shapeValidation.reason);
  }

  if (isFirstNightTaskSettled(state.firstNightTaskProgress, payload.taskId)) {
    throw new DomainError("InvalidScheduledTaskSettledPayload", "ScheduledTaskSettled cannot settle a task twice");
  }

  const nextTask = getNextUnsettledFirstNightTask(state.firstNightTaskPlan, state.firstNightTaskProgress);
  if (nextTask === undefined || nextTask.taskId !== payload.taskId || nextTask.taskType !== payload.taskType) {
    throw new DomainError("InvalidScheduledTaskSettledPayload", "ScheduledTaskSettled must target the current next unsettled task");
  }

  if (payload.taskType === "MINION_INFO") {
    if (
      state.minionInformation === undefined ||
      state.minionInformation.taskId !== payload.taskId ||
      state.minionInformation.taskType !== payload.taskType ||
      state.minionInformation.characterStateRevision !== payload.characterStateRevision ||
      state.minionInformation.resolvedEvilTeam.characterStateRevision !== payload.characterStateRevision ||
      payload.outcomeType !== "MINION_INFORMATION_DELIVERED"
    ) {
      throw new DomainError("InvalidScheduledTaskSettledPayload", "ScheduledTaskSettled must match the delivered minion information");
    }
    return;
  }

  if (payload.taskType === "DEMON_INFO") {
    if (
      state.demonInformation === undefined ||
      state.demonInformation.taskId !== payload.taskId ||
      state.demonInformation.taskType !== payload.taskType ||
      state.demonInformation.characterStateRevision !== payload.characterStateRevision ||
      state.demonInformation.resolvedEvilTeam.characterStateRevision !== payload.characterStateRevision ||
      payload.outcomeType !== "DEMON_INFORMATION_DELIVERED"
    ) {
      throw new DomainError("InvalidScheduledTaskSettledPayload", "ScheduledTaskSettled must match the delivered demon information");
    }
    return;
  }

  if (payload.taskType === "PHILOSOPHER_ACTION") {
    if (payload.outcomeType === "PHILOSOPHER_DEFERRED") {
      if (!hasClosedPhilosopherOpportunityForSettlement(state.firstNightActionOpportunities, payload)) {
        throw new DomainError("InvalidScheduledTaskSettledPayload", "ScheduledTaskSettled must match a closed Philosopher action opportunity");
      }
      return;
    }

    if (payload.outcomeType === "PHILOSOPHER_ABILITY_CHOSEN") {
      if (
        !hasPhilosopherAbilityGrantForSettlement(
          state.philosopherGrantedAbilities,
          payload,
          state.firstNightActionOpportunities
        )
      ) {
        throw new DomainError("InvalidScheduledTaskSettledPayload", "ScheduledTaskSettled must match a granted Philosopher ability choice");
      }
      return;
    }

    throw new DomainError("InvalidScheduledTaskSettledPayload", "ScheduledTaskSettled uses an unsupported Philosopher outcome");
  }

  throw new DomainError(
    "InvalidScheduledTaskSettledPayload",
    "ScheduledTaskSettled only supports PHILOSOPHER_ACTION, MINION_INFO, and DEMON_INFO in this slice"
  );
};

const invalidPayloadCodeForEvent = (eventType: AnyDomainEventEnvelope["eventType"]): DomainErrorCode => {
  switch (eventType) {
    case "GameCreated":
      return "InvalidGameCreatedPayload";
    case "ScriptSelected":
      return "InvalidScriptSelectedPayload";
    case "SetupGenerated":
      return "InvalidSetupGeneratedPayload";
    case "PlayerRosterCreated":
      return "InvalidPlayerRosterCreatedPayload";
    case "CharactersAssigned":
      return "InvalidCharactersAssignedPayload";
    case "FirstNightInitialized":
      return "InvalidFirstNightInitializedPayload";
    case "InitialPrivateKnowledgeEstablished":
      return "InvalidInitialPrivateKnowledgeEstablishedPayload";
    case "FirstNightTaskPlanCreated":
      return "InvalidFirstNightTaskPlanCreatedPayload";
    case "FirstNightActionOpportunityCreated":
      return "InvalidFirstNightActionOpportunityCreatedPayload";
    case "PhilosopherActionDeferred":
      return "InvalidPhilosopherActionDeferredPayload";
    case "PhilosopherAbilityChosen":
      return "InvalidPhilosopherAbilityChosenPayload";
    case "PhilosopherAbilityGranted":
      return "InvalidPhilosopherAbilityGrantedPayload";
    case "AbilityImpairmentApplied":
      return "InvalidAbilityImpairmentAppliedPayload";
    case "FirstNightTaskInserted":
      return "InvalidFirstNightTaskInsertedPayload";
    case "MinionInformationDelivered":
      return "InvalidMinionInformationDeliveredPayload";
    case "DemonInformationDelivered":
      return "InvalidDemonInformationDeliveredPayload";
    case "ScheduledTaskSettled":
      return "InvalidScheduledTaskSettledPayload";
    case "PhaseTransitioned":
      return "InvalidPhaseTransition";
    default:
      return assertNever(eventType);
  }
};

const requirePayloadRulesBaseline = (event: AnyDomainEventEnvelope): string => {
  if (!isPlainRecord(event.payload) || typeof event.payload.rulesBaselineVersion !== "string") {
    throw new DomainError(invalidPayloadCodeForEvent(event.eventType), "Domain event payload must be a plain object with rulesBaselineVersion");
  }

  return event.payload.rulesBaselineVersion;
};

const validateEnvelope = (state: GameState | undefined, event: AnyDomainEventEnvelope): void => {
  if (event.eventVersion !== SUPPORTED_DOMAIN_EVENT_VERSION) {
    throw new DomainError("UnsupportedEventVersion", "Unsupported domain event version");
  }

  if (event.rulesBaselineVersion !== requirePayloadRulesBaseline(event)) {
    throw new DomainError("EventRulesBaselineMismatch", "Event rules baseline metadata must match payload");
  }

  if (state === undefined) {
    if (event.eventSequence !== 1) {
      throw new DomainError("EventSequenceJump", "First domain event sequence must be 1");
    }

    if (event.eventType !== "GameCreated") {
      throw new DomainError("MissingGameCreated", "First domain event must be GameCreated");
    }

    return;
  }

  if (event.gameId !== state.gameId) {
    throw new DomainError("EventGameMismatch", "Domain event game id does not match rebuilt state");
  }

  if (event.eventSequence !== state.lastEventSequence + 1) {
    throw new DomainError("EventSequenceJump", "Domain event sequence must be continuous");
  }

  if (event.rulesBaselineVersion !== state.rulesBaselineVersion) {
    throw new DomainError("EventRulesBaselineMismatch", "Domain event rules baseline must match rebuilt state");
  }
};

export const applyDomainEvent = (state: GameState | undefined, event: AnyDomainEventEnvelope): GameState => {
  validateEnvelope(state, event);

  switch (event.eventType) {
    case "GameCreated": {
      if (state !== undefined) {
        throw new DomainError("DuplicateGameCreated", "GameCreated cannot be applied twice");
      }

      if (event.payload.gameId !== event.gameId) {
        throw new DomainError("InvalidGameCreatedPayload", "GameCreated payload game id must match event game id");
      }

      if (event.rulesBaselineVersion !== RULES_BASELINE_VERSION) {
        throw new DomainError("EventRulesBaselineMismatch", "GameCreated must use the supported rules baseline");
      }

      if (!isCanonicalPlayerCounts(event.payload)) {
        throw new DomainError("InvalidPlayerCounts", "First release requires 12 players, 1 human, 11 AI, and 1 Storyteller");
      }

      return {
        gameId: event.gameId,
        gameVersion: event.gameVersion,
        lastEventSequence: event.eventSequence,
        phase: "SCRIPT_SELECTION",
        dayNumber: 0,
        nightNumber: 0,
        created: true,
        rootSeed: event.payload.rootSeed,
        rulesBaselineVersion: event.payload.rulesBaselineVersion,
        playerCounts: {
          playerCount: event.payload.playerCount,
          humanPlayerCount: event.payload.humanPlayerCount,
          aiPlayerCount: event.payload.aiPlayerCount,
          storytellerCount: event.payload.storytellerCount
        }
      };
    }

    case "ScriptSelected": {
      if (state === undefined) {
        throw new DomainError("MissingGameCreated", "ScriptSelected requires an existing game");
      }

      if (event.payload.rulesBaselineVersion !== state.rulesBaselineVersion) {
        throw new DomainError("InvalidScriptSelectedPayload", "ScriptSelected payload rules baseline must match game state");
      }

      if (state.phase !== "SCRIPT_SELECTION") {
        throw new DomainError("InvalidScriptSelectedPhase", "ScriptSelected can only be applied during SCRIPT_SELECTION");
      }

      if (state.selectedScript !== undefined) {
        throw new DomainError("DuplicateScriptSelected", "ScriptSelected cannot overwrite an existing script selection");
      }

      return {
        ...state,
        gameVersion: event.gameVersion,
        lastEventSequence: event.eventSequence,
        selectedScript: event.payload
      };
    }

    case "SetupGenerated": {
      if (state === undefined) {
        throw new DomainError("MissingGameCreated", "SetupGenerated requires an existing game");
      }

      if (event.payload.rulesBaselineVersion !== state.rulesBaselineVersion) {
        throw new DomainError("InvalidSetupGeneratedPayload", "SetupGenerated payload rules baseline must match game state");
      }

      validateSetupGeneratedPayload(state, event.payload);

      return {
        ...state,
        gameVersion: event.gameVersion,
        lastEventSequence: event.eventSequence,
        setup: event.payload
      };
    }

    case "PlayerRosterCreated": {
      if (state === undefined) {
        throw new DomainError("MissingGameCreated", "PlayerRosterCreated requires an existing game");
      }

      if (event.payload.rulesBaselineVersion !== state.rulesBaselineVersion) {
        throw new DomainError("InvalidPlayerRosterCreatedPayload", "PlayerRosterCreated payload rules baseline must match game state");
      }

      validatePlayerRosterCreatedPayload(state, event.payload);

      return {
        ...state,
        gameVersion: event.gameVersion,
        lastEventSequence: event.eventSequence,
        roster: event.payload
      };
    }

    case "CharactersAssigned": {
      if (state === undefined) {
        throw new DomainError("MissingGameCreated", "CharactersAssigned requires an existing game");
      }

      if (event.payload.rulesBaselineVersion !== state.rulesBaselineVersion) {
        throw new DomainError("InvalidCharactersAssignedPayload", "CharactersAssigned payload rules baseline must match game state");
      }

      validateCharactersAssignedPayload(state, event.payload);

      if (state.setup === undefined || state.roster === undefined) {
        throw new DomainError(
          "InvalidCharactersAssignedPayload",
          "CharactersAssigned current character state derivation requires setup and roster"
        );
      }

      return {
        ...state,
        gameVersion: event.gameVersion,
        lastEventSequence: event.eventSequence,
        assignment: event.payload,
        currentCharacterState: deriveInitialCurrentCharacterStateSet({
          roster: state.roster.entries,
          assignment: event.payload.assignments,
          setup: state.setup
        })
      };
    }

    case "FirstNightInitialized": {
      if (state === undefined) {
        throw new DomainError("MissingGameCreated", "FirstNightInitialized requires an existing game");
      }

      if (event.payload.rulesBaselineVersion !== state.rulesBaselineVersion) {
        throw new DomainError("InvalidFirstNightInitializedPayload", "FirstNightInitialized payload rules baseline must match game state");
      }

      validateFirstNightInitializedPayload(state, event.payload);

      return {
        ...state,
        gameVersion: event.gameVersion,
        lastEventSequence: event.eventSequence,
        firstNight: event.payload
      };
    }

    case "InitialPrivateKnowledgeEstablished": {
      if (state === undefined) {
        throw new DomainError("MissingGameCreated", "InitialPrivateKnowledgeEstablished requires an existing game");
      }

      if (event.payload.rulesBaselineVersion !== state.rulesBaselineVersion) {
        throw new DomainError(
          "InvalidInitialPrivateKnowledgeEstablishedPayload",
          "InitialPrivateKnowledgeEstablished payload rules baseline must match game state"
        );
      }

      validateInitialPrivateKnowledgeEstablishedPayload(state, event.payload);

      return {
        ...state,
        gameVersion: event.gameVersion,
        lastEventSequence: event.eventSequence,
        initialPrivateKnowledge: event.payload
      };
    }

    case "FirstNightTaskPlanCreated": {
      if (state === undefined) {
        throw new DomainError("MissingGameCreated", "FirstNightTaskPlanCreated requires an existing game");
      }

      if (event.payload.rulesBaselineVersion !== state.rulesBaselineVersion) {
        throw new DomainError(
          "InvalidFirstNightTaskPlanCreatedPayload",
          "FirstNightTaskPlanCreated payload rules baseline must match game state"
        );
      }

      validateFirstNightTaskPlanCreatedPayloadForState(state, event.payload);

      return {
        ...state,
        gameVersion: event.gameVersion,
        lastEventSequence: event.eventSequence,
        firstNightTaskPlan: event.payload
      };
    }

    case "FirstNightActionOpportunityCreated": {
      if (state === undefined) {
        throw new DomainError("MissingGameCreated", "FirstNightActionOpportunityCreated requires an existing game");
      }

      if (event.payload.rulesBaselineVersion !== state.rulesBaselineVersion) {
        throw new DomainError(
          "InvalidFirstNightActionOpportunityCreatedPayload",
          "FirstNightActionOpportunityCreated payload rules baseline must match game state"
        );
      }

      validateFirstNightActionOpportunityCreatedPayloadForState(state, event.payload);

      return {
        ...state,
        gameVersion: event.gameVersion,
        lastEventSequence: event.eventSequence,
        firstNightActionOpportunities: appendFirstNightActionOpportunity(state.firstNightActionOpportunities, event.payload)
      };
    }

    case "PhilosopherActionDeferred": {
      if (state === undefined) {
        throw new DomainError("MissingGameCreated", "PhilosopherActionDeferred requires an existing game");
      }

      if (event.payload.rulesBaselineVersion !== state.rulesBaselineVersion) {
        throw new DomainError(
          "InvalidPhilosopherActionDeferredPayload",
          "PhilosopherActionDeferred payload rules baseline must match game state"
        );
      }

      validatePhilosopherActionDeferredPayloadForState(state, event.payload);

      return {
        ...state,
        gameVersion: event.gameVersion,
        lastEventSequence: event.eventSequence,
        firstNightActionOpportunities: closeFirstNightActionOpportunity(state.firstNightActionOpportunities, event.payload)
      };
    }

    case "PhilosopherAbilityChosen": {
      if (state === undefined) {
        throw new DomainError("MissingGameCreated", "PhilosopherAbilityChosen requires an existing game");
      }

      if (event.payload.rulesBaselineVersion !== state.rulesBaselineVersion) {
        throw new DomainError(
          "InvalidPhilosopherAbilityChosenPayload",
          "PhilosopherAbilityChosen payload rules baseline must match game state"
        );
      }

      validatePhilosopherAbilityChosenPayloadForState(state, event.payload);

      return {
        ...state,
        gameVersion: event.gameVersion,
        lastEventSequence: event.eventSequence,
        firstNightActionOpportunities: closeFirstNightActionOpportunity(state.firstNightActionOpportunities, event.payload),
        philosopherAbilityChoices: appendPhilosopherAbilityChoice(state.philosopherAbilityChoices, event.payload)
      };
    }

    case "PhilosopherAbilityGranted": {
      if (state === undefined) {
        throw new DomainError("MissingGameCreated", "PhilosopherAbilityGranted requires an existing game");
      }

      if (event.payload.rulesBaselineVersion !== state.rulesBaselineVersion) {
        throw new DomainError(
          "InvalidPhilosopherAbilityGrantedPayload",
          "PhilosopherAbilityGranted payload rules baseline must match game state"
        );
      }

      validatePhilosopherAbilityGrantedPayloadForState(state, event.payload);

      return {
        ...state,
        gameVersion: event.gameVersion,
        lastEventSequence: event.eventSequence,
        philosopherGrantedAbilities: appendPhilosopherGrantedAbility(state.philosopherGrantedAbilities, event.payload)
      };
    }

    case "AbilityImpairmentApplied": {
      if (state === undefined) {
        throw new DomainError("MissingGameCreated", "AbilityImpairmentApplied requires an existing game");
      }

      if (event.payload.rulesBaselineVersion !== state.rulesBaselineVersion) {
        throw new DomainError(
          "InvalidAbilityImpairmentAppliedPayload",
          "AbilityImpairmentApplied payload rules baseline must match game state"
        );
      }

      validateAbilityImpairmentAppliedPayloadForState(state, event.payload);

      return {
        ...state,
        gameVersion: event.gameVersion,
        lastEventSequence: event.eventSequence,
        abilityImpairments: appendAbilityImpairment(state.abilityImpairments, event.payload)
      };
    }

    case "FirstNightTaskInserted": {
      if (state === undefined) {
        throw new DomainError("MissingGameCreated", "FirstNightTaskInserted requires an existing game");
      }

      if (event.payload.rulesBaselineVersion !== state.rulesBaselineVersion) {
        throw new DomainError(
          "InvalidFirstNightTaskInsertedPayload",
          "FirstNightTaskInserted payload rules baseline must match game state"
        );
      }

      validateFirstNightTaskInsertedPayloadForState(state, event.payload);
      if (state.firstNightTaskPlan === undefined) {
        throw new DomainError("InvalidFirstNightTaskInsertedPayload", "FirstNightTaskInserted requires first-night task plan");
      }

      return {
        ...state,
        gameVersion: event.gameVersion,
        lastEventSequence: event.eventSequence,
        firstNightTaskPlan: {
          ...applyFirstNightTaskInsertionToPlan(state.firstNightTaskPlan, event.payload),
          rulesBaselineVersion: state.firstNightTaskPlan.rulesBaselineVersion
        },
        firstNightTaskInsertions: appendFirstNightTaskInsertion(state.firstNightTaskInsertions, event.payload)
      };
    }

    case "MinionInformationDelivered": {
      if (state === undefined) {
        throw new DomainError("MissingGameCreated", "MinionInformationDelivered requires an existing game");
      }

      if (event.payload.rulesBaselineVersion !== state.rulesBaselineVersion) {
        throw new DomainError(
          "InvalidMinionInformationDeliveredPayload",
          "MinionInformationDelivered payload rules baseline must match game state"
        );
      }

      validateMinionInformationDeliveredPayloadForState(state, event.payload);

      return {
        ...state,
        gameVersion: event.gameVersion,
        lastEventSequence: event.eventSequence,
        minionInformation: event.payload
      };
    }

    case "DemonInformationDelivered": {
      if (state === undefined) {
        throw new DomainError("MissingGameCreated", "DemonInformationDelivered requires an existing game");
      }

      if (event.payload.rulesBaselineVersion !== state.rulesBaselineVersion) {
        throw new DomainError(
          "InvalidDemonInformationDeliveredPayload",
          "DemonInformationDelivered payload rules baseline must match game state"
        );
      }

      validateDemonInformationDeliveredPayloadForState(state, event.payload);

      return {
        ...state,
        gameVersion: event.gameVersion,
        lastEventSequence: event.eventSequence,
        demonInformation: event.payload
      };
    }

    case "ScheduledTaskSettled": {
      if (state === undefined) {
        throw new DomainError("MissingGameCreated", "ScheduledTaskSettled requires an existing game");
      }

      if (event.payload.rulesBaselineVersion !== state.rulesBaselineVersion) {
        throw new DomainError(
          "InvalidScheduledTaskSettledPayload",
          "ScheduledTaskSettled payload rules baseline must match game state"
        );
      }

      validateScheduledTaskSettledPayloadForState(state, event.payload);

      const firstNightTaskPlan = state.firstNightTaskPlan;
      if (firstNightTaskPlan === undefined) {
        throw new DomainError("InvalidScheduledTaskSettledPayload", "ScheduledTaskSettled requires first-night task plan");
      }

      const nextProgress = {
        settlements: [
          ...cloneFirstNightTaskProgress(state.firstNightTaskProgress).settlements,
          {
            taskId: event.payload.taskId,
            taskType: event.payload.taskType,
            nightNumber: event.payload.nightNumber,
            settlementVersion: event.payload.settlementVersion,
            outcomeType: event.payload.outcomeType,
            characterStateRevision: event.payload.characterStateRevision
          }
        ]
      };

      const progressValidation = validateFirstNightTaskProgress(firstNightTaskPlan, nextProgress);
      if (!progressValidation.valid) {
        throw new DomainError("InvalidScheduledTaskSettledPayload", progressValidation.reason);
      }

      return {
        ...state,
        gameVersion: event.gameVersion,
        lastEventSequence: event.eventSequence,
        firstNightTaskProgress: nextProgress
      };
    }

    case "PhaseTransitioned": {
      if (state === undefined) {
        throw new DomainError("MissingGameCreated", "PhaseTransitioned requires an existing game");
      }

      if (event.payload.fromPhase !== state.phase) {
        throw new DomainError("InvalidPhaseTransition", "PhaseTransitioned fromPhase must match current game state");
      }

      if (
        event.payload.dayNumberBefore < 0 ||
        event.payload.dayNumberAfter < 0 ||
        event.payload.nightNumberBefore < 0 ||
        event.payload.nightNumberAfter < 0
      ) {
        throw new DomainError("InvalidPhaseCounter", "Phase day and night counters cannot be negative");
      }

      if (event.payload.dayNumberBefore !== state.dayNumber || event.payload.nightNumberBefore !== state.nightNumber) {
        throw new DomainError("InvalidPhaseCounter", "Phase counter before values must match current game state");
      }

      if (
        event.payload.transitionReason === "SCRIPT_SELECTED" &&
        event.payload.fromPhase === "SCRIPT_SELECTION" &&
        event.payload.toPhase === "SETUP_GENERATION" &&
        state.selectedScript === undefined
      ) {
        throw new DomainError("MissingTransitionPrerequisite", "SCRIPT_SELECTED transition requires a selected script fact");
      }

      if (
        event.payload.transitionReason === "SETUP_GENERATED" &&
        event.payload.fromPhase === "SETUP_GENERATION" &&
        event.payload.toPhase === "CHARACTER_ASSIGNMENT" &&
        state.setup === undefined
      ) {
        throw new DomainError("MissingTransitionPrerequisite", "SETUP_GENERATED transition requires a generated setup fact");
      }

      if (
        event.payload.transitionReason === "CHARACTERS_ASSIGNED" &&
        event.payload.fromPhase === "CHARACTER_ASSIGNMENT" &&
        event.payload.toPhase === "FIRST_NIGHT" &&
        state.assignment === undefined
      ) {
        throw new DomainError("MissingTransitionPrerequisite", "CHARACTERS_ASSIGNED transition requires character assignment fact");
      }

      const transition = evaluatePhaseTransition({
        fromPhase: event.payload.fromPhase,
        toPhase: event.payload.toPhase,
        dayNumber: state.dayNumber,
        nightNumber: state.nightNumber
      });

      if (!transition.allowed) {
        throw new DomainError("InvalidPhaseTransition", transition.reason);
      }

      if (event.payload.transitionReason !== transition.reasonCode) {
        throw new DomainError("InvalidPhaseTransitionReason", "PhaseTransitioned reason code must match transition policy");
      }

      if (event.payload.dayNumberAfter !== transition.dayNumber || event.payload.nightNumberAfter !== transition.nightNumber) {
        throw new DomainError("InvalidPhaseCounter", "Phase counter after values must match transition policy");
      }

      return {
        ...state,
        gameVersion: event.gameVersion,
        lastEventSequence: event.eventSequence,
        phase: event.payload.toPhase,
        dayNumber: event.payload.dayNumberAfter,
        nightNumber: event.payload.nightNumberAfter
      };
    }

    default:
      return assertNever(event);
  }
};
