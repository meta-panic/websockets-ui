import { App } from "./app";
import { InMemoryDB } from "./DB/inMemoryDB";
import { EventNameType } from "./events/event.interface";
import { IHandler } from "./events/eventHandlers/handler.interface";
import { registrationHandler } from "./events/eventHandlers/registration";
import { UserRepository } from "./user/user.repository";
import { UserFactory } from "./user/userFactory";

const userFactory = new UserFactory();
const userRepository = new UserRepository(new InMemoryDB());
const WS_PORT = 3000;
const app = new App(WS_PORT, userRepository);

const eventHandlers = new Map([
  ["reg", (arg: Parameters<IHandler<"reg">>[0]) => {
    registrationHandler(userFactory)(arg);
    console.log("update after registration handler");
  }]
] as const) as Map<EventNameType, IHandler<EventNameType>>;

app.registerHandlers(eventHandlers);
