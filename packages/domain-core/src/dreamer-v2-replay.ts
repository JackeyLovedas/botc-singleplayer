import { sameCanonicalDataValue } from "./canonical-data.js";
import { validateDomainBatchSemantics } from "./domain-batch-semantics.js";
import { applyDomainEvent } from "./event-applier.js";
import { validateDomainEventStream } from "./event-stream-validator.js";
import type { AnyDomainEventEnvelope, DomainEventEnvelope } from "./events.js";
import { rebuildGameState } from "./rebuild.js";
import {
  captureDreamerV2PipelineFingerprintForInternalApplication,
  resolveDreamerV2SourceEffectivenessForInternalValidation,
  resolveDreamerV2TargetTruthForInternalValidation,
  resolveDreamerV2VortoxConstraintForInternalValidation,
  sameDreamerV2PipelineStateFingerprint
} from "./dreamer-v2-internal.js";
import type { DreamerV2PipelineStateFingerprint } from "./dreamer-v2-internal.js";
import {
  DREAMER_V2_CANDIDATE_DOMAIN_VERSION,
  DREAMER_V2_INFORMATION_DELIVERY_SCHEMA_VERSION,
  DREAMER_V2_INFORMATION_MODEL_VERSION,
  DREAMER_V2_INFORMATION_STAGE,
  DREAMER_V2_RESOLUTION_BOUNDARY_VERSION,
  DREAMER_V2_RESOLUTION_MODEL_VERSION,
  DREAMER_V2_SIMULATION_POLICY_VERSION,
  DREAMER_V2_TARGET_CHOICE_SCHEMA_VERSION,
  formatDreamerV2DeliveryId,
  formatDreamerV2TargetChoiceId,
  resolveDreamerV2Candidates
} from "./dreamer-v2.js";
import type { DreamerInformationDeliveredV2Payload, DreamerTargetChosenV2Payload, DreamerV2DeliveryId, DreamerV2TargetChoiceId } from "./dreamer-v2.js";
import { SUPPORTED_SCHEDULED_TASK_SETTLEMENT_VERSION } from "./first-night-task-plan.js";
import type { ScheduledTaskSettledPayload } from "./first-night-task-plan.js";
import type { PlayerId, ScheduledTaskId, ActionOpportunityId } from "./ids.js";
import type { GameState } from "./game-state.js";

export type DreamerV2ProspectiveEventTuple = readonly [
  DomainEventEnvelope<"DreamerTargetChosenV2">,
  DomainEventEnvelope<"DreamerInformationDeliveredV2">,
  DomainEventEnvelope<"ScheduledTaskSettled">
];

export type DreamerV2DeliveryCheckpoint = {
  readonly targetEventIndex: number;
  readonly deliveryEventIndex: number;
  readonly settlementEventIndex: number;
  readonly preTargetStateFingerprint: DreamerV2PipelineStateFingerprint;
  readonly targetEvent: DomainEventEnvelope<"DreamerTargetChosenV2">;
  readonly stateAfterTargetFingerprint: DreamerV2PipelineStateFingerprint;
  readonly deliveryEvent: DomainEventEnvelope<"DreamerInformationDeliveredV2">;
  readonly stateAfterDeliveryFingerprint: DreamerV2PipelineStateFingerprint;
  readonly settlementEvent: DomainEventEnvelope<"ScheduledTaskSettled">;
  readonly stateAfterSettlementFingerprint: DreamerV2PipelineStateFingerprint;
};

export type ProspectiveDreamerV2TripletValidation =
  | { readonly valid: true; readonly prospectiveStateFingerprint: DreamerV2PipelineStateFingerprint }
  | { readonly valid: false; readonly code:
      | "PIPELINE_STATE_MISMATCH"
      | "EXPECTED_TARGET_MISMATCH"
      | "EXPECTED_DELIVERY_MISMATCH"
      | "EXPECTED_SETTLEMENT_MISMATCH"
      | "BATCH_CONTRACT_INVALID"
      | "PROSPECTIVE_STREAM_INVALID"
      | "PROSPECTIVE_REBUILD_MISMATCH"
      | "LEDGER_FACT_MISMATCH";
      readonly reason: string };

const boundary=(stage:"PRE_TARGET"|"PRE_DELIVERY"|"PRE_SETTLEMENT",opportunityId:DomainEventEnvelope<"DreamerTargetChosenV2">["payload"]["opportunityId"],targetPlayerId:DomainEventEnvelope<"DreamerTargetChosenV2">["payload"]["targetPlayerId"],targetChoiceId:DreamerV2TargetChoiceId|null,deliveryId:DreamerV2DeliveryId|null)=>({boundaryVersion:DREAMER_V2_RESOLUTION_BOUNDARY_VERSION,stage,opportunityId,targetPlayerId,targetChoiceId,deliveryId});

export const validateDreamerV2AliveEvidenceForInternalReplay = (
  events: readonly { readonly eventType: string }[]
): { readonly valid: true } | { readonly valid: false; readonly reason: string } => {
  const deathCapable = events.find((event) =>
    event.eventType === "PlayerDied" || event.eventType === "PlayerDeathRecorded" || event.eventType === "PlayerExecuted"
  );
  return deathCapable === undefined
    ? { valid: true }
    : { valid: false, reason: `Dreamer V2 does not support alive evidence after ${deathCapable.eventType}` };
};

export type InternalDreamerV2Resolution={readonly kind:"READY";readonly rebuiltStateFingerprint:DreamerV2PipelineStateFingerprint;readonly targetPayload:DreamerTargetChosenV2Payload;readonly deliveryPayload:DreamerInformationDeliveredV2Payload;readonly settlementPayload:ScheduledTaskSettledPayload}|{readonly kind:"DEPENDENCY_FAILURE";readonly message:string};

export const resolveDreamerV2FromAcceptedEventStream=(input:{readonly acceptedEvents:readonly AnyDomainEventEnvelope[];readonly pipelineStateFingerprint:DreamerV2PipelineStateFingerprint;readonly taskId:ScheduledTaskId;readonly opportunityId:ActionOpportunityId;readonly targetPlayerId:PlayerId}):InternalDreamerV2Resolution=>{
  try{
    const aliveEvidence=validateDreamerV2AliveEvidenceForInternalReplay(input.acceptedEvents);if(!aliveEvidence.valid)return {kind:"DEPENDENCY_FAILURE",message:aliveEvidence.reason};
    const state=rebuildGameState(input.acceptedEvents);const rebuiltFingerprint=captureDreamerV2PipelineFingerprintForInternalApplication({state,taskId:input.taskId,boundary:boundary("PRE_TARGET",input.opportunityId,input.targetPlayerId,null,null)});
    if(!sameDreamerV2PipelineStateFingerprint(rebuiltFingerprint,input.pipelineStateFingerprint))return {kind:"DEPENDENCY_FAILURE",message:"Dreamer V2 application and accepted-stream fingerprints differ"};
    const source=rebuiltFingerprint.sourceContractFingerprint;if(state.currentCharacterState===undefined||state.roster===undefined||state.setup===undefined)return {kind:"DEPENDENCY_FAILURE",message:"Dreamer V2 target truth is unavailable"};
    const truth=resolveDreamerV2TargetTruthForInternalValidation({currentCharacterState:state.currentCharacterState,roster:state.roster.entries,targetPlayerId:input.targetPlayerId});
    const effectiveness=resolveDreamerV2SourceEffectivenessForInternalValidation({sourceContract:source,abilityImpairments:state.abilityImpairments??{impairments:[]}});
    const vortox=resolveDreamerV2VortoxConstraintForInternalValidation({currentCharacterState:state.currentCharacterState,roleTenures:state.seamstressRoleTenureState!,abilityImpairments:state.abilityImpairments??{impairments:[]}});
    const candidates=resolveDreamerV2Candidates({roleCatalogSnapshot:state.setup.roleCatalogSnapshot,roleCatalogSignature:state.setup.roleCatalogSignature,targetTruth:truth,sourceEffectiveness:effectiveness,vortoxConstraint:vortox});if(candidates.kind!=="READY")return {kind:"DEPENDENCY_FAILURE",message:candidates.message};
    const targetChoiceId=formatDreamerV2TargetChoiceId(input.taskId);const deliveryId=formatDreamerV2DeliveryId(input.taskId);
    const targetPayload:DreamerTargetChosenV2Payload={rulesBaselineVersion:state.rulesBaselineVersion,targetChoiceSchemaVersion:DREAMER_V2_TARGET_CHOICE_SCHEMA_VERSION,nightNumber:1,taskId:input.taskId,taskType:"DREAMER_ACTION",opportunityId:input.opportunityId,targetChoiceId,decisionKind:"CHOOSE_PLAYER",sourceContract:structuredClone(source),targetPlayerId:truth.targetPlayerId,targetSeatNumber:truth.targetSeatNumber,settlementCharacterStateRevision:state.currentCharacterState.revision};
    const deliveryPayload:DreamerInformationDeliveredV2Payload={rulesBaselineVersion:state.rulesBaselineVersion,deliverySchemaVersion:DREAMER_V2_INFORMATION_DELIVERY_SCHEMA_VERSION,nightNumber:1,taskId:input.taskId,taskType:"DREAMER_ACTION",opportunityId:input.opportunityId,targetChoiceId,deliveryId,sourceContract:structuredClone(source),targetTruth:truth,candidateDomain:{...candidates.candidateDomain,candidateDomainVersion:DREAMER_V2_CANDIDATE_DOMAIN_VERSION},selectedGoodRole:candidates.selectedGoodRole,selectedEvilRole:candidates.selectedEvilRole,truthOutcome:candidates.truthOutcome,sourceEffectiveness:effectiveness,vortoxConstraint:vortox,informationReliability:candidates.informationReliability,resolutionModelVersion:DREAMER_V2_RESOLUTION_MODEL_VERSION,simulationPolicyVersion:DREAMER_V2_SIMULATION_POLICY_VERSION,knowledgeModelVersion:DREAMER_V2_INFORMATION_MODEL_VERSION,knowledgeStage:DREAMER_V2_INFORMATION_STAGE,settlementCharacterStateRevision:state.currentCharacterState.revision};
    const settlementPayload:ScheduledTaskSettledPayload={rulesBaselineVersion:state.rulesBaselineVersion,settlementVersion:SUPPORTED_SCHEDULED_TASK_SETTLEMENT_VERSION,nightNumber:1,taskId:input.taskId,taskType:"DREAMER_ACTION",outcomeType:"DREAMER_INFORMATION_DELIVERED",characterStateRevision:state.currentCharacterState.revision};
    return {kind:"READY",rebuiltStateFingerprint:rebuiltFingerprint,targetPayload,deliveryPayload,settlementPayload};
  }catch(error){return {kind:"DEPENDENCY_FAILURE",message:error instanceof Error?error.message:"Dreamer V2 resolution failed"};}
};

export const validateProspectiveDreamerV2TripletForInternalApplication=(input:{
  readonly priorAcceptedEvents:readonly AnyDomainEventEnvelope[];
  readonly pipelineStateFingerprint:DreamerV2PipelineStateFingerprint;
  readonly events:DreamerV2ProspectiveEventTuple;
}):ProspectiveDreamerV2TripletValidation=>{
  try{
    const acceptedEvents=structuredClone(input.priorAcceptedEvents);validateDomainEventStream(acceptedEvents);
    const prior=rebuildGameState(acceptedEvents);const [target,delivery,settlement]=input.events;
    const pre=captureDreamerV2PipelineFingerprintForInternalApplication({state:prior,taskId:target.payload.taskId,boundary:boundary("PRE_TARGET",target.payload.opportunityId,target.payload.targetPlayerId,null,null)});
    if(!sameDreamerV2PipelineStateFingerprint(pre,input.pipelineStateFingerprint))return {valid:false,code:"PIPELINE_STATE_MISMATCH",reason:"Dreamer V2 pre-target fingerprint changed"};
    const expected=resolveDreamerV2FromAcceptedEventStream({
      acceptedEvents,
      pipelineStateFingerprint:input.pipelineStateFingerprint,
      taskId:target.payload.taskId,
      opportunityId:target.payload.opportunityId,
      targetPlayerId:target.payload.targetPlayerId
    });
    if(expected.kind!=="READY")return {valid:false,code:"PROSPECTIVE_STREAM_INVALID",reason:expected.message};
    if(!sameCanonicalDataValue(expected.targetPayload,target.payload))return {valid:false,code:"EXPECTED_TARGET_MISMATCH",reason:"Dreamer V2 prospective target differs from canonical resolution"};
    if(!sameCanonicalDataValue(expected.deliveryPayload,delivery.payload))return {valid:false,code:"EXPECTED_DELIVERY_MISMATCH",reason:"Dreamer V2 prospective delivery differs from canonical resolution"};
    if(!sameCanonicalDataValue(expected.settlementPayload,settlement.payload))return {valid:false,code:"EXPECTED_SETTLEMENT_MISMATCH",reason:"Dreamer V2 prospective settlement differs from canonical resolution"};
    try{validateDomainBatchSemantics(prior,input.events);}catch(error){return {valid:false,code:"BATCH_CONTRACT_INVALID",reason:error instanceof Error?error.message:"Dreamer V2 batch contract is invalid"};}
    const prospective=[...acceptedEvents,...structuredClone(input.events)];validateDomainEventStream(prospective);
    const factsBefore=prior.firstNightAbilityOutcomeLedger?.facts.length??0;
    const afterTarget=applyDomainEvent(prior,target);
    captureDreamerV2PipelineFingerprintForInternalApplication({state:afterTarget,taskId:target.payload.taskId,boundary:boundary("PRE_DELIVERY",target.payload.opportunityId,target.payload.targetPlayerId,target.payload.targetChoiceId,null)});
    const afterDelivery=applyDomainEvent(afterTarget,delivery);
    captureDreamerV2PipelineFingerprintForInternalApplication({state:afterDelivery,taskId:target.payload.taskId,boundary:boundary("PRE_SETTLEMENT",target.payload.opportunityId,target.payload.targetPlayerId,target.payload.targetChoiceId,delivery.payload.deliveryId)});
    const deliveryFacts=afterDelivery.firstNightAbilityOutcomeLedger?.facts??[];
    if(deliveryFacts.length!==factsBefore+1||deliveryFacts.filter((fact)=>fact.sourceEventId===delivery.eventId).length!==1)return {valid:false,code:"LEDGER_FACT_MISMATCH",reason:"Dreamer V2 delivery must append exactly one ledger fact"};
    const afterSettlement=applyDomainEvent(afterDelivery,settlement);
    if((afterSettlement.firstNightAbilityOutcomeLedger?.facts.length??0)!==deliveryFacts.length)return {valid:false,code:"LEDGER_FACT_MISMATCH",reason:"Dreamer V2 settlement must not append a second ledger fact"};
    const rebuilt=rebuildGameState(prospective);
    if(!sameCanonicalDataValue(afterSettlement,rebuilt))return {valid:false,code:"PROSPECTIVE_REBUILD_MISMATCH",reason:"Dreamer V2 prospective replay differs from full rebuild"};
    const facts=rebuilt.firstNightAbilityOutcomeLedger?.facts.filter((fact)=>fact.sourceEventId===delivery.eventId)??[];
    if(facts.length!==1)return {valid:false,code:"LEDGER_FACT_MISMATCH",reason:"Dreamer V2 delivery must append exactly one ledger fact"};
    return {valid:true,prospectiveStateFingerprint:captureDreamerV2PipelineFingerprintForInternalApplication({state:afterSettlement,taskId:target.payload.taskId,boundary:boundary("PRE_SETTLEMENT",target.payload.opportunityId,target.payload.targetPlayerId,target.payload.targetChoiceId,delivery.payload.deliveryId)})};
  }catch(error){return {valid:false,code:"PROSPECTIVE_STREAM_INVALID",reason:error instanceof Error?error.message:"Dreamer V2 prospective validation failed"};}
};

export const validateStoredDreamerV2CheckpointForInternalReplay=(input:{
  readonly acceptedEvents:readonly AnyDomainEventEnvelope[];
  readonly checkpoint:DreamerV2DeliveryCheckpoint;
  readonly finalStateFingerprint:DreamerV2PipelineStateFingerprint;
}):{readonly valid:true}|{readonly valid:false;readonly reason:string}=>{
  try{
    validateDomainEventStream(input.acceptedEvents);const c=input.checkpoint;
    if(c.deliveryEventIndex!==c.targetEventIndex+1||c.settlementEventIndex!==c.deliveryEventIndex+1||
      !sameCanonicalDataValue(input.acceptedEvents[c.targetEventIndex],c.targetEvent)||!sameCanonicalDataValue(input.acceptedEvents[c.deliveryEventIndex],c.deliveryEvent)||!sameCanonicalDataValue(input.acceptedEvents[c.settlementEventIndex],c.settlementEvent))return {valid:false,reason:"Dreamer V2 checkpoint indexes or envelopes are not exact"};
    const prior=rebuildGameState(input.acceptedEvents.slice(0,c.targetEventIndex));const afterTarget=applyDomainEvent(prior,c.targetEvent);const afterDelivery=applyDomainEvent(afterTarget,c.deliveryEvent);const afterSettlement=applyDomainEvent(afterDelivery,c.settlementEvent);
    const expected=resolveDreamerV2FromAcceptedEventStream({
      acceptedEvents:input.acceptedEvents.slice(0,c.targetEventIndex),
      pipelineStateFingerprint:c.preTargetStateFingerprint,
      taskId:c.targetEvent.payload.taskId,
      opportunityId:c.targetEvent.payload.opportunityId,
      targetPlayerId:c.targetEvent.payload.targetPlayerId
    });
    if(expected.kind!=="READY"||!sameCanonicalDataValue(expected.targetPayload,c.targetEvent.payload)||
      !sameCanonicalDataValue(expected.deliveryPayload,c.deliveryEvent.payload)||
      !sameCanonicalDataValue(expected.settlementPayload,c.settlementEvent.payload))return {valid:false,reason:"Dreamer V2 stored triplet differs from canonical accepted-stream resolution"};
    const b0=boundary("PRE_TARGET",c.targetEvent.payload.opportunityId,c.targetEvent.payload.targetPlayerId,null,null);const b1=boundary("PRE_DELIVERY",c.targetEvent.payload.opportunityId,c.targetEvent.payload.targetPlayerId,c.targetEvent.payload.targetChoiceId,null);const b2=boundary("PRE_SETTLEMENT",c.targetEvent.payload.opportunityId,c.targetEvent.payload.targetPlayerId,c.targetEvent.payload.targetChoiceId,c.deliveryEvent.payload.deliveryId);
    if(!sameDreamerV2PipelineStateFingerprint(captureDreamerV2PipelineFingerprintForInternalApplication({state:prior,taskId:c.targetEvent.payload.taskId,boundary:b0}),c.preTargetStateFingerprint)||!sameDreamerV2PipelineStateFingerprint(captureDreamerV2PipelineFingerprintForInternalApplication({state:afterTarget,taskId:c.targetEvent.payload.taskId,boundary:b1}),c.stateAfterTargetFingerprint)||!sameDreamerV2PipelineStateFingerprint(captureDreamerV2PipelineFingerprintForInternalApplication({state:afterDelivery,taskId:c.targetEvent.payload.taskId,boundary:b2}),c.stateAfterDeliveryFingerprint)||!sameDreamerV2PipelineStateFingerprint(captureDreamerV2PipelineFingerprintForInternalApplication({state:afterSettlement,taskId:c.targetEvent.payload.taskId,boundary:b2}),c.stateAfterSettlementFingerprint))return {valid:false,reason:"Dreamer V2 checkpoint fingerprint mismatch"};
    const final=rebuildGameState(input.acceptedEvents);const finalFingerprint=captureDreamerV2PipelineFingerprintForInternalApplication({state:final,taskId:c.targetEvent.payload.taskId,boundary:b2});
    return sameDreamerV2PipelineStateFingerprint(finalFingerprint,input.finalStateFingerprint)?{valid:true}:{valid:false,reason:"Dreamer V2 final fingerprint mismatch"};
  }catch(error){return {valid:false,reason:error instanceof Error?error.message:"Stored Dreamer V2 validation failed"};}
};

const trustedDreamerV2ProjectionBrand:unique symbol=Symbol("trustedDreamerV2ProjectionBrand");
export type TrustedDreamerV2ProjectionState={readonly trustVersion:"dreamer-projection-trust-v2";readonly finalState:GameState;readonly checkpoints:readonly DreamerV2DeliveryCheckpoint[];readonly [trustedDreamerV2ProjectionBrand]:true};

export const replayTrustedDreamerV2ProjectionStream=(events:readonly AnyDomainEventEnvelope[]):TrustedDreamerV2ProjectionState=>{
  validateDomainEventStream(events);const finalState=rebuildGameState(events);const checkpoints:DreamerV2DeliveryCheckpoint[]=[];
  for(let index=0;index<events.length;index+=1){const target=events[index];if(target?.eventType!=="DreamerTargetChosenV2")continue;const delivery=events[index+1];const settlement=events[index+2];if(delivery?.eventType!=="DreamerInformationDeliveredV2"||settlement?.eventType!=="ScheduledTaskSettled")throw new Error("Dreamer V2 accepted stream contains an incomplete triplet");
    const prior=rebuildGameState(events.slice(0,index));const b0=boundary("PRE_TARGET",target.payload.opportunityId,target.payload.targetPlayerId,null,null);const b1=boundary("PRE_DELIVERY",target.payload.opportunityId,target.payload.targetPlayerId,target.payload.targetChoiceId,null);const b2=boundary("PRE_SETTLEMENT",target.payload.opportunityId,target.payload.targetPlayerId,target.payload.targetChoiceId,delivery.payload.deliveryId);const afterTarget=applyDomainEvent(prior,target);const afterDelivery=applyDomainEvent(afterTarget,delivery);const afterSettlement=applyDomainEvent(afterDelivery,settlement);
    checkpoints.push({targetEventIndex:index,deliveryEventIndex:index+1,settlementEventIndex:index+2,preTargetStateFingerprint:captureDreamerV2PipelineFingerprintForInternalApplication({state:prior,taskId:target.payload.taskId,boundary:b0}),targetEvent:structuredClone(target),stateAfterTargetFingerprint:captureDreamerV2PipelineFingerprintForInternalApplication({state:afterTarget,taskId:target.payload.taskId,boundary:b1}),deliveryEvent:structuredClone(delivery),stateAfterDeliveryFingerprint:captureDreamerV2PipelineFingerprintForInternalApplication({state:afterDelivery,taskId:target.payload.taskId,boundary:b2}),settlementEvent:structuredClone(settlement),stateAfterSettlementFingerprint:captureDreamerV2PipelineFingerprintForInternalApplication({state:afterSettlement,taskId:target.payload.taskId,boundary:b2})});index+=2;
  }
  for(const checkpoint of checkpoints){const b=boundary("PRE_SETTLEMENT",checkpoint.targetEvent.payload.opportunityId,checkpoint.targetEvent.payload.targetPlayerId,checkpoint.targetEvent.payload.targetChoiceId,checkpoint.deliveryEvent.payload.deliveryId);const finalFingerprint=captureDreamerV2PipelineFingerprintForInternalApplication({state:finalState,taskId:checkpoint.targetEvent.payload.taskId,boundary:b});const validation=validateStoredDreamerV2CheckpointForInternalReplay({acceptedEvents:events,checkpoint,finalStateFingerprint:finalFingerprint});if(!validation.valid)throw new Error(validation.reason);}
  const trusted={trustVersion:"dreamer-projection-trust-v2" as const,finalState:structuredClone(finalState),checkpoints:structuredClone(checkpoints)} as unknown as TrustedDreamerV2ProjectionState;Object.defineProperty(trusted,trustedDreamerV2ProjectionBrand,{value:true,enumerable:false});return trusted;
};
