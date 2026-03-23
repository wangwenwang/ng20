import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzConfigService } from 'ng-zorro-antd/core/config';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'app-change-zorro-config-page',
  imports: [FormsModule, NzButtonModule, NzCardModule, NzInputModule, NzSelectModule],
  templateUrl: './change-zorro-config.page.html',
  styleUrl: './change-zorro-config.page.less',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangeZorroConfigPageComponent {
  private readonly nzConfigService = inject(NzConfigService);

  protected readonly defaultPrimaryColor = '#1890ff';
  protected readonly lessVariableName = '@demo-panel-color';
  protected readonly lessVariableSource = 'src/styles/themes/default.less';
  protected readonly presetColors = [
    '#1890ff',
    '#1677ff',
    '#722ed1',
    '#13c2c2',
    '#52c41a',
    '#fa8c16',
    '#f5222d'
  ];
  protected readonly sampleCode =
    "this.nzConfigService.set('theme', { primaryColor: '#1890ff' });";

  protected primaryColor = this.defaultPrimaryColor;
  protected selectedUser = 'lucy';

  protected onChangeConfig(color = this.primaryColor): void {
    const normalizedColor = color.trim();

    if (!this.isHexColor(normalizedColor)) {
      return;
    }

    this.primaryColor = normalizedColor;
    this.nzConfigService.set('theme', { primaryColor: normalizedColor });
  }

  protected usePreset(color: string): void {
    this.onChangeConfig(color);
  }

  protected resetTheme(): void {
    this.onChangeConfig(this.defaultPrimaryColor);
  }

  private isHexColor(color: string): boolean {
    return /^#([0-9a-fA-F]{6})$/.test(color);
  }
}
