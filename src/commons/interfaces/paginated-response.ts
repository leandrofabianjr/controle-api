export interface PaginatedResponse<T> {
  limit?: number;
  offset?: number;
  total?: number;
  data: T[];
}
