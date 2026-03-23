import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';

interface ExampleMenuItem {
  readonly label: string;
  readonly path: string;
}

@Component({
  selector: 'app-examples-layout',
  imports: [RouterOutlet, RouterLink, NzLayoutModule, NzMenuModule],
  templateUrl: './examples-layout.component.html',
  styleUrl: './examples-layout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExamplesLayoutComponent {
  private readonly router = inject(Router);

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

  protected isActive(path: string): boolean {
    return this.router.isActive(path, {
      paths: 'exact',
      queryParams: 'ignored',
      matrixParams: 'ignored',
      fragment: 'ignored'
    });
  }
}
