import { TemplateRef } from '@angular/core';

export type AppTableSize = 'default' | 'middle' | 'small';

export interface AppTableScrollConfig {
  x?: string | null;
  y?: string | null;
}

export interface AppTableCellContext<T extends object> {
  $implicit: T;
  column: AppTableColumn<T>;
  index: number;
  value: unknown;
}

export interface AppTableColumn<T extends object> {
  key: keyof T | string;
  title: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  ellipsis?: boolean;
  valueGetter?: (row: T, index: number) => unknown;
  cellTemplate?: TemplateRef<AppTableCellContext<T>>;
}
