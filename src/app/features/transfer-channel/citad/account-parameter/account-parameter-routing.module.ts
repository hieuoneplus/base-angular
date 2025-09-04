import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AccountParameterComponent} from "./account-parameter.component";
import {AccountParameterEditComponent} from "./account-parameter-edit/account-parameter-edit.component";
import {ModuleKeys, PermissionsActions} from "../../../../public/module-permission.utils";
import {AuthGuard} from "../../../../shared/permission/auth.guard";
import { HistoryComponent } from '../history/history.component';

const routes: Routes = [
  { path: '', component: AccountParameterComponent, data: { title: 'Cấu hình tài khoản tham số điện hoàn trả', role: ModuleKeys.citad_account_parameter, action:  PermissionsActions.view }, canActivate: [AuthGuard] },
  { path: 'edit', component: AccountParameterEditComponent, data: { title: 'Cập nhật cấu hình tài khoản tham số điện hoàn trả', role: ModuleKeys.citad_account_parameter,action: PermissionsActions.update}, canActivate: [AuthGuard] },
  { path: 'history-config', component: HistoryComponent, data: { title: 'Lịch sử tài khoản tham số điện hoàn trả', role: ModuleKeys.citad_account_parameter, action: PermissionsActions.view }, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountParameterRoutingModule { }
