import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { DFORM_CONFIRM_STATUS } from 'src/app/public/constants';

@Component({
  selector: 'mbb-dform-confirm-otp',
  templateUrl: './dform-confirm-otp.component.html',
  styleUrls: ['./dform-confirm-otp.component.scss']
})
export class DformConfirmOtpComponent{
  confirm!: string;
  isRequired = false;
  characterNumberandTex = /[^A-Za-z0-9 ]/g;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DformConfirmOtpComponent>,
  ) {
    this.dialogRef.disableClose = true;
  }

  onCancelConfirm() {
    if (!this.confirm && this.data?.description && this.data?.closeBtn != 'btn.cancel'){
      this.isRequired = true;
    } else {
      if (this.dialogRef.close) {
        this.dialogRef.close({ status: DFORM_CONFIRM_STATUS.CONFIRMED, data: this.confirm });
      }
    }
  }

  onUpdateConfirm() {
    if (!this.confirm && this.data?.description && this.data?.acceptBtn !== 'btn.accept'){
      this.isRequired = true;
    } else {
      if (this.dialogRef.close) {
        this.dialogRef.close({ status: DFORM_CONFIRM_STATUS.CONFIRMED, data: this.confirm });
      }
    }
  }

  closeDialog() {
    if (this.dialogRef.close) { this.dialogRef.close({ status: 0 }); }
  }

  ngModelChange() {
    // this.confirm = turnAlphanumberic(this.confirm, this.characterNumberandTex).trim();
    this.confirm = this.confirm.trim();
  }
}
