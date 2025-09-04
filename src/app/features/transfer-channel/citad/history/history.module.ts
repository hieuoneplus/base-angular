import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';
import { ChangeDatePipe, SharedSMModule } from '@shared-sm';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { ThemeModule } from 'src/app/theme/theme.module';
import { MaterialModule } from 'src/app/shared/material.module';
import { HistoryRoutingModule } from './history-routing.module';
import { HistoryComponent } from './history.component';
import { DetailHistoryConfigCitadComponent } from './detail-history/detail-history.component';

@NgModule({
  declarations: [
    HistoryComponent,
    ChangeDatePipe,
    DetailHistoryConfigCitadComponent
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
    HistoryRoutingModule
  ]
})
export class HistoryModule {
}
