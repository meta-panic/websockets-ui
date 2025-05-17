import { IHandler } from "./handler.interface";
import { createResponse } from "./utils";


const setTurnHandler: (gameId: string) => IHandler<"add_ships"> =
  (gameId: string) => ({ gameRepo }) => {
    const game = gameRepo.get(gameId);
    if (!game) {
      console.error(`Cannot set attacker: the game with id ${gameId} was not found.\n`);
      return;
    }

    const responce = createResponse({
      type: "turn",
      data: {
        currentPlayer: game.attackerId
      }
    });

    game?.sendToAllGamers(JSON.stringify(responce));
  };

export { setTurnHandler };
