export type Row<T> = {
  page_count: number;
  rows: Partial<T>[];
};
