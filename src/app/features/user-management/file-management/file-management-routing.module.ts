import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FileManagementComponent } from './file-management.component';
import {ModuleKeys, PermissionsActions} from "../../../public/module-permission.utils";
import {AuthGuard} from "../../../shared/permission/auth.guard";

const routes: Routes = [
  { path: '', component: FileManagementComponent, data: { title: 'Quản lý thông tin file', role: ModuleKeys.file, action: PermissionsActions.view  }, canActivate: [AuthGuard] },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FileManagementRoutingModule {
}
