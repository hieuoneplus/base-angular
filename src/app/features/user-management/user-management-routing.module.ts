import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyProfileComponent } from './profile/my-profile.component';
import { RoleService } from './service/RoleService';
import { UserService } from './service/UserService';
const routes: Routes = [
  {
    path: 'users',
    loadChildren: () => import('./user/user.module').then(m => m.UserModule),
  },
  {
    path: 'roles',
    loadChildren: () => import('./role/role.module').then(m => m.RoleModule),
  },
  { path: 'profile', component: MyProfileComponent, data: { title: 'Thông tin cá nhân' } },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [UserService, RoleService]
})
export class UserManagementRoutingModule {
}
