import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SpecialAccountComponent} from "./special-account.component";
import {AddSpecialAccountComponent} from "./add-special-account/add-special-account.component";
import {DetailSpecialAccountComponent} from "./detail-special-account/detail-special-account.component";
import {EditSpecialAccountComponent} from "./edit-special-account/edit-special-account.component";
import {ModuleKeys, PermissionsActions} from "../../../public/module-permission.utils";
import {AuthGuard} from "../../../shared/permission/auth.guard";
import {AliasAccountHistoriesComponent} from "./alias-histories/alias-account-histories.component";
import {
  DetailAliasAccountHistoriesComponent
} from "./alias-histories/detail-alias-account-histories/detail-alias-account-histories.component";

const routes: Routes = [
  { path: '', component: SpecialAccountComponent, data: { title: 'Danh mục tài khoản đặc biệt',role: ModuleKeys.alias_account, action: PermissionsActions.view  }, canActivate: [AuthGuard] },
  { path: 'add', component: AddSpecialAccountComponent, data: { title: 'Thêm mới tài khoản đặc biệt', role: ModuleKeys.alias_account, action: PermissionsActions.insert }, canActivate: [AuthGuard] },
  { path: 'detail', component: DetailSpecialAccountComponent, data: { title: 'Chi tiết tài khoản đặc biệt', role: ModuleKeys.alias_account, action: PermissionsActions.view }, canActivate: [AuthGuard] },
  { path: 'edit', component: EditSpecialAccountComponent, data: { title: 'Chi tiết tài khoản đặc biệt', role: ModuleKeys.alias_account, action: PermissionsActions.update }, canActivate: [AuthGuard] },
  { path: 'history', component: AliasAccountHistoriesComponent, data: { title: 'Lịch sử thay đổi', role: ModuleKeys.alias_account, action: PermissionsActions.view }, canActivate: [AuthGuard] },
  { path: 'history/detail', component: DetailAliasAccountHistoriesComponent, data: { title: 'Chi tiết lịch sử thay đổi', role: ModuleKeys.alias_account, action: PermissionsActions.view }, canActivate: [AuthGuard] },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SpecialAccountRoutingModule {
}
