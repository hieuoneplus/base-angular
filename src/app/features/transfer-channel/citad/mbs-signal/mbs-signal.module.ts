import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';
import { SharedSMModule } from '@shared-sm';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { ThemeModule } from 'src/app/theme/theme.module';
import { MaterialModule } from 'src/app/shared/material.module';
import { MbsSignalRoutingModule } from './mbs-signal-routing.module';
import { MbsSignalComponent } from './mbs-signal.component';
import { EditMbsSignalComponent } from './edit-mbs-signal/edit-mbs-signal.component';


@NgModule({
  declarations: [
    MbsSignalComponent,
    EditMbsSignalComponent,
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
    MbsSignalRoutingModule
  ]
})
export class MbsSignalModule {
}
