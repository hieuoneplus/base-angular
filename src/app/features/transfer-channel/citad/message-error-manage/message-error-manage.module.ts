import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';
import { SharedSMModule } from '@shared-sm';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { ThemeModule } from 'src/app/theme/theme.module';
import { MaterialModule } from 'src/app/shared/material.module';
import { MessageErrorManageRoutingModule } from './message-error-manage-routing.module';
import { MessageErrorManageComponent } from './message-error-manage.component';
import { DetailMessageErrorManageComponent } from './detail-message-error-manage/detail-message-error-manage.component';


@NgModule({
  declarations: [
    MessageErrorManageComponent,
    DetailMessageErrorManageComponent,
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
    MessageErrorManageRoutingModule
  ]
})
export class MessageErrorManageModule {
}
