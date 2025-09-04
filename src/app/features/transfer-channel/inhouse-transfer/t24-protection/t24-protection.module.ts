import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {T24ProtectionRoutingModule} from './t24-protection-routing.module';
import {T24ProtectionComponent} from './t24-protection.component';
import {ThemeModule} from "../../../../theme/theme.module";
import {TranslateModule} from "@ngx-translate/core";
import {SharedSMModule} from "@shared-sm";
import {MatIconModule} from "@angular/material/icon";
import {MatTableModule} from "@angular/material/table";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MaterialModule} from "../../../../shared/material.module";
import {
  T24ProtectiontEditComponent,
} from './edit-t24-protection/edit-t24-protection.component';
import {TransferChannelModule} from "../../transfer-channel.module";
import {HistoryComponent} from "./history/history.component";
import {DetailHistoryComponent} from "./history/detail-history/detail-history.component";


@NgModule({
  declarations: [
    T24ProtectionComponent,
    T24ProtectiontEditComponent,
    HistoryComponent,
    DetailHistoryComponent
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
        T24ProtectionRoutingModule,
        TransferChannelModule
    ]
})
export class T24ProtectionModule { }
