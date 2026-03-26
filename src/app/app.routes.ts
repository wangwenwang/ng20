import { Type, isStandalone } from '@angular/core';
import { Routes } from '@angular/router';

function isStandaloneComponent(value: unknown): value is Type<unknown> {
  return (
    typeof value === 'function' &&
    isStandalone(value as Type<unknown>) &&
    'ɵcmp' in value
  );
}

function pickStandaloneComponent(
  exports: Record<string, unknown>,
  routePath: string
): Type<unknown> {
  const component = Object.values(exports).find(isStandaloneComponent);

  if (!component) {
    throw new Error(`No standalone component export found for route "${routePath}".`);
  }

  return component;
}

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import(
        './features/examples/layouts/examples-layout/examples-layout.component'
      ).then(m => m.ExamplesLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'ng-zorro-playground',
        pathMatch: 'full'
      },
      {
        path: 'ng-zorro-playground',
        loadComponent: () =>
          import(
            './features/examples/pages/ng-zorro-playground/ng-zorro-playground.page'
          ).then(m => pickStandaloneComponent(m, 'ng-zorro-playground'))
      },
      {
        path: 'table-demo',
        loadComponent: () =>
          import('./features/examples/pages/table-demo/table-demo.page').then(
            m => m.TableDemoPageComponent
          )
      },
      {
        path: 'hmi',
        loadComponent: () =>
          import('./features/examples/pages/hmi/hmi.page').then(
            m => m.HmiPageComponent
          )
      }
    ]
  }
];
