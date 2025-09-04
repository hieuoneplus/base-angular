import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';
import { SharedSMModule } from '@shared-sm';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { ThemeModule } from 'src/app/theme/theme.module';
import {MaterialModule} from '../../../../shared/material.module';
import { WhitelistCategoriesRoutingModule } from './whitelist-categories-routing.module';
import {WhitelistCategoriesComponent} from "./whitelist-categories.component";
import {AddWhitelistCategoriesComponent} from "./add-whitelist-categories/add-whitelist-categories.component";
import {DetailWhitelistCategoriesComponent} from "./detail-whitelist-categories/detail-whitelist-categories.component";
import { EditWhitelistCategoriesComponent } from './edit-whitelist-categories/edit-whitelist-categories.component';
import { WhitelistCategoriesHistoriesComponent } from './whitelist-categories-histories/whitelist-categories-histories.component';
import { DetailWhitelistCategoriesHistoryComponent } from './detail-whitelist-categories-histories/detail-whitelist-categories-histories.component';


@NgModule({
  declarations: [
    WhitelistCategoriesHistoriesComponent,
    DetailWhitelistCategoriesHistoryComponent,
    WhitelistCategoriesComponent, AddWhitelistCategoriesComponent, DetailWhitelistCategoriesComponent,EditWhitelistCategoriesComponent,
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
    WhitelistCategoriesRoutingModule,
  ]
})
export class WhitelistCategoriesModule {
}
