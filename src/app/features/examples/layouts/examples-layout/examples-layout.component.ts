import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

import { NzConfigService } from 'ng-zorro-antd/core/config';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import {
  APPLIED_APP_THEME_CLASSES,
  EXAMPLE_THEME_OPTIONS,
  type ExampleThemeOption
} from '../../shared/example-themes';

interface ExampleMenuItem {
  readonly label: string;
  readonly path: string;
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
  private readonly appThemeClasses = APPLIED_APP_THEME_CLASSES;

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
  protected readonly themeOptions = EXAMPLE_THEME_OPTIONS;

  protected selectedTheme = this.themeOptions[0]?.value ?? 'theme-orange-light';
  protected currentAppTheme: ExampleThemeOption['appTheme'] = 'theme-orange-light';
  protected currentAppearance: ExampleThemeOption['appearance'] = 'light';

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
    return this.currentAppTheme === 'theme-orange-light';
  }

  private applyTheme(theme: ExampleThemeOption): void {
    const root = this.document.documentElement;

    this.currentAppTheme = theme.appTheme;
    this.currentAppearance = theme.appearance;
    root.classList.remove(...this.appThemeClasses);

    if (theme.appTheme !== 'theme-default') {
      root.classList.add(theme.appTheme);
    }

    root.removeAttribute('data-app-theme');
    // this.nzConfigService.set('theme', { primaryColor: theme.primaryColor });
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
