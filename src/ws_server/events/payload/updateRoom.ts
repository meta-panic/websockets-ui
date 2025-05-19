export type UpdateRoomRes = {
  roomId: string,
  roomUsers: {
    name: string;
    index: string | number;
  }[],
}[];
