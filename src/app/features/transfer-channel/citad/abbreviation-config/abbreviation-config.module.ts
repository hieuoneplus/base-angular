import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ThemeModule} from "../../../../theme/theme.module";
import {TranslateModule} from "@ngx-translate/core";
import {SharedSMModule} from "@shared-sm";
import {MatIconModule} from "@angular/material/icon";
import {MatTableModule} from "@angular/material/table";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MaterialModule} from "../../../../shared/material.module";
import {AbbreviationConfigComponent} from "./abbreviation-config.component";
import {AbbreviationConfigRoutingModule} from "./abbreviation-config-routing.module";
import { AbbreviationConfigEditComponent } from './abbreviation-config-edit/abbreviation-config-edit.component';

@NgModule({
  declarations: [
    AbbreviationConfigComponent,
    AbbreviationConfigEditComponent,
  ],
  imports: [
    CommonModule,
    ThemeModule,
    CommonModule,
    TranslateModule,
    SharedSMModule,
    MatIconModule,
    MatTableModule,
    MatCheckboxModule,
    MatTooltipModule,
    MaterialModule,
    AbbreviationConfigRoutingModule
  ]
})
export class AbbreviationConfigModule { }
