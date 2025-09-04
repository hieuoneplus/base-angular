import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SharedSMModule } from '@shared-sm';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { ThemeModule } from 'src/app/theme/theme.module';
import { MaterialModule } from '../../../../shared/material.module';
import { TransactionInfoRoutingModule } from './transaction-info-routing.module';
import { TransactionInfoComponent } from './transaction-info.component';
import { DetailTransactionInfoComponent } from './detail-transaction-info/detail-transaction-info.component';


@NgModule({
  declarations: [
    TransactionInfoComponent,
    DetailTransactionInfoComponent
  ],
  imports: [
    CommonModule,
    TransactionInfoRoutingModule,
    ThemeModule,
    TranslateModule,
    SharedSMModule,
    MatIconModule,
    MatTableModule,
    MatCheckboxModule,
    MatTooltipModule,
    MaterialModule,
  ],
})
export class TransactionInfoModule { }
