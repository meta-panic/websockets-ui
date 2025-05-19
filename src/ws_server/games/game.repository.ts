import { IRepository } from "../DB/core/repository/repository.interface";
import { IDatabase } from "../DB/db.interface";
import { IGame } from "./game.interface";


export class GameRepository implements IRepository<IGame> {
  private dbService: IDatabase<IGame>;

  constructor(dbService: IDatabase<IGame>) {
    this.dbService = dbService;
  }

  update(id: string, fields: Partial<IGame>): void {
    this.dbService.update(id, fields);
  }

  getAll() {
    return this.dbService.findAll();
  }

  get(id: string) {
    return this.dbService.findById(id);
  }

  add(game: IGame) {
    this.dbService.create(game);
  }

  delete(game: IGame) {
    this.dbService.delete(game.id);
  }
}
