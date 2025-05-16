export interface IRepository<T extends { id: string }> {
  getAll(): T[];
  get(id: string): T | undefined;
  add(user: T): void;
  delete(user: T): void;
}
