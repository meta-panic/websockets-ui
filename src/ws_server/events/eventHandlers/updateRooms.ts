import { EventNameType } from "../event.interface";
import { IHandler } from "./handler.interface";
import { createResponse } from "./utils";


const updateRoomHandler: () => IHandler<EventNameType> =
  () => ({ roomRepo, broadcast }) => {
    const allRooms = roomRepo.getAll();

    const resData = allRooms
      .filter((room) => room.members.length === 1)
      .map((room) => {
        return {
          roomId: room.id,
          roomUsers: room.members
        };
      });

    const response = createResponse({
      type: "update_room",
      data: resData
    });

    broadcast(JSON.stringify(response));
  };

export { updateRoomHandler };
