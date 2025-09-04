import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';
import { SharedSMModule } from '@shared-sm';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { ThemeModule } from 'src/app/theme/theme.module';
import { MaterialModule } from '../../shared/material.module';

import { UserManagementRoutingModule } from './user-management-routing.module';
import { MyProfileComponent } from './profile/my-profile.component';
@NgModule({
  declarations: [
    MyProfileComponent,
  ],
  imports: [
    ThemeModule,
    CommonModule,
    UserManagementRoutingModule,
    TranslateModule,
    SharedSMModule,
    MatIconModule,
    MatTableModule,
    MatCheckboxModule,
    MatTooltipModule,
    MaterialModule,
  ]
})
export class UserManagementModule {
}
