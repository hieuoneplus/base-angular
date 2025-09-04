import { TranslateModule } from '@ngx-translate/core';
import { DformDialogService } from './dialog.service';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { DformConfirmComponent } from './dform-confirm/dform-confirm.component';
import { DformConfirmOtpComponent } from './dform-confirm-otp/dform-confirm-otp.component';

import { DformTooltipConfirmComponent } from './dform-tooltip-confirm/dform-tooltip-confirm.component';
import { DformTooltipRejectComponent } from './dform-tooltip-reject/dform-tooltip-reject.component';
import { DialogConfirmComponent } from './dialog-confirm/dialog-confirm.component';
import { DialogErrorComponent } from './dialog-error/dialog-error.component';
import { DialogSuccessComponent } from './dialog-success/dialog-success.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogViewImagesComponent } from './dialog-view-images/dialog-view-images.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCheckboxModule } from '@angular/material/checkbox';
@NgModule({
  imports: [
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatDialogModule,
    CommonModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    FormsModule,
    FlexLayoutModule,
    TranslateModule
  ],
  declarations: [
    DialogErrorComponent,
    DialogConfirmComponent,
    DialogSuccessComponent,
    DformConfirmComponent,
    DformConfirmOtpComponent,
    DformTooltipRejectComponent,
    DformTooltipConfirmComponent,
    DialogViewImagesComponent
  ],
  entryComponents: [
    DialogErrorComponent,
    DialogConfirmComponent,
    DialogSuccessComponent,
    DformConfirmComponent,
    DformTooltipRejectComponent,
    DformTooltipConfirmComponent,
    DialogViewImagesComponent
  ],
  providers: [
    DformDialogService
  ]
})
export class DformDialogModule {}
