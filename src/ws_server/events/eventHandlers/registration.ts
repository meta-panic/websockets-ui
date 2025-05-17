import { type WebSocket as WSType } from "ws";

import { IUserFactory } from "../../users/userFactory.interface";
import { IHandler } from "./handler.interface";
import { createResponse } from "./utils";


const registrationHandler: (userFactory: IUserFactory) => IHandler<"reg"> =
  (userFactory: IUserFactory) => ({ data, userRepo, wsClient }) => {
    const newUser = userFactory.create(data.name, data.password, wsClient);
    userRepo.add(newUser);

    addIdToSocket(wsClient, newUser.id);

    const resData = {
      name: newUser.name,
      index: newUser.id,
      error: false
    };
    const response = createResponse({
      type: "reg",
      data: resData
    });

    wsClient.send(JSON.stringify(response));
  };

export { registrationHandler };

function addIdToSocket(wsClient: WSType, id: string) {
  Object.defineProperty(wsClient, "id", {
    value: id,
    writable: false,
    enumerable: true
  });
}
