import { IUser } from "../users/user.interface";

export interface IRoom {
  readonly id: string;
  readonly host: IUser;
  members: IUser[];
}
