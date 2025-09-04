import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';
import { SharedSMModule } from '@shared-sm';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { ThemeModule } from 'src/app/theme/theme.module';
import {MaterialModule} from '../../../shared/material.module';
import { SpecialAccountRoutingModule } from './special-account-routing.module';
import {SpecialAccountComponent} from "./special-account.component";
import {AddSpecialAccountComponent} from "./add-special-account/add-special-account.component";
import {DetailSpecialAccountComponent} from "./detail-special-account/detail-special-account.component";
import {EditSpecialAccountComponent} from "./edit-special-account/edit-special-account.component";
import {AliasAccountHistoriesComponent} from "./alias-histories/alias-account-histories.component";
import {
  DetailAliasAccountHistoriesComponent
} from "./alias-histories/detail-alias-account-histories/detail-alias-account-histories.component";


@NgModule({
  declarations: [
    SpecialAccountComponent,
    AddSpecialAccountComponent,
    DetailSpecialAccountComponent,
    EditSpecialAccountComponent,
    AliasAccountHistoriesComponent,
    DetailAliasAccountHistoriesComponent
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
    SpecialAccountRoutingModule,
  ]
})
export class SpecialAccountModule {
}
