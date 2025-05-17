import { type WebSocket as WSType } from "ws";

import { IUser } from "./user.interface";
import { generateUUID } from "../utils";


export class User implements IUser {
  winCount: number;
  id: string;

  public constructor(
    public name: string,
    private password: string,
    public webSocket: WSType
  ) {
    this.winCount = 0;
    this.id = generateUUID();
  }

  sendMessage(message: string) {
    this.webSocket.send(message);
  }
}
