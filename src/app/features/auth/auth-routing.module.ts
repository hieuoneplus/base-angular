import { AuthLayoutComponent } from './auth-layout.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginOTPComponent } from './login-otp/login-otp.component';
import { AuthService } from './service/AuthService';
import {WelcomeComponent} from "./welcome/welcome.component";
const routes: Routes = [
  {
    path: '',
    // component: AuthLayoutComponent,
    children: [
      // { path: '', redirectTo: 'welcome', pathMatch: 'full' },
      {
        path: '', component: WelcomeComponent, data: { title: 'Welcome', titleI18n: 'Welcome' }
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
