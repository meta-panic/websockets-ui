import { IRepository } from "../../DB/core/repository/repository.interface";
import { IGame } from "../../games/game.interface";
import { IGameFactory } from "../../games/gameFactory.interface";
import { IRoom } from "../../rooms/room.interface";
import { IHandler } from "./handler.interface";
import { createResponse } from "./utils";


const createGameHandler: (gameFactory: IGameFactory) => IHandler<"add_user_to_room"> =
  (gameFactory: IGameFactory) => ({ gameRepo, data, roomRepo }) => {

    const room = roomRepo.get(data.indexRoom);
    if (!room || room.members.length !== 2) {
      console.warn(`Game cannot be created: the room "${data.indexRoom}" is not full.`);
      return;
    }

    const newGame = createNewGame(gameFactory, room);
    gameRepo.add(newGame);

    deleteAllRoomsOfUserById(room.members[0].id, roomRepo);
    deleteAllRoomsOfUserById(room.members[1].id, roomRepo);

    sendAllMembersOFGameEvent(newGame);
  };

export { createGameHandler };


function deleteAllRoomsOfUserById(userId: string, roomRepo: IRepository<IRoom>) {
  const allRooms = roomRepo.getAll();

  allRooms.forEach((room) => {
    if (room.host.id === userId) {
      roomRepo.delete(room);
    }
  });
}


function createNewGame(gameFactory: IGameFactory, room: IRoom) {
  return gameFactory.create({
    [room.members[0].id]: {
      user: room.members[0]
    },
    [room.members[1].id]: {
      user: room.members[1]
    }
  });
}

function sendAllMembersOFGameEvent(newGame: IGame) {
  Object.entries(newGame.members).forEach(([userId, member]) => {
    const response = createResponse({
      type: "add_user_to_room",
      data: {
        idGame: newGame.id,
        idPlayer: member.currentPlayerIndex || userId
      },
      overwriteType: "create_game"
    });

    member.user.sendMessage(JSON.stringify(response));
  });
}
