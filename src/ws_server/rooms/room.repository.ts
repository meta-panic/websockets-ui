import { IRepository } from "../DB/core/repository/repository.interface";
import { IDatabase } from "../DB/db.interface";
import { IRoom } from "./room.interface";


export class RoomRepository implements IRepository<IRoom> {
  private dbService: IDatabase<IRoom>;

  constructor(dbService: IDatabase<IRoom>) {
    this.dbService = dbService;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: string, fields: Partial<IRoom>): void {
    throw new Error("Method not implemented.");
  }

  getAll() {
    return this.dbService.findAll();
  }

  get(id: string) {
    return this.dbService.findById(id);
  }

  add(room: IRoom) {
    this.dbService.create(room);
  }

  delete(room: IRoom) {
    this.dbService.delete(room.id);
  }
}
