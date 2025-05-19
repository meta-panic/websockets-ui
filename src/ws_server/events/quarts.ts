import { EventNameType, IncomingMessage, EVENT_NAME_LIST } from "./event.interface";


export type AllIncomingMessages = {
  [K in EventNameType]: IncomingMessage<K>
}[EventNameType];

export function isIncomingMessage(msg: unknown): msg is AllIncomingMessages {
  if (typeof msg !== "object" || msg === null) {
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const potentialMsg = msg as any;

  if (typeof potentialMsg.type !== "string" || typeof potentialMsg.id !== "number" || potentialMsg.data === undefined) {
    return false;
  }

  const eventName: string = potentialMsg.type;

  if (!EVENT_NAME_LIST.includes(eventName as EventNameType)) {
    return false;
  }

  return true;
}
