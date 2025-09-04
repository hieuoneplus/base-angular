import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';
import { SharedSMModule } from '@shared-sm';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { ThemeModule } from 'src/app/theme/theme.module';
import { SearchBlacklistComponent } from './search-blacklist.component';
import { BlacklistRoutingModule } from "./blacklist-routing.module";
import { AddBlacklistComponent } from "./add-blacklist/add-blacklist.component";
import { EditAccountComponent } from "./edit-blacklist/edit-account.component";
import { MaterialModule } from 'src/app/shared/material.module';
import { HistoryComponent } from './history/history.component';


@NgModule({
  declarations: [
    SearchBlacklistComponent, AddBlacklistComponent, EditAccountComponent, HistoryComponent
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
