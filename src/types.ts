export type MatrixElement = {
  id: number;
  row: number;
  column: number;
  value: number;
};
export type Output = {
  id: number;
  inputId: number;
  result: number;
  pathInfo: string;
};
export type InputList = {
  id: number;
  rows: number;
  columns: number;
  treasure: number;
  output: Output;
};
export type Input = {
  id: number;
  rows: number;
  columns: number;
  treasure: number;
  matrixElements: MatrixElement[];
  output: Output;
};
export type ResultDisplayData = {
  result: string;
  path: string;
};

// api
export type ServiceResponse<T> = {
  data: T;
  success: boolean;
  message: string;
};
export type MatrixElementPayload = {
  row: number;
  column: number;
  value: number;
};
export type FindResultPayload = {
  m: number;
  n: number;
  p: number;
  matrixElements: MatrixElementPayload[];
};
export type UpdateInputPayload = {
  id: number;
  rows?: number;
  columns?: number;
  treasure?: number;
  matrixElements?: MatrixElementPayload[];
};
