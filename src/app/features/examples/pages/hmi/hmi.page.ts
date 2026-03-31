import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { EXAMPLE_THEME_OPTIONS, type AppThemeClass } from '../../shared/example-themes';

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
export class HmiPageComponent {
  protected readonly themeOptions = EXAMPLE_THEME_OPTIONS;

  protected selectedTheme: HmiTheme = 'theme-orange-light';
  protected currentAppTheme: AppThemeClass = 'theme-orange-light';
  protected date: Date[] | null = null;
  protected isPreviewModalVisible = false;
  protected themeRenderKey = 0;

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
    console.log(selectedTheme);
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
