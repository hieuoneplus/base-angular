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

import { BlacklistRoutingModule } from './blacklist-routing.module';
import { SearchBlacklistComponent } from './search-blacklist.component';
import {AddBlacklistComponent} from "./add-blacklist/add-blacklist.component";
import {DetailBlacklistComponent} from "./detail-blacklist/detail-blacklist.component";
import { EditBlacklistComponent} from "./edit-blacklist/edit-blacklist.component";
import {HistoryComponent} from "./history/history.component";
import {DetailHistoryComponent} from "./history/detail/detail-history.component";

@NgModule({
  declarations: [
    SearchBlacklistComponent, AddBlacklistComponent, DetailBlacklistComponent, EditBlacklistComponent, HistoryComponent, DetailHistoryComponent
  ],
  imports: [
    ThemeModule,
    CommonModule,
    BlacklistRoutingModule,
    TranslateModule,
    SharedSMModule,
    MatIconModule,
    MatTableModule,
    MatCheckboxModule,
    MatTooltipModule,
    MaterialModule,
  ]
})
export class BlacklistModule {
}
