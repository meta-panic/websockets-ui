import { IUser } from "../users/user.interface";
import { IRoom } from "./room.interface";


export interface IRoomFactory {
  create(host: IUser): IRoom;
}
