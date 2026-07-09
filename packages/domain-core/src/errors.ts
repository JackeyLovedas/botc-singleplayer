export type DomainErrorCode =
  | "EmptyEventStream"
  | "EmptyEventBatch"
  | "InvalidDomainBatchSemantics"
  | "EventGameMismatch"
  | "EventSequenceJump"
  | "EventGameVersionMismatch"
  | "EventBatchMismatch"
  | "EventCommandMismatch"
  | "EventRulesBaselineMismatch"
  | "DuplicateEventId"
  | "DuplicateCommandBatch"
  | "NonContiguousBatch"
  | "DuplicateGameCreated"
  | "MissingGameCreated"
  | "UnsupportedEventVersion"
  | "InvalidPlayerCounts"
  | "InvalidGameCreatedPayload"
  | "InvalidScriptSelectedPayload"
  | "InvalidScriptSelectedPhase"
  | "DuplicateScriptSelected"
  | "InvalidSetupGeneratedPayload"
  | "DuplicateSetupGenerated"
  | "InvalidPlayerRosterCreatedPayload"
  | "DuplicatePlayerRosterCreated"
  | "InvalidCharactersAssignedPayload"
  | "DuplicateCharactersAssigned"
  | "InvalidFirstNightInitializedPayload"
  | "DuplicateFirstNightInitialized"
  | "InvalidInitialPrivateKnowledgeEstablishedPayload"
  | "DuplicateInitialPrivateKnowledgeEstablished"
  | "InvalidFirstNightTaskPlanCreatedPayload"
  | "DuplicateFirstNightTaskPlanCreated"
  | "InvalidFirstNightActionOpportunityCreatedPayload"
  | "InvalidPhilosopherActionDeferredPayload"
  | "InvalidPhilosopherAbilityChosenPayload"
  | "InvalidPhilosopherAbilityGrantedPayload"
  | "InvalidAbilityImpairmentAppliedPayload"
  | "InvalidFirstNightTaskInsertedPayload"
  | "InvalidMinionInformationDeliveredPayload"
  | "DuplicateMinionInformationDelivered"
  | "InvalidDemonInformationDeliveredPayload"
  | "DuplicateDemonInformationDelivered"
  | "InvalidScheduledTaskSettledPayload"
  | "PrivateKnowledgeUnavailable"
  | "UnknownPlayerPrivateKnowledgeViewer"
  | "InvalidPhaseTransition"
  | "InvalidPhaseTransitionReason"
  | "InvalidPhaseCounter"
  | "MissingTransitionPrerequisite"
  | "PhaseTransitionNotIntegrated";

export class DomainError extends Error {
  public constructor(
    public readonly code: DomainErrorCode,
    message: string
  ) {
    super(message);
    this.name = "DomainError";
  }
}

export const assertNever = (_value: never): never => {
  void _value;
  throw new DomainError("UnsupportedEventVersion", "Unexpected value");
};
