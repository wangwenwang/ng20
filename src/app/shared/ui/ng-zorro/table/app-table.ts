import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output
} from '@angular/core';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';

import {
  AppTableCellContext,
  AppTableColumn,
  AppTableScrollConfig,
  AppTableSize
} from './app-table.types';

@Component({
  selector: 'app-table',
  imports: [CommonModule, NzTableModule],
  templateUrl: './app-table.html',
  styleUrl: './app-table.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppTableComponent<T extends object = Record<string, unknown>> {
  readonly columns = input<readonly AppTableColumn<T>[]>([]);
  readonly data = input<readonly T[]>([]);
  readonly loading = input(false);
  readonly bordered = input(false);
  readonly frontPagination = input(true);
  readonly showPagination = input(true);
  readonly pageIndex = input(1);
  readonly pageSize = input(10);
  readonly total = input(0);
  readonly pageSizeOptions = input<readonly number[]>([10, 20, 50, 100]);
  readonly showSizeChanger = input(false);
  readonly showQuickJumper = input(false);
  readonly hideOnSinglePage = input(false);
  readonly paginationPosition = input<'top' | 'bottom' | 'both'>('bottom');
  readonly size = input<AppTableSize>('default');
  readonly scroll = input<AppTableScrollConfig | null>(null);
  readonly noResult = input('暂无数据');

  readonly pageIndexChange = output<number>();
  readonly pageSizeChange = output<number>();
  readonly queryParamsChange = output<NzTableQueryParams>();
  readonly currentPageDataChange = output<T[]>();

  protected readonly normalizedPageSizeOptions = computed(() => [...this.pageSizeOptions()]);
  protected readonly normalizedScroll = computed(() => this.scroll() ?? {});

  protected getCellValue(row: T, column: AppTableColumn<T>, index: number): unknown {
    if (column.valueGetter) {
      return column.valueGetter(row, index);
    }

    return (row as Record<string, unknown>)[column.key as string];
  }

  protected getCellContext(
    row: T,
    column: AppTableColumn<T>,
    index: number
  ): AppTableCellContext<T> {
    return {
      $implicit: row,
      column,
      index,
      value: this.getCellValue(row, column, index)
    };
  }

  protected getColumnWidth(column: AppTableColumn<T>): string | null {
    return column.width ?? null;
  }

  protected getColumnAlign(column: AppTableColumn<T>): 'left' | 'center' | 'right' | null {
    return column.align ?? null;
  }

  protected onPageIndexChange(pageIndex: number): void {
    this.pageIndexChange.emit(pageIndex);
  }

  protected onPageSizeChange(pageSize: number): void {
    this.pageSizeChange.emit(pageSize);
  }

  protected onQueryParamsChange(params: NzTableQueryParams): void {
    this.queryParamsChange.emit(params);
  }

  protected onCurrentPageDataChange(data: readonly T[]): void {
    this.currentPageDataChange.emit([...data]);
  }
}
