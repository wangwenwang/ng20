import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NzIconService } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  constructor(private readonly nzIconService: NzIconService) {
    this.nzIconService.fetchFromIconfont({
      scriptUrl: 'assets/fonts/iconfont.js'
    });
  }
}
