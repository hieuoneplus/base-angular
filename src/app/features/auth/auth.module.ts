import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ActivityIndicatorModule } from './../../shared/activity-indicator/activityIndicator.module';
import { AuthLayoutComponent } from './auth-layout.component';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginOTPComponent } from './login-otp/login-otp.component';
import {WelcomeComponent} from "./welcome/welcome.component";

const COMPONENTS = [AuthLayoutComponent, LoginOTPComponent, WelcomeComponent];
const COMPONENTS_DYNAMIC = [];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    MatInputModule,
    MatRadioModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    FormsModule,
    FlexLayoutModule,
    ActivityIndicatorModule,
    AuthRoutingModule,

  ],
  declarations: [...COMPONENTS, ...COMPONENTS_DYNAMIC],
  entryComponents: COMPONENTS_DYNAMIC,
  providers: []
})
export class AuthModule { }
