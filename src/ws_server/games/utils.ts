import { Coordinates, IShip } from "./shipsPosition.interface";


function hit({ ships, coords }: { ships: IShip[], coords: Coordinates }): IShip | undefined {
  console.log(`hit x: ${coords.x}, y: ${coords.y}`);
  let hitShip: IShip | undefined = undefined;
  const { x, y } = coords;
  for (const ship of ships) {
    const shipCoordinates: Coordinates[] = _calcShipCoords(ship);

    shipCoordinates.forEach((s) => {
      console.log(`shipCoordinates: ${s.x}, y: ${s.y}`);
    });
    // Check if the attack coordinate matches any of the ship's coordinates
    if (shipCoordinates.some(shipCords => shipCords.x === x && shipCords.y === y)) {
      console.log("hit!");

      hitShip = ship;
      break;
    }
  }

  return hitShip;
}

function isShipKilled(hitShip: IShip, hitCoordinates: Coordinates[]) {
  const shipCoordinates: Coordinates[] = _calcShipCoords(hitShip);

  const isShipKilled = shipCoordinates.every(shipCoord =>
    hitCoordinates.some(hitCoord => hitCoord.x === shipCoord.x && hitCoord.y === shipCoord.y)
  );

  return isShipKilled;
}

function _calcShipCoords(ship: IShip): Coordinates[] {
  const shipCoordinates: Coordinates[] = [];

  if (_isVertical(ship.direction)) { // Horizontal
    for (let i = 0; i < ship.length; i++) {
      shipCoordinates.push({ x: ship.position.x, y: ship.position.y + i });
    }

  } else { // Vertical
    for (let i = 0; i < ship.length; i++) {
      shipCoordinates.push({ x: ship.position.x + i, y: ship.position.y });
    }
  }

  return shipCoordinates;
}

function checkAllShipsKilled(shipsPosition: IShip[], hitCoordinates: Coordinates[]): boolean {
  return shipsPosition.every(ship => {
    const shipCoords: Coordinates[] = _calcShipCoords(ship);

    return shipCoords.every(shipCoord =>
      hitCoordinates.some(hitCoord => hitCoord.x === shipCoord.x && hitCoord.y === shipCoord.y)
    );
  });
}

function _isCoordinateInBounds(coord: Coordinates): boolean {
  return coord.x >= 0 && coord.x < 10 && coord.y >= 0 && coord.y < 10;
}

function getCoordsAroundShip(ship: IShip) {
  const aroundCoords: Coordinates[] = [];
  const occupiedCoords = _calcShipCoords(ship);

  // Use a Set to easily track and ensure uniqueness of coordinates
  const uniqueCoords = new Set<string>();

  // Helper to add a coordinate if it's in bounds and not already added
  const addCoord = (x: number, y: number) => {
    const coord = { x, y };
    const key = `${x},${y}`;
    // Check if in bounds and not already in the set of occupied or around coordinates
    if (_isCoordinateInBounds(coord) && !occupiedCoords.some(oc => oc.x === x && oc.y === y) && !uniqueCoords.has(key)) {
      aroundCoords.push(coord);
      uniqueCoords.add(key);
    }
  };

  occupiedCoords.forEach(segment => {
    addCoord(segment.x - 1, segment.y); // Left
    addCoord(segment.x + 1, segment.y); // Right
    addCoord(segment.x, segment.y - 1); // Up
    addCoord(segment.x, segment.y + 1); // Down

    // Add diagonal
    addCoord(segment.x - 1, segment.y - 1); // Top-Left
    addCoord(segment.x + 1, segment.y - 1); // Top-Right
    addCoord(segment.x - 1, segment.y + 1); // Bottom-Left
    addCoord(segment.x + 1, segment.y + 1); // Bottom-Right
  });

  return aroundCoords;

}


function _isVertical(direction: boolean) {
  return direction;
}

export { hit, isShipKilled, checkAllShipsKilled, getCoordsAroundShip };
