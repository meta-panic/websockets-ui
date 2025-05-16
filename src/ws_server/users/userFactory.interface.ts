import { type WebSocket as WSType } from "ws";

import { IUser } from "./user.interface";

export interface IUserFactory {
  create(name: string, password: string, socket: WSType): IUser;
}
