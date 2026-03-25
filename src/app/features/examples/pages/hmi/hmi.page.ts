import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';

type HmiTheme = 'orange-light' | 'orange-dark';

@Component({
  selector: 'app-hmi-page',
  imports: [FormsModule, NzButtonModule, NzModalModule, NzSelectModule],
  templateUrl: './hmi.page.html',
  styleUrl: './hmi.page.less',
  host: {
    '[class.orange-light]': "selectedTheme === 'orange-light'",
    '[class.orange-dark]': "selectedTheme === 'orange-dark'"
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HmiPageComponent {
  protected readonly themeOptions: ReadonlyArray<{ label: string; value: HmiTheme }> = [
    { label: '晨曦橙', value: 'orange-light' },
    { label: '暮夜橙', value: 'orange-dark' }
  ];

  protected selectedTheme: HmiTheme = 'orange-light';
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
  }

  protected openPreviewModal(): void {
    this.isPreviewModalVisible = true;
  }

  protected closePreviewModal(): void {
    this.isPreviewModalVisible = false;
  }
}
