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
import { BilateralRoutingModule } from './bilateral-routing.module';
import { DetailConfigComponent } from './partner-config/detail-partner-config/detail-partner-config.component';
import { PartnerConfigComponent } from './partner-config/partner-config.component';
import { BilateralMainComponent } from './bilateral-main.component';
@NgModule({
  declarations: [
    PartnerConfigComponent,
    DetailConfigComponent,
    BilateralMainComponent,

  ],
  imports: [
    ThemeModule,
    CommonModule,
    BilateralRoutingModule,
    TranslateModule,
    SharedSMModule,
    MatIconModule,
    MatTableModule,
    MatCheckboxModule,
    MatTooltipModule,
    MaterialModule,
  ]
})
export class BilateralModule {
}
