import { type WebSocket as WSType } from "ws";

import { IUser } from "./user.interface";
import { generateUUID } from "../utils/common";


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

  addWin() {
    this.winCount = this.winCount + 1;
  }

  sendMessage(message: string) {
    this.webSocket.send(message);
  }
}
