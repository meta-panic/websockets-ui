import { IRoomFactory } from "../../rooms/roomFactory.interface";
import { hasUserRoom } from "../../rooms/utils";
import { IHandler } from "./handler.interface";


const createRoomHandler: (roomFactory: IRoomFactory) => IHandler<"create_room"> =
  (roomFactory: IRoomFactory) => ({ userRepo, roomRepo, wsClient }) => {
    const user = "id" in wsClient ? userRepo.get((wsClient as ({ id: string }))?.id) : undefined;

    if (!user) {
      console.error("Cannot create a new room, user does not exits");
      return;
    }
    if (hasUserRoom(roomRepo.getAll(), user.id)) {
      console.error(`Cannot create a new room, ${user.name} have already created a room`);
      return;
    }

    const newRoom = roomFactory.create(user);
    roomRepo.add(newRoom);;
  };

export { createRoomHandler };
