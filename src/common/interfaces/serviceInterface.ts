export interface IService<T, CreateDTO, UpdateDTO> {
  findAll(): Promise<T[]>;
  findById(id: string): Promise<T>;
  create(data: CreateDTO): Promise<T>;
  update(id: string, data: UpdateDTO): Promise<T>;
  delete(id: string): Promise<void>;
}