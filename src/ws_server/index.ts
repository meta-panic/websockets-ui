import { App } from "./app";
import { InMemoryDB } from "./DB/inMemoryDB";
import { EventNameType } from "./events/event.interface";
import { addShipsHandler } from "./events/eventHandlers/addShips";
import { addUserToRoomHandler } from "./events/eventHandlers/addUserToRoom";
import { attackHandler } from "./events/eventHandlers/attack";
import { createGameHandler } from "./events/eventHandlers/createGame";
import { createRoomHandler } from "./events/eventHandlers/createRoom";
import { IHandler } from "./events/eventHandlers/handler.interface";
import { registrationHandler } from "./events/eventHandlers/registration";
import { setTurnHandler } from "./events/eventHandlers/setTurnHandler";
import { startGameHandler } from "./events/eventHandlers/startGame";
import { updateRoomHandler } from "./events/eventHandlers/updateRooms";
import { GameRepository } from "./games/game.repository";
import { GameFactory } from "./games/gameFactory";
import { RoomRepository } from "./rooms/room.repository";
import { RoomFactory } from "./rooms/roomFactory";
import { UserRepository } from "./users/user.repository";
import { UserFactory } from "./users/userFactory";
import * as readline from "readline";

const userRepo = new UserRepository(new InMemoryDB());
const roomRepo = new RoomRepository(new InMemoryDB());
const gameRepo = new GameRepository(new InMemoryDB());

const userFactory = new UserFactory();
const roomFactory = new RoomFactory();
const gameFactory = new GameFactory();

const WS_PORT = 3000;
const app = new App({ port: WS_PORT, userRepo, roomRepo, gameRepo });

export type HandlerWrapper<E extends EventNameType> = (arg: Parameters<IHandler<E>>[0]) => void;
export type EventHandler<T extends EventNameType> = {
  [K in T]: HandlerWrapper<K>;
};
const eventHandlers: EventHandler<EventNameType> = {


  // menu and room mechanic handlers //
  "reg": (arg) => {
    registrationHandler(userFactory)(arg);
    updateRoomHandler()(arg);
    // updateWinnerHandler(userFactory)(arg);
  },
  "create_room": (arg) => {
    createRoomHandler(roomFactory)(arg);
    updateRoomHandler()(arg);
    // updateWinnerHandler(userFactory)(arg);
  },
  "add_user_to_room": (arg) => {
    addUserToRoomHandler()(arg);
    createGameHandler(gameFactory)(arg);
    updateRoomHandler()(arg);
    // updateWinnerHandler(userFactory)(arg);
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
  },

  // only for sending back //
  "update_room": () => { },// eslint-disable-line @typescript-eslint/no-empty-function
  "start_game": () => { },  // eslint-disable-line @typescript-eslint/no-empty-function
  "turn": () => { }, // eslint-disable-line @typescript-eslint/no-empty-function
  "finish": () => { }  // eslint-disable-line @typescript-eslint/no-empty-function
};

app.registerHandlers(eventHandlers);

// --- Start of added code for console input ---

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "> " // Optional prompt
});

rl.prompt(); // Display the initial prompt

rl.on("line", (line: string) => {
  const command = line.trim().toLowerCase();

  switch (command) {
    case "user":
      {
        const users = userRepo.getAll();
        console.log("User Repository Contents[total number]:", users.length);
        users.forEach((user, index) => {
          console.log(`${index}. user ${user.id}, ${user.name}, winCount: ${user.winCount}`);
        });
        break;
      }
    case "room":
      {
        const rooms = roomRepo.getAll();
        console.log("Room Repository Contents[total number]:", rooms.length);
        rooms.forEach((room, index) => {
          console.log(`${index}. room ${room.id}, host: ${room.host.name}, members: ${room.members.length}`);
          room.members.forEach((member) => {
            console.log(`member ${member.id}, name: ${member.name}, winsCount: ${member.winCount}`);
          });
        });
        break;
      }
    case "game":
      {
        const games = gameRepo.getAll();
        console.log("Game Repository Contents[total number]:", games.length);
        games.forEach((game, index) => {
          console.log(`${index}. game ${game.id}, current turn: ${game.attackerId}`);
          Object.entries(game.members).forEach(([memberId, member]) => {
            console.log(`member name: ${member.user.name}, currentPlayerIndex: ${member.currentPlayerIndex}, userId: ${member.user.id}, is attacking?:${member.currentPlayerIndex === game.attackerId ? "yes" : "no"} shipsPosition: ${member.shipsPosition?.length ? "set" : "not set"}`);
          });
        });
        break;
      }
    default:
      console.log(`Unknown command: ${command}`);
  }

  rl.prompt(); // Display prompt again for next input
}).on("close", () => {
  console.log("Exiting console input.");
  process.exit(0);
});

console.log(`WebSocket server running on port ${WS_PORT}`);
console.log("Type \"user\", \"room\", or \"game\" to see repository contents.");

