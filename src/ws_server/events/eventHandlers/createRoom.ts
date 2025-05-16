import { IRoomFactory } from "../../rooms/roomFactory.interface";
import { IHandler } from "./handler.interface";


const createRoomHandler: (roomFactory: IRoomFactory) => IHandler<"create_room"> =
  (roomFactory: IRoomFactory) => ({ userRepo, roomRepo, wsClient }) => {
    const user = "id" in wsClient ? userRepo.get((wsClient as ({ id: string }))?.id) : undefined;

    if (!user) {
      return;
    }

    const newRoom = roomFactory.create(user);
    roomRepo.add(newRoom);
  };

export { createRoomHandler };
