import { Coordinates } from "../../games/shipsPosition.interface";
import { ShootStatus } from "../event.interface";
import { isAttackReq } from "../payload/attack";
import { IHandler } from "./handler.interface";
import { createResponse } from "./utils";


const attackHandler: () => IHandler<"attack" | "randomAttack"> =
  () => ({ gameRepo, userRepo, data, wsClient }) => {
    const attackerId = data.indexPlayer;

    const game = gameRepo.get(data.gameId);
    if (!game) {
      console.error(`Cannot handle the attack: the game with id ${data.gameId} was not found.\n`);
      return;
    }

    let attackData: Coordinates & { attackerId: string };
    if (isAttackReq(data)) {
      attackData = { x: data.x, y: data.y, attackerId };
    } else {
      const randomCoords = game.getRandomAttackCoordinate(attackerId);
      attackData = { x: randomCoords.x, y: randomCoords.y, attackerId };
    }
    const result: { status: ShootStatus, coords: Coordinates[] } | "wrong turn" = game.handleAttack(attackData);

    if (result === "wrong turn") {
      return;
    }

    sendResultOfAttack(result, attackerId, game?.sendToAllGamers.bind(game));

    const isWin = !game.hasEnemyAliveShips(attackerId);
    if (isWin) {
      sendFinishGame(attackerId, game?.sendToAllGamers.bind(game));

      const userId = "id" in wsClient ? (wsClient as ({ id: string }))?.id : undefined;
      userId && userRepo.get(userId)?.addWin();
    }
  };

export { attackHandler };

function sendResultOfAttack(result: { status: ShootStatus, coords: Coordinates[] }, attackerId: string, sendFn: (msg: string) => void) {
  result.coords.forEach(coord => {
    const responce = createResponse({
      type: "attack",
      data: {
        position: coord,
        currentPlayer: attackerId,
        status: result.status
      }
    });
    sendFn(JSON.stringify(responce));
  });
}

function sendFinishGame(attackerId: string, sendFn: (msg: string) => void) {
  const responce = createResponse({
    type: "finish",
    data: {
      winPlayer: attackerId
    }
  });

  sendFn(JSON.stringify(responce));
}

