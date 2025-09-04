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
import { TransactionManagerInComponent } from './transaction-manager-in.component';
import { TransactionManagerInRoutingModule } from './transaction-manager-in-routing.module';
import { DetailTransactionManagerInComponent } from './detail-transaction-manager-in/detail-transaction-manager-in.component';


@NgModule({
  declarations: [
    TransactionManagerInComponent,
    DetailTransactionManagerInComponent
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
    TransactionManagerInRoutingModule
  ]
})
export class TransactionManagerInModule {
}
