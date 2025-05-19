export interface AttackReq {
  gameId: string;
  x: number;
  y: number;
  indexPlayer: string;
}

export function isAttackReq(data: unknown): data is AttackReq {
  return (
    typeof data === "object" &&
    data !== null &&
    "x" in data && typeof data.x === "number" &&
    "y" in data && typeof data.y === "number" &&
    "gameId" in data && typeof data.gameId === "string" &&
    "indexPlayer" in data && typeof data.indexPlayer === "string"
  );
}
