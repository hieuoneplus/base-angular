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
import { HoldReceiverAccountRoutingModule } from './hold-receiver-account-routing.module';
import { HoldReceiverAccountComponent } from './hold-receiver-account.component';
import { EditHoldReceiverAccountComponent } from './edit-hold-receiver-account/edit-hold-receiver-account.component';


@NgModule({
  declarations: [
    HoldReceiverAccountComponent,
    EditHoldReceiverAccountComponent,
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
    HoldReceiverAccountRoutingModule
  ]
})
export class HoldReceiverAccountModule {
}
