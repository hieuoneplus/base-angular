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
import { RefundComponent } from './refund.component';
import { RefundRoutingModule } from './refund-routing.module';
import { CreateRefundComponent } from './create-refund/create-refund.component';
import { EditRefundComponent } from './edit-refund/edit-refund.component';
import { DetailRefundComponent } from './detail-refund/detail-refund.component';


@NgModule({
  declarations: [
    RefundComponent,
    CreateRefundComponent,
    EditRefundComponent,
    DetailRefundComponent
  ],
  imports: [
    CommonModule,
    RefundRoutingModule,
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
export class RefundModule { }
