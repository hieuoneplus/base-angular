import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddGeneralAchComponent } from './add-general-ach/add-general-ach.component';
import { DetailGeneralAchComponent } from './detail-general-ach/detail-general-ach.component';
import { EditGeneralAchComponent } from './edit-general-ach/edit-general-ach.component';
import { GeneralAchComponent } from './general-ach.component';
import { ModuleKeys } from "../../../../public/module-permission.utils";
import { AuthGuard } from "../../../../shared/permission/auth.guard";


const routes: Routes = [
  { path: '', component: GeneralAchComponent, data: { title: 'Cấu hình tài khoản trung gian', role: ModuleKeys.ach_common_config, action: 'view' }, canActivate: [AuthGuard] },
  { path: 'add', component: AddGeneralAchComponent, data: { title: 'Thêm mới tài khoản trung gian', role: ModuleKeys.ach_common_config, action: 'insert' }, canActivate: [AuthGuard] },
  { path: 'detail', component: DetailGeneralAchComponent, data: { title: 'Chi tiết tài khoản trung gian', role: ModuleKeys.ach_common_config, action: 'view' }, canActivate: [AuthGuard] },
  { path: 'edit', component: EditGeneralAchComponent, data: { title: 'Chi tiết tài khoản trung gian', role: ModuleKeys.ach_common_config, action: 'update' }, canActivate: [AuthGuard] },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeneralAchRoutingModule {
}
