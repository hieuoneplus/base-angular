import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountParameterRoutingModule } from './account-parameter-routing.module';
import { AccountParameterComponent } from './account-parameter.component';
import {ThemeModule} from "../../../../theme/theme.module";
import {TranslateModule} from "@ngx-translate/core";
import {SharedSMModule} from "@shared-sm";
import {MatIconModule} from "@angular/material/icon";
import {MatTableModule} from "@angular/material/table";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MaterialModule} from "../../../../shared/material.module";
import { AccountParameterEditComponent } from './account-parameter-edit/account-parameter-edit.component';
import {TransferChannelModule} from "../../transfer-channel.module";


@NgModule({
  declarations: [
    AccountParameterComponent,
    AccountParameterEditComponent
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
        AccountParameterRoutingModule,
        TransferChannelModule
    ]
})
export class AccountParameterModule { }
