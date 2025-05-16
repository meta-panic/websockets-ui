import { RegistrationReq, RegistrationRes } from "./payload/registration";

interface RequestResponce<Req, Res> {
  request: Req,
  responce: Res
}

export interface Events {
  reg: RequestResponce<RegistrationReq, RegistrationRes>;
  reg2: RequestResponce<1, RegistrationRes>;
}

export const EVENT_NAME_LIST = ["reg", "reg2"] satisfies (keyof Events)[];
export type EventNameType = typeof EVENT_NAME_LIST[number];

export interface IncomingMessage<T extends EventNameType> {
  type: T,
  data: T extends keyof Events ? Events[T]["request"] : never,
  id: number,
}

export interface OutcomingMessage<T extends EventNameType> {
  type: T,
  data: T extends keyof Events ? Events[T]["responce"] : never,
  id: number,
}

