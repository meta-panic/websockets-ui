export interface IRepository<T> {
  getAll(): T[];
  add(user: T): void;
  delete(user: T): void;
}
