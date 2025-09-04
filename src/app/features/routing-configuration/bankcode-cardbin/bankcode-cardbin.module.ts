import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';
import { SharedSMModule } from '@shared-sm';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { ThemeModule } from 'src/app/theme/theme.module';
import { MaterialModule } from '../../../shared/material.module';
import { AddBankCodeCardBinComponent } from "./add-bankcode-cardbin/add-bankcode-cardbin.component";
import { SearchBankCodeCardBinComponent } from './search-bankcode-cardbin.component';
import { HistoryComponent } from './history/history.component';
import { BankCodeCardBinRoutingModule } from './bankcode-cardbin-routing.module';


@NgModule({
  declarations: [
    SearchBankCodeCardBinComponent, AddBankCodeCardBinComponent,HistoryComponent
  ],
  imports: [
    ThemeModule,
    CommonModule,
    BankCodeCardBinRoutingModule,
    TranslateModule,
    SharedSMModule,
    MatIconModule,
    MatTableModule,
    MatCheckboxModule,
    MatTooltipModule,
    MaterialModule,
  ]
})
export class BankCodeCardBinModule {
}
