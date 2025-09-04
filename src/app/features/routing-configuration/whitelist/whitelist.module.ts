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
import { SearchWhitelistComponent } from './search-whitelist.component';
import { WhitelistRoutingModule } from "./whitelist-routing.module";
import { AddWhitelistComponent } from "./add-whitelist/add-whitelist.component";
import { EditAccountComponent } from "./edit-whitelist/edit-account.component";
import { DetailWhitelistComponent } from "./detail-whitelist/detail-whitelist.component";
import { HistoryComponent } from './history/history.component';
import { DetailHistoryWhitelistComponent } from './history/detail-history-whitelist/detail-history-whitelist.component';


@NgModule({
  declarations: [
    SearchWhitelistComponent, AddWhitelistComponent, EditAccountComponent, DetailWhitelistComponent, HistoryComponent, DetailHistoryWhitelistComponent
  ],
  imports: [
    ThemeModule,
    CommonModule,
    WhitelistRoutingModule,
    TranslateModule,
    SharedSMModule,
    MatIconModule,
    MatTableModule,
    MatCheckboxModule,
    MatTooltipModule,
    MaterialModule,
  ]
})
export class WhitelistModule {
}
