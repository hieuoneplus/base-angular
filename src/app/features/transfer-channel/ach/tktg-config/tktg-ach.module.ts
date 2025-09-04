import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';
import { SharedSMModule } from '@shared-sm';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { ThemeModule } from 'src/app/theme/theme.module';
import { TktgACHRoutingModule } from './tktg-ach-routing.module';
import { MaterialModule } from 'src/app/shared/material.module';
import { TktgACHComponent } from './tktg-ach.component';
import { AddTktgACHComponent } from './add-tktg-ach/add-tktg-ach.component';
import { DetailTktgACHComponent } from './detail-tktg-ach/detail-tktg-ach.component';
import { EditTktgACHComponent } from './edit-tktg-ach/edit-tktg-ach.component';

@NgModule({
  declarations: [
    TktgACHComponent,
    AddTktgACHComponent,
    DetailTktgACHComponent,
    EditTktgACHComponent,
  ],
  imports: [
    ThemeModule,
    CommonModule,
    TktgACHRoutingModule,
    TranslateModule,
    SharedSMModule,
    MatIconModule,
    MatTableModule,
    MatCheckboxModule,
    MatTooltipModule,
    MaterialModule,
  ]
})
export class TktgACHModule {
}
