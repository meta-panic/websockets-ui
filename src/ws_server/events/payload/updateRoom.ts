import { IUser } from "../../users/user.interface";

export type UpdateRoomRes = {
  roomId: string,
  roomUsers: Omit<IUser, "winCount">[],
}[]
