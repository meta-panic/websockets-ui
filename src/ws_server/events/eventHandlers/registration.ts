import { IUserFactory } from "../../user/userFactory.interface";
import { IHandler } from "./handler.interface";
import { createResponse } from "./utils";


const registrationHandler: (userFactory: IUserFactory) => IHandler<"reg"> =
  (userFactory: IUserFactory) => ({ data, userRepo, wsClient }) => {
    const newUser = userFactory.create(data.name, data.password, wsClient);
    userRepo.add(newUser);


    const resData = {
      name: newUser.name,
      index: newUser.id,
      error: false
    };
    const response = createResponse(
      "reg",
      resData
    );

    console.log("response - ", response);
    wsClient.send(JSON.stringify(response));
  };

export { registrationHandler };
