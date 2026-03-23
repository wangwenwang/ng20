import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

import { NzConfigService } from 'ng-zorro-antd/core/config';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzSelectModule } from 'ng-zorro-antd/select';

interface ExampleMenuItem {
  readonly label: string;
  readonly path: string;
}

interface ThemeOption {
  readonly label: string;
  readonly value: string;
  readonly primaryColor: string;
}

@Component({
  selector: 'app-examples-layout',
  imports: [FormsModule, RouterOutlet, RouterLink, NzLayoutModule, NzMenuModule, NzSelectModule],
  templateUrl: './examples-layout.component.html',
  styleUrl: './examples-layout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExamplesLayoutComponent {
  private readonly router = inject(Router);
  private readonly nzConfigService = inject(NzConfigService);

  protected readonly menuItems: ExampleMenuItem[] = [
    {
      label: 'Ng Zorro Playground',
      path: '/ng-zorro-playground'
    },
    {
      label: 'Change Zorro Config',
      path: '/change-zorro-config'
    },
    {
      label: 'Table Demo',
      path: '/table-demo'
    }
  ];
  protected readonly themeOptions: ThemeOption[] = [
    {
      label: '默认蓝',
      value: 'default-blue',
      primaryColor: '#1890ff'
    },
    {
      label: '极客蓝',
      value: 'geek-blue',
      primaryColor: '#1677ff'
    },
    {
      label: '紫罗兰',
      value: 'violet',
      primaryColor: '#722ed1'
    },
    {
      label: '青绿色',
      value: 'cyan',
      primaryColor: '#13c2c2'
    },
    {
      label: '活力橙',
      value: 'orange',
      primaryColor: '#fa8c16'
    }
  ];

  protected selectedTheme = this.themeOptions[0]?.value ?? 'default-blue';

  protected onThemeChange(themeValue: string): void {
    this.selectedTheme = themeValue;

    const selectedTheme = this.themeOptions.find(option => option.value === themeValue);

    if (!selectedTheme) {
      return;
    }

    this.nzConfigService.set('theme', { primaryColor: selectedTheme.primaryColor });
  }

  protected isActive(path: string): boolean {
    return this.router.isActive(path, {
      paths: 'exact',
      queryParams: 'ignored',
      matrixParams: 'ignored',
      fragment: 'ignored'
    });
  }
}
