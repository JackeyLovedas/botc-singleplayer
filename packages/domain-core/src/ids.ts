type Brand<TValue, TBrand extends string> = TValue & { readonly __brand: TBrand };

export type GameId = Brand<string, "GameId">;
export type CommandId = Brand<string, "CommandId">;
export type EventId = Brand<string, "EventId">;
export type BatchId = Brand<string, "BatchId">;
export type CorrelationId = Brand<string, "CorrelationId">;
export type CausationId = Brand<string, "CausationId">;
export type PlayerId = Brand<string, "PlayerId">;
export type RoleId = Brand<string, "RoleId">;
export type ScheduledTaskId = Brand<string, "ScheduledTaskId">;
export type ActionOpportunityId = Brand<string, "ActionOpportunityId">;
export type GrantedAbilityId = Brand<string, "GrantedAbilityId">;
export type AbilityImpairmentId = Brand<string, "AbilityImpairmentId">;
export type RoleTenureId = Brand<string, "RoleTenureId">;
export type RoleTenureTransitionFactId = Brand<string, "RoleTenureTransitionFactId">;
export type AbilityInstanceId = Brand<string, "AbilityInstanceId">;
export type AbilityUseEntitlementId = Brand<string, "AbilityUseEntitlementId">;
export type CandidateId = Brand<string, "CandidateId">;

const asNonEmpty = <TBrand extends string>(value: string, label: TBrand): Brand<string, TBrand> => {
  if (value.trim().length === 0) {
    throw new Error(`${label} cannot be empty`);
  }

  return value as Brand<string, TBrand>;
};

export const gameId = (value: string): GameId => asNonEmpty(value, "GameId");
export const commandId = (value: string): CommandId => asNonEmpty(value, "CommandId");
export const eventId = (value: string): EventId => asNonEmpty(value, "EventId");
export const batchId = (value: string): BatchId => asNonEmpty(value, "BatchId");
export const correlationId = (value: string): CorrelationId => asNonEmpty(value, "CorrelationId");
export const causationId = (value: string): CausationId => asNonEmpty(value, "CausationId");
export const playerId = (value: string): PlayerId => asNonEmpty(value, "PlayerId");
export const roleId = (value: string): RoleId => asNonEmpty(value, "RoleId");
export const scheduledTaskId = (value: string): ScheduledTaskId => asNonEmpty(value, "ScheduledTaskId");
export const actionOpportunityId = (value: string): ActionOpportunityId => asNonEmpty(value, "ActionOpportunityId");
export const grantedAbilityId = (value: string): GrantedAbilityId => asNonEmpty(value, "GrantedAbilityId");
export const abilityImpairmentId = (value: string): AbilityImpairmentId => asNonEmpty(value, "AbilityImpairmentId");
export const roleTenureId = (value: string): RoleTenureId => asNonEmpty(value, "RoleTenureId");
export const roleTenureTransitionFactId = (value: string): RoleTenureTransitionFactId =>
  asNonEmpty(value, "RoleTenureTransitionFactId");
export const abilityInstanceId = (value: string): AbilityInstanceId => asNonEmpty(value, "AbilityInstanceId");
export const abilityUseEntitlementId = (value: string): AbilityUseEntitlementId =>
  asNonEmpty(value, "AbilityUseEntitlementId");
export const candidateId = (value: string): CandidateId => asNonEmpty(value, "CandidateId");

export const causationIdFromCommandId = (value: CommandId): CausationId => causationId(value);
