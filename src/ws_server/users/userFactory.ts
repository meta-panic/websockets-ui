import { type WebSocket as WSType } from "ws";

import { User } from "./user";
import { IUserFactory } from "./userFactory.interface";

export class UserFactory implements IUserFactory {
  create(name: string, password: string, socket: WSType): User {
    return new User(name, password, socket);
  }
}
