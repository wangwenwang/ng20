import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'nz-demo-modal-basic',
  imports: [FormsModule, NzButtonModule, NzDatePickerModule, NzModalModule, NzSelectModule],
  template: `
    <button nz-button nzType="primary" (click)="showModal()"><span>Show Modal</span></button>
    <nz-modal
      [(nzVisible)]="isVisible"
      nzTitle="表单弹窗"
      nzOkText="确认"
      nzCancelText="取消"
      (nzOnCancel)="handleCancel()"
      (nzOnOk)="handleOk()">
      <ng-container *nzModalContent>
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <label style="display: flex; flex-direction: column; gap: 8px;">
            <span>选项</span>
            <nz-select [(ngModel)]="selectedValue" nzPlaceHolder="请选择">
              <nz-option nzValue="jack" nzLabel="Jack"></nz-option>
              <nz-option nzValue="lucy" nzLabel="Lucy"></nz-option>
              <nz-option nzValue="disabled" nzLabel="Disabled" nzDisabled></nz-option>
            </nz-select>
          </label>
          <label style="display: flex; flex-direction: column; gap: 8px;">
            <span>日期</span>
            <nz-date-picker [(ngModel)]="selectedDate" nzPlaceHolder="请选择日期" style="width: 100%;"></nz-date-picker>
          </label>
          <label style="display: flex; flex-direction: column; gap: 8px;">
            <span>日期</span>
            <nz-date-picker [(ngModel)]="selectedDate" nzPlaceHolder="请选择日期" style="width: 100%;"></nz-date-picker>
          </label>
          <label style="display: flex; flex-direction: column; gap: 8px;">
            <span>日期</span>
            <nz-date-picker [(ngModel)]="selectedDate" nzPlaceHolder="请选择日期" style="width: 100%;"></nz-date-picker>
          </label>
          <label style="display: flex; flex-direction: column; gap: 8px;">
            <span>日期</span>
            <nz-date-picker [(ngModel)]="selectedDate" nzPlaceHolder="请选择日期" style="width: 100%;"></nz-date-picker>
          </label>
          <label style="display: flex; flex-direction: column; gap: 8px;">
            <span>日期</span>
            <nz-date-picker [(ngModel)]="selectedDate" nzPlaceHolder="请选择日期" style="width: 100%;"></nz-date-picker>
          </label>
          <label style="display: flex; flex-direction: column; gap: 8px;">
            <span>日期</span>
            <nz-date-picker [(ngModel)]="selectedDate" nzPlaceHolder="请选择日期" style="width: 100%;"></nz-date-picker>
          </label>
          <label style="display: flex; flex-direction: column; gap: 8px;">
            <span>日期</span>
            <nz-date-picker [(ngModel)]="selectedDate" nzPlaceHolder="请选择日期" style="width: 100%;"></nz-date-picker>
          </label>
        </div>
      </ng-container>
    </nz-modal>
  `
})
export class NzDemoModalBasicComponent {
  isVisible = false;
  selectedValue: string | null = null;
  selectedDate: Date | null = null;

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    console.log('确认', { selectedValue: this.selectedValue, selectedDate: this.selectedDate });
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }
}
