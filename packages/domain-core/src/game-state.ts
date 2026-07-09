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
  SnakeCharmerNoSwapResolutionSet,
  SnakeCharmerTargetChoiceSet
} from "./snake-charmer.js";
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
  SetupGeneratedPayload
} from "./events.js";
import type { GamePhase } from "./game-phase.js";

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
  readonly setup?: SetupGeneratedPayload;
  readonly roster?: PlayerRosterCreatedPayload;
  readonly assignment?: CharactersAssignedPayload;
  readonly currentCharacterState?: CurrentCharacterStateSet;
  readonly firstNight?: FirstNightInitializedPayload;
  readonly initialPrivateKnowledge?: InitialPrivateKnowledgeEstablishedPayload;
  readonly firstNightTaskPlan?: FirstNightTaskPlanCreatedPayload;
  readonly firstNightActionOpportunities?: FirstNightActionOpportunityState;
  readonly philosopherAbilityChoices?: PhilosopherAbilityChoiceSet;
  readonly philosopherGrantedAbilities?: GrantedAbilitySet;
  readonly abilityImpairments?: AbilityImpairmentSet;
  readonly firstNightTaskInsertions?: FirstNightTaskInsertion;
  readonly snakeCharmerTargetChoices?: SnakeCharmerTargetChoiceSet;
  readonly snakeCharmerNoSwapResolutions?: SnakeCharmerNoSwapResolutionSet;
  readonly snakeCharmerDemonSwaps?: SnakeCharmerDemonSwapSet;
  readonly minionInformation?: MinionInformationDeliveredPayload;
  readonly demonInformation?: DemonInformationDeliveredPayload;
  readonly firstNightTaskProgress?: FirstNightTaskProgress;
};
