import { IRepository } from "../DB/core/repository/repository.interface";
import { IDatabase } from "../DB/db.interface";
import { IUser } from "./user.interface";

export class UserRepository implements IRepository<IUser> {
  private dbService: IDatabase<IUser>;

  constructor(dbService: IDatabase<IUser>) {
    this.dbService = dbService;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: string, fields: Partial<IUser>): void {
    throw new Error("Method not implemented.");
  }

  getAll() {
    return this.dbService.findAll();
  }

  get(id: string) {
    return this.dbService.findById(id);
  }

  add(user: IUser) {
    this.dbService.create(user);
  }

  delete(user: IUser) {
    this.dbService.delete(user.id);
  }
}
