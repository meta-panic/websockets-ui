import { App } from "./app";
import { InMemoryDB } from "./DB/inMemoryDB";
import { EventNameType } from "./events/event.interface";
import { addShipsHandler } from "./events/eventHandlers/addShips";
import { addUserToRoomHandler } from "./events/eventHandlers/addUserToRoom";
import { attackHandler } from "./events/eventHandlers/attack";
import { createGameHandler } from "./events/eventHandlers/createGame";
import { createRoomHandler } from "./events/eventHandlers/createRoom";
import { EventHandler } from "./events/eventHandlers/handler.interface";
import { registrationHandler } from "./events/eventHandlers/registration";
import { setTurnHandler } from "./events/eventHandlers/setTurnHandler";
import { startGameHandler } from "./events/eventHandlers/startGame";
import { updateRoomHandler } from "./events/eventHandlers/updateRooms";
import { updateWinnersHandler } from "./events/eventHandlers/updateWinners";
import { GameRepository } from "./games/game.repository";
import { GameFactory } from "./games/gameFactory";
import { RoomRepository } from "./rooms/room.repository";
import { RoomFactory } from "./rooms/roomFactory";
import { UserRepository } from "./users/user.repository";
import { UserFactory } from "./users/userFactory";
import getAppArgs from "./utils/ArgParser";
import { runDebugger } from "./utils/debugger";


const userRepo = new UserRepository(new InMemoryDB());
const roomRepo = new RoomRepository(new InMemoryDB());
const gameRepo = new GameRepository(new InMemoryDB());

const userFactory = new UserFactory();
const roomFactory = new RoomFactory();
const gameFactory = new GameFactory();

const WS_PORT = 3000;
const app = new App({ port: WS_PORT, userRepo, roomRepo, gameRepo });


const eventHandlers: EventHandler<EventNameType> = {
  // menu and room mechanic handlers //
  "reg": (arg) => {
    registrationHandler(userFactory)(arg);
    updateRoomHandler()(arg);
    updateWinnersHandler()(arg);
  },
  "create_room": (arg) => {
    createRoomHandler(roomFactory)(arg);
    updateRoomHandler()(arg);
  },
  "add_user_to_room": (arg) => {
    addUserToRoomHandler()(arg);
    createGameHandler(gameFactory)(arg);
    updateRoomHandler()(arg);
  },


  // game mechanic //
  "add_ships": (arg) => {
    const gameId = arg.data.gameId;

    addShipsHandler()(arg);
    startGameHandler(gameId)(arg);
    setTurnHandler(gameId)(arg);
  },
  "attack": (arg) => {
    const gameId = arg.data.gameId;

    attackHandler()(arg);
    setTurnHandler(gameId)(arg);
    updateWinnersHandler()(arg);
  },
  "randomAttack": (arg) => {
    const gameId = arg.data.gameId;

    attackHandler()(arg);
    setTurnHandler(gameId)(arg);
    updateWinnersHandler()(arg);
  },

  // only for sending back //
  "update_room": () => { },// eslint-disable-line @typescript-eslint/no-empty-function
  "start_game": () => { },  // eslint-disable-line @typescript-eslint/no-empty-function
  "turn": () => { }, // eslint-disable-line @typescript-eslint/no-empty-function
  "finish": () => { },  // eslint-disable-line @typescript-eslint/no-empty-function
  "update_winners": () => { }  // eslint-disable-line @typescript-eslint/no-empty-function
};

app.registerHandlers(eventHandlers);
console.log(`WebSocket server running on port ${WS_PORT}`);

if (getAppArgs(process.argv, "mode") === "dev") {
  runDebugger({ userRepo, gameRepo, roomRepo });
}
