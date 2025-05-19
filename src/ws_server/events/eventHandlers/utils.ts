import { EventNameType, OutcomingMessage } from "../event.interface";

export function createResponse<E extends EventNameType>
  ({ type, data, overwriteType }: { type: E, data: OutcomingMessage<E>["data"], overwriteType?: string }) {
  return {
    type: overwriteType ?? type,
    data: JSON.stringify(data),
    id: 0
  };
}
