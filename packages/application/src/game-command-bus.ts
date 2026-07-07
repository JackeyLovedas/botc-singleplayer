import type { SupportedCommandEnvelope } from "@botc/domain-core";
import type { CommandResult } from "./command-result.js";
import { GameApplicationService } from "./game-application-service.js";
import { GameSessionRunner } from "./game-session-runner.js";

export class GameCommandBus {
  public constructor(
    private readonly applicationService: GameApplicationService,
    private readonly runner = new GameSessionRunner()
  ) {}

  public execute(command: SupportedCommandEnvelope): Promise<CommandResult> {
    return this.runner.enqueue(command.gameId, () => this.applicationService.execute(command));
  }
}
