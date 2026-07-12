import type { GameId } from "./ids.js";
import type { CurrentCharacterStateSet } from "./current-character-state.js";
import type { FirstNightActionOpportunityState } from "./first-night-action-opportunity.js";
import type { FirstNightTaskProgress } from "./first-night-task-plan.js";
import type {
  AbilityImpairmentSet,
  FirstNightTaskInsertion,
  GrantedAbilitySet,
  PhilosopherAbilityChoiceSet
} from "./philosopher-ability.js";
import type {
  SnakeCharmerDemonSwapSet,
  SnakeCharmerIneffectiveResolutionSet,
  SnakeCharmerNoSwapResolutionSet,
  SnakeCharmerTargetChoiceSet
} from "./snake-charmer.js";
import type {
  WitchDeathPendingSet,
  WitchIneffectiveResolutionSet,
  WitchTargetChoiceSet
} from "./witch.js";
import type {
  DreamerInformationSet,
  DreamerTargetChoiceSet
} from "./dreamer.js";
import type { CerenovusChoiceSet, CerenovusMadnessInstructionSet, CerenovusMadnessMarkerSet } from "./cerenovus.js";
import type {
  RoleTenureState,
  SeamstressAbilitySpendSet,
  SeamstressAbilityState,
  SeamstressInformationSet,
  SeamstressTargetChoiceSet
} from "./seamstress.js";
import type { ClockmakerInformationSet } from "./clockmaker.js";
import type {
  EvilTwinInformationDeliveredPayload,
  EvilTwinPairSet
} from "./evil-twin.js";
import type {
  CharactersAssignedPayload,
  DemonInformationDeliveredPayload,
  FirstNightInitializedPayload,
  FirstNightTaskPlanCreatedPayload,
  InitialPrivateKnowledgeEstablishedPayload,
  MinionInformationDeliveredPayload,
  PlayerCounts,
  PlayerRosterCreatedPayload,
  ScriptSelectedPayload,
  SeamstressResolutionCapabilityDeclaredPayload,
  SetupGeneratedPayload
} from "./events.js";
import type { GamePhase } from "./game-phase.js";
import type { FirstNightAbilityOutcomeLedger } from "./first-night-ability-outcome-ledger.js";

export type GameState = {
  readonly gameId: GameId;
  readonly gameVersion: number;
  readonly lastEventSequence: number;
  readonly phase: GamePhase;
  readonly dayNumber: number;
  readonly nightNumber: number;
  readonly created: true;
  readonly rootSeed: string;
  readonly rulesBaselineVersion: string;
  readonly playerCounts: PlayerCounts;
  readonly selectedScript?: ScriptSelectedPayload;
  readonly seamstressResolutionCapability?: SeamstressResolutionCapabilityDeclaredPayload;
  readonly setup?: SetupGeneratedPayload;
  readonly roster?: PlayerRosterCreatedPayload;
  readonly assignment?: CharactersAssignedPayload;
  readonly currentCharacterState?: CurrentCharacterStateSet;
  readonly seamstressRoleTenureState?: RoleTenureState;
  readonly seamstressAbilityState?: SeamstressAbilityState;
  readonly firstNight?: FirstNightInitializedPayload;
  readonly firstNightAbilityOutcomeLedger?: FirstNightAbilityOutcomeLedger;
  readonly initialPrivateKnowledge?: InitialPrivateKnowledgeEstablishedPayload;
  readonly firstNightTaskPlan?: FirstNightTaskPlanCreatedPayload;
  readonly firstNightActionOpportunities?: FirstNightActionOpportunityState;
  readonly philosopherAbilityChoices?: PhilosopherAbilityChoiceSet;
  readonly philosopherGrantedAbilities?: GrantedAbilitySet;
  readonly abilityImpairments?: AbilityImpairmentSet;
  readonly firstNightTaskInsertions?: FirstNightTaskInsertion;
  readonly snakeCharmerTargetChoices?: SnakeCharmerTargetChoiceSet;
  readonly snakeCharmerNoSwapResolutions?: SnakeCharmerNoSwapResolutionSet;
  readonly snakeCharmerIneffectiveResolutions?: SnakeCharmerIneffectiveResolutionSet;
  readonly snakeCharmerDemonSwaps?: SnakeCharmerDemonSwapSet;
  readonly witchTargetChoices?: WitchTargetChoiceSet;
  readonly witchDeathPending?: WitchDeathPendingSet;
  readonly witchIneffectiveResolutions?: WitchIneffectiveResolutionSet;
  readonly cerenovusChoices?: CerenovusChoiceSet;
  readonly cerenovusMadnessMarkers?: CerenovusMadnessMarkerSet;
  readonly cerenovusMadnessInstructions?: CerenovusMadnessInstructionSet;
  readonly dreamerTargetChoices?: DreamerTargetChoiceSet;
  readonly dreamerInformation?: DreamerInformationSet;
  readonly clockmakerInformation?: ClockmakerInformationSet;
  readonly seamstressTargetChoices?: SeamstressTargetChoiceSet;
  readonly seamstressAbilitySpends?: SeamstressAbilitySpendSet;
  readonly seamstressInformation?: SeamstressInformationSet;
  readonly evilTwinPairs?: EvilTwinPairSet;
  readonly evilTwinInformation?: EvilTwinInformationDeliveredPayload;
  readonly minionInformation?: MinionInformationDeliveredPayload;
  readonly demonInformation?: DemonInformationDeliveredPayload;
  readonly firstNightTaskProgress?: FirstNightTaskProgress;
};
