import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddTktgACHComponent } from './add-tktg-ach/add-tktg-ach.component';
import { DetailTktgACHComponent } from './detail-tktg-ach/detail-tktg-ach.component';
import { EditTktgACHComponent } from './edit-tktg-ach/edit-tktg-ach.component';
import { TktgACHComponent } from './tktg-ach.component';
import {ModuleKeys} from "../../../../public/module-permission.utils";
import {AuthGuard} from "../../../../shared/permission/auth.guard";


const routes: Routes = [
  { path: '', component: TktgACHComponent, data: { title: 'Cấu hình tài khoản trung gian', role: ModuleKeys.ach_tktg_config, action: 'view' }, canActivate: [AuthGuard] },
  { path: 'add', component: AddTktgACHComponent, data: { title: 'Thêm mới tài khoản trung gian', role: ModuleKeys.ach_tktg_config, action: 'insert' }, canActivate: [AuthGuard] },
  { path: 'detail', component: DetailTktgACHComponent, data: { title: 'Chi tiết tài khoản trung gian', role: ModuleKeys.ach_tktg_config, action: 'view' }, canActivate: [AuthGuard] },
  { path: 'edit', component: EditTktgACHComponent, data: { title: 'Chi tiết tài khoản trung gian', role: ModuleKeys.ach_tktg_config, action: 'update' }, canActivate: [AuthGuard] },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TktgACHRoutingModule {
}
