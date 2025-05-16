import { App } from "./app";
import { InMemoryDB } from "./DB/inMemoryDB";
import { EventNameType } from "./events/event.interface";
import { createRoomHandler } from "./events/eventHandlers/createRoom";
import { IHandler } from "./events/eventHandlers/handler.interface";
import { registrationHandler } from "./events/eventHandlers/registration";
import { updateRoomHandler } from "./events/eventHandlers/updateRooms";
import { RoomRepository } from "./rooms/room.repository";
import { RoomFactory } from "./rooms/roomFactory";
import { UserRepository } from "./users/user.repository";
import { UserFactory } from "./users/userFactory";

const userRepo = new UserRepository(new InMemoryDB());
const roomRepo = new RoomRepository(new InMemoryDB());

const userFactory = new UserFactory();
const roomFactory = new RoomFactory();

const WS_PORT = 3000;
const app = new App({ port: WS_PORT, userRepo, roomRepo });

export type HandlerWrapper<E extends EventNameType> = (arg: Parameters<IHandler<E>>[0]) => void;
export type EventHandler<T extends EventNameType> = {
  [K in T]: HandlerWrapper<K>;
};
const eventHandlers: EventHandler<EventNameType> = {
  "reg": (arg) => {
    registrationHandler(userFactory)(arg);
    updateRoomHandler()(arg);
  },
  "create_room": (arg) => {
    createRoomHandler(roomFactory)(arg);
    updateRoomHandler()(arg);
    //     //updateWinnerHandler(userFactory)(arg);
  },


  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  "update_room": (arg: Parameters<IHandler<"update_room">>[0]) => {
  }
};

app.registerHandlers(eventHandlers);



// const eventHandlers = new Map([
//   ["reg"],
//   ["create_room", (arg: Parameters<IHandler<"create_room">>[0]) => {
//     createRoomHandler(roomFactory)(arg);
//     updateRoomHandler()(arg);
//     //updateWinnerHandler(userFactory)(arg);
//   }],
//   // eslint-disable-next-line @typescript-eslint/no-empty-function
//   ["update_room", () => { }]
// ] as const);

