import { IHandler } from "./handler.interface";


const addShipsHandler: () => IHandler<"add_ships"> =
  () => ({ gameRepo, data, wsClient }) => {
    const game = gameRepo.get(data.gameId);
    if (!game) {
      console.error("Cannot add ships: the game does not exist");
      return;
    }

    const userId = "id" in wsClient ? (wsClient as ({ id: string }))?.id : undefined;
    if (!userId) {
      console.error("Cannot add ships: the user is not logged in");
      return;
    }

    game.addShipsPosition(userId, data.ships);
  };

export { addShipsHandler };
