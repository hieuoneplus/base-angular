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
import { TransactionManagerOutComponent } from './transaction-manager-out.component';
import { TransactionManagerOutRoutingModule } from './transaction-manager-out-routing.module';
import { DetailTransactionManagerOutComponent } from './detail-transaction-manager-out/detail-transaction-manager-out.component';


@NgModule({
  declarations: [
    TransactionManagerOutComponent,
    DetailTransactionManagerOutComponent
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
    TransactionManagerOutRoutingModule
  ]
})
export class TransactionManagerOutModule {
}
