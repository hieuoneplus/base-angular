import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModuleKeys, PermissionsActions } from "../../../public/module-permission.utils";
import { AuthGuard } from "../../../shared/permission/auth.guard";
import { AddBlacklistComponent } from "./add-blacklist/add-blacklist.component";
import { DetailBlacklistComponent } from "./detail-blacklist/detail-blacklist.component";
import { EditBlacklistComponent } from "./edit-blacklist/edit-blacklist.component";
import { SearchBlacklistComponent } from './search-blacklist.component';
import {HistoryComponent} from "./history/history.component";


const routes: Routes = [
  { path: '', component: SearchBlacklistComponent, data: { title: 'Tài khoản Blacklist', role: ModuleKeys.routing_blacklist, action: PermissionsActions.view }, canActivate: [AuthGuard] },
  { path: 'add', component: AddBlacklistComponent, data: { title: 'Thêm mới tài khoản Blacklist', role: ModuleKeys.routing_blacklist, action: PermissionsActions.insert }, canActivate: [AuthGuard] },
  { path: 'detail', component: DetailBlacklistComponent, data: { title: 'Chi tiết tài khoản Blacklist', role: ModuleKeys.routing_blacklist, action: PermissionsActions.view }, canActivate: [AuthGuard] },
  { path: 'edit', component: EditBlacklistComponent, data: { title: 'Chi tiết tài khoản Blacklist', role: ModuleKeys.routing_blacklist, action: PermissionsActions.update }, canActivate: [AuthGuard] },
  { path: 'history', component: HistoryComponent, data: { title: 'Lịch sử cấu hình tài khoản Blacklist', role: ModuleKeys.routing_blacklist, action: PermissionsActions.view }, canActivate: [AuthGuard] },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlacklistRoutingModule {
}
