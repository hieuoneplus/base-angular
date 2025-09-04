import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';
import { SharedSMModule } from '@shared-sm';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { ThemeModule } from 'src/app/theme/theme.module';
import { GeneralAchRoutingModule } from './general-ach-routing.module';
import { MaterialModule } from 'src/app/shared/material.module';
import { GeneralAchComponent } from './general-ach.component';
import { DetailGeneralAchComponent } from './detail-general-ach/detail-general-ach.component';
import { EditGeneralAchComponent } from './edit-general-ach/edit-general-ach.component';
import { AddGeneralAchComponent } from "./add-general-ach/add-general-ach.component";

@NgModule({
  declarations: [
    GeneralAchComponent,
    AddGeneralAchComponent,
    DetailGeneralAchComponent,
    EditGeneralAchComponent,
  ],
  imports: [
    ThemeModule,
    CommonModule,
    GeneralAchRoutingModule,
    TranslateModule,
    SharedSMModule,
    MatIconModule,
    MatTableModule,
    MatCheckboxModule,
    MatTooltipModule,
    MaterialModule,
  ]
})
export class GeneralAchModule {
}
