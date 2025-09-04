import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {T24ProtectionComponent} from "./t24-protection.component";
import {T24ProtectiontEditComponent} from "./edit-t24-protection/edit-t24-protection.component";
import {ModuleKeys, PermissionsActions} from "../../../../public/module-permission.utils";
import {AuthGuard} from "../../../../shared/permission/auth.guard";
import {HistoryComponent} from "./history/history.component";

const routes: Routes = [
  { path: '', component: T24ProtectionComponent, data: { title: 'Cấu hình tham số bảo vệ T24', role: ModuleKeys.inhouse_config, action: PermissionsActions.view }, canActivate: [AuthGuard] },
  { path: 'history', component: HistoryComponent, data: { title: 'Lịch sử cấu hình', role: ModuleKeys.inhouse_config, action: PermissionsActions.view }, canActivate: [AuthGuard] },
  { path: 'edit', component: T24ProtectiontEditComponent, data: { title: 'Cập nhật tham số bảo vệ T24', role: ModuleKeys.inhouse_config, action: PermissionsActions.update }, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class T24ProtectionRoutingModule { }
