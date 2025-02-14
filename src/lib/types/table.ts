export type SortDirection = 'asc' | 'desc';

// Type helper for nested object keys
export type NestedKeyOf<T> = keyof T | string;


export type CurrencyCode = 'USD' | 'GBP';

export interface TableColumn<T> {
  header: string;
  key: NestedKeyOf<T>;
  isAmount?: boolean;
  currency?: CurrencyCode;
  isDate?: boolean;
  className?: string;
  hidden?:boolean;
  render?: (value: unknown, record: T) => React.ReactNode;
}


export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  onSort?: (key: NestedKeyOf<T>, direction: SortDirection) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
}