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
import { FlagReportRoutingModule } from './flag-report-routing.module';
import { FlagReportComponent } from './flag-report.component';
import { DetailFlagReportComponent } from './detail-flag-report/detail-flag-report.component';
import { CreateFlagReportComponent } from './create-flag-report/create-flag-report.component';
import { EditFlagReportComponent } from './edit-flag-report/edit-flag-report.component';


@NgModule({
  declarations: [
    FlagReportComponent,
    DetailFlagReportComponent,
    CreateFlagReportComponent,
    EditFlagReportComponent
  ],
  imports: [
    CommonModule,
    FlagReportRoutingModule,
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
export class FlagReportModule { }
