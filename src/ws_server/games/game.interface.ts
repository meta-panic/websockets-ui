import { IUser } from "../users/user.interface";
import { Coordinates, IShip } from "./shipsPosition.interface";

export type Members<T extends { id: string }> = Record<T["id"], {
  user: T,
  shipsPosition?: IShip[],
  currentPlayerIndex: string;
}>;

export type MembersNotSet<T extends { id: string }> = Record<T["id"], {
  user: T,
  shipsPosition?: IShip[],
  currentPlayerIndex?: string;
}>;

export interface IGame {
  readonly id: string;
  members: Members<IUser>;
  attackerId: string;

  addShipsPosition: (userId: string, shipsPosition: IShip[]) => void;
  handleAttack: ({ x, y, attackerId }: Coordinates & { attackerId: number }) => void;

  sendToAllGamers: (message: string) => void;
}


export function areAllMembersReadyWithShips(game: IGame): game is GameWithMembersAndShips {
  if (!game || typeof game.members !== "object" || game.members === null) {
    return false;
  }

  return Object.values(game.members).every(member => {
    if (typeof member !== "object" || member === null || !("shipsPosition" in member)) {
      return false;
    }
    if (!Array.isArray(member.shipsPosition)) {
      return false;
    }
    return true;
  });
}

type GameWithMembersAndShips = IGame & {
  members: Record<string, GameMemberWithShips>;
};

interface GameMemberWithShips {
  user: IUser;
  shipsPosition: IShip[];
  currentPlayerIndex?: string | number;
}
