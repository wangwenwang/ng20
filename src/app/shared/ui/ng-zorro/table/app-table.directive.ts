import { Directive, Input, booleanAttribute } from '@angular/core';

@Directive({
  selector: 'nz-table[appTable]',
  standalone: true,
  exportAs: 'appTable',
  host: {
    class: 'app-table-host',
    '[class.app-table-host--resizable]': 'appTableResizable'
  }
})
export class AppTableDirective<T extends object = Record<string, unknown>> {
  @Input({ transform: booleanAttribute })
  appTableResizable = true;

  @Input()
  appTableMinColumnWidth = 120;

  @Input()
  appTableResizeHandleWidth = 10;
}
