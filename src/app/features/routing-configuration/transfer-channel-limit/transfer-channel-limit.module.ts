export interface TransferChannelLimitModuleTs { }
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { SharedSMModule } from '@shared-sm';
import { MaterialModule } from 'src/app/shared/material.module';
import { ThemeModule } from 'src/app/theme/theme.module';
import { AddTransferChannelLimitComponent } from './add-transfer-channel-limit/add-transfer-channel-limit.component';
import { DetailTransferChannelLimitComponent } from './detail-transfer-channel-limit/detail-transfer-channel-limit.component';
import { EditTransferChannelLimitComponent } from './edit-transfer-channel-limit/edit-transfer-channel-limit.component';
import { TransferChannelLimitRoutingModule } from './transfer-channel-limit-routing.module';
import { TransferChannelLimitComponent } from './transfer-channel-limit.component';
import { HistoryComponent } from './history/history.component';
import { DetailHistoryTransferChannelLimitComponent } from './history/detail-history/detail-history.component';

@NgModule({
  declarations: [
    TransferChannelLimitComponent,
    AddTransferChannelLimitComponent,
    DetailTransferChannelLimitComponent,
    EditTransferChannelLimitComponent,
    HistoryComponent,
    DetailHistoryTransferChannelLimitComponent
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
    TransferChannelLimitRoutingModule
  ]
})

export class TransferChannelLimitModule {
}
