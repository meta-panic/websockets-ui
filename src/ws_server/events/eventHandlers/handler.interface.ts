import { IRepository } from "../../DB/core/repository/repository.interface";
import { EventNameType, IncomingMessage } from "../event.interface";
import { IUser } from "../../users/user.interface";
import { type WebSocket as WSType } from "ws";
import { IRoom } from "../../rooms/room.interface";
import { IGame } from "../../games/game.interface";

export type IHandler<E extends EventNameType> = ({ type, data, userRepo, wsClient, broadcast }
  : {
    type: E,
    data: IncomingMessage<E>["data"],
    userRepo: IRepository<IUser>,
    roomRepo: IRepository<IRoom>,
    gameRepo: IRepository<IGame>,
    wsClient: WSType,
    broadcast: (message: string) => void,
  }) => void
