import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ModuleKeys, PermissionsActions} from "../../../../public/module-permission.utils";
import {AuthGuard} from "../../../../shared/permission/auth.guard";
import { CreateFlagReportComponent } from './create-flag-report/create-flag-report.component';
import { DetailFlagReportComponent } from './detail-flag-report/detail-flag-report.component';
import { EditFlagReportComponent } from './edit-flag-report/edit-flag-report.component';
import { FlagReportComponent } from './flag-report.component';

const routes: Routes = [
  { path: 'search', component: FlagReportComponent, data: { title: 'Tra cứu',role: ModuleKeys.napas_ibft_reconcile_flag_report, action: PermissionsActions.view  }, canActivate: [AuthGuard] },
  { path: 'detail', component: DetailFlagReportComponent, data: { title: 'Xem chi tiết',role: ModuleKeys.napas_ibft_reconcile_flag_report, action: PermissionsActions.view  }, canActivate: [AuthGuard] },
  { path: 'create', component: CreateFlagReportComponent, data: { title: 'Thêm',role: ModuleKeys.napas_ibft_reconcile_flag_report, action: PermissionsActions.view  }, canActivate: [AuthGuard] },
  { path: 'edit', component: EditFlagReportComponent, data: { title: 'Sửa',role: ModuleKeys.napas_ibft_reconcile_flag_report, action: PermissionsActions.view  }, canActivate: [AuthGuard] },

]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FlagReportRoutingModule {
}
