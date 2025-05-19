import { IRoomFactory } from "./roomFactory.interface";
import { IRoom } from "./room.interface";
import { Room } from "./room";
import { IUser } from "../users/user.interface";


export class RoomFactory implements IRoomFactory {
  create(host: IUser): IRoom {
    return new Room(host);
  }
}
