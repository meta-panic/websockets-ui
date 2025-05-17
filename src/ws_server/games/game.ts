import { IUser } from "../users/user.interface";
import { generateUUID } from "../utils";
import { IGame, Members, MembersNotSet } from "./game.interface";
import { Coordinates, IShip } from "./shipsPosition.interface";


export class Game implements IGame {
  id: string;
  members: Members<IUser>;
  attackerId: string;

  public constructor(
    initialMembers: MembersNotSet<IUser>
  ) {
    this.id = generateUUID();
    this.members = Game.prepareMembers(initialMembers);
    this.attackerId = this.getRandomAttacker();
  }

  private static prepareMembers(members: MembersNotSet<IUser>): Members<IUser> {
    const preparedMembers: Members<IUser> = {};
    for (const key in members) {
      if (Object.prototype.hasOwnProperty.call(members, key)) {
        preparedMembers[key] = {
          ...members[key],
          currentPlayerIndex: generateUUID()
        };
      }
    }
    return preparedMembers;
  }

  handleAttack({ x, y, attackerId }: Coordinates & { attackerId: number }) {

  }

  private getRandomAttacker() {
    const memberIndexes = Object.values(this.members).map(member => member.currentPlayerIndex);

    return memberIndexes[0];
  }

  addShipsPosition(userId: string, shipsPosition: IShip[]): void {
    this.members[userId].shipsPosition = shipsPosition;
  }

  sendToAllGamers(message: string): void {
    Object.keys(this.members).forEach((userId) => {
      this.members[userId].user.sendMessage(message);
    });
  }
}
