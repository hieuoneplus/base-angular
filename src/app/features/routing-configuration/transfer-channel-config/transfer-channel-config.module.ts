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
import {TransferChannelConfigComponent} from "./transfer-channel-config.component";
import {TransferChannelConfigRoutingModule} from "./transfer-channel-config-routing.module";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {EditTransferChannelConfigComponent} from "./edit-transfer-channel-config/edit-transfer-channel-config.component";




@NgModule({
  declarations: [
    TransferChannelConfigComponent, EditTransferChannelConfigComponent
  ],
  imports: [
    DragDropModule,
    ThemeModule,
    CommonModule,
    TranslateModule,
    SharedSMModule,
    MatIconModule,
    MatTableModule,
    MatCheckboxModule,
    MatTooltipModule,
    MaterialModule,
    TransferChannelConfigRoutingModule
  ]
})
export class TransferChannelConfigModule {
}
