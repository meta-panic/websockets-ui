import { IShip } from "../../games/shipsPosition.interface";

export interface AddShipsReq {
  gameId: string;
  ships: IShip[];
  indexPlayer: string;
}
