import { DialogManagementService } from './../services/dialog-management.service';
import { DformTooltipConfirmComponent } from './dform-tooltip-confirm/dform-tooltip-confirm.component';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DformConfirmComponent } from './dform-confirm/dform-confirm.component';
import { DformTooltipRejectComponent } from './dform-tooltip-reject/dform-tooltip-reject.component';
import { DialogConfirmComponent } from './dialog-confirm/dialog-confirm.component';
import { DialogErrorComponent } from './dialog-error/dialog-error.component';
import { DialogSuccessComponent } from './dialog-success/dialog-success.component';
import { IConfirmModel, IErrorModel } from './dialog.model';
import { DialogViewImagesComponent } from './dialog-view-images/dialog-view-images.component';
import { DformConfirmOtpComponent } from './dform-confirm-otp/dform-confirm-otp.component';

@Injectable()
export class DformDialogService {
  constructor(
    private dialog: MatDialog,
    private dialogManagementService: DialogManagementService
  ) { }

  error(data: IErrorModel, callback?: (result: boolean) => void) {
    const dialogRef = this.dialog.open(DialogErrorComponent, { data, panelClass: 'dialog-dform' });
    if (callback) {
      dialogRef.afterClosed().subscribe(callback);
    }
    this.dialogManagementService.addDialogRef(dialogRef);
  }

  success(data: IErrorModel, callback?: (result: boolean) => void) {
    const dialogRef = this.dialog.open(DialogSuccessComponent, { data, panelClass: 'dialog-dform' });
    if (callback) {
      dialogRef.afterClosed().subscribe(callback);
    }
    this.dialogManagementService.addDialogRef(dialogRef);
  }

  confirm(data: IConfirmModel, callback: (result: boolean) => void) {
    const dialogRef = this.dialog.open(DialogConfirmComponent, { data, panelClass: 'dialog-dform' });
    dialogRef.afterClosed().subscribe(callback);
    this.dialogManagementService.addDialogRef(dialogRef);
  }

  dformconfirm(data: IConfirmModel, callback: (result: { status: number, data: string }) => void) {
    const dialogRef = this.dialog.open(DformConfirmComponent, { data, panelClass: 'dialog-dform' });
    dialogRef.afterClosed().subscribe(callback);
    this.dialogManagementService.addDialogRef(dialogRef);
  }

  dformconfirmOtp(data: IConfirmModel, callback: (result: { status: number, data: string }) => void) {
    const dialogRef = this.dialog.open(DformConfirmOtpComponent,
      { data, panelClass: 'dialog-dform' });
    dialogRef.afterClosed().subscribe(callback);
    this.dialogManagementService.addDialogRef(dialogRef);
  }

  componentDialog(component: any, data: any, callback: any) {
    const dialogRef = this.dialog.open(component, data);
    dialogRef.afterClosed().subscribe(callback);
    this.dialogManagementService.addDialogRef(dialogRef);
  }

  confirmChange(data: IConfirmModel) {
    const dialogRef = this.dialog.open(DialogConfirmComponent, { data, panelClass: data.panelClass });
    this.dialogManagementService.addDialogRef(dialogRef);
    return dialogRef.afterClosed();
  }

  closeAll() {
    this.dialogManagementService.closeAll();
  }

  dformTooltipReject(data: IConfirmModel, callback: (result: boolean) => void) {
    const dialogRef = this.dialog.open(DformTooltipRejectComponent,
      {
        data,
        panelClass: 'dialog-tooltip-reject',
        backdropClass: 'backdrop-dialog-tooltip-reject'
      }
    );
    dialogRef.afterClosed().subscribe(callback);
    this.dialogManagementService.addDialogRef(dialogRef);
  }

  dformTooltipConfirm(data: IConfirmModel, callback: (result: boolean) => void) {
    const dialogRef = this.dialog.open(DformTooltipConfirmComponent,
      {
        data,
        panelClass: 'dialog-tooltip-reject',
        backdropClass: 'backdrop-dialog-tooltip-reject'
      }
    );
    dialogRef.afterClosed().subscribe(callback);
    this.dialogManagementService.addDialogRef(dialogRef);
  }

  dformViewImage(data: IConfirmModel, callback: (result: boolean) => void) {
    const dialogRef = this.dialog.open(DialogViewImagesComponent,
      {
        data,
        minWidth: '782px',
        height: '65vh',
        panelClass: 'dialog-view-image',
        backdropClass: 'backdrop-dialog-view-image'
      }
    );
    dialogRef.afterClosed().subscribe(callback);
    this.dialogManagementService.addDialogRef(dialogRef);
  }
}
