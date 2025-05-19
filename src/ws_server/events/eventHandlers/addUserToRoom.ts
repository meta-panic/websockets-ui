import { IHandler } from "./handler.interface";


const addUserToRoomHandler: () => IHandler<"add_user_to_room"> =
  () => ({ userRepo, data, roomRepo, wsClient }) => {
    const user = "id" in wsClient ? userRepo.get((wsClient as ({ id: string }))?.id) : undefined;
    if (!user) {
      return;
    }

    const room = roomRepo.get(data.indexRoom);
    if (!room) {
      return;
    }

    if (!!room.members[0] && room.members[0]?.id !== user.id) {
      room.addUser(user);
    }
  };

export { addUserToRoomHandler };
