import { ChangeDetectionStrategy, Component, ElementRef, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzConfigService } from 'ng-zorro-antd/core/config';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';

type HmiTheme = 'orange-light' | 'orange-dark';

@Component({
  selector: 'app-hmi-page',
  imports: [FormsModule, NzButtonModule, NzDatePickerModule, NzModalModule, NzSelectModule],
  templateUrl: './hmi.page.html',
  styleUrl: './hmi.page.less',
  host: {
    '[class.orange-light]': "selectedTheme === 'orange-light'",
    '[class.orange-dark]': "selectedTheme === 'orange-dark'"
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HmiPageComponent {
  private readonly document = inject(DOCUMENT);
  private readonly hostEl = inject(ElementRef<HTMLElement>);
  private readonly nzConfigService = inject(NzConfigService);

  protected readonly themeOptions: ReadonlyArray<{ label: string; value: HmiTheme }> = [
    { label: '晨曦橙', value: 'orange-light' },
    { label: '暮夜橙', value: 'orange-dark' }
  ];

  protected selectedTheme: HmiTheme = 'orange-light';
  protected date: Date[] | null = null;
  protected isPreviewModalVisible = false;
  protected themeRenderKey = 0;
  protected get overlayThemeClassNames(): string[] {
    return ['hmi-overlay-theme', this.selectedTheme];
  }
  protected get overlayThemeWrapClassName(): string {
    return `hmi-overlay-theme ${this.selectedTheme}`;
  }

  protected onThemeChange(theme: HmiTheme | string | null): void {
    if (theme !== 'orange-light' && theme !== 'orange-dark') {
      return;
    }

    this.selectedTheme = theme;
    this.themeRenderKey += 1;
    this.applyAntPrimaryTheme(theme);
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

  constructor() {
    // 首次进入页面时，应用默认主题的 ant primaryColor。
    this.applyAntPrimaryTheme(this.selectedTheme);
  }

  private applyAntPrimaryTheme(theme: HmiTheme): void {
    // ng-zorro dynamic theme CSS variables are written to :root(html) by NzConfigService.
    // If you want variables to be scoped to <app-hmi-page>, mirror the generated --ant-* variables to host.
    const primaryColor = theme === 'orange-light' ? '#fa8c16' : '#78359e';
    this.nzConfigService.set('theme', { primaryColor });

    // Let ng-zorro update :root styles first, then copy them to the host element.
    requestAnimationFrame(() => this.copyNzThemeVarsToHost());
  }

  private copyNzThemeVarsToHost(): void {
    const host = this.hostEl.nativeElement;
    const root = this.document.documentElement;

    if (!host || !root) {
      return;
    }

    const css = getComputedStyle(root);

    const primaryPaletteKeys: string[] = Array.from({ length: 10 }, (_, i) => `primary-${i + 1}`);
    const keys = [
      'primary-color',
      'primary-color-disabled',
      'primary-color-hover',
      'primary-color-active',
      'primary-color-outline',
      'primary-color-deprecated-bg',
      'primary-color-deprecated-border',
      ...primaryPaletteKeys,
      'primary-color-deprecated-l-35',
      'primary-color-deprecated-l-20',
      'primary-color-deprecated-t-20',
      'primary-color-deprecated-t-50',
      'primary-color-deprecated-f-12',
      'primary-color-active-deprecated-f-30',
      'primary-color-active-deprecated-d-02'
    ];

    for (const key of keys) {
      const varName = `--ant-${key}`;
      const value = css.getPropertyValue(varName).trim();
      if (value) {
        host.style.setProperty(varName, value);
      }
    }
  }
}
