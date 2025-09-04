

import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatIconModule} from '@angular/material/icon';
import {MatTableModule} from '@angular/material/table';
import {MatTooltipModule} from '@angular/material/tooltip';
import {TranslateModule} from '@ngx-translate/core';
import {SharedSMModule} from '@shared-sm';
import {MaterialModule} from 'src/app/shared/material.module';
import {ThemeModule} from 'src/app/theme/theme.module';
import {AddProvinceComponent} from './add-province/add-province.component';
import {DetailProvinceComponent} from './detail-province/detail-province.component';
import {EditProvinceComponent} from './edit-province/edit-province.component';
import {ProvinceRoutingModule} from './province-routing.module';
import {ProvinceComponent} from './province.component';
import {HistoryComponent} from './history/history.component';
import {DetailHistoryProvinceComponent} from './history/detail-history/detail-history.component';

@NgModule({
  declarations: [
    ProvinceComponent,
    AddProvinceComponent,
    DetailProvinceComponent,
    EditProvinceComponent,
    HistoryComponent,
    DetailHistoryProvinceComponent
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
    ProvinceRoutingModule
  ]
})

export class ProvinceModule {
}
