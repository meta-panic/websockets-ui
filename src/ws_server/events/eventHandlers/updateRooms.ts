import { EventNameType } from "../event.interface";
import { IHandler } from "./handler.interface";
import { createResponse } from "./utils";


const updateRoomHandler: () => IHandler<EventNameType> =
  () => ({ roomRepo, wsClient }) => {
    const allRooms = roomRepo.getAll();

    const resData = allRooms
      .filter((room) => room.members.length === 1)
      .map((room) => {
        return {
          roomId: room.id,
          roomUsers: room.members
        };
      });

    const response = createResponse(
      "update_room",
      resData
    );

    console.log("response - ", response);
    wsClient.send(JSON.stringify(response));
  };

export { updateRoomHandler };
