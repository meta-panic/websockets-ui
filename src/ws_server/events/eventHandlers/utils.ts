import { EventNameType, OutcomingMessage } from "../event.interface";

export function createResponse<E extends EventNameType>
  (type: E, data: OutcomingMessage<E>["data"]) {
  return {
    type,
    data: JSON.stringify(data),
    id: 0
  };
}
