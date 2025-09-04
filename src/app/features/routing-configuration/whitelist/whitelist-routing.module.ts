import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchWhitelistComponent } from './search-whitelist.component';
import {AddWhitelistComponent} from "./add-whitelist/add-whitelist.component";
import {DetailWhitelistComponent} from "./detail-whitelist/detail-whitelist.component";
import {EditAccountComponent} from "./edit-whitelist/edit-account.component";
import {AuthGuard} from "../../../shared/permission/auth.guard";
import {ModuleKeys, PermissionsActions} from "../../../public/module-permission.utils";
import { HistoryComponent } from './history/history.component';
import { DetailHistoryWhitelistComponent } from './history/detail-history-whitelist/detail-history-whitelist.component';



const routes: Routes = [
  { path: '', component: SearchWhitelistComponent, data: { title: 'Tài khoản Whitelist', role: ModuleKeys.routing_whitelist, action: PermissionsActions.view }, canActivate: [AuthGuard] },
  { path: 'add', component: AddWhitelistComponent, data: { title: 'Thêm mới tài khoản Whitelist', role: ModuleKeys.routing_whitelist, action: PermissionsActions.insert }, canActivate: [AuthGuard] },
  { path: 'detail', component: DetailWhitelistComponent, data: { title: 'Chi tiết tài khoản Whitelist', role: ModuleKeys.routing_whitelist, action: PermissionsActions.view }, canActivate: [AuthGuard] },
  { path: 'edit', component: EditAccountComponent, data: { title: 'Chỉnh sửa tài khoản Whitelist', role: ModuleKeys.routing_whitelist, action: PermissionsActions.update }, canActivate: [AuthGuard] },
  { path: 'history', component: HistoryComponent, data: { title: 'Lịch sử chỉnh sửa tài khoản Whitelist', role: ModuleKeys.routing_whitelist, action: PermissionsActions.view }, canActivate: [AuthGuard] },
  { path: 'detail-history', component: DetailHistoryWhitelistComponent, data: { title: 'Chi tiết tài khoản Whitelist', role: ModuleKeys.routing_whitelist, action: PermissionsActions.view }, canActivate: [AuthGuard] },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WhitelistRoutingModule {
}
