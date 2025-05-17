export type ShipType = "small" | "medium" | "large" | "huge";

export interface ShipPosition {
  x: number;
  y: number;
}

export interface IShip {
  position: ShipPosition;
  direction: boolean;
  length: number;
  type: ShipType;
}

export interface Coordinates {
  x: number;
  y: number;
}
