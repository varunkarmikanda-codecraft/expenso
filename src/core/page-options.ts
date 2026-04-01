export interface PageOptions { 
  offset: number, 
  linit: number 
}

export interface PageResult<T> {
  data: T[];
  matched: number;
  total: number;
}