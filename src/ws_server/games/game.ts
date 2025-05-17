import { ShootStatus } from "../events/event.interface";
import { IUser } from "../users/user.interface";
import { generateUUID } from "../utils/common";
import { IGame, Members, MembersNotSet } from "./game.interface";
import { Coordinates, IShip } from "./shipsPosition.interface";
import { checkAllShipsKilled, getCoordsAroundShip, getShipCoords, hit, isShipKilled } from "./utils";


export const BOARD_X_MIN = 0;
export const BOARD_X_MAX = 9;

export const BOARD_Y_MIN = 0;
export const BOARD_Y_MAX = 9;


export class Game implements IGame {
  id: string;
  members: Members<IUser>;
  attackerId: string;

  private missCoordinates: Record<IUser["id"], Coordinates[]>;

  public constructor(
    initialMembers: MembersNotSet<IUser>
  ) {
    this.id = generateUUID();
    this.members = Game.prepareMembers(initialMembers);
    this.attackerId = this.getRandomAttacker();
    this.missCoordinates = {};
    Object.values(this.members).forEach(member => {
      this.missCoordinates[member.sessionPlayerId] = [];
    });
  }

  private static prepareMembers(members: MembersNotSet<IUser>): Members<IUser> {
    const preparedMembers: Members<IUser> = {};
    for (const key in members) {
      if (Object.prototype.hasOwnProperty.call(members, key)) {
        preparedMembers[key] = {
          ...members[key],
          sessionPlayerId: generateUUID(),
          hitCoordinates: []
        };
      }
    }

    return preparedMembers;
  }

  getRandomAttackCoordinate(attackerId: string): Coordinates {
    if (!this.hasEnemyAliveShips(attackerId)) {
      throw new Error(`Tne enemy has no ships anymore: ${this.findTheOtherPlayer(attackerId)?.sessionPlayerId}`);
    }

    const defender = this.findTheOtherPlayer(attackerId);

    if (!defender) {
      throw new Error(`Game ${this.id}: Could not find the defender to generate random attack coordinate.`);
    }

    let randomX: number;
    let randomY: number;
    let isHit: boolean;

    do {
      randomX = Math.floor(Math.random() * BOARD_X_MAX);
      randomY = Math.floor(Math.random() * BOARD_Y_MAX);

      isHit = defender.hitCoordinates.some(coord => coord.x === randomX && coord.y === randomY);

    } while (isHit);

    return { x: randomX, y: randomY };
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

      this.missCoordinates[defender.sessionPlayerId].push(attackCoordinate);

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
      coords: [{ x, y }, ...coordinateAroundKilledShip, ...getShipCoords(hitShip)]
    };
  }


  private switchAttacker() {
    const attacker = Object.values(this.members).find(member => member.sessionPlayerId === this.attackerId);
    if (!attacker) {
      return;
    }

    const defender = this.findTheOtherPlayer(attacker?.sessionPlayerId);

    if (attacker && defender) {
      this.attackerId = defender.sessionPlayerId;
      console.log(`Game ${this.id}: Attacker switched to ${this.attackerId}\n`);
    }
  }

  hasEnemyAliveShips(attackerId: string) {
    const defender = this.findTheOtherPlayer(attackerId);

    if (!defender?.shipsPosition) {
      throw new Error(`No ships for ${defender?.user?.id} user. The game is not all set.\n`);
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

    if (this.missCoordinates[defender.sessionPlayerId].some(coord => coord.x === x && coord.y === y)) {
      throw new Error(`Game ${this.id}: Coordinate ${x},${y} already hit.\n`);
    }

    if (!defender.shipsPosition) {
      throw new Error(`No ships for ${defender.user.id} user. The game is not all set.\n`);
    }
  }

  private findTheOtherPlayer(firstPlayer: string) {
    return Object.values(this.members).find(member => member.sessionPlayerId !== firstPlayer);
  }

  private getRandomAttacker() {
    const memberIndexes = Object.values(this.members).map(member => member.sessionPlayerId);

    return memberIndexes[0];
  }

  addShipsPosition(userId: string, shipsPosition: IShip[]): void {
    this.members[userId].shipsPosition = shipsPosition;
  }

  sendToAllGamers(message: string): void {
    Object.keys(this.members).forEach((userId) => {
      const member = this.members[userId];
      member.user.sendMessage(message);
    });
  }
}
