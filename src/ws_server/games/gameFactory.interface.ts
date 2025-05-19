import { IUser } from "../users/user.interface";
import { IGame, MembersNotSet } from "./game.interface";

export interface IGameFactory {
  create(members: MembersNotSet<IUser>): IGame;
}
