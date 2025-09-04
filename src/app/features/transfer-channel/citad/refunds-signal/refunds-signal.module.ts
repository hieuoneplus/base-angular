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
import { RefundsSignalRoutingModule } from './refunds-signal-routing.module';
import { RefundsSignalComponent } from './refunds-signal.component';
import { EditRefundsSignalComponent } from './edit-refunds-signal/edit-refunds-signal.component';


@NgModule({
  declarations: [
    RefundsSignalComponent,
    EditRefundsSignalComponent,
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
    RefundsSignalRoutingModule
  ]
})
export class RefundsSignalModule {
}
