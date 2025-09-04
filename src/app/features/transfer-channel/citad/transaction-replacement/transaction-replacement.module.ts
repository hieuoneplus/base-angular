import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {TransactionReplacementRoutingModule} from './transaction-replacement-routing.module';
import {TransactionReplacementComponent} from './transaction-replacement.component';
import {ThemeModule} from "../../../../theme/theme.module";
import {TranslateModule} from "@ngx-translate/core";
import {SharedSMModule} from "@shared-sm";
import {MatIconModule} from "@angular/material/icon";
import {MatTableModule} from "@angular/material/table";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MaterialModule} from "../../../../shared/material.module";
import {
  TransactionReplacementEditComponent
} from './edit-transaction-replacement/edit-tranasction-replacement.component';
import {TransferChannelModule} from "../../transfer-channel.module";


@NgModule({
  declarations: [
    TransactionReplacementComponent,
    TransactionReplacementEditComponent
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
        CommonModule,
        TransactionReplacementRoutingModule,
        TransferChannelModule
    ]
})
export class TransactionReplacementModule { }
