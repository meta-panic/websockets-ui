import { CreateRoomReq } from "./payload/createRoom";
import { RegistrationReq, RegistrationRes } from "./payload/registration";
import { UpdateRoomRes } from "./payload/updateRoom";

interface RequestResponce<Req, Res> {
  request: Req,
  responce: Res
}

export interface Events {
  reg: RequestResponce<RegistrationReq, RegistrationRes>;
  update_room: RequestResponce<never, UpdateRoomRes>;
  create_room: RequestResponce<CreateRoomReq, never>;
}

export const EVENT_NAME_LIST = ["reg", "update_room", "create_room"] satisfies (keyof Events)[];
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

