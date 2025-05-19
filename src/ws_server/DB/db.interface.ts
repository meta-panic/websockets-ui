export interface IDatabase<T> {
  create(item: T): void;
  findAll(): T[];
  findById(id: string): T | undefined;
  update(id: string, item: Partial<T>): void;
  delete(id: string): void;
}
