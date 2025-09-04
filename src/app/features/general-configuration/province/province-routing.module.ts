import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModuleKeys, PermissionsActions } from 'src/app/public/module-permission.utils';
import {ProvinceComponent} from './province.component';
import { AuthGuard } from 'src/app/shared/permission/auth.guard';
import { AddProvinceComponent } from './add-province/add-province.component';
import { DetailProvinceComponent } from './detail-province/detail-province.component';
import { EditProvinceComponent } from './edit-province/edit-province.component';
import { HistoryComponent } from './history/history.component';

const routes: Routes = [
  { path: '', component: ProvinceComponent, data: { title: 'Quản lý tỉnh thành', role: ModuleKeys.city, action: PermissionsActions.view }, canActivate: [AuthGuard] },
  { path: 'add', component: AddProvinceComponent, data: { title: 'Thêm mới tỉnh thành', role: ModuleKeys.city, action: PermissionsActions.insert }, canActivate: [AuthGuard] },
  { path: 'detail', component: DetailProvinceComponent, data: { title: 'Chi tiết tỉnh thành', role: ModuleKeys.city, action: PermissionsActions.view }, canActivate: [AuthGuard] },
  { path: 'edit', component: EditProvinceComponent, data: { title: 'Chỉnh sửa tỉnh thành', role: ModuleKeys.city, action: PermissionsActions.update }, canActivate: [AuthGuard] },
  { path: 'history', component: HistoryComponent, data: { title: 'Lịch sử thay đổi', role: ModuleKeys.city, action: PermissionsActions.view }, canActivate: [AuthGuard] },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProvinceRoutingModule {
}
