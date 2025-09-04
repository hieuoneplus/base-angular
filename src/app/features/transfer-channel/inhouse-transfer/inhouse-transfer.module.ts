import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';
import { SharedSMModule } from '@shared-sm';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { ThemeModule } from 'src/app/theme/theme.module';
import {MaterialModule} from '../../../shared/material.module';
import {InhouseTransferMainComponent} from "./inhouse-transfer-main.component";
import {InhouseTransferRoutingModule} from "./inhouse-transfer-routing.module";


// Chuyển tiền thường
@NgModule({
  declarations: [
    InhouseTransferMainComponent
  ],
  imports: [
    ThemeModule,
    CommonModule,
    TranslateModule,
    SharedSMModule,
    MatIconModule,
    MatTableModule,
    MatCheckboxModule,
    MatTooltipModule,
    MaterialModule,
    InhouseTransferRoutingModule
  ]
})
export class InhouseTransferModule {
}
