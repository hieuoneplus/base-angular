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
import { HoldReceiverNameRoutingModule } from './hold-receiver-name-routing.module';
import { HoldReceiverNameComponent } from './hold-receiver-name.component';
import { EditHoldReceiverNameComponent } from './edit-hold-receiver-name/edit-hold-receiver-name.component';


@NgModule({
  declarations: [
    HoldReceiverNameComponent,
    EditHoldReceiverNameComponent,
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
    HoldReceiverNameRoutingModule
  ]
})
export class HoldReceiverNameModule {
}
