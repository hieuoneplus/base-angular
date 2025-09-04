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
import { ChargeCreditComponent } from './charge-credit.component';
import { ChargeCreditRoutingModule } from './charge-credit-routing.module';
import { CreateChargeCreditComponent } from './create-charge-credit/create-charge-credit.component';
import { DetailChargeCreditComponent } from './detail-charge-credit/detail-charge-credit.component';
import { EditChargeCreditComponent } from './edit-charge-credit/edit-charge-credit.component';


@NgModule({
  declarations: [
    ChargeCreditComponent,
    CreateChargeCreditComponent,
    EditChargeCreditComponent,
    DetailChargeCreditComponent,
  ],
  imports: [
    CommonModule,
    ChargeCreditRoutingModule,
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
export class ChargeCreditModule { }
