import type { CharacterAssignmentSet } from "./character-assignment.js";
import { cloneRoleSetupSnapshot, validateCharacterAssignments } from "./character-assignment.js";
import { assertNever } from "./errors.js";
import type { PlayerId, RoleId } from "./ids.js";
import type { PlayerRoster } from "./player-roster.js";
import { validatePlayerRoster } from "./player-roster.js";
import type { GeneratedSetup, RoleCatalogSnapshot, RoleSetupSnapshot } from "./setup-types.js";
import {
  CHARACTER_TYPES,
  SUPPORTED_ROLE_CATALOG_SIGNATURE,
  SUPPORTED_ROLE_CATALOG_SIGNATURE_ALGORITHM,
  calculateRoleCatalogSignature,
  compareStableId,
  sameRoleSetupSnapshot,
  validateRoleSetupSnapshot
} from "./setup-types.js";
import type { SeatNumber } from "./player-roster.js";

export const SUPPORTED_FIRST_NIGHT_INITIALIZATION_VERSION = "first-night-initialization-v1" as const;
export const SUPPORTED_INITIAL_KNOWLEDGE_MODEL_VERSION = "initial-private-knowledge-v1" as const;
export const INITIAL_KNOWLEDGE_KINDS = [
  "OWN_CHARACTER",
  "DEMON_IDENTITY",
  "MINION_IDENTITIES",
  "DEMON_BLUFFS"
] as const;

export type SupportedFirstNightInitializationVersion = typeof SUPPORTED_FIRST_NIGHT_INITIALIZATION_VERSION;
export type SupportedInitialKnowledgeModelVersion = typeof SUPPORTED_INITIAL_KNOWLEDGE_MODEL_VERSION;

export type FirstNightSession = {
  readonly initializationVersion: SupportedFirstNightInitializationVersion;
  readonly nightNumber: 1;
  readonly rosterVersion: string;
  readonly assignmentAlgorithmVersion: string;
  readonly roleCatalogSignature: string;
};

export type KnownPlayerReference = {
  readonly playerId: PlayerId;
  readonly seatNumber: SeatNumber;
};

export type OwnCharacterKnowledge = {
  readonly kind: "OWN_CHARACTER";
  readonly recipientPlayerId: PlayerId;
  readonly role: RoleSetupSnapshot;
};

export type DemonIdentityKnowledge = {
  readonly kind: "DEMON_IDENTITY";
  readonly recipientPlayerId: PlayerId;
  readonly demon: KnownPlayerReference;
};

export type MinionIdentitiesKnowledge = {
  readonly kind: "MINION_IDENTITIES";
  readonly recipientPlayerId: PlayerId;
  readonly minions: readonly KnownPlayerReference[];
};

export type DemonBluffsKnowledge = {
  readonly kind: "DEMON_BLUFFS";
  readonly recipientPlayerId: PlayerId;
  readonly roles: readonly RoleSetupSnapshot[];
};

export type InitialKnowledgeEntry =
  | OwnCharacterKnowledge
  | DemonIdentityKnowledge
  | MinionIdentitiesKnowledge
  | DemonBluffsKnowledge;

export type InitialPrivateKnowledge = {
  readonly knowledgeModelVersion: SupportedInitialKnowledgeModelVersion;
  readonly entries: readonly InitialKnowledgeEntry[];
};

export type PlayerPrivateKnowledgeView = {
  readonly viewerPlayerId: PlayerId;
  readonly viewerSeatNumber: SeatNumber;
  readonly viewerDisplayName: string;
  readonly ownCharacter: RoleSetupSnapshot;
  readonly knownDemon?: KnownPlayerReference;
  readonly knownMinions: readonly KnownPlayerReference[];
  readonly demonBluffs: readonly RoleSetupSnapshot[];
  readonly knowledgeModelVersion: SupportedInitialKnowledgeModelVersion;
};

export type InitialPrivateKnowledgeGenerationFailureCode =
  | "InvalidRoster"
  | "InvalidAssignment"
  | "InvalidSetup"
  | "MissingDemon"
  | "InvalidDemonCount"
  | "InvalidMinionCount"
  | "InvalidDemonBluffs"
  | "InvalidKnowledgeResult";

export type InitialPrivateKnowledgeGenerationFailure = {
  readonly status: "failure";
  readonly failureCode: InitialPrivateKnowledgeGenerationFailureCode;
  readonly message: string;
  readonly conflictingPlayerIds: readonly PlayerId[];
  readonly conflictingRoleIds: readonly RoleId[];
};

export type InitialPrivateKnowledgeGenerationSuccess = {
  readonly status: "success";
  readonly knowledge: InitialPrivateKnowledge;
};

export type InitialPrivateKnowledgeGenerationResult =
  | InitialPrivateKnowledgeGenerationSuccess
  | InitialPrivateKnowledgeGenerationFailure;

export type InitialPrivateKnowledgeGeneratorInput = {
  readonly roster: PlayerRoster;
  readonly assignment: CharacterAssignmentSet;
  readonly setup: GeneratedSetup;
};

export type InitialKnowledgeSourceFacts = {
  readonly roster: unknown;
  readonly assignment: unknown;
  readonly setup: unknown;
  readonly rosterVersion?: unknown;
  readonly assignmentAlgorithmVersion?: unknown;
  readonly roleCatalogSignature?: unknown;
};

export type InitialPrivateKnowledgeValidationInput = InitialKnowledgeSourceFacts & {
  readonly entries: unknown;
};

export type InitialPrivateKnowledgeValidationResult =
  | { readonly valid: true }
  | { readonly valid: false; readonly reason: string };

const KNOWLEDGE_KIND_ORDER: Readonly<Record<InitialKnowledgeEntry["kind"], number>> = {
  OWN_CHARACTER: 0,
  DEMON_IDENTITY: 1,
  MINION_IDENTITIES: 2,
  DEMON_BLUFFS: 3
};

const asciiCompare = (left: string, right: string): number => {
  if (left === right) {
    return 0;
  }

  return left < right ? -1 : 1;
};

export const isPlainRecord = (value: unknown): value is Record<string, unknown> => {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value) as unknown;
  return prototype === Object.prototype || prototype === null;
};

export const hasExactEnumerableKeys = (
  value: Record<string, unknown>,
  expectedKeys: readonly string[]
): boolean => {
  const actual = Object.keys(value).sort(asciiCompare);
  const expected = [...expectedKeys].sort(asciiCompare);
  return actual.length === expected.length && actual.every((key, index) => key === expected[index]);
};

export const isInitialKnowledgeKind = (value: unknown): value is InitialKnowledgeEntry["kind"] =>
  typeof value === "string" && (INITIAL_KNOWLEDGE_KINDS as readonly string[]).includes(value);

const isDenseArray = (value: readonly unknown[]): boolean => {
  for (let index = 0; index < value.length; index += 1) {
    if (!Object.hasOwn(value, index)) {
      return false;
    }
  }

  return true;
};

const isKnownCharacterType = (value: unknown): value is RoleSetupSnapshot["characterType"] =>
  typeof value === "string" && (CHARACTER_TYPES as readonly string[]).includes(value);

const isKnownDefaultAlignment = (value: unknown): value is RoleSetupSnapshot["defaultAlignment"] =>
  value === "GOOD" || value === "EVIL";

const ROLE_SETUP_SNAPSHOT_KEYS = [
  "roleId",
  "characterType",
  "defaultAlignment",
  "edition",
  "setupModifier"
] as const;
const SETUP_MODIFIER_KEYS = ["outsiderDelta", "townsfolkDelta"] as const;
const KNOWN_PLAYER_REFERENCE_KEYS = ["playerId", "seatNumber"] as const;
const OWN_CHARACTER_KEYS = ["kind", "recipientPlayerId", "role"] as const;
const DEMON_IDENTITY_KEYS = ["kind", "recipientPlayerId", "demon"] as const;
const MINION_IDENTITIES_KEYS = ["kind", "recipientPlayerId", "minions"] as const;
const DEMON_BLUFFS_KEYS = ["kind", "recipientPlayerId", "roles"] as const;
const FIRST_NIGHT_INITIALIZED_PAYLOAD_KEYS = [
  "rulesBaselineVersion",
  "initializationVersion",
  "nightNumber",
  "rosterVersion",
  "assignmentAlgorithmVersion",
  "roleCatalogSignature"
] as const;
const INITIAL_PRIVATE_KNOWLEDGE_PAYLOAD_KEYS = [
  "rulesBaselineVersion",
  "knowledgeModelVersion",
  "rosterVersion",
  "assignmentAlgorithmVersion",
  "roleCatalogSignature",
  "entries"
] as const;

export const hasExactRoleSetupSnapshotShape = (value: unknown): value is RoleSetupSnapshot => {
  if (!isPlainRecord(value) || !hasExactEnumerableKeys(value, ROLE_SETUP_SNAPSHOT_KEYS)) {
    return false;
  }

  const setupModifier = value.setupModifier;
  if (!isPlainRecord(setupModifier) || !hasExactEnumerableKeys(setupModifier, SETUP_MODIFIER_KEYS)) {
    return false;
  }

  if (
    typeof value.roleId !== "string" ||
    value.roleId.trim().length === 0 ||
    !isKnownCharacterType(value.characterType) ||
    !isKnownDefaultAlignment(value.defaultAlignment) ||
    typeof value.edition !== "string" ||
    typeof setupModifier.outsiderDelta !== "number" ||
    typeof setupModifier.townsfolkDelta !== "number"
  ) {
    return false;
  }

  return validateRoleSetupSnapshot(value as RoleSetupSnapshot);
};

export const hasExactKnownPlayerReferenceShape = (value: unknown): value is KnownPlayerReference => {
  if (!isPlainRecord(value) || !hasExactEnumerableKeys(value, KNOWN_PLAYER_REFERENCE_KEYS)) {
    return false;
  }

  return (
    typeof value.playerId === "string" &&
    value.playerId.trim().length > 0 &&
    typeof value.seatNumber === "number" &&
    Number.isInteger(value.seatNumber) &&
    value.seatNumber >= 1 &&
    value.seatNumber <= 12
  );
};

const compareKnownPlayerReference = (left: KnownPlayerReference, right: KnownPlayerReference): number =>
  left.seatNumber - right.seatNumber;

const knownReferencesAreSorted = (references: readonly KnownPlayerReference[]): boolean =>
  references.every((reference, index) => {
    if (!hasExactKnownPlayerReferenceShape(reference)) {
      return false;
    }

    return index === 0 || compareKnownPlayerReference(references[index - 1] ?? reference, reference) < 0;
  });

const roleListIsAsciiSorted = (roles: readonly RoleSetupSnapshot[]): boolean =>
  roles.every((role, index) => index === 0 || compareStableId(roles[index - 1]?.roleId ?? "", role.roleId) < 0);

export const cloneKnownPlayerReference = (reference: KnownPlayerReference): KnownPlayerReference => ({
  playerId: reference.playerId,
  seatNumber: reference.seatNumber
});

export const cloneInitialKnowledgeEntry = (entry: InitialKnowledgeEntry): InitialKnowledgeEntry => {
  switch (entry.kind) {
    case "OWN_CHARACTER":
      return {
        kind: entry.kind,
        recipientPlayerId: entry.recipientPlayerId,
        role: cloneRoleSetupSnapshot(entry.role)
      };

    case "DEMON_IDENTITY":
      return {
        kind: entry.kind,
        recipientPlayerId: entry.recipientPlayerId,
        demon: cloneKnownPlayerReference(entry.demon)
      };

    case "MINION_IDENTITIES":
      return {
        kind: entry.kind,
        recipientPlayerId: entry.recipientPlayerId,
        minions: entry.minions.map(cloneKnownPlayerReference)
      };

    case "DEMON_BLUFFS":
      return {
        kind: entry.kind,
        recipientPlayerId: entry.recipientPlayerId,
        roles: entry.roles.map(cloneRoleSetupSnapshot)
      };

    default:
      return assertNever(entry);
  }
};

export const cloneInitialPrivateKnowledge = (knowledge: InitialPrivateKnowledge): InitialPrivateKnowledge => ({
  knowledgeModelVersion: knowledge.knowledgeModelVersion,
  entries: knowledge.entries.map(cloneInitialKnowledgeEntry)
});

const fail = (reason: string): InitialPrivateKnowledgeValidationResult => ({ valid: false, reason });

type InitialKnowledgeEntryShapeValidationResult =
  | { readonly valid: true; readonly entries: readonly InitialKnowledgeEntry[] }
  | { readonly valid: false; readonly reason: string };

const parseInitialKnowledgeEntryShape = (
  entry: unknown
): InitialKnowledgeEntry | InitialPrivateKnowledgeValidationResult => {
  if (!isPlainRecord(entry)) {
    return fail("initial private knowledge entry must be a non-null plain object");
  }

  if (typeof entry.kind !== "string") {
    return fail("initial private knowledge entry kind must be a string");
  }

  if (!isInitialKnowledgeKind(entry.kind)) {
    return fail("unknown initial private knowledge kind");
  }

  switch (entry.kind) {
    case "OWN_CHARACTER":
      if (
        !hasExactEnumerableKeys(entry, OWN_CHARACTER_KEYS) ||
        typeof entry.recipientPlayerId !== "string" ||
        entry.recipientPlayerId.trim().length === 0 ||
        !hasExactRoleSetupSnapshotShape(entry.role)
      ) {
        return fail("OWN_CHARACTER entry must have exact runtime shape");
      }
      return entry as unknown as OwnCharacterKnowledge;

    case "DEMON_IDENTITY":
      if (
        !hasExactEnumerableKeys(entry, DEMON_IDENTITY_KEYS) ||
        typeof entry.recipientPlayerId !== "string" ||
        entry.recipientPlayerId.trim().length === 0 ||
        !hasExactKnownPlayerReferenceShape(entry.demon)
      ) {
        return fail("DEMON_IDENTITY entry must have exact runtime shape");
      }
      return entry as unknown as DemonIdentityKnowledge;

    case "MINION_IDENTITIES":
      if (
        !hasExactEnumerableKeys(entry, MINION_IDENTITIES_KEYS) ||
        typeof entry.recipientPlayerId !== "string" ||
        entry.recipientPlayerId.trim().length === 0 ||
        !Array.isArray(entry.minions) ||
        !isDenseArray(entry.minions) ||
        entry.minions.some((reference) => !hasExactKnownPlayerReferenceShape(reference))
      ) {
        return fail("MINION_IDENTITIES entry must have exact runtime shape");
      }
      return entry as unknown as MinionIdentitiesKnowledge;

    case "DEMON_BLUFFS":
      if (
        !hasExactEnumerableKeys(entry, DEMON_BLUFFS_KEYS) ||
        typeof entry.recipientPlayerId !== "string" ||
        entry.recipientPlayerId.trim().length === 0 ||
        !Array.isArray(entry.roles) ||
        !isDenseArray(entry.roles) ||
        entry.roles.some((role) => !hasExactRoleSetupSnapshotShape(role))
      ) {
        return fail("DEMON_BLUFFS entry must have exact runtime shape");
      }
      return entry as unknown as DemonBluffsKnowledge;

    default:
      return assertNever(entry.kind);
  }
};

const parseInitialKnowledgeEntryShapes = (entries: unknown): InitialKnowledgeEntryShapeValidationResult => {
  if (!Array.isArray(entries)) {
    return { valid: false, reason: "initial private knowledge entries must be a real array" };
  }

  if (!isDenseArray(entries)) {
    return { valid: false, reason: "initial private knowledge entries array must not contain sparse holes" };
  }

  const parsed: InitialKnowledgeEntry[] = [];
  for (const entry of entries) {
    const result = parseInitialKnowledgeEntryShape(entry);
    if ("valid" in result) {
      if (result.valid) {
        return { valid: false, reason: "initial private knowledge entry parser returned no entry" };
      }

      return result;
    }

    parsed.push(result);
  }

  return { valid: true, entries: parsed };
};

const hasExactRosterEntryShape = (value: unknown): boolean => {
  if (!isPlainRecord(value) || !hasExactEnumerableKeys(value, ["displayName", "playerId", "playerKind", "seatNumber"])) {
    return false;
  }

  return (
    typeof value.playerId === "string" &&
    value.playerId.trim().length > 0 &&
    typeof value.displayName === "string" &&
    (value.playerKind === "HUMAN" || value.playerKind === "AI") &&
    typeof value.seatNumber === "number" &&
    Number.isInteger(value.seatNumber) &&
    value.seatNumber >= 1 &&
    value.seatNumber <= 12
  );
};

const hasExactAssignmentShape = (value: unknown): boolean => {
  if (!isPlainRecord(value) || !hasExactEnumerableKeys(value, ["playerId", "role", "seatNumber"])) {
    return false;
  }

  return (
    typeof value.playerId === "string" &&
    value.playerId.trim().length > 0 &&
    typeof value.seatNumber === "number" &&
    Number.isInteger(value.seatNumber) &&
    value.seatNumber >= 1 &&
    value.seatNumber <= 12 &&
    hasExactRoleSetupSnapshotShape(value.role)
  );
};

const validateRoleSetupSnapshotArray = (
  value: unknown,
  label: string
): InitialPrivateKnowledgeValidationResult => {
  if (!Array.isArray(value)) {
    return fail(`${label} must be a real array`);
  }

  if (!isDenseArray(value)) {
    return fail(`${label} must not contain sparse holes`);
  }

  for (const role of value) {
    if (!hasExactRoleSetupSnapshotShape(role)) {
      return fail(`${label} must contain exact RoleSetupSnapshot objects`);
    }
  }

  return { valid: true };
};

const requireCatalogRole = (
  catalogByRoleId: ReadonlyMap<RoleId, RoleSetupSnapshot>,
  role: RoleSetupSnapshot,
  message: string
): InitialPrivateKnowledgeValidationResult => {
  const catalogRole = catalogByRoleId.get(role.roleId);
  if (catalogRole === undefined || !sameRoleSetupSnapshot(role, catalogRole)) {
    return fail(message);
  }

  return { valid: true };
};

export const validateInitialKnowledgeSourceFacts = (
  sourceFacts: InitialKnowledgeSourceFacts
): InitialPrivateKnowledgeValidationResult => {
  if (!Array.isArray(sourceFacts.roster) || !isDenseArray(sourceFacts.roster)) {
    return fail("roster must be a dense array");
  }

  if (sourceFacts.roster.some((entry) => !hasExactRosterEntryShape(entry))) {
    return fail("roster entries must have exact runtime shape");
  }

  const roster = sourceFacts.roster as PlayerRoster;
  const rosterValidation = validatePlayerRoster(roster);
  if (!rosterValidation.valid) {
    return fail(rosterValidation.reason);
  }

  if (!isPlainRecord(sourceFacts.setup)) {
    return fail("setup must be a non-null plain object");
  }

  const setupRecord = sourceFacts.setup;
  if (
    typeof setupRecord.roleCatalogSignature !== "string" ||
    typeof setupRecord.roleCatalogSignatureAlgorithm !== "string" ||
    !isPlainRecord(setupRecord.roleCatalogSnapshot)
  ) {
    return fail("setup role catalog metadata must have exact runtime shape");
  }

  const roleCatalogSnapshot = setupRecord.roleCatalogSnapshot;
  if (
    typeof roleCatalogSnapshot.scriptId !== "string" ||
    typeof roleCatalogSnapshot.edition !== "string" ||
    typeof roleCatalogSnapshot.roleCatalogVersion !== "string" ||
    typeof roleCatalogSnapshot.canonicalSignature !== "string"
  ) {
    return fail("roleCatalogSnapshot metadata must have exact runtime shape");
  }

  const catalogRolesValidation = validateRoleSetupSnapshotArray(roleCatalogSnapshot.roles, "roleCatalogSnapshot.roles");
  if (!catalogRolesValidation.valid) {
    return catalogRolesValidation;
  }

  const actualRolesValidation = validateRoleSetupSnapshotArray(setupRecord.actualRoles, "setup.actualRoles");
  if (!actualRolesValidation.valid) {
    return actualRolesValidation;
  }

  if (!hasExactRoleSetupSnapshotShape(setupRecord.demonRole)) {
    return fail("setup.demonRole must have exact RoleSetupSnapshot shape");
  }

  const demonBluffsValidation = validateRoleSetupSnapshotArray(setupRecord.demonBluffs, "setup.demonBluffs");
  if (!demonBluffsValidation.valid) {
    return demonBluffsValidation;
  }

  const setup = sourceFacts.setup as GeneratedSetup;
  const recalculatedSignature = calculateRoleCatalogSignature(roleCatalogSnapshot as unknown as RoleCatalogSnapshot);
  if (
    setup.roleCatalogSignatureAlgorithm !== SUPPORTED_ROLE_CATALOG_SIGNATURE_ALGORITHM ||
    setup.roleCatalogSignature !== SUPPORTED_ROLE_CATALOG_SIGNATURE ||
    roleCatalogSnapshot.canonicalSignature !== setup.roleCatalogSignature ||
    recalculatedSignature !== setup.roleCatalogSignature
  ) {
    return fail("setup role catalog signature must match the supported exact catalog");
  }

  const catalogByRoleId = new Map<RoleId, RoleSetupSnapshot>(setup.roleCatalogSnapshot.roles.map((role) => [role.roleId, role]));
  for (const role of setup.actualRoles) {
    const catalogValidation = requireCatalogRole(catalogByRoleId, role, "setup.actualRoles must match roleCatalogSnapshot");
    if (!catalogValidation.valid) {
      return catalogValidation;
    }
  }

  const demonCatalogValidation = requireCatalogRole(catalogByRoleId, setup.demonRole, "setup.demonRole must match roleCatalogSnapshot");
  if (!demonCatalogValidation.valid) {
    return demonCatalogValidation;
  }

  for (const role of setup.demonBluffs) {
    const catalogValidation = requireCatalogRole(catalogByRoleId, role, "setup.demonBluffs must match roleCatalogSnapshot");
    if (!catalogValidation.valid) {
      return catalogValidation;
    }
  }

  if (!Array.isArray(sourceFacts.assignment) || !isDenseArray(sourceFacts.assignment)) {
    return fail("assignment must be a dense array");
  }

  if (sourceFacts.assignment.some((assignment) => !hasExactAssignmentShape(assignment))) {
    return fail("assignment entries must have exact runtime shape");
  }

  const assignmentValidation = validateCharacterAssignments({
    assignments: sourceFacts.assignment as CharacterAssignmentSet,
    roster,
    actualRoles: setup.actualRoles,
    roleCatalogRoles: setup.roleCatalogSnapshot.roles
  });
  if (!assignmentValidation.valid) {
    return fail(assignmentValidation.reason);
  }

  return { valid: true };
};

export const validateFirstNightInitializedPayloadShape = (
  value: unknown
): InitialPrivateKnowledgeValidationResult => {
  if (!isPlainRecord(value) || !hasExactEnumerableKeys(value, FIRST_NIGHT_INITIALIZED_PAYLOAD_KEYS)) {
    return fail("FirstNightInitialized payload must have exact runtime shape");
  }

  if (
    typeof value.rulesBaselineVersion !== "string" ||
    typeof value.initializationVersion !== "string" ||
    value.nightNumber !== 1 ||
    typeof value.rosterVersion !== "string" ||
    typeof value.assignmentAlgorithmVersion !== "string" ||
    typeof value.roleCatalogSignature !== "string"
  ) {
    return fail("FirstNightInitialized payload fields must have supported primitive types");
  }

  return { valid: true };
};

export const validateInitialPrivateKnowledgePayload = (
  value: unknown,
  sourceFacts: InitialKnowledgeSourceFacts
): InitialPrivateKnowledgeValidationResult => {
  if (!isPlainRecord(value) || !hasExactEnumerableKeys(value, INITIAL_PRIVATE_KNOWLEDGE_PAYLOAD_KEYS)) {
    return fail("InitialPrivateKnowledgeEstablished payload must have exact runtime shape");
  }

  if (
    typeof value.rulesBaselineVersion !== "string" ||
    typeof value.knowledgeModelVersion !== "string" ||
    typeof value.rosterVersion !== "string" ||
    typeof value.assignmentAlgorithmVersion !== "string" ||
    typeof value.roleCatalogSignature !== "string"
  ) {
    return fail("InitialPrivateKnowledgeEstablished payload fields must have supported primitive types");
  }

  if (value.knowledgeModelVersion !== SUPPORTED_INITIAL_KNOWLEDGE_MODEL_VERSION) {
    return fail("InitialPrivateKnowledgeEstablished knowledge model version must be supported");
  }

  if (
    (sourceFacts.rosterVersion !== undefined && value.rosterVersion !== sourceFacts.rosterVersion) ||
    (sourceFacts.assignmentAlgorithmVersion !== undefined && value.assignmentAlgorithmVersion !== sourceFacts.assignmentAlgorithmVersion) ||
    (sourceFacts.roleCatalogSignature !== undefined && value.roleCatalogSignature !== sourceFacts.roleCatalogSignature)
  ) {
    return fail("InitialPrivateKnowledgeEstablished metadata must match roster, assignment, and setup facts");
  }

  return validateInitialPrivateKnowledgeEntries({
    ...sourceFacts,
    entries: value.entries
  });
};

const validateDemonBluffs = (setup: GeneratedSetup): InitialPrivateKnowledgeValidationResult => {
  if (setup.demonBluffs.length !== 3) {
    return fail("setup.demonBluffs must contain exactly 3 roles");
  }

  if (!roleListIsAsciiSorted(setup.demonBluffs)) {
    return fail("setup.demonBluffs must use ASCII roleId order");
  }

  const actualRoleIds = new Set(setup.actualRoles.map((role) => role.roleId));
  const bluffRoleIds = new Set<string>();
  for (const bluff of setup.demonBluffs) {
    if (actualRoleIds.has(bluff.roleId)) {
      return fail("demon bluffs must not be actual roles");
    }

    if (bluff.defaultAlignment !== "GOOD" || bluff.characterType === "MINION" || bluff.characterType === "DEMON") {
      return fail("demon bluffs must be good roles");
    }

    if (bluffRoleIds.has(bluff.roleId)) {
      return fail("demon bluffs must be unique");
    }
    bluffRoleIds.add(bluff.roleId);
  }

  return { valid: true };
};

const validateKnowledgeOrdering = (
  entries: readonly InitialKnowledgeEntry[],
  seatByPlayerId: ReadonlyMap<PlayerId, SeatNumber>
): InitialPrivateKnowledgeValidationResult => {
  for (const [index, entry] of entries.entries()) {
    const seat = seatByPlayerId.get(entry.recipientPlayerId);
    if (seat === undefined) {
      return fail("knowledge recipient must exist in roster");
    }

    if (index === 0) {
      continue;
    }

    const previous = entries[index - 1];
    if (previous === undefined) {
      return fail("knowledge ordering comparison failed");
    }

    const previousSeat = seatByPlayerId.get(previous.recipientPlayerId);
    if (previousSeat === undefined) {
      return fail("knowledge recipient must exist in roster");
    }

    if (
      previousSeat > seat ||
      (previousSeat === seat && KNOWLEDGE_KIND_ORDER[previous.kind] >= KNOWLEDGE_KIND_ORDER[entry.kind])
    ) {
      return fail("initial private knowledge entries must use canonical recipient and kind order");
    }
  }

  return { valid: true };
};

export const validateInitialPrivateKnowledgeEntries = (
  input: InitialPrivateKnowledgeValidationInput
): InitialPrivateKnowledgeValidationResult => {
  const entriesShapeValidation = parseInitialKnowledgeEntryShapes(input.entries);
  if (!entriesShapeValidation.valid) {
    return entriesShapeValidation;
  }

  const sourceValidation = validateInitialKnowledgeSourceFacts(input);
  if (!sourceValidation.valid) {
    return sourceValidation;
  }

  const roster = input.roster as PlayerRoster;
  const assignment = input.assignment as CharacterAssignmentSet;
  const setup = input.setup as GeneratedSetup;
  const entries = entriesShapeValidation.entries;

  const bluffValidation = validateDemonBluffs(setup);
  if (!bluffValidation.valid) {
    return bluffValidation;
  }

  const seatByPlayerId = new Map<PlayerId, SeatNumber>(roster.map((entry) => [entry.playerId, entry.seatNumber]));
  const assignmentByPlayerId = new Map(assignment.map((currentAssignment) => [currentAssignment.playerId, currentAssignment]));
  const catalogByRoleId = new Map(setup.roleCatalogSnapshot.roles.map((role) => [role.roleId, role]));
  const demonAssignments = assignment.filter((currentAssignment) => currentAssignment.role.characterType === "DEMON");
  const minionAssignments = assignment.filter((currentAssignment) => currentAssignment.role.characterType === "MINION")
    .sort((left, right) => left.seatNumber - right.seatNumber);
  const actualRoleIds = new Set(setup.actualRoles.map((role) => role.roleId));

  if (demonAssignments.length === 0) {
    return fail("initial private knowledge requires a demon assignment");
  }

  if (demonAssignments.length !== 1) {
    return fail("initial private knowledge requires exactly one demon assignment");
  }

  if (minionAssignments.length !== 2) {
    return fail("initial private knowledge requires exactly two minion assignments");
  }

  const demon = demonAssignments[0];
  if (demon === undefined) {
    return fail("initial private knowledge requires a demon assignment");
  }

  const orderingValidation = validateKnowledgeOrdering(entries, seatByPlayerId);
  if (!orderingValidation.valid) {
    return orderingValidation;
  }

  const ownByRecipient = new Map<PlayerId, OwnCharacterKnowledge>();
  const demonIdentityByRecipient = new Map<PlayerId, DemonIdentityKnowledge>();
  const minionIdentitiesByRecipient = new Map<PlayerId, MinionIdentitiesKnowledge>();
  const demonBluffsByRecipient = new Map<PlayerId, DemonBluffsKnowledge>();

  for (const entry of entries) {
    switch (entry.kind) {
      case "OWN_CHARACTER":
        if (ownByRecipient.has(entry.recipientPlayerId)) {
          return fail("each player must receive exactly one OWN_CHARACTER entry");
        }
        ownByRecipient.set(entry.recipientPlayerId, entry);
        break;

      case "DEMON_IDENTITY":
        if (demonIdentityByRecipient.has(entry.recipientPlayerId)) {
          return fail("each minion must receive exactly one DEMON_IDENTITY entry");
        }
        demonIdentityByRecipient.set(entry.recipientPlayerId, entry);
        break;

      case "MINION_IDENTITIES":
        if (minionIdentitiesByRecipient.has(entry.recipientPlayerId)) {
          return fail("each evil player must receive exactly one MINION_IDENTITIES entry");
        }
        minionIdentitiesByRecipient.set(entry.recipientPlayerId, entry);
        break;

      case "DEMON_BLUFFS":
        if (demonBluffsByRecipient.has(entry.recipientPlayerId)) {
          return fail("demon must receive exactly one DEMON_BLUFFS entry");
        }
        demonBluffsByRecipient.set(entry.recipientPlayerId, entry);
        break;

      default:
        return assertNever(entry);
    }
  }

  if (ownByRecipient.size !== roster.length) {
    return fail("every player must receive exactly one OWN_CHARACTER entry");
  }

  for (const rosterEntry of roster) {
    const own = ownByRecipient.get(rosterEntry.playerId);
    const assignment = assignmentByPlayerId.get(rosterEntry.playerId);
    if (own === undefined || assignment === undefined) {
      return fail("OWN_CHARACTER entries must cover every roster player");
    }

    const catalogRole = catalogByRoleId.get(own.role.roleId);
    if (
      !sameRoleSetupSnapshot(own.role, assignment.role) ||
      catalogRole === undefined ||
      !sameRoleSetupSnapshot(own.role, catalogRole)
    ) {
      return fail("OWN_CHARACTER role must match assignment and setup catalog");
    }
  }

  const minionPlayerIds = new Set(minionAssignments.map((assignment) => assignment.playerId));
  const evilPlayerIds = new Set([...minionPlayerIds, demon.playerId]);
  const demonReference = {
    playerId: demon.playerId,
    seatNumber: demon.seatNumber
  } satisfies KnownPlayerReference;

  if (demonIdentityByRecipient.size !== minionAssignments.length) {
    return fail("each minion must receive exactly one DEMON_IDENTITY entry");
  }

  for (const minion of minionAssignments) {
    const entry = demonIdentityByRecipient.get(minion.playerId);
    if (entry === undefined) {
      return fail("each minion must receive DEMON_IDENTITY");
    }

    if (
      !hasExactKnownPlayerReferenceShape(entry.demon) ||
      entry.demon.playerId !== demonReference.playerId ||
      entry.demon.seatNumber !== demonReference.seatNumber ||
      entry.demon.playerId === entry.recipientPlayerId
    ) {
      return fail("DEMON_IDENTITY must point to the unique demon without leaking role fields");
    }
  }

  for (const recipient of demonIdentityByRecipient.keys()) {
    if (!minionPlayerIds.has(recipient)) {
      return fail("only minions may receive DEMON_IDENTITY");
    }
  }

  if (minionIdentitiesByRecipient.size !== evilPlayerIds.size) {
    return fail("demon and minions must receive MINION_IDENTITIES entries");
  }

  for (const [recipient, entry] of minionIdentitiesByRecipient.entries()) {
    if (!evilPlayerIds.has(recipient)) {
      return fail("only demon or minions may receive MINION_IDENTITIES");
    }

    if (!knownReferencesAreSorted(entry.minions)) {
      return fail("MINION_IDENTITIES references must be canonical and role-free");
    }

    const expected = recipient === demon.playerId
      ? minionAssignments
      : minionAssignments.filter((assignment) => assignment.playerId !== recipient);

    if (entry.minions.length !== expected.length) {
      return fail("MINION_IDENTITIES entry has the wrong number of visible minions");
    }

    for (const [index, reference] of entry.minions.entries()) {
      const expectedMinion = expected[index];
      if (
        expectedMinion === undefined ||
        reference.playerId !== expectedMinion.playerId ||
        reference.seatNumber !== expectedMinion.seatNumber ||
        reference.playerId === recipient ||
        reference.playerId === demon.playerId ||
        !minionPlayerIds.has(reference.playerId)
      ) {
        return fail("MINION_IDENTITIES must reference only the permitted other minions");
      }
    }
  }

  if (demonBluffsByRecipient.size !== 1 || !demonBluffsByRecipient.has(demon.playerId)) {
    return fail("only the demon must receive exactly one DEMON_BLUFFS entry");
  }

  const demonBluffs = demonBluffsByRecipient.get(demon.playerId);
  if (demonBluffs === undefined) {
    return fail("demon must receive DEMON_BLUFFS");
  }

  if (demonBluffs.roles.length !== setup.demonBluffs.length || !roleListIsAsciiSorted(demonBluffs.roles)) {
    return fail("DEMON_BLUFFS roles must use canonical setup demon bluff order");
  }

  for (const [index, role] of demonBluffs.roles.entries()) {
    const expected = setup.demonBluffs[index];
    if (
      expected === undefined ||
      !sameRoleSetupSnapshot(role, expected) ||
      actualRoleIds.has(role.roleId)
    ) {
      return fail("DEMON_BLUFFS roles must deeply equal setup.demonBluffs and exclude actual roles");
    }
  }

  return { valid: true };
};
