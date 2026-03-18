import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/examples/pages/table-demo/table-demo.page').then(
        m => m.TableDemoPageComponent
      )
  }
];
