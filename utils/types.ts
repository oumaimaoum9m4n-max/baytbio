export type PaginatedData<T> = {
  data: T[];
  totalPages: number;
  totalItems: number;
  currentPage: number;
  pageSize: number;
};

export type MutationResponse = {
  msg: string;
};

export type ErrorResponse = MutationResponse