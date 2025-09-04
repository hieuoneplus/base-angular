import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchBlacklistComponent } from './search-blacklist.component';
import { AddBlacklistComponent } from "./add-blacklist/add-blacklist.component";
import { EditAccountComponent } from "./edit-blacklist/edit-account.component";
import { HistoryComponent } from './history/history.component';
import { ModuleKeys, PermissionsActions } from 'src/app/public/module-permission.utils';

const routes: Routes = [
  { path: '', component: SearchBlacklistComponent, data: { title: 'Tài khoản blacklist', role: ModuleKeys.citad_blacklist_accounts, action:  PermissionsActions.view } },
  { path: 'add', component: AddBlacklistComponent, data: { title: 'Thêm mới tài khoản blacklist', role: ModuleKeys.citad_blacklist_accounts, action:  PermissionsActions.insert } },
  { path: 'edit', component: EditAccountComponent, data: { title: 'Chỉnh sửa tài khoản blacklist', role: ModuleKeys.citad_blacklist_accounts, action:  PermissionsActions.update } },
  { path: 'histories', component: HistoryComponent, data: { title: 'Lịch sử thay đổi' , role: ModuleKeys.citad_blacklist_accounts, action:  PermissionsActions.view} },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlacklistRoutingModule {
}
