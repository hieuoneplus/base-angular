import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StateTreasuryConfigRoutingModule } from './state-treasury-config-routing.module';
import { EditStateTreasuryConfigComponent } from './edit-state-treasury-config/edit-state-treasury-config.component';
import {ThemeModule} from "../../../../theme/theme.module";
import {CitadRoutingModule} from "../citad-routing.module";
import {TranslateModule} from "@ngx-translate/core";
import {SharedSMModule} from "@shared-sm";
import {MatIconModule} from "@angular/material/icon";
import {MatTableModule} from "@angular/material/table";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MaterialModule} from "../../../../shared/material.module";
import {StateTreasuryConfigComponent} from "./state-treasury-config.component";
import { DetailStateTreasuryComponent } from './detail-state-treasury-config/detail-state-treasury-config.component';
import { AddStateTreasuryComponent } from './add-state-treasury/add-state-treasury.component';
import { StateTreasuriesHistoriesComponent } from './state-treasuries-histories/state-treasuries-histories.component';
import { DetailStateTreasuriesHistoryComponent } from './detail-state-treasuries-histories/detail-state-treasuries-histories.component';


@NgModule({
  declarations: [
    DetailStateTreasuriesHistoryComponent,
    StateTreasuryConfigComponent,
    AddStateTreasuryComponent,
    EditStateTreasuryConfigComponent,
    StateTreasuriesHistoriesComponent,
    DetailStateTreasuryComponent
  ],
  imports: [
    CommonModule,
    StateTreasuryConfigRoutingModule,
    ThemeModule,
    CommonModule,
    CitadRoutingModule,
    TranslateModule,
    SharedSMModule,
    MatIconModule,
    MatTableModule,
    MatCheckboxModule,
    MatTooltipModule,
    MaterialModule,
  ]
})
export class StateTreasuryConfigModule { }
