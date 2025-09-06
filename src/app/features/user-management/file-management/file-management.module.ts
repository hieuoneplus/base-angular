import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SharedSMModule } from '@shared-sm';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { ThemeModule } from 'src/app/theme/theme.module';

import { FileManagementComponent } from './file-management.component';
import { FileManagementRoutingModule } from './file-management-routing.module';
import {MaterialModule} from "../../../shared/material.module";


@NgModule({
  declarations: [
    FileManagementComponent,
  ],
  imports: [
    CommonModule,
    FileManagementRoutingModule,
    ThemeModule,
    TranslateModule,
    SharedSMModule,
    MatIconModule,
    MatTableModule,
    MatCheckboxModule,
    MatTooltipModule,
    MaterialModule,
  ],
})
export class FileManagementModule { }
