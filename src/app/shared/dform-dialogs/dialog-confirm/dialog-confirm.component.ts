import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DFORM_CONFIRM_STATUS } from 'src/app/public/constants';
import { DformConfirmComponent } from '../dform-confirm/dform-confirm.component';
@Component({
  selector: 'mbb-dialog-confirm',
  templateUrl: './dialog-confirm.component.html',
  styleUrls: ['./dialog-confirm.component.scss']
})
export class DialogConfirmComponent {
  confirm!: string;
  isRequired = false;
  characterNumberandTex = /[^A-Za-z0-9 ]/g;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DformConfirmComponent>,
  ) {
    this.dialogRef.disableClose = true;
  }

  onCancelConfirm() {
    if (!this.confirm && this.data?.description && this.data?.closeBtn != 'btn.cancel') {
      this.isRequired = true;
    } else {
      if (this.dialogRef.close) {
        this.dialogRef.close({ status: DFORM_CONFIRM_STATUS.CANCELED, data: this.confirm });
      }
    }
  }

  onUpdateConfirm() {
    if (!this.confirm && this.data?.description && this.data?.acceptBtn !== 'btn.accept') {
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
    // this.confirm = this.confirm.trim();
  }
}

