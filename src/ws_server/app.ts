import { RawData, WebSocketServer, type WebSocket as WSType } from "ws";
import { deepParse } from "./utils";
import { IUser } from "./user/user.interface";
import { IRepository } from "./DB/core/repository/repository.interface";
import { EventNameType } from "./events/event.interface";
import { isIncomingMessage } from "./events/quarts";
import { IHandler } from "./events/eventHandlers/handler.interface";


export class App {
  private readonly wsServer: WebSocketServer;
  private userRepo: IRepository<IUser>;
  private eventHandlers?: Map<EventNameType, IHandler<EventNameType>>;

  constructor(port: number, userRepo: IRepository<IUser>) {
    this.userRepo = userRepo;
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

  registerHandlers(handlers: Map<EventNameType, IHandler<EventNameType>>): this {
    this.eventHandlers = handlers;

    return this;

  }

  private handleMessage({ wsClient, data }: { wsClient: WSType, data: RawData }): void {
    const parsedClientData: unknown = deepParse(data.toString());

    if (!this.eventHandlers) {
      throw new Error("No event handlers registered");
    }

    if (isIncomingMessage(parsedClientData)) {
      const handler = this.eventHandlers.get(parsedClientData.type);

      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      handler && handler({
        type: parsedClientData.type,
        data: parsedClientData.data,
        wsClient: wsClient,
        userRepo: this.userRepo
      });

      return;
    }

    console.error("Received an invalid or unexpected message format:", parsedClientData);
  }

  // broadcast() {
  //   this.wsServer.clients.forEach((client) => {

  //   });
  // }
}
