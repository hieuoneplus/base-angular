import { AuthLayoutComponent } from './auth-layout.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginOTPComponent } from './login-otp/login-otp.component';
import { AuthService } from './service/AuthService';
const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: '', redirectTo: 'login-otp', pathMatch: 'full' },
      {
        path: 'login-otp', component: LoginOTPComponent, data: { title: 'Login', titleI18n: 'login' }
      }
    ],
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
  providers: [AuthService]
})
export class AuthRoutingModule { }
