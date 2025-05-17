import { AddUserToRoomReq } from "./payload/addUserToRoom";
import { CreateRoomReq } from "./payload/createRoom";
import { RegistrationReq, RegistrationRes } from "./payload/registration";
import { CreateGameRes } from "./payload/createGame";
import { UpdateRoomRes } from "./payload/updateRoom";
import { AddShipsReq } from "./payload/addShips";
import { StartGameRes } from "./payload/startGame";
import { SetTurnRes } from "./payload/setTurn";
import { AttackReq } from "./payload/attack";
import { AttackFeedbackRes } from "./payload/attackFeedback";
import { FinishRes } from "./payload/finish";
import { RandomAttackReq } from "./payload/randomAttack";
import { UpdateWinnersRes } from "./payload/updateWinners";

interface RequestResponce<Req, Res> {
  request: Req,
  responce: Res
}

export interface Events {
  reg: RequestResponce<RegistrationReq, RegistrationRes>;
  update_room: RequestResponce<never, UpdateRoomRes>;
  create_room: RequestResponce<CreateRoomReq, never>;
  add_user_to_room: RequestResponce<AddUserToRoomReq, CreateGameRes>;
  add_ships: RequestResponce<AddShipsReq, never>;
  start_game: RequestResponce<never, StartGameRes>;
  turn: RequestResponce<never, SetTurnRes>;
  attack: RequestResponce<AttackReq, AttackFeedbackRes>;
  finish: RequestResponce<never, FinishRes>;
  randomAttack: RequestResponce<RandomAttackReq, AttackFeedbackRes>;
  update_winners: RequestResponce<never, UpdateWinnersRes>;
}

export const EVENT_NAME_LIST = [
  "reg",
  "update_room",
  "create_room",
  "add_user_to_room",
  "add_ships",
  "start_game",
  "turn",
  "attack",
  "finish",
  "randomAttack",
  "update_winners"
] satisfies (keyof Events)[];
export type EventNameType = typeof EVENT_NAME_LIST[number];

export interface IncomingMessage<T extends EventNameType> {
  type: T,
  data: T extends keyof Events ? Events[T]["request"] : never,
  id: string,
}

export interface OutcomingMessage<T extends EventNameType> {
  type: T,
  data: T extends keyof Events ? Events[T]["responce"] : never,
  id: string,
}

export type ShootStatus = "miss" | "killed" | "shot";
