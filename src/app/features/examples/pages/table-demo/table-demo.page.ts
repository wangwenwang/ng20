import { ChangeDetectionStrategy, Component, TemplateRef, computed, viewChild } from '@angular/core';

import {
  AppTableCellContext,
  AppTableColumn,
  AppTableComponent
} from '../../../../shared/ui/ng-zorro/table';

interface UserTableRow {
  id: number;
  name: string;
  age: number;
  status: '启用' | '禁用' | '待审核';
  email: string;
  department: string;
}

@Component({
  selector: 'app-table-demo-page',
  imports: [AppTableComponent],
  templateUrl: './table-demo.page.html',
  styleUrl: './table-demo.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableDemoPageComponent {
  private readonly nameCell =
    viewChild.required<TemplateRef<AppTableCellContext<UserTableRow>>>('nameCell');
  private readonly statusCell =
    viewChild.required<TemplateRef<AppTableCellContext<UserTableRow>>>('statusCell');
  private readonly actionCell =
    viewChild.required<TemplateRef<AppTableCellContext<UserTableRow>>>('actionCell');

  protected readonly pageSize = 5;
  protected readonly users: UserTableRow[] = [
    {
      id: 1001,
      name: '王晓晨',
      age: 28,
      status: '启用',
      email: 'xiaocheng.wang@example.com',
      department: '产品研发中心'
    },
    {
      id: 1002,
      name: '李书言',
      age: 31,
      status: '待审核',
      email: 'shuyan.li@example.com',
      department: '运营支持部'
    },
    {
      id: 1003,
      name: '周嘉宁',
      age: 26,
      status: '启用',
      email: 'jianing.zhou@example.com',
      department: '客户成功部'
    },
    {
      id: 1004,
      name: '陈思远',
      age: 35,
      status: '禁用',
      email: 'siyuan.chen@example.com',
      department: '风控管理部'
    },
    {
      id: 1005,
      name: '赵明哲',
      age: 29,
      status: '启用',
      email: 'mingzhe.zhao@example.com',
      department: '数据平台组'
    },
    {
      id: 1006,
      name: '孙雨桐',
      age: 27,
      status: '待审核',
      email: 'yutong.sun@example.com',
      department: '设计体验组'
    }
  ];

  protected readonly columns = computed<AppTableColumn<UserTableRow>[]>(() => [
    {
      key: 'name',
      title: '姓名',
      width: '180px',
      cellTemplate: this.nameCell()
    },
    {
      key: 'age',
      title: '年龄',
      width: '100px',
      align: 'center'
    },
    {
      key: 'status',
      title: '状态',
      width: '120px',
      align: 'center',
      cellTemplate: this.statusCell()
    },
    {
      key: 'email',
      title: '邮箱',
      ellipsis: true
    },
    {
      key: 'department',
      title: '部门',
      width: '180px'
    },
    {
      key: 'action',
      title: '操作',
      width: '160px',
      align: 'center',
      cellTemplate: this.actionCell()
    }
  ]);

  protected getStatusClass(status: UserTableRow['status']): string {
    switch (status) {
      case '启用':
        return 'status-chip success';
      case '禁用':
        return 'status-chip danger';
      default:
        return 'status-chip pending';
    }
  }
}
