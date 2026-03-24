import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

import { NzConfigService } from 'ng-zorro-antd/core/config';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';

interface ExampleMenuItem {
  readonly label: string;
  readonly path: string;
}

interface ThemeOption {
  readonly label: string;
  readonly value: string;
  readonly primaryColor: string;
  readonly appTheme: 'default' | 'orange-light' | 'orange-dark';
  readonly appearance: 'light' | 'dark';
}

@Component({
  selector: 'app-examples-layout',
  imports: [FormsModule, RouterOutlet, RouterLink, NzLayoutModule, NzMenuModule, NzSelectModule, NzButtonModule],
  templateUrl: './examples-layout.component.html',
  styleUrl: './examples-layout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExamplesLayoutComponent {
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly nzConfigService = inject(NzConfigService);
  private readonly appThemeClasses = ['orange-light', 'orange-dark'] as const;

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
    },
    {
      label: 'HMI 页面',
      path: '/hmi'
    }
  ];
  protected readonly themeOptions: ThemeOption[] = [
    {
      label: '紫罗兰',
      value: 'violet',
      primaryColor: '#722ed1',
      appTheme: 'default',
      appearance: 'light'
    },
    {
      label: '青绿色',
      value: 'cyan',
      primaryColor: '#13c2c2',
      appTheme: 'default',
      appearance: 'light'
    },
    {
      label: '晨曦橙',
      value: 'orange-light',
      primaryColor: '#fa8c16',
      appTheme: 'orange-light',
      appearance: 'light'
    },
    {
      label: '暮夜橙',
      value: 'orange-dark',
      primaryColor: '#fa8c16',
      appTheme: 'orange-dark',
      appearance: 'dark'
    }
  ];

  protected selectedTheme = this.themeOptions[0]?.value ?? 'orange-light';
  protected currentAppTheme: ThemeOption['appTheme'] = 'orange-light';
  protected currentAppearance: ThemeOption['appearance'] = 'light';

  constructor() {
    const defaultTheme = this.themeOptions[0];

    if (defaultTheme) {
      this.applyTheme(defaultTheme);
    }
  }

  protected onThemeChange(themeValue: string): void {
    this.selectedTheme = themeValue;

    const selectedTheme = this.themeOptions.find(option => option.value === themeValue);

    if (!selectedTheme) {
      return;
    }

    this.applyTheme(selectedTheme);
  }

  protected get isDarkTheme(): boolean {
    return this.currentAppearance === 'dark';
  }

  protected get isOrangeLightTheme(): boolean {
    return this.currentAppTheme === 'orange-light';
  }

  private applyTheme(theme: ThemeOption): void {
    const root = this.document.documentElement;

    this.currentAppTheme = theme.appTheme;
    this.currentAppearance = theme.appearance;
    root.classList.remove(...this.appThemeClasses);

    if (theme.appTheme !== 'default') {
      root.classList.add(theme.appTheme);
    }

    root.removeAttribute('data-app-theme');
    this.nzConfigService.set('theme', { primaryColor: theme.primaryColor });
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
