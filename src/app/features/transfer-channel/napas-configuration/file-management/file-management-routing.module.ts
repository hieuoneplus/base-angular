import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ModuleKeys, PermissionsActions} from "../../../../public/module-permission.utils";
import {AuthGuard} from "../../../../shared/permission/auth.guard";
import { FileManagementComponent } from './file-management.component';

const routes: Routes = [
  { path: 'search', component: FileManagementComponent, data: { title: 'Quản lý thông tin file',role: ModuleKeys.napas_ibft_reconcile_flag_report, action: PermissionsActions.view  }, canActivate: [AuthGuard] },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FileManagementRoutingModule {
}
