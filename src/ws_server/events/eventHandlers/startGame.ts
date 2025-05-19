import { areAllMembersReadyWithShips } from "../../games/game.interface";
import { IHandler } from "./handler.interface";
import { createResponse } from "./utils";


const startGameHandler: (gameId: string) => IHandler<"add_ships"> =
  (gameId: string) => ({ gameRepo }) => {

    const game = gameRepo.get(gameId);
    if (!game) {
      console.error(`The game with id "${gameId}" does not exist\n`);
      return;
    }

    if (!areAllMembersReadyWithShips(game)) {
      console.warn("Ship position wasn't set for all users yet\n");
      return;
    }

    Object.entries(game.members).forEach(([userId, member]) => {
      const response = createResponse({
        type: "start_game",
        data: {
          ships: member.shipsPosition,
          currentPlayerIndex: member.sessionPlayerId || userId
        }
      });

      member.user.sendMessage(JSON.stringify(response));
    });
  };

export { startGameHandler };
