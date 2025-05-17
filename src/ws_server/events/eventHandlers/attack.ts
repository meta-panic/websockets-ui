import { IHandler } from "./handler.interface";


const attackHandler: () => IHandler<"attack"> =
  () => ({ gameRepo, data, wsClient }) => {
    const game = gameRepo.get(data.gameId);
    if (!game) {
      console.error(`Cannot handle the attack: the game with id ${data.gameId} was not found.\n`);
      return;
    }

    game.handleAttack({
      x: data.x,
      y: data.y,
      attackerId: data.indexPlayer
    });
  };

export { attackHandler };
