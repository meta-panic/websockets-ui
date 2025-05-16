import { IRepository } from "../DB/core/repository/repository.interface";
import { IDatabase } from "../DB/db.interface";
import { IRoom } from "./room.interface";


export class RoomRepository implements IRepository<IRoom> {
  private dbService: IDatabase<IRoom>;

  constructor(dbService: IDatabase<IRoom>) {
    this.dbService = dbService;
  }

  getAll() {
    return this.dbService.findAll();
  }

  get(id: string) {
    return this.dbService.findById(id);
  }

  add(user: IRoom) {
    this.dbService.create(user);
  }

  delete(user: IRoom) {
    this.dbService.delete(user.id);
  }
}
