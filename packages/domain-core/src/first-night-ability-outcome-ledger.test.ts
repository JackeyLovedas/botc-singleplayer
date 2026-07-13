import { describe, expect, it } from "vitest";
import {
  canonicalizeAbilityOutcomeEvidenceReferences,
  cloneFirstNightAbilityOutcomeLedger,
  deriveFirstNightAbilityOutcomeFact,
  FIRST_NIGHT_ABILITY_OUTCOME_AUDIT_MODEL_VERSION,
  FIRST_NIGHT_ABILITY_OUTCOME_LEDGER_VERSION,
  FIRST_NIGHT_ABILITY_OUTCOME_WINDOW_VERSION,
  formatBaseFirstNightAbilityInstanceId,
  formatFirstNightAbilityOutcomeFactId,
  formatPhilosopherGainedV1AbilityInstanceId,
  formatPhilosopherGainedV2AbilityInstanceId,
  parseFirstNightAbilityInstanceId,
  validateAbilityOutcomeEvidenceReferenceShape,
  validateFirstNightAbilityInstanceProvenanceShape,
  validateFirstNightAbilityOutcomeFactShape,
  validateFirstNightAbilityOutcomeLedgerShape,
  validateFirstNightAbilityOutcomeWindowAnchorShape
} from "./first-night-ability-outcome-ledger.js";
import { DomainError } from "./errors.js";
import { batchId, eventId, gameId, grantedAbilityId, playerId, roleId, scheduledTaskId } from "./ids.js";
import type { FirstNightAbilityOutcomeFact, FirstNightAbilityOutcomeLedger, SourceEventEvidence } from "./first-night-ability-outcome-ledger.js";
import type { GameState } from "./game-state.js";
import { seatNumber } from "./player-roster.js";

const taskId = scheduledTaskId("first-night-v1:WITCH_ACTION:seat-01");
const sourceEventId = eventId("event-20");
const sourceEvidence = (): SourceEventEvidence => ({
  kind: "SOURCE_EVENT", eventId: sourceEventId, eventType: "WitchDeathPendingMarked",
  eventSequence: 20, batchId: batchId("batch-20")
});
const fact = (status: FirstNightAbilityOutcomeFact["outcomeStatus"] = "NORMAL"): FirstNightAbilityOutcomeFact => ({
  auditFactId: formatFirstNightAbilityOutcomeFactId(sourceEventId),
  auditModelVersion: FIRST_NIGHT_ABILITY_OUTCOME_AUDIT_MODEL_VERSION,
  windowVersion: FIRST_NIGHT_ABILITY_OUTCOME_WINDOW_VERSION,
  sourcePlayerId: playerId("player-1"), sourceSeatNumber: seatNumber(1), abilityRoleId: roleId("witch"), abilityTaskId: taskId,
  abilityInstance: { provenanceVersion: "first-night-ability-instance-provenance-v1", kind: "BASE_ROLE_TASK", abilityInstanceId: formatBaseFirstNightAbilityInstanceId(taskId), abilityRoleId: roleId("witch"), taskId, sourcePlayerId: playerId("player-1"), sourceSeatNumber: seatNumber(1) },
  sourceEventId, sourceBatchId: batchId("batch-20"), sourceEventSequence: 20, evaluatedCharacterStateRevision: 1,
  outcomeStatus: status, causeKind: status === "ABNORMAL" ? "SOURCE_POISONING" : "NO_OTHER_CHARACTER_ABILITY",
  causedByAnotherCharacterAbility: status === "ABNORMAL", evidenceReferences: canonicalizeAbilityOutcomeEvidenceReferences([
    sourceEvidence(), { kind: "TASK", taskId, taskType: "WITCH_ACTION" },
    { kind: "ACTION_OPPORTUNITY", opportunityId: "opportunity-1", taskId, sourcePlayerId: "player-1", sourceSeatNumber: 1 },
    { kind: "CHARACTER_STATE", characterStateRevision: 1 },
    { kind: "PLAYER_ROLE_AT_REVISION", playerId: "player-1", seatNumber: 1, roleId: "witch", characterType: "MINION", defaultAlignment: "EVIL", characterStateRevision: 1 },
    { kind: "PLAYER_ROLE_AT_REVISION", playerId: "player-2", seatNumber: 2, roleId: "dreamer", characterType: "TOWNSFOLK", defaultAlignment: "GOOD", characterStateRevision: 1 },
    { kind: "WITCH_PENDING_MARKER", pendingDeathId: "pending-1", sourcePlayerId: "player-1", targetPlayerId: "player-2", taskId, opportunityId: "opportunity-1", terminalEventId: sourceEventId }
  ]), detectedAtEventSequence: 20
});
const ledger = (facts: readonly FirstNightAbilityOutcomeFact[] = [fact()]): FirstNightAbilityOutcomeLedger => ({
  ledgerVersion: FIRST_NIGHT_ABILITY_OUTCOME_LEDGER_VERSION,
  auditModelVersion: FIRST_NIGHT_ABILITY_OUTCOME_AUDIT_MODEL_VERSION,
  windowAnchor: { windowVersion: FIRST_NIGHT_ABILITY_OUTCOME_WINDOW_VERSION, gameId: gameId("game-1"), nightNumber: 1, rulesBaselineVersion: "Phase One v2.1", firstNightInitializedEventId: eventId("event-10"), startEventSequence: 10, startBoundary: "EXCLUSIVE" },
  facts
});
const factAt=(id:string,sequence:number,status:FirstNightAbilityOutcomeFact["outcomeStatus"],cause:FirstNightAbilityOutcomeFact["causeKind"],sourcePlayer="player-1"):FirstNightAbilityOutcomeFact=>{
  const nextId=eventId(id);const base=fact(status);return {...base,auditFactId:formatFirstNightAbilityOutcomeFactId(nextId),sourceEventId:nextId,sourceEventSequence:sequence,detectedAtEventSequence:sequence,sourcePlayerId:playerId(sourcePlayer),abilityInstance:{...base.abilityInstance,sourcePlayerId:playerId(sourcePlayer)},causeKind:cause,causedByAnotherCharacterAbility:status==="ABNORMAL"||status==="PENDING_TRIGGER",evidenceReferences:base.evidenceReferences.map((entry)=>entry.kind==="SOURCE_EVENT"?{...entry,eventId:nextId,eventSequence:sequence}:entry.kind==="WITCH_PENDING_MARKER"?{...entry,sourcePlayerId:playerId(sourcePlayer),terminalEventId:nextId}:entry.kind==="PLAYER_ROLE_AT_REVISION"&&entry.playerId==="player-1"?{...entry,playerId:playerId(sourcePlayer)}:entry.kind==="ACTION_OPPORTUNITY"?{...entry,sourcePlayerId:playerId(sourcePlayer)}:entry)};
};
const roleSnapshot=(id:string,characterType:"TOWNSFOLK"|"OUTSIDER"|"MINION"|"DEMON"="TOWNSFOLK")=>({roleId:roleId(id),characterType,defaultAlignment:characterType==="MINION"||characterType==="DEMON"?"EVIL" as const:"GOOD" as const,edition:"sects-and-violets" as const,setupModifier:{outsiderDelta:0,townsfolkDelta:0}});
const resolvingState=(facts:readonly FirstNightAbilityOutcomeFact[]):GameState=>{
  const roster=Array.from({length:12},(_,index)=>({playerId:playerId(index===11?"math-player":`player-${index+1}`),seatNumber:seatNumber(index+1),playerKind:index===0?("HUMAN" as const):("AI" as const),displayName:`Player ${index+1}`}));
  const entries=roster.map((entry,index)=>({playerId:entry.playerId,seatNumber:entry.seatNumber,role:index===11?roleSnapshot("mathematician"):index===0?roleSnapshot("witch","MINION"):roleSnapshot(`role-${index+1}`),currentAlignment:index===0?"EVIL" as const:"GOOD" as const}));
  return {gameId:gameId("game-1"),gameVersion:30,lastEventSequence:30,phase:"FIRST_NIGHT",dayNumber:0,nightNumber:1,created:true,rootSeed:"seed",rulesBaselineVersion:"Phase One v2.1",playerCounts:{playerCount:12,humanPlayerCount:1,aiPlayerCount:11,storytellerCount:1},firstNight:{rulesBaselineVersion:"Phase One v2.1",initializationVersion:"first-night-initialization-v1",nightNumber:1,rosterVersion:"fixed-12-player-roster-v1",assignmentAlgorithmVersion:"assignment-v1",roleCatalogSignature:"catalog"},roster:{rulesBaselineVersion:"Phase One v2.1",rosterVersion:"fixed-12-player-roster-v1",entries:roster},currentCharacterState:{revision:1,entries},firstNightAbilityOutcomeLedger:ledger(facts),firstNightTaskPlan:{rulesBaselineVersion:"Phase One v2.1",nightNumber:1,taskPlanVersion:"first-night-task-plan-v2",taskCatalogVersion:"catalog",taskCatalogSignatureAlgorithm:"algorithm",taskCatalogSignature:"signature",taskCatalogSnapshot:{},rosterVersion:"fixed-12-player-roster-v1",assignmentAlgorithmVersion:"assignment-v1",roleCatalogSignature:"catalog",knowledgeModelVersion:"knowledge",knowledgeStage:"stage",tasks:[{taskId:scheduledTaskId("first-night-v1:MATHEMATICIAN_INFORMATION:seat-12"),taskType:"MATHEMATICIAN_INFORMATION",taskClass:"ROLE_INFORMATION",orderKey:{baseOrder:1100,insertionOrder:0},source:{kind:"ROLE",playerId:playerId("math-player"),seatNumber:seatNumber(12),role:roleSnapshot("mathematician")},status:"PENDING",settlementPolicy:"REEVALUATE_SOURCE_AT_SETTLEMENT"}]},firstNightTaskProgress:{settlements:[]}} as unknown as GameState;
};
const evidenceVariants=()=>[
  sourceEvidence(),
  {kind:"TASK",taskId:"task",taskType:"WITCH_ACTION"},
  {kind:"ACTION_OPPORTUNITY",opportunityId:"opp",taskId:"task",sourcePlayerId:"p1",sourceSeatNumber:1},
  {kind:"ABILITY_IMPAIRMENT",impairmentId:"imp",impairmentKind:"DRUNK",affectedPlayerId:"p1",affectedSeatNumber:1,affectedRoleId:"witch",sourceKind:"PHILOSOPHER_CHOSEN_DUPLICATE",appliedCharacterStateRevision:1},
  {kind:"ROLE_TENURE",roleTenureId:"tenure",playerId:"p1",seatNumber:1,roleId:"vortox",acquiredCharacterStateRevision:1,statusAtEvaluation:"ACTIVE"},
  {kind:"CHARACTER_STATE",characterStateRevision:1},
  {kind:"PLAYER_ROLE_AT_REVISION",playerId:"p1",seatNumber:1,roleId:"witch",characterType:"MINION",defaultAlignment:"EVIL",characterStateRevision:1},
  {kind:"PHILOSOPHER_GRANT",grantId:"grant",philosopherOpportunityId:"opp",sourcePlayerId:"p1",sourceSeatNumber:1,chosenRoleId:"witch",sourceCharacterStateRevision:1},
  {kind:"FIRST_NIGHT_TASK_INSERTION",taskId:"task",philosopherOpportunityId:"opp",sourcePlayerId:"p1",sourceSeatNumber:1,chosenRoleId:"witch",generation:{kind:"V1",taskPlanVersion:"first-night-task-plan-v1"}},
  {kind:"SNAKE_CHARMER_RESOLUTION",resolutionKind:"NON_DEMON_NO_SWAP",taskId:"task",opportunityId:"opp",targetPlayerId:"p2",targetSeatNumber:2,targetRoleIdAtResolution:"dreamer",resolutionEventId:"event"},
  {kind:"EVIL_TWIN_PAIR",pairId:"pair",evilTwinPlayerId:"p1",goodTwinPlayerId:"p2",establishedTaskId:"task",informationDeliveryEventId:"event"},
  {kind:"WITCH_PENDING_MARKER",pendingDeathId:"pending",sourcePlayerId:"p1",targetPlayerId:"p2",taskId:"task",opportunityId:"opp",terminalEventId:"event"},
  {kind:"CERENOVUS_INSTRUCTION",deliveryId:"delivery",choiceId:"choice",markerId:"marker",sourcePlayerId:"p1",targetPlayerId:"p2",chosenRoleId:"dreamer",taskId:"task",terminalEventId:"event"},
  {kind:"CLOCKMAKER_DELIVERY",deliveryId:"delivery",taskId:"task",sourcePlayerId:"p1",ruleCorrectDistance:1,selectedDistance:2,terminalEventId:"event"},
  {kind:"DREAMER_DELIVERY",taskId:"task",opportunityId:"opp",sourcePlayerId:"p1",targetPlayerId:"p2",deliveredGoodRoleId:"dreamer",deliveredEvilRoleId:"witch",terminalEventId:"event"},
  {kind:"SEAMSTRESS_DELIVERY",taskId:"task",opportunityId:"opp",sourcePlayerId:"p1",firstTargetPlayerId:"p2",secondTargetPlayerId:"p3",ruleCorrectAnswer:"YES",deliveredAnswer:"NO",terminalEventId:"event"}
] as const;
const terminalState=(taskType:"SNAKE_CHARMER_ACTION"|"DREAMER_ACTION",sourceRole:"snake_charmer"|"dreamer",targetRole:string,targetType:"TOWNSFOLK"|"DEMON"="TOWNSFOLK"):GameState=>{
  const state=resolvingState([]);const task=scheduledTaskId(`first-night-v1:${taskType}:seat-01`);const sourceEntry=state.currentCharacterState!.entries[0]!;const targetEntry=state.currentCharacterState!.entries[1]!;
  return {...state,currentCharacterState:{revision:1,entries:state.currentCharacterState!.entries.map((entry,index)=>index===0?{...sourceEntry,role:roleSnapshot(sourceRole),currentAlignment:"GOOD" as const}:index===1?{...targetEntry,role:roleSnapshot(targetRole,targetType),currentAlignment:targetType==="DEMON"?"EVIL" as const:"GOOD" as const}:entry)},firstNightTaskPlan:{...state.firstNightTaskPlan!,tasks:[{taskId:task,taskType,taskClass:taskType==="DREAMER_ACTION"?"ROLE_INFORMATION":"ROLE_ACTION",orderKey:{baseOrder:500,insertionOrder:0},source:{kind:"ROLE",playerId:sourceEntry.playerId,seatNumber:sourceEntry.seatNumber,role:roleSnapshot(sourceRole)},status:"PENDING",settlementPolicy:"REEVALUATE_SOURCE_AT_SETTLEMENT"}]},firstNightActionOpportunities:{opportunities:[{opportunityId:"opportunity-1",taskId:task,sourcePlayerId:sourceEntry.playerId,sourceSeatNumber:sourceEntry.seatNumber}]}} as unknown as GameState;
};
const terminalEvent=(eventType:string,payload:Record<string,unknown>)=>({eventId:eventId(`event-${eventType}`),eventType,eventSequence:20,batchId:batchId("batch-terminal"),gameId:gameId("game-1"),gameVersion:20,payload});

describe("first-night ability outcome ledger", () => {
  it("round-trips base and gained V2 canonical ability instance identities", () => {
    expect(parseFirstNightAbilityInstanceId(formatBaseFirstNightAbilityInstanceId(taskId))).toMatchObject({ valid: true, kind: "BASE_ROLE_TASK", taskId });
    const gainedTaskId=scheduledTaskId("first-night-v2:PHILOSOPHER_GAINED:WITCH_ACTION:seat-01:from-witch");const gained = formatPhilosopherGainedV2AbilityInstanceId({ taskId:gainedTaskId, grantId: grantedAbilityId("philosopher-grant-v1:seat-01:from-witch") });
    expect(parseFirstNightAbilityInstanceId(gained)).toMatchObject({ valid: true, kind: "PHILOSOPHER_GAINED_TASK_V2", taskId:gainedTaskId, grantId: "philosopher-grant-v1:seat-01:from-witch" });
    expect(parseFirstNightAbilityInstanceId(`${gained}:grant:other`)).toMatchObject({ valid: false });
    expect(parseFirstNightAbilityInstanceId(formatBaseFirstNightAbilityInstanceId(scheduledTaskId("first-night-v1:WITCH_ACTION:seat-1")))).toMatchObject({valid:false});
    expect(parseFirstNightAbilityInstanceId(formatBaseFirstNightAbilityInstanceId(scheduledTaskId("first-night-v1:WITCH_ACTION:seat-013")))).toMatchObject({valid:false});
    expect(parseFirstNightAbilityInstanceId(formatPhilosopherGainedV2AbilityInstanceId({taskId:gainedTaskId,grantId:grantedAbilityId("philosopher-grant-v1:seat-1:from-witch")}))).toMatchObject({valid:false});
    const v1TaskId=scheduledTaskId("first-night-v1:PHILOSOPHER_GAINED:WITCH_ACTION:seat-01:from-witch");
    const grantId=grantedAbilityId("philosopher-grant-v1:seat-01:from-witch");
    expect(parseFirstNightAbilityInstanceId(formatPhilosopherGainedV1AbilityInstanceId({taskId:v1TaskId,grantId}))).toMatchObject({valid:true,kind:"PHILOSOPHER_GAINED_TASK_V1",generation:"V1",embeddedSeat:1,embeddedRoleId:"witch"});
    expect(parseFirstNightAbilityInstanceId(formatPhilosopherGainedV1AbilityInstanceId({taskId:gainedTaskId,grantId}))).toMatchObject({valid:false});
    expect(parseFirstNightAbilityInstanceId(formatPhilosopherGainedV2AbilityInstanceId({taskId:v1TaskId,grantId}))).toMatchObject({valid:false});
  });

  it("requires exact provenance variants", () => {
    const provenance = fact().abilityInstance;
    expect(validateFirstNightAbilityInstanceProvenanceShape(provenance)).toStrictEqual({ valid: true });
    expect(validateFirstNightAbilityInstanceProvenanceShape({ ...provenance, extra: true })).toMatchObject({ valid: false });
    const gainedTaskId=scheduledTaskId("first-night-v2:PHILOSOPHER_GAINED:WITCH_ACTION:seat-01:from-witch");
    const grantId=grantedAbilityId("philosopher-grant-v1:seat-01:from-witch");
    const gained={provenanceVersion:"first-night-ability-instance-provenance-v1",kind:"PHILOSOPHER_GAINED_TASK_V2",abilityInstanceId:formatPhilosopherGainedV2AbilityInstanceId({taskId:gainedTaskId,grantId}),abilityRoleId:roleId("witch"),taskId:gainedTaskId,sourcePlayerId:playerId("player-1"),sourceSeatNumber:seatNumber(1),philosopherOpportunityId:"opportunity-1",grantId,sourceCharacterStateRevision:1,schedulingVersion:"philosopher-gained-first-night-scheduling-v2"} as const;
    expect(validateFirstNightAbilityInstanceProvenanceShape(gained)).toStrictEqual({valid:true});
    expect(validateFirstNightAbilityInstanceProvenanceShape({...gained,abilityRoleId:roleId("cerenovus")})).toMatchObject({valid:false});
    expect(validateFirstNightAbilityInstanceProvenanceShape({...gained,sourceSeatNumber:seatNumber(2)})).toMatchObject({valid:false});
  });

  it("validates an exact first-night window anchor", () => {
    expect(validateFirstNightAbilityOutcomeWindowAnchorShape(ledger().windowAnchor)).toStrictEqual({ valid: true });
    expect(validateFirstNightAbilityOutcomeWindowAnchorShape({ ...ledger().windowAnchor, startBoundary: "INCLUSIVE" })).toMatchObject({ valid: false });
  });

  it("accepts all closed evidence shapes and rejects extra fields", () => {
    for(const variant of evidenceVariants()){
      expect(validateAbilityOutcomeEvidenceReferenceShape(variant),variant.kind).toStrictEqual({valid:true});
      const keys=Object.keys(variant);const missing={...variant} as Record<string,unknown>;delete missing[keys[0]!];
      expect(validateAbilityOutcomeEvidenceReferenceShape(missing),`${variant.kind} missing`).toMatchObject({valid:false});
      expect(validateAbilityOutcomeEvidenceReferenceShape({...variant,extra:true}),`${variant.kind} extra`).toMatchObject({valid:false});
    }
    expect(validateAbilityOutcomeEvidenceReferenceShape({ ...sourceEvidence(), recordId: "open" })).toMatchObject({ valid: false });
    expect(validateAbilityOutcomeEvidenceReferenceShape({ kind: "DOMAIN_RECORD", recordId: "open" })).toMatchObject({ valid: false });
  });

  it("validates V1/V2 insertion nested exact shapes",()=>{
    const v1=evidenceVariants().find((entry)=>entry.kind==="FIRST_NIGHT_TASK_INSERTION")!;
    expect(validateAbilityOutcomeEvidenceReferenceShape(v1)).toStrictEqual({valid:true});
    expect(validateAbilityOutcomeEvidenceReferenceShape({...v1,generation:{kind:"V2",taskPlanVersion:"first-night-task-plan-v2",grantId:"grant",schedulingVersion:"philosopher-gained-first-night-scheduling-v2"}})).toStrictEqual({valid:true});
    expect(validateAbilityOutcomeEvidenceReferenceShape({...v1,generation:{...v1.generation,grantId:"illegal"}})).toMatchObject({valid:false});
  });

  it("uses frozen role-specific primary identities",()=>{
    const delivery=evidenceVariants().find((entry)=>entry.kind==="CLOCKMAKER_DELIVERY")!;
    expect(canonicalizeAbilityOutcomeEvidenceReferences([delivery,{...delivery,deliveryId:"delivery-2"}])).toHaveLength(2);
    expect(()=>canonicalizeAbilityOutcomeEvidenceReferences([delivery,{...delivery,selectedDistance:3}])).toThrowError(DomainError);
  });

  it("canonicalizes evidence independent of input order and removes equal duplicates", () => {
    const task = { kind: "TASK" as const, taskId, taskType: "WITCH_ACTION" as const };
    expect(canonicalizeAbilityOutcomeEvidenceReferences([task, sourceEvidence(), sourceEvidence()])).toStrictEqual([sourceEvidence(), task]);
  });

  it("rejects conflicting content with the same primary identity", () => {
    const conflict = { ...sourceEvidence(), eventSequence: 21 };
    expect(() => canonicalizeAbilityOutcomeEvidenceReferences([sourceEvidence(), conflict])).toThrowError(DomainError);
  });

  it("treats player plus revision as the player-role primary identity", () => {
    const base = { kind: "PLAYER_ROLE_AT_REVISION" as const, playerId: playerId("player-1"), seatNumber: 1 as const, roleId: roleId("witch"), characterType: "MINION" as const, defaultAlignment: "EVIL" as const, characterStateRevision: 1 };
    expect(canonicalizeAbilityOutcomeEvidenceReferences([base, { ...base, characterStateRevision: 2 }])).toHaveLength(2);
    expect(() => canonicalizeAbilityOutcomeEvidenceReferences([base, { ...base, roleId: roleId("cerenovus") }])).toThrowError(DomainError);
  });

  it("validates facts and ledgers and deep-clones their arrays", () => {
    expect(validateFirstNightAbilityOutcomeFactShape(fact())).toStrictEqual({ valid: true });
    expect(validateFirstNightAbilityOutcomeLedgerShape(ledger())).toStrictEqual({ valid: true });
    const copied = cloneFirstNightAbilityOutcomeLedger(ledger());
    expect(copied).toStrictEqual(ledger());
    expect(copied).not.toBe(ledger());
    expect(copied.facts).not.toBe(ledger().facts);
    expect(copied.windowAnchor).not.toBe(ledger().windowAnchor);
    expect(copied.facts[0]?.abilityInstance).not.toBe(ledger().facts[0]?.abilityInstance);
    expect(copied.facts[0]?.evidenceReferences).not.toBe(ledger().facts[0]?.evidenceReferences);
    expect(copied.facts[0]?.evidenceReferences[0]).not.toBe(ledger().facts[0]?.evidenceReferences[0]);
  });

  it("rejects duplicate or out-of-order fact identities", () => {
    expect(validateFirstNightAbilityOutcomeLedgerShape(ledger([fact(), fact()]))).toMatchObject({ valid: false });
    expect(()=>cloneFirstNightAbilityOutcomeLedger({...ledger(),facts:[fact(),fact()]})).toThrowError(DomainError);
  });

  it("fails hostile getters, proxies, sparse arrays, cycles, symbols and nonplain values closed", () => {
    let calls = 0;
    const getter = Object.defineProperty({}, "kind", { enumerable: true, get: () => { calls += 1; return "SOURCE_EVENT"; } });
    const revoked = Proxy.revocable({}, {}); revoked.revoke();
    const sparse: unknown[] = []; sparse.length = 1;
    const cycle: Record<string, unknown> = {}; cycle.self = cycle;
    for (const hostile of [getter, revoked.proxy, sparse, cycle, { kind: Symbol("x") }, new Date()]) {
      expect(() => validateAbilityOutcomeEvidenceReferenceShape(hostile)).not.toThrow();
      expect(validateAbilityOutcomeEvidenceReferenceShape(hostile)).toMatchObject({ valid: false });
    }
    expect(calls).toBe(0);
  });

  it("rejects facts at the exclusive lower-window boundary",()=>{
    const below=factAt("event-10",10,"NORMAL","NO_OTHER_CHARACTER_ABILITY");
    expect(validateFirstNightAbilityOutcomeLedgerShape(ledger([below]))).toMatchObject({valid:false});
  });

  it("classifies ineffective Snake Charmer from the historical target quadrant",()=>{
    const derive=(targetRole:string,targetType:"TOWNSFOLK"|"DEMON")=>{const state=terminalState("SNAKE_CHARMER_ACTION","snake_charmer",targetRole,targetType);const source=state.currentCharacterState!.entries[0]!;const target=state.currentCharacterState!.entries[1]!;const impairmentId="impairment-snake";const withImpairment={...state,abilityImpairments:{impairments:[{impairmentId,kind:"POISONED",sourceKind:"SNAKE_CHARMER_DEMON_HIT",sourcePlayerId:target.playerId,affectedPlayerId:source.playerId,affectedSeatNumber:source.seatNumber,affectedRole:source.role,sourceCharacterStateRevision:1}]}} as unknown as GameState;return deriveFirstNightAbilityOutcomeFact({stateBefore:withImpairment,event:terminalEvent("SnakeCharmerIneffectiveResolved",{taskId:scheduledTaskId("first-night-v1:SNAKE_CHARMER_ACTION:seat-01"),opportunityId:"opportunity-1",sourcePlayerId:source.playerId,sourceSeatNumber:source.seatNumber,targetPlayerId:target.playerId,targetSeatNumber:target.seatNumber,sourceImpairmentId:impairmentId,sourceImpairmentKind:"POISONED"}) as never})!;};
    const nonDemon=derive("clockmaker","TOWNSFOLK");expect(nonDemon).toMatchObject({outcomeStatus:"NORMAL",causeKind:"NO_OTHER_CHARACTER_ABILITY",causedByAnotherCharacterAbility:false});expect(validateFirstNightAbilityOutcomeFactShape(nonDemon)).toStrictEqual({valid:true});
    const demon=derive("vortox","DEMON");expect(demon).toMatchObject({outcomeStatus:"ABNORMAL",causeKind:"SOURCE_POISONING",causedByAnotherCharacterAbility:true});expect(validateFirstNightAbilityOutcomeFactShape(demon)).toStrictEqual({valid:true});
    const wrongImpairmentKind={...demon,evidenceReferences:demon.evidenceReferences.map((entry)=>entry.kind==="ABILITY_IMPAIRMENT"?{...entry,impairmentKind:"DRUNK" as const}:entry)};expect(validateFirstNightAbilityOutcomeFactShape(wrongImpairmentKind)).toMatchObject({valid:false});
    const missingState=terminalState("SNAKE_CHARMER_ACTION","snake_charmer","clockmaker");const source=missingState.currentCharacterState!.entries[0]!;const target=missingState.currentCharacterState!.entries[1]!;const missing={...missingState,currentCharacterState:{revision:1,entries:missingState.currentCharacterState!.entries.filter((entry)=>entry.playerId!==target.playerId)},abilityImpairments:{impairments:[{impairmentId:"impairment-snake",kind:"POISONED",sourceKind:"SNAKE_CHARMER_DEMON_HIT",sourcePlayerId:target.playerId,affectedPlayerId:source.playerId,affectedSeatNumber:source.seatNumber,affectedRole:source.role,sourceCharacterStateRevision:1}]}} as unknown as GameState;
    const unresolved=deriveFirstNightAbilityOutcomeFact({stateBefore:missing,event:terminalEvent("SnakeCharmerIneffectiveResolved",{taskId:scheduledTaskId("first-night-v1:SNAKE_CHARMER_ACTION:seat-01"),opportunityId:"opportunity-1",sourcePlayerId:source.playerId,sourceSeatNumber:source.seatNumber,targetPlayerId:target.playerId,targetSeatNumber:target.seatNumber,sourceImpairmentId:"impairment-snake",sourceImpairmentKind:"POISONED"}) as never})!;expect(unresolved).toMatchObject({outcomeStatus:"UNRESOLVED",causeKind:"CAUSE_NOT_PROVEN",causedByAnotherCharacterAbility:false});expect(validateFirstNightAbilityOutcomeFactShape(unresolved)).toStrictEqual({valid:true});
  });

  it("classifies Dreamer truth and Vortox applicability without fabricating historical tenure",()=>{
    const eventFor=(state:GameState,goodRole:string,evilRole:string)=>{const source=state.currentCharacterState!.entries[0]!;const target=state.currentCharacterState!.entries[1]!;return deriveFirstNightAbilityOutcomeFact({stateBefore:state,event:terminalEvent("DreamerInformationDelivered",{taskId:scheduledTaskId("first-night-v1:DREAMER_ACTION:seat-01"),opportunityId:"opportunity-1",sourcePlayerId:source.playerId,sourceSeatNumber:source.seatNumber,targetPlayerId:target.playerId,targetSeatNumber:target.seatNumber,goodRole:roleSnapshot(goodRole),evilRole:roleSnapshot(evilRole,"MINION"),informationReliability:{kind:"EFFECTIVE"}}) as never})!;};
    const normalState=terminalState("DREAMER_ACTION","dreamer","clockmaker");const normal=eventFor(normalState,"clockmaker","witch");expect(normal).toMatchObject({outcomeStatus:"NORMAL",causeKind:"NO_OTHER_CHARACTER_ABILITY"});expect(validateFirstNightAbilityOutcomeFactShape(normal)).toStrictEqual({valid:true});const forgedNormal={...normal,evidenceReferences:normal.evidenceReferences.map((entry)=>entry.kind==="DREAMER_DELIVERY"?{...entry,deliveredGoodRoleId:roleId("artist")}:entry)};expect(validateFirstNightAbilityOutcomeFactShape(forgedNormal)).toMatchObject({valid:false});
    const vortoxEntry={...normalState.currentCharacterState!.entries[2]!,role:roleSnapshot("vortox","DEMON"),currentAlignment:"EVIL" as const};const currentVortox={...normalState,currentCharacterState:{revision:1,entries:normalState.currentCharacterState!.entries.map((entry,index)=>index===2?vortoxEntry:entry)}} as GameState;
    const unproven=eventFor(currentVortox,"clockmaker","witch");expect(unproven).toMatchObject({outcomeStatus:"UNRESOLVED",causeKind:"VORTOX_APPLICABILITY_NOT_PROVEN"});expect(unproven.evidenceReferences).toContainEqual(expect.objectContaining({kind:"PLAYER_ROLE_AT_REVISION",roleId:"vortox"}));expect(validateFirstNightAbilityOutcomeFactShape(unproven)).toStrictEqual({valid:true});
    const proven={...currentVortox,seamstressRoleTenureState:{records:[{roleTenureId:"tenure-vortox",playerId:vortoxEntry.playerId,seatNumber:vortoxEntry.seatNumber,roleId:"vortox",acquiredCharacterStateRevision:1}]}} as unknown as GameState;const constrained=eventFor(proven,"clockmaker","witch");expect(constrained).toMatchObject({outcomeStatus:"UNRESOLVED",causeKind:"DREAMER_VORTOX_CONSTRAINT_UNRECORDED"});expect(constrained.evidenceReferences).toContainEqual(expect.objectContaining({kind:"ROLE_TENURE",roleId:"vortox",statusAtEvaluation:"ACTIVE"}));expect(validateFirstNightAbilityOutcomeFactShape(constrained)).toStrictEqual({valid:true});
    expect(()=>eventFor(normalState,"artist","witch")).toThrowError(DomainError);
  });
});
