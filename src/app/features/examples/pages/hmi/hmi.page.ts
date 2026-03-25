import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';

type HmiTheme = 'orange-light' | 'orange-dark';

@Component({
  selector: 'app-hmi-page',
  imports: [FormsModule, NzButtonModule, NzSelectModule],
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
  protected readonly stationOptions = [
    { label: '一号产线', value: 'line-1' },
    { label: '二号产线', value: 'line-2' },
    { label: '三号产线', value: 'line-3' }
  ];

  protected selectedTheme: HmiTheme = 'orange-light';
  protected selectedStation = this.stationOptions[0]?.value ?? 'line-1';
  protected themeRenderKey = 0;
  protected get overlayThemeClassNames(): string[] {
    return ['hmi-overlay-theme', this.selectedTheme];
  }

  protected onThemeChange(theme: HmiTheme | string | null): void {
    if (theme !== 'orange-light' && theme !== 'orange-dark') {
      return;
    }

    this.selectedTheme = theme;
    this.themeRenderKey += 1;
  }
}
