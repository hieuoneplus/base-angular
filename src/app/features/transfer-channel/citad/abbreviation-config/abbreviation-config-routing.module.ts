import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AbbreviationConfigComponent } from './abbreviation-config.component';
import { HistoryComponent } from '../history/history.component';
import { AbbreviationConfigEditComponent } from './abbreviation-config-edit/abbreviation-config-edit.component';
import { AuthGuard } from '../../../../shared/permission/auth.guard';
import {
  ModuleKeys,
  PermissionsActions,
} from '../../../../public/module-permission.utils';

const routes: Routes = [
  {
    path: '',
    component: AbbreviationConfigComponent,
    data: {
      title: 'Cấu hình từ điển viết tắt',
      role: ModuleKeys.citad_transaction_abbreviation,
      action: PermissionsActions.view,
    },
    canActivate: [AuthGuard],
  },
  {
    path: 'history-config',
    component: HistoryComponent,
    data: {
      title: 'Lịch sử thay đổi',
      role: ModuleKeys.citad_transaction_abbreviation,
      action: PermissionsActions.view,
    },
    canActivate: [AuthGuard],
  },
  {
    path: 'edit',
    component: AbbreviationConfigEditComponent,
    data: {
      title: 'Chỉnh sửa cấu hình từ điển viết tắt',
      role: ModuleKeys.citad_transaction_abbreviation,
      action: PermissionsActions.update,
    },
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AbbreviationConfigRoutingModule {}
