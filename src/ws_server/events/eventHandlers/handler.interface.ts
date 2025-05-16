import { IRepository } from "../../DB/core/repository/repository.interface";
import { EventNameType, IncomingMessage } from "../event.interface";
import { IUser } from "../../user/user.interface";
import { type WebSocket as WSType } from "ws";

export type IHandler<E extends EventNameType>
  = ({ type, data, userRepo, wsClient }
    : { type: E, data: IncomingMessage<E>["data"], userRepo: IRepository<IUser>, wsClient: WSType }) => void
