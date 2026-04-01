import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { ExampleLayoutThemeSyncService } from '../../shared/example-layout-theme-sync.service';
import {
  EXAMPLE_THEME_OPTIONS,
  getExampleThemeOptionFromDocument,
  type AppThemeClass,
  type ExampleThemeOption
} from '../../shared/example-themes';

type HmiTheme = (typeof EXAMPLE_THEME_OPTIONS)[number]['value'];

@Component({
  selector: 'app-hmi-page',
  imports: [FormsModule, NzButtonModule, NzDatePickerModule, NzModalModule, NzSelectModule],
  templateUrl: './hmi.page.html',
  styleUrl: './hmi.page.less',
  host: {
    '[class.theme-orange-light]': "currentAppTheme === 'theme-orange-light'",
    '[class.theme-violet]': "currentAppTheme === 'theme-violet'",
    '[class.theme-cyan]': "currentAppTheme === 'theme-cyan'",
    '[class.theme-blue]': "currentAppTheme === 'theme-blue'",
    '[class.theme-green]': "currentAppTheme === 'theme-green'"
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HmiPageComponent implements OnInit {
  private readonly document = inject(DOCUMENT);
  private readonly layoutThemeSync = inject(ExampleLayoutThemeSyncService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly themeOptions = EXAMPLE_THEME_OPTIONS;

  protected selectedTheme: HmiTheme = 'theme-orange-light';
  protected currentAppTheme: AppThemeClass = 'theme-orange-light';
  protected date: Date[] | null = null;
  protected isPreviewModalVisible = false;
  protected themeRenderKey = 0;

  ngOnInit(): void {
    this.syncFromDocument();

    this.layoutThemeSync.layoutThemeChanged$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(theme => {
        this.applyThemeFromLayout(theme);
      });
  }

  /** 仅响应 layout 侧全局主题；不调用此方法时 HMI 本地切换不会影响 layout。 */
  private applyThemeFromLayout(theme: ExampleThemeOption): void {
    this.selectedTheme = theme.value as HmiTheme;
    this.currentAppTheme = theme.appTheme;
    this.themeRenderKey += 1;
    this.cdr.markForCheck();
  }

  private syncFromDocument(): void {
    const option = getExampleThemeOptionFromDocument(this.document.documentElement);
    this.applyThemeFromLayout(option);
  }

  protected onThemeChange(theme: HmiTheme | string | null): void {
    if (!theme) {
      return;
    }

    const selectedTheme = this.themeOptions.find(option => option.value === theme);

    if (!selectedTheme) {
      return;
    }

    this.selectedTheme = selectedTheme.value;
    this.currentAppTheme = selectedTheme.appTheme;
    this.themeRenderKey += 1;
  }

  protected openPreviewModal(): void {
    this.isPreviewModalVisible = true;
  }

  protected closePreviewModal(): void {
    this.isPreviewModalVisible = false;
  }

  protected onChange(value: Date[] | null): void {
    this.date = value;
  }
}
