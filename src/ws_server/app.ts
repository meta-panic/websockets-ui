import { RawData, WebSocketServer, type WebSocket as WSType } from "ws";

import { deepParse } from "./utils/common";
import { IUser } from "./users/user.interface";
import { IRepository } from "./DB/core/repository/repository.interface";
import { EventNameType } from "./events/event.interface";
import { isIncomingMessage } from "./events/quarts";
import { IRoom } from "./rooms/room.interface";
import { IGame } from "./games/game.interface";
import { EventHandler, HandlerWrapper } from "./events/eventHandlers/handler.interface";


export class App {
  private readonly wsServer: WebSocketServer;
  private userRepo: IRepository<IUser>;
  private roomRepo: IRepository<IRoom>;
  private gameRepo: IRepository<IGame>;

  private eventHandlers?: EventHandler<EventNameType>;

  constructor({ port, userRepo, roomRepo, gameRepo }: { port: number, userRepo: IRepository<IUser>, roomRepo: IRepository<IRoom>, gameRepo: IRepository<IGame> }) {
    this.userRepo = userRepo;
    this.roomRepo = roomRepo;
    this.gameRepo = gameRepo;

    this.wsServer = new WebSocketServer({ port });
    this.wsServer.on("connection", (wsClient: WSType) => {
      wsClient.on("message", (data: RawData) => this.handleMessage({
        data, wsClient
      }));
    });

    this.wsServer.on("listening", () =>
      console.log(`WebSocket server is running on port: ${port}`)
    );

    this.wsServer.on("error ", () => {
      console.log("Error.");
    });

    this.wsServer.on("close", () => {
      console.log("WebSocket server close");
    });
  }

  registerHandlers(handlers: EventHandler<EventNameType>): this {
    this.eventHandlers = handlers;

    return this;

  }

  private handleMessage({ wsClient, data }: { wsClient: WSType, data: RawData }): void {
    const parsedClientData: unknown = deepParse(data.toString());

    if (!this.eventHandlers) {
      throw new Error("No event handlers registered");
    }

    if (isIncomingMessage(parsedClientData)) {
      const handler = this.eventHandlers[parsedClientData.type] as HandlerWrapper<typeof parsedClientData.type>;

      handler && handler({
        type: parsedClientData.type,
        data: parsedClientData.data,
        wsClient: wsClient,
        userRepo: this.userRepo,
        gameRepo: this.gameRepo,
        roomRepo: this.roomRepo,
        broadcast: this.broadcast.bind(this)
      });

      return;
    }

    console.error("Received an invalid or unexpected message format:", parsedClientData);
  }

  broadcast(message: string) {
    this.wsServer.clients.forEach((client) => {
      client.send(message);
    });
  }
}
