import { FindManyOptions } from 'typeorm';

export interface PaginatedServiceFilters<T> extends FindManyOptions<T> {
  search?: string;
}
