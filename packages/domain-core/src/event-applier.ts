import { DomainError, assertNever } from "./errors.js";
import { RULES_BASELINE_VERSION, SUPPORTED_DOMAIN_EVENT_VERSION, isCanonicalPlayerCounts } from "./events.js";
import type { AnyDomainEventEnvelope, SetupGeneratedPayload } from "./events.js";
import type { GameState } from "./game-state.js";
import { evaluatePhaseTransition } from "./phase-transition-policy.js";
import {
  BASE_TWELVE_PLAYER_COUNTS,
  SUPPORTED_SCRIPT_EDITION,
  SUPPORTED_SCRIPT_ID,
  isSupportedScriptMetadata
} from "./setup-types.js";
import type { CharacterType, RoleCountSet, RoleSetupSnapshot, SetupModifierApplied } from "./setup-types.js";

const CHARACTER_TYPES: readonly CharacterType[] = ["TOWNSFOLK", "OUTSIDER", "MINION", "DEMON"];

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

const nonZeroModifier = (modifier: SetupModifierApplied): boolean =>
  modifier.outsiderDelta !== 0 || modifier.townsfolkDelta !== 0;

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

  if (!sameCounts(payload.preModifierCounts, BASE_TWELVE_PLAYER_COUNTS)) {
    throw new DomainError("InvalidSetupGeneratedPayload", "SetupGenerated preModifierCounts must be 7/2/2/1");
  }

  if (countTotal(payload.postModifierCounts) !== 12) {
    throw new DomainError("InvalidSetupGeneratedPayload", "SetupGenerated postModifierCounts must total 12");
  }

  if (payload.actualRoles.length !== 12) {
    throw new DomainError("InvalidSetupGeneratedPayload", "SetupGenerated actualRoles must contain 12 roles");
  }

  if (!allRoleIdsUnique(payload.actualRoles)) {
    throw new DomainError("InvalidSetupGeneratedPayload", "SetupGenerated actualRoles must be unique");
  }

  if (payload.actualRoles.some((role) => role.edition !== SUPPORTED_SCRIPT_EDITION)) {
    throw new DomainError("InvalidSetupGeneratedPayload", "SetupGenerated actualRoles must use Sects & Violets edition");
  }

  const actualCounts = countRolesByType(payload.actualRoles);
  if (!sameCounts(actualCounts, payload.postModifierCounts)) {
    throw new DomainError("InvalidSetupGeneratedPayload", "SetupGenerated actual role counts must match postModifierCounts");
  }

  if (actualCounts.DEMON !== 1 || actualCounts.MINION !== 2) {
    throw new DomainError("InvalidSetupGeneratedPayload", "SetupGenerated must contain exactly 1 demon and 2 minions");
  }

  const actualRoleIds = new Set(payload.actualRoles.map((role) => role.roleId));
  const demonInActualRoles = payload.actualRoles.find((role) => role.roleId === payload.demonRole.roleId);
  if (demonInActualRoles === undefined || payload.demonRole.characterType !== "DEMON") {
    throw new DomainError("InvalidSetupGeneratedPayload", "SetupGenerated demonRole must be the demon in actualRoles");
  }

  const expectedPostCounts: RoleCountSet = {
    TOWNSFOLK: BASE_TWELVE_PLAYER_COUNTS.TOWNSFOLK + payload.demonRole.setupModifier.townsfolkDelta,
    OUTSIDER: BASE_TWELVE_PLAYER_COUNTS.OUTSIDER + payload.demonRole.setupModifier.outsiderDelta,
    MINION: BASE_TWELVE_PLAYER_COUNTS.MINION,
    DEMON: BASE_TWELVE_PLAYER_COUNTS.DEMON
  };
  if (!sameCounts(payload.postModifierCounts, expectedPostCounts)) {
    throw new DomainError("InvalidSetupGeneratedPayload", "SetupGenerated postModifierCounts must match demon setup modifier");
  }

  const nonZeroApplied = payload.setupModifiersApplied.filter(nonZeroModifier);
  const demonModifierIsZero = payload.demonRole.setupModifier.outsiderDelta === 0 && payload.demonRole.setupModifier.townsfolkDelta === 0;
  if (demonModifierIsZero && nonZeroApplied.length !== 0) {
    throw new DomainError("InvalidSetupGeneratedPayload", "SetupGenerated must not apply zero setup modifiers");
  }

  if (!demonModifierIsZero) {
    const [applied] = nonZeroApplied;
    if (
      nonZeroApplied.length !== 1 ||
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

  if (
    payload.demonBluffs.some(
      (role) =>
        role.defaultAlignment !== "GOOD" ||
        role.edition !== SUPPORTED_SCRIPT_EDITION ||
        actualRoleIds.has(role.roleId)
    )
  ) {
    throw new DomainError("InvalidSetupGeneratedPayload", "SetupGenerated demonBluffs must be good, Sects & Violets, and not actual roles");
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
};

const validateEnvelope = (state: GameState | undefined, event: AnyDomainEventEnvelope): void => {
  if (event.eventVersion !== SUPPORTED_DOMAIN_EVENT_VERSION) {
    throw new DomainError("UnsupportedEventVersion", "Unsupported domain event version");
  }

  if (event.rulesBaselineVersion !== event.payload.rulesBaselineVersion) {
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
