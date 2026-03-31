export const APP_THEME_CLASSES = [
  'theme-default',
  'theme-orange-light',
  'theme-orange-dark',
  'theme-violet',
  'theme-cyan',
  'theme-blue',
  'theme-green'
] as const;

export type AppThemeClass = (typeof APP_THEME_CLASSES)[number];
export type ThemeAppearance = 'light' | 'dark';
export type AppliedAppThemeClass = Exclude<AppThemeClass, 'theme-default'>;

export const APPLIED_APP_THEME_CLASSES: ReadonlyArray<AppliedAppThemeClass> = APP_THEME_CLASSES.filter(
  (themeClass): themeClass is AppliedAppThemeClass => themeClass !== 'theme-default'
);

export interface ExampleThemeOption {
  readonly label: string;
  readonly value: string;
  readonly primaryColor: string;
  readonly appTheme: AppThemeClass;
  readonly appearance: ThemeAppearance;
}

export const EXAMPLE_THEME_OPTIONS: ReadonlyArray<ExampleThemeOption> = [
  {
    label: '晨曦橙',
    value: 'theme-orange-light',
    primaryColor: '#fa8c16',
    appTheme: 'theme-orange-light',
    appearance: 'light'
  },
  {
    label: '紫罗兰',
    value: 'violet',
    primaryColor: '#722ed1',
    appTheme: 'theme-violet',
    appearance: 'light'
  },
  {
    label: '青绿色',
    value: 'cyan',
    primaryColor: '#13c2c2',
    appTheme: 'theme-cyan',
    appearance: 'light'
  },
  {
    label: '海洋蓝',
    value: 'blue',
    primaryColor: '#1677ff',
    appTheme: 'theme-blue',
    appearance: 'light'
  },
  {
    label: '森林绿',
    value: 'green',
    primaryColor: '#52c41a',
    appTheme: 'theme-green',
    appearance: 'light'
  }
];
