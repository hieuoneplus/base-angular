import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModuleKeys, PermissionsActions } from 'src/app/public/module-permission.utils';
import { AuthGuard } from 'src/app/shared/permission/auth.guard';
import { AddUserComponent } from './add-user/add-user.component';
import { DetailUserComponent } from './detail-user/detail-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { SearchUserComponent } from './search-user.component';

const routes: Routes = [
  { path: '', component: SearchUserComponent, data: { role: ModuleKeys.user, action: PermissionsActions.view }, canActivate: [AuthGuard] },
  { path: 'add', component: AddUserComponent, data: { role: ModuleKeys.user, action: PermissionsActions.insert }, canActivate: [AuthGuard] },
  { path: 'detail', component: DetailUserComponent, data: { role: ModuleKeys.user, action: PermissionsActions.view }, canActivate: [AuthGuard] },
  { path: 'edit', component: EditUserComponent, data: { role: ModuleKeys.user, action: PermissionsActions.update }, canActivate: [AuthGuard] },

]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {
}
