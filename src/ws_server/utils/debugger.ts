import * as readline from "readline";
import { UserRepository } from "../users/user.repository";
import { RoomRepository } from "../rooms/room.repository";
import { GameRepository } from "../games/game.repository";


function runDebugger(
  { userRepo, roomRepo, gameRepo }: { userRepo: UserRepository, roomRepo: RoomRepository, gameRepo: GameRepository }
) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "> "
  });

  rl.prompt();

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
            Object.entries(game.members).forEach(([, member]) => {
              console.log(`member name: ${member.user.name}, playerId: ${member.sessionPlayerId}, userId: ${member.user.id}, is attacking?:${member.sessionPlayerId === game.attackerId ? "yes" : "no"} shipsPosition: ${member.shipsPosition?.length ? "set" : "not set"}`);
            });
          });
          break;
        }
      default:
        console.log(`Unknown command: ${command}`);
    }

    rl.prompt();
  }).on("close", () => {
    console.log("Exiting console input.");
    process.exit(0);
  });

  console.log("Type \"user\", \"room\", or \"game\" to see repository contents.");
}

export { runDebugger };
