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
import { SearchDisputeRoutingModule } from './search-dispute-routing.module';
import { SearchDisputeComponent } from './search-dispute.component';
import { CreateDisputeComponent } from './create-dispute/create-dispute.component';
import { EditDisputeComponent } from './edit-dispute/edit-dispute.component';
import { DetailDisputeComponent } from './detail-dispute/detail-dispute.component';
import { ReplyDisputeComponent } from './reply-dispute/reply-dispute.component';
import { ReplyEditDisputeComponent } from './reply-edit-dispute/reply-edit-dispute.component';
import { ReplyDetailDisputeComponent } from './reply-detail-dispute/reply-detail-dispute.component';


@NgModule({
  declarations: [
    SearchDisputeComponent,
    CreateDisputeComponent,
    EditDisputeComponent,
    DetailDisputeComponent,
    ReplyDisputeComponent,
    ReplyEditDisputeComponent,
    ReplyDetailDisputeComponent
  ],
  imports: [
    CommonModule,
    SearchDisputeRoutingModule,
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
export class SearchDisputeModule { }
