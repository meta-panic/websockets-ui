import { IHandler } from "./handler.interface";
import { createResponse } from "./utils";


const updateWinnersHandler: () => IHandler<"attack" | "randomAttack" | "reg"> =
  () => ({ userRepo, broadcast }) => {
    const allUsers = userRepo.getAll();

    const response = createResponse({
      type: "update_winners",
      data: allUsers.map((user) => ({ name: user.name, wins: user.winCount }))
    });

    broadcast(JSON.stringify(response));
  };

export { updateWinnersHandler };
