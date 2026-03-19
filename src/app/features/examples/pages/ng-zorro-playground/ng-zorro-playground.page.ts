import { Component, OnInit, signal } from '@angular/core';

import { NzTableModule } from 'ng-zorro-antd/table';

interface ItemData {
  name: string;
  age: number;
  address: string;
}

@Component({
  selector: 'nz-demo-table-fixed-header',
  imports: [NzTableModule],
  template: `
  <div style="height: 500px; overflow: hidden;">
    <nz-table #headerTable [nzData]="listOfData" [nzPageSize]="50" [nzScroll]="{ y: 'calc(100% - 100px)' }" [nzShowPagination]="false" style="height: 100%;">
      <thead>
        <tr>
          <th>Name</th>
          <th nzWidth="100px">Age</th>
          <th>Address</th>
        </tr>
      </thead>
      <tbody>
        @for (data of headerTable.data; track data) {
          <tr>
            <td>{{ data.name }}</td>
            <td>{{ data.age }}</td>
            <td>{{ data.address }}</td>
          </tr>
        }
      </tbody>
    </nz-table>
  </div>
  `
})
export class NzDemoTableFixedHeaderComponent implements OnInit {
  listOfData: ItemData[] = [];

  ngOnInit(): void {
    const data: ItemData[] = [];
    for (let i = 0; i < 100; i++) {
      data.push({
        name: `Edward King ${i}`,
        age: 32,
        address: `London, Park Lane no. ${i}`
      });
    }
    this.listOfData = data;
  }
}
