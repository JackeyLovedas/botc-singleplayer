import { isCanonicalDataValue, sameCanonicalDataValue } from "./canonical-data.js";
import {
  parseFirstNightAbilityInstanceId,
  validateFirstNightAbilityInstanceProvenanceShape
} from "./first-night-ability-outcome-ledger.js";
import { hasExactRoleSetupSnapshotShape } from "./initial-private-knowledge.js";
import type { SeatNumber } from "./player-roster.js";
import type { RoleSetupSnapshot } from "./setup-types.js";
import type { DreamerV2SourceContract } from "./dreamer-v2.js";

export type DreamerV2InternalShapeValidation =
  | { readonly valid: true }
  | { readonly valid: false; readonly reason: string };

const invalid = (reason: string): DreamerV2InternalShapeValidation => ({ valid: false, reason });
const exact = (value: unknown, expected: readonly string[]): value is Record<string, unknown> => {
  if (!isCanonicalDataValue(value) || value === null || typeof value !== "object" || Array.isArray(value)) return false;
  const keys = Object.keys(value);
  return keys.length === expected.length && keys.every((key) => expected.includes(key));
};
const canonicalId = (value: unknown): value is string =>
  typeof value === "string" && value.length > 0 && value.trim() === value &&
  ![...value].some((character) => {
    const code = character.charCodeAt(0);
    return code <= 31 || code === 127;
  });
const seat = (value: unknown): value is SeatNumber =>
  typeof value === "number" && Number.isSafeInteger(value) && value >= 1 && value <= 12;
const revision = (value: unknown): value is number =>
  typeof value === "number" && Number.isSafeInteger(value) && value >= 1;
const exactRole = (value: unknown): value is RoleSetupSnapshot =>
  exact(value, ["roleId", "characterType", "defaultAlignment", "edition", "setupModifier"]) &&
  exact(value.setupModifier, ["outsiderDelta", "townsfolkDelta"]) && hasExactRoleSetupSnapshotShape(value);
const parseTask = (value: unknown): { readonly sourceKind: "BASE"; readonly seatNumber: SeatNumber } | undefined => {
  if (typeof value !== "string") return undefined;
  const base = /^first-night-v1:DREAMER_ACTION:seat-(0[1-9]|1[0-2])$/.exec(value);
  if (base?.[1] !== undefined) return { sourceKind: "BASE", seatNumber: Number(base[1]) as SeatNumber };
  return undefined;
};
const validateTenure = (value: unknown, contract: DreamerV2SourceContract): boolean =>
  exact(value, ["roleTenureId", "playerId", "seatNumber", "roleId", "acquiredCharacterStateRevision", "endedCharacterStateRevision", "statusAtEvaluation"]) &&
  canonicalId(value.roleTenureId) && value.playerId === contract.sourcePlayerId && value.seatNumber === contract.sourceSeatNumber &&
  value.roleId === contract.sourceRole.roleId && revision(value.acquiredCharacterStateRevision) &&
  value.acquiredCharacterStateRevision <= contract.opportunityCharacterStateRevision && value.endedCharacterStateRevision === null &&
  value.statusAtEvaluation === "ACTIVE";
const baseKeys = [
  "sourceContractVersion", "taskPlanVersion", "taskId", "taskType", "sourcePlayerId", "sourceSeatNumber",
  "sourceRole", "abilityRole", "sourceRoleTenure", "opportunityCharacterStateRevision", "abilityInstance", "kind"
] as const;

export const validateDreamerV2SourceContractShapeForInternalUse = (
  value: unknown
): DreamerV2InternalShapeValidation => {
  try {
    if (!exact(value, baseKeys)) return invalid("Dreamer V2 source contract must have the exact base shape");
    if (value.kind !== "BASE_DREAMER_V2") return invalid("Dreamer V2 source kind must be base");
    const contract = value as unknown as DreamerV2SourceContract;
    const task = parseTask(contract.taskId);
    if (contract.sourceContractVersion !== "dreamer-source-contract-v2" || contract.taskPlanVersion !== "first-night-task-plan-v2" ||
        contract.taskType !== "DREAMER_ACTION" || task === undefined || !canonicalId(contract.sourcePlayerId) ||
        !seat(contract.sourceSeatNumber) || task.seatNumber !== contract.sourceSeatNumber || !exactRole(contract.sourceRole) ||
        !exactRole(contract.abilityRole) || contract.abilityRole.roleId !== "dreamer" ||
        !revision(contract.opportunityCharacterStateRevision) || !validateTenure(contract.sourceRoleTenure, contract)) {
      return invalid("Dreamer V2 source contract fields or tenure are invalid");
    }
    const abilityValidation = validateFirstNightAbilityInstanceProvenanceShape(contract.abilityInstance);
    const parsedAbility = parseFirstNightAbilityInstanceId(contract.abilityInstance.abilityInstanceId);
    if (!abilityValidation.valid || !parsedAbility.valid || contract.abilityInstance.taskId !== contract.taskId ||
        contract.abilityInstance.sourcePlayerId !== contract.sourcePlayerId || contract.abilityInstance.sourceSeatNumber !== contract.sourceSeatNumber ||
        contract.abilityInstance.abilityRoleId !== "dreamer") return invalid("Dreamer V2 source ability instance is invalid");
    return task.sourceKind === "BASE" && contract.sourceRole.roleId === "dreamer" &&
      sameCanonicalDataValue(contract.sourceRole, contract.abilityRole) && contract.abilityInstance.kind === "BASE_ROLE_TASK"
      ? { valid: true }
      : invalid("Base Dreamer V2 source contract cross-links are invalid");
  } catch {
    return invalid("Dreamer V2 source contract validation failed closed");
  }
};
