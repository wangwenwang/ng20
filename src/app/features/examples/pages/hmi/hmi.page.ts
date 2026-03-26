import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';

import { NzDemoMenuInlineComponent } from '../../ng-zorro-official-demos/menu/nz-demo-menu-inline.component';

type HmiTheme = 'theme-orange-light' | 'theme-orange-dark';

@Component({
  selector: 'app-hmi-page',
  imports: [FormsModule, NzButtonModule, NzDatePickerModule, NzDemoMenuInlineComponent, NzModalModule, NzSelectModule],
  templateUrl: './hmi.page.html',
  styleUrl: './hmi.page.less',
  host: {
    '[class.theme-orange-light]': "selectedTheme === 'theme-orange-light'",
    '[class.theme-orange-dark]': "selectedTheme === 'theme-orange-dark'"
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HmiPageComponent {
  protected readonly themeOptions: ReadonlyArray<{ label: string; value: HmiTheme }> = [
    { label: '晨曦橙', value: 'theme-orange-light' },
    { label: '暮夜橙', value: 'theme-orange-dark' }
  ];

  protected selectedTheme: HmiTheme = 'theme-orange-light';
  protected date: Date[] | null = null;
  protected isPreviewModalVisible = false;
  protected themeRenderKey = 0;

  protected onThemeChange(theme: HmiTheme | string | null): void {
    if (theme !== 'theme-orange-light' && theme !== 'theme-orange-dark') {
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

  protected onChange(value: Date[] | null): void {
    this.date = value;
  }
}
