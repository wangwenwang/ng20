import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-hmi-page',
  templateUrl: './hmi.page.html',
  styleUrl: './hmi.page.less',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HmiPageComponent {}
