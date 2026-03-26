import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { generate as generateAntColorPalette } from '@ant-design/colors';

import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';

type ThemeValue = 'theme-default' | 'theme-orange-light' | 'theme-orange-dark' | 'theme-sky';

interface ExampleMenuItem {
  readonly label: string;
  readonly path: string;
}

interface ThemeOption {
  readonly label: string;
  readonly value: ThemeValue;
  readonly primaryColor: string;
  readonly appTheme: ThemeValue;
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
  private readonly appThemeClasses = ['theme-orange-light', 'theme-orange-dark', 'theme-sky', 'theme-default'] as const;

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
      label: '橙黑',
      value: 'theme-orange-dark',
      primaryColor: '#db501a',
      appTheme: 'theme-orange-dark',
    },
    {
      label: '橙白',
      value: 'theme-orange-light',
      primaryColor: '#fa8c16',
      appTheme: 'theme-orange-light',
    },
    {
      label: '默认',
      value: 'theme-default',
      primaryColor: '#722ed1',
      appTheme: 'theme-default',
    },
    {
      label: '天空',
      value: 'theme-sky',
      primaryColor: '#13c2c2',
      appTheme: 'theme-sky',
    },
  ];

  protected selectedTheme = this.themeOptions[0]?.value;
  protected currentAppTheme: ThemeOption['appTheme'] = 'theme-orange-light';

  /** 与当前主题一致，且已写入 `:root` 的 `--primary-color-1`～`--primary-color-10`。 */
  protected primaryColorPalette: readonly string[] = generateAntColorPalette(
    this.themeOptions[0]?.primaryColor ?? '#722ed1'
  );

  constructor() {
    const defaultTheme = this.themeOptions[0];

    if (defaultTheme) {
      this.applyTheme(defaultTheme);
    }
  }

  protected onThemeChange(themeValue: ThemeValue): void {
    if (!this.themeOptions.some(option => option.value === themeValue)) {
      return;
    }

    this.selectedTheme = themeValue;
    this.applyTheme(this.themeOptions.find(option => option.value === themeValue)!);
  }

  protected get isOrangeLightTheme(): boolean {
    return this.currentAppTheme === 'theme-orange-light';
  }

  private applyTheme(theme: ThemeOption): void {
    const root = this.document.documentElement;

    root.classList.remove(...this.appThemeClasses);
    root.classList.add(theme.appTheme);
    this.currentAppTheme = theme.appTheme;

    const palette = generateAntColorPalette(theme.primaryColor);
    this.primaryColorPalette = palette;
    root.style.setProperty('--portal-primary-color', theme.primaryColor);
    for (let i = 0; i < palette.length; i += 1) {
      root.style.setProperty(`--portal-primary-color-${i + 1}`, palette[i]!);
    }
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
