import { ShootStatus } from "../event.interface";


export interface AttackFeedbackRes {
  position: {
    x: number;
    y: number;
  },
  currentPlayer: string;/* id of the player in the current game session */
  status: ShootStatus;
}
