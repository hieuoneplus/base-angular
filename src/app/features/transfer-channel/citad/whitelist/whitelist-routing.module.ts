import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchWhitelistComponent } from './search-whitelist.component';
import { AddWhitelistComponent } from "./add-whitelist/add-whitelist.component";
import { EditAccountComponent } from "./edit-whitelist/edit-account.component";
import { HistoryComponent } from './history/history.component';



const routes: Routes = [
  { path: '', component: SearchWhitelistComponent, data: { title: 'Tài khoản Whitelist' } },
  { path: 'add', component: AddWhitelistComponent, data: { title: 'Thêm mới tài khoản Whitelist' } },
  { path: 'edit', component: EditAccountComponent, data: { title: 'Chỉnh sửa tài khoản Whitelist' } },
  { path: 'histories', component: HistoryComponent, data: { title: 'Lịch sử thay đổi' } },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WhitelistRoutingModule {
}
