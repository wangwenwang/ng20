import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import type { ExampleThemeOption } from './example-themes';

/**
 * 仅由 examples layout 在切换全局文档主题时发出事件，供子路由页面（如 HMI）同步 UI。
 * HMI 等页面本地改主题时不应调用 {@link emitFromLayout}，以免反向影响 layout。
 */
@Injectable({ providedIn: 'root' })
export class ExampleLayoutThemeSyncService {
  private readonly layoutThemeChanged = new Subject<ExampleThemeOption>();

  readonly layoutThemeChanged$: Observable<ExampleThemeOption> = this.layoutThemeChanged.asObservable();

  emitFromLayout(theme: ExampleThemeOption): void {
    this.layoutThemeChanged.next(theme);
  }
}
