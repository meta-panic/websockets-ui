import { ShootStatus } from "../events/event.interface";
import { IUser } from "../users/user.interface";
import { generateUUID } from "../utils";
import { IGame, Members, MembersNotSet } from "./game.interface";
import { Coordinates, IShip } from "./shipsPosition.interface";
import { checkAllShipsKilled, getCoordsAroundShip, hit, isShipKilled } from "./utils";


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
          currentPlayerIndex: generateUUID(),
          hitCoordinates: []
        };
      }
    }
    return preparedMembers;
  }

  handleAttack({ x, y, attackerId }: Coordinates & { attackerId: string }): { status: ShootStatus, coords: Coordinates[] } | "wrong turn" {
    const attackCoordinate: Coordinates = { x, y };
    const defender = this.findTheOtherPlayer(attackerId);

    try {
      this.validateAttack(x, y, attackerId, defender);
    } catch (error) {
      console.warn(`Game ${this.id}: error${error instanceof Error ? error.message : "something wrong"}\n`);
      return "wrong turn";
    }

    if (this.attackerId !== attackerId) {
      console.warn(`Game ${this.id}: Attacker ID mismatch. Expected ${this.attackerId}, received ${attackerId}\n`);
      return "wrong turn";
    }

    const hitShip = hit({ ships: defender.shipsPosition, coords: { x, y } });

    if (!hitShip) {
      console.log(`Game ${this.id}: Miss at ${x},${y}\n`);
      this.switchAttacker();

      return {
        status: "miss",
        coords: [{ x, y }]
      };
    }

    defender.hitCoordinates.push(attackCoordinate);

    if (!isShipKilled(hitShip, defender.hitCoordinates)) {
      console.log(`Game ${this.id}: Ship hit at ${x},${y}\n`);
      return {
        status: "shot",
        coords: [{ x, y }]
      };
    }

    console.log(`Game ${this.id}: Ship of type ${hitShip.type} killed at ${hitShip.position.x},${hitShip.position.y}\n`);


    const coordinateAroundKilledShip = getCoordsAroundShip(hitShip);
    coordinateAroundKilledShip.forEach((coords) => {
      defender.hitCoordinates.push(coords);
    });

    return {
      status: "killed",
      coords: [{ x, y }, ...coordinateAroundKilledShip]
    };
  }


  private switchAttacker() {
    const attacker = Object.values(this.members).find(member => member.currentPlayerIndex === this.attackerId);
    if (!attacker) {
      return;
    }

    const defender = this.findTheOtherPlayer(attacker?.currentPlayerIndex);

    if (attacker && defender) {
      this.attackerId = defender.currentPlayerIndex;
      console.log(`Game ${this.id}: Attacker switched to ${this.attackerId}\n`);
    }
  }

  hasEnemyAliveShips(attackerId: string) {
    const defender = this.findTheOtherPlayer(attackerId);

    if (!defender?.shipsPosition) {
      throw new Error(`No ships for ${defender?.user.id} user. The game is not all set.\m`);
    }

    const allDefenderShipsKilled = checkAllShipsKilled(defender?.shipsPosition, defender.hitCoordinates);

    if (allDefenderShipsKilled) {
      console.log(`Game ${this.id}: All ships of defender ${defender.user.id} are killed. Attacker ${attackerId} wins!\n`);
      return false;
    }

    return true;
  }

  private validateAttack(x: Coordinates["x"], y: Coordinates["y"], attackerId: string, defender?: Members<IUser>[string]): asserts defender is Members<IUser>[string] & { shipsPosition: IShip[] } {
    if (!defender) {
      throw new Error(`Game ${this.id}: Could not find the defender.\n`);
    }

    if (defender.hitCoordinates.some(coord => coord.x === x && coord.y === y)) {
      throw new Error(`Game ${this.id}: Coordinate ${x},${y} already hit.\n`);
    }

    if (!defender.shipsPosition) {
      throw new Error(`No ships for ${defender.user.id} user. The game is not all set.\n`);
    }
  }

  private findTheOtherPlayer(firstPlayer: string) {
    return Object.values(this.members).find(member => member.currentPlayerIndex !== firstPlayer);
  }

  private getRandomAttacker() {
    const memberIndexes = Object.values(this.members).map(member => member.currentPlayerIndex);

    return memberIndexes[0];
  }

  addShipsPosition(userId: string, shipsPosition: IShip[]): void {
    this.members[userId].shipsPosition = shipsPosition;
  }

  sendToAllGamers(message: string): void {
    if (!this.members) {
      console.error(`Game ${this.id}: sendToAllGamers called but members is undefined.`);
      return; // Prevent crash
    }
    // Assuming Object.keys(this.members) is safe if this.members is an object/Record
    Object.keys(this.members).forEach((userId) => {
      // Ensure the member and user exist before sending the message
      const member = this.members[userId];
      if (member && member.user && member.user.sendMessage) {
        member.user.sendMessage(message);
      } else {
        console.warn(`Game ${this.id}: Could not send message to user ${userId}. Member or user/sendMessage not found.`);
      }
    });
  }
}
