import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';
import { SharedSMModule } from '@shared-sm';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { ThemeModule } from 'src/app/theme/theme.module';
import { MaterialModule } from '../../../shared/material.module';

import { RoleRoutingModule } from './role-routing.module';
import { SearchRoleComponent } from './search-role.component';
import { AddRoleComponent } from './add-role/add-role.component';
import { DetailRoleComponent } from './detail-role/detail-role.component';

@NgModule({
  declarations: [
    SearchRoleComponent,
    AddRoleComponent,
    DetailRoleComponent,
  ],
  imports: [
    ThemeModule,
    CommonModule,
    RoleRoutingModule,
    TranslateModule,
    SharedSMModule,
    MatIconModule,
    MatTableModule,
    MatCheckboxModule,
    MatTooltipModule,
    MaterialModule,
  ]
})
export class RoleModule {
}
