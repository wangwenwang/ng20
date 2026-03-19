import { Routes } from '@angular/router';

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
          ).then(m => m.NzDemoTableRowSelectionCustomComponent)
      },
      {
        path: 'table-demo',
        loadComponent: () =>
          import('./features/examples/pages/table-demo/table-demo.page').then(
            m => m.TableDemoPageComponent
          )
      }
    ]
  }
];
