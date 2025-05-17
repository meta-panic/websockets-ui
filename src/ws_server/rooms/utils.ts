import { IRoom } from "./room.interface";


export function hasUserRoom(rooms: IRoom[], userId: string): boolean {
  return rooms.some((room) => {
    return room.members.some((member) => member.id === userId);
  });
}
