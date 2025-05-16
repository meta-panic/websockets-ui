import { type WebSocket as WSType } from "ws";

import { IRoom } from "./room.interface";
import { IUser } from "../users/user.interface";
import { generateUUID } from "../utils";


export class Room implements IRoom {
  id: string;
  members: IUser[];
  host: IUser;

  public constructor(
    host: IUser
  ) {
    this.id = generateUUID();
    this.members = [host];
    this.host = host;
  }
}
