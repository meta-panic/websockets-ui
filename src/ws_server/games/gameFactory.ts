import { IUser } from "../users/user.interface";
import { Game } from "./game";
import { IGame, Members } from "./game.interface";
import { IGameFactory } from "./gameFactory.interface";


export class GameFactory implements IGameFactory {
  create(members: Members<IUser>): IGame {
    return new Game(members);
  }
}
