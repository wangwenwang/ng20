import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NzMenuModule } from 'ng-zorro-antd/menu';

@Component({
  selector: 'nz-demo-menu-inline',
  standalone: true,
  imports: [NzMenuModule],
  template: `
    <ul nz-menu nzMode="inline" class="nz-demo-menu-inline">
      <li nz-submenu nzTitle="Navigation One" nzOpen>
        <ul>
          <li nz-menu-group nzTitle="Item 1">
            <ul>
              <li nz-menu-item nzSelected>Option 1</li>
              <li nz-menu-item>Option 2</li>
            </ul>
          </li>

          <li nz-menu-group nzTitle="Item 2">
            <ul>
              <li nz-menu-item>Option 3</li>
              <li nz-menu-item>Option 4</li>
            </ul>
          </li>
        </ul>
      </li>

      <li nz-submenu nzTitle="Navigation Two">
        <ul>
          <li nz-menu-item>Option 5</li>
          <li nz-menu-item>Option 6</li>
        </ul>
      </li>
    </ul>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .nz-demo-menu-inline {
        width: 240px;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NzDemoMenuInlineComponent {}

