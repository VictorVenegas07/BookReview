export interface ApiPaginated<T> {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
  totalCountRecords: number;
  message: string;
  success: boolean;
  data: T[];
}
