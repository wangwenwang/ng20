import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  Output,
  Renderer2,
  SimpleChanges,
  booleanAttribute,
  inject
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { AppTableDirective } from './app-table.directive';

export interface AppTableColumnResizeEvent {
  key: string;
  width: number;
  deltaX: number;
}

@Directive({
  selector: 'th[appResizableColumn]',
  standalone: true
})
export class AppResizableColumnDirective implements AfterViewInit, OnChanges, OnDestroy {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly ngZone = inject(NgZone);
  private readonly document = inject(DOCUMENT);
  private readonly table = inject(AppTableDirective, { optional: true });

  private handleElement?: HTMLSpanElement;
  private removePointerDownListener?: () => void;
  private removeHandleClickListener?: () => void;
  private removePointerMoveListener?: () => void;
  private removePointerUpListener?: () => void;
  private removePointerCancelListener?: () => void;
  private startX = 0;
  private startWidth = 0;
  private currentWidth = 0;
  private activePointerId?: number;
  private dragging = false;
  private initialized = false;
  private suppressNextClick = false;
  private clearClickSuppressionTimer?: number;
  private bodyUserSelect = '';
  private bodyCursor = '';
  private readonly hostClickCaptureListener = (event: Event): void => {
    if (!this.suppressNextClick) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    this.scheduleClickSuppressionClear();
  };

  @HostBinding('class.app-table__resizable-column')
  protected readonly hostClass = true;

  @HostBinding('class.app-table__resizable-column--dragging')
  protected get draggingClass(): boolean {
    return this.dragging;
  }

  @Input('appResizableColumn')
  appResizableColumn = '';

  @Input()
  appResizableMinWidth?: number;

  @Input()
  appResizableMaxWidth?: number;

  @Input({ transform: booleanAttribute })
  appResizableDisabled = false;

  @Output()
  readonly appColumnResizeStart = new EventEmitter<AppTableColumnResizeEvent>();

  @Output()
  readonly appColumnResize = new EventEmitter<AppTableColumnResizeEvent>();

  @Output()
  readonly appColumnResizeEnd = new EventEmitter<AppTableColumnResizeEvent>();

  ngAfterViewInit(): void {
    this.initialized = true;
    this.ensureHandle();
    this.applyInitialStyles();
    this.syncHandleState();
    this.hostElement.addEventListener('click', this.hostClickCaptureListener, true);
  }

  ngOnChanges(_changes: SimpleChanges): void {
    if (!this.initialized) {
      return;
    }

    this.syncHandleState();
  }

  ngOnDestroy(): void {
    this.stopDragging();
    this.removePointerDownListener?.();
    this.removeHandleClickListener?.();
    this.hostElement.removeEventListener('click', this.hostClickCaptureListener, true);
    this.clearClickSuppression();
  }

  private ensureHandle(): void {
    if (this.handleElement) {
      return;
    }

    const handle = this.renderer.createElement('span') as HTMLSpanElement;
    this.renderer.addClass(handle, 'app-table__resize-handle');
    this.renderer.setAttribute(handle, 'aria-hidden', 'true');
    this.renderer.setStyle(handle, 'position', 'absolute');
    this.renderer.setStyle(handle, 'top', '0');
    this.renderer.setStyle(handle, 'right', '0');
    this.renderer.setStyle(handle, 'width', `${this.resolveHandleWidth()}px`);
    this.renderer.setStyle(handle, 'height', '100%');
    this.renderer.setStyle(handle, 'cursor', 'col-resize');
    this.renderer.setStyle(handle, 'user-select', 'none');
    this.renderer.setStyle(handle, 'touch-action', 'none');
    this.renderer.setStyle(handle, 'z-index', '1');

    const grip = this.renderer.createElement('span') as HTMLSpanElement;
    this.renderer.setStyle(grip, 'position', 'absolute');
    this.renderer.setStyle(grip, 'top', '50%');
    this.renderer.setStyle(grip, 'left', '50%');
    this.renderer.setStyle(grip, 'transform', 'translate(-50%, -50%)');
    this.renderer.setStyle(grip, 'width', '2px');
    this.renderer.setStyle(grip, 'height', '24px');
    this.renderer.setStyle(grip, 'border-radius', '999px');
    this.renderer.setStyle(grip, 'background', '#d9d9d9');
    this.renderer.appendChild(handle, grip);

    this.removePointerDownListener = this.renderer.listen(
      handle,
      'pointerdown',
      (event: PointerEvent) => this.onPointerDown(event)
    );
    this.removeHandleClickListener = this.renderer.listen(handle, 'click', (event: MouseEvent) =>
      this.onHandleClick(event)
    );

    this.renderer.appendChild(this.hostElement, handle);
    this.handleElement = handle;
  }

  private applyInitialStyles(): void {
    this.renderer.setStyle(this.hostElement, 'position', 'relative');
    this.renderer.setStyle(this.hostElement, 'overflow', 'visible');
  }

  private syncHandleState(): void {
    if (!this.handleElement) {
      return;
    }

    this.renderer.setStyle(this.handleElement, 'display', this.isDisabled() ? 'none' : 'block');
    this.renderer.setStyle(this.handleElement, 'width', `${this.resolveHandleWidth()}px`);
  }

  private onPointerDown(event: PointerEvent): void {
    if (this.isDisabled()) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    this.dragging = true;
    this.suppressNextClick = true;
    this.startX = event.clientX;
    this.startWidth = this.measureWidth();
    this.currentWidth = this.startWidth;
    this.activePointerId = event.pointerId;
    this.cacheBodyState();
    this.clearClickSuppression();

    this.handleElement?.setPointerCapture?.(event.pointerId);

    this.renderer.addClass(this.hostElement, 'app-table__resizable-column--active');
    this.renderer.setStyle(this.document.body, 'cursor', 'col-resize');
    this.renderer.setStyle(this.document.body, 'user-select', 'none');

    this.emitResize(this.appColumnResizeStart, 0, this.startWidth);
    this.bindDraggingListeners();
  }

  private bindDraggingListeners(): void {
    this.stopDraggingListeners();

    this.ngZone.runOutsideAngular(() => {
      this.removePointerMoveListener = this.renderer.listen(
        this.document,
        'pointermove',
        (event: PointerEvent) => this.onPointerMove(event)
      );
      this.removePointerUpListener = this.renderer.listen(
        this.document,
        'pointerup',
        (event: PointerEvent) => this.onPointerUp(event)
      );
      this.removePointerCancelListener = this.renderer.listen(
        this.document,
        'pointercancel',
        (event: PointerEvent) => this.onPointerUp(event)
      );
    });
  }

  private onPointerMove(event: PointerEvent): void {
    if (!this.dragging) {
      return;
    }

    const deltaX = event.clientX - this.startX;
    const nextWidth = this.clampWidth(this.startWidth + deltaX);

    if (nextWidth === this.currentWidth) {
      return;
    }

    this.currentWidth = nextWidth;
    this.applyWidth(nextWidth);

    this.ngZone.run(() => {
      this.emitResize(this.appColumnResize, deltaX, nextWidth);
    });
  }

  private onPointerUp(event: PointerEvent): void {
    if (!this.dragging) {
      return;
    }

    const deltaX = event.clientX - this.startX;
    const nextWidth = this.clampWidth(this.startWidth + deltaX);
    this.applyWidth(nextWidth);

    this.ngZone.run(() => {
      this.emitResize(this.appColumnResizeEnd, deltaX, nextWidth);
    });

    this.stopDragging();
    this.scheduleClickSuppressionClear();
  }

  private stopDragging(): void {
    this.dragging = false;
    if (
      typeof this.activePointerId === 'number' &&
      this.handleElement?.hasPointerCapture?.(this.activePointerId)
    ) {
      this.handleElement.releasePointerCapture(this.activePointerId);
    }

    this.activePointerId = undefined;
    this.renderer.removeClass(this.hostElement, 'app-table__resizable-column--active');
    this.restoreBodyState();
    this.stopDraggingListeners();
  }

  private stopDraggingListeners(): void {
    this.removePointerMoveListener?.();
    this.removePointerMoveListener = undefined;
    this.removePointerUpListener?.();
    this.removePointerUpListener = undefined;
    this.removePointerCancelListener?.();
    this.removePointerCancelListener = undefined;
  }

  private emitResize(
    emitter: EventEmitter<AppTableColumnResizeEvent>,
    deltaX: number,
    width: number
  ): void {
    emitter.emit({
      key: this.appResizableColumn,
      width,
      deltaX
    });
  }

  private applyWidth(width: number): void {
    const widthPx = `${width}px`;
    this.renderer.setStyle(this.hostElement, 'width', widthPx);
    this.renderer.setStyle(this.hostElement, 'min-width', widthPx);
    this.renderer.setStyle(this.hostElement, 'max-width', widthPx);
    this.renderer.setAttribute(this.hostElement, 'data-app-column-width', `${width}`);
    this.syncRenderedColumnWidth(widthPx);
  }

  private measureWidth(): number {
    return Math.round(this.hostElement.getBoundingClientRect().width);
  }

  private clampWidth(width: number): number {
    const minWidth = this.appResizableMinWidth ?? this.table?.appTableMinColumnWidth ?? 120;
    const maxWidth = this.appResizableMaxWidth;

    if (typeof maxWidth === 'number') {
      return Math.max(minWidth, Math.min(maxWidth, Math.round(width)));
    }

    return Math.max(minWidth, Math.round(width));
  }

  private resolveHandleWidth(): number {
    return this.table?.appTableResizeHandleWidth ?? 10;
  }

  private isDisabled(): boolean {
    return this.appResizableDisabled || this.table?.appTableResizable === false;
  }

  private cacheBodyState(): void {
    this.bodyCursor = this.document.body.style.cursor;
    this.bodyUserSelect = this.document.body.style.userSelect;
  }

  private restoreBodyState(): void {
    this.renderer.setStyle(this.document.body, 'cursor', this.bodyCursor);
    this.renderer.setStyle(this.document.body, 'user-select', this.bodyUserSelect);
  }

  private onHandleClick(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    this.scheduleClickSuppressionClear();
  }

  private scheduleClickSuppressionClear(): void {
    this.clearClickSuppression();
    this.clearClickSuppressionTimer = this.document.defaultView?.setTimeout(() => {
      this.suppressNextClick = false;
      this.clearClickSuppressionTimer = undefined;
    }, 0);
  }

  private clearClickSuppression(): void {
    if (typeof this.clearClickSuppressionTimer === 'number') {
      this.document.defaultView?.clearTimeout(this.clearClickSuppressionTimer);
      this.clearClickSuppressionTimer = undefined;
    }
  }

  private syncRenderedColumnWidth(widthPx: string): void {
    const columnIndex = this.resolveColumnIndex();
    const tableHost = this.hostElement.closest('nz-table');

    if (columnIndex < 0 || !tableHost) {
      return;
    }

    for (const colgroup of Array.from(tableHost.querySelectorAll('colgroup'))) {
      const column = colgroup.children.item(columnIndex);
      if (!(column instanceof HTMLElement)) {
        continue;
      }

      this.renderer.setStyle(column, 'width', widthPx);
      this.renderer.setStyle(column, 'min-width', widthPx);
      this.renderer.setStyle(column, 'max-width', widthPx);
    }

    for (const row of Array.from(tableHost.querySelectorAll('tr'))) {
      const cell = row.children.item(columnIndex);
      if (!(cell instanceof HTMLElement) || cell === this.hostElement) {
        continue;
      }

      this.renderer.setStyle(cell, 'width', widthPx);
      this.renderer.setStyle(cell, 'min-width', widthPx);
      this.renderer.setStyle(cell, 'max-width', widthPx);
    }
  }

  private resolveColumnIndex(): number {
    const row = this.hostElement.parentElement;

    if (!row) {
      return -1;
    }

    return Array.from(row.children).indexOf(this.hostElement);
  }

  private get hostElement(): HTMLElement {
    return this.elementRef.nativeElement;
  }
}
