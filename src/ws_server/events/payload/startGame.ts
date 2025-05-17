import { IShip } from "../../games/shipsPosition.interface";

export interface StartGameRes {
  ships: IShip[];
  currentPlayerIndex: string;
}
