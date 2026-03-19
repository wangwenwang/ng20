import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-ng-zorro-playground-page',
  templateUrl: './ng-zorro-playground.page.html',
  styleUrl: './ng-zorro-playground.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgZorroPlaygroundPageComponent {
  protected readonly pageTitle = 'Ng Zorro Playground';
}
