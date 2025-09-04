import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddRoleComponent } from './add-role/add-role.component';
import { DetailRoleComponent } from './detail-role/detail-role.component';
import { SearchRoleComponent } from './search-role.component';

const routes: Routes = [
  { path: '', component: SearchRoleComponent, data: { title: 'Danh sách vai trò' } },
  { path: 'add', component: AddRoleComponent, data: { title: 'Thêm vai trò' } },
  { path: 'edit', component: AddRoleComponent, data: { title: 'Chỉnh sửa vai trò' } },
  { path: 'detail', component: DetailRoleComponent, data: { title: 'Chi tiết vai trò' } },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoleRoutingModule {

}
