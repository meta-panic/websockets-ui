import { IRoom } from "./room.interface";
import { IUser } from "../users/user.interface";
import { generateUUID } from "../utils/common";

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

  addUser(user: IUser): void {
    if (this.members.length >= 2) {
      throw new Error(`Room ${this.id} is full. Cannot add user ${user.id}`);
    }

    if (!this.members.find(member => member.id === user.id)) {
      this.members.push(user);
    }
  }

  removeUser(userId: string): void {
    this.members = this.members.filter(member => member.id !== userId);
  }

  emptyRoom(): void {
    this.members = [];
  }
}
