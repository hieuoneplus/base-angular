import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { turnAlphanumberic } from '../../utils/utils.function';

@Component({
  selector: 'app-dform-tooltip-reject',
  templateUrl: './dform-tooltip-reject.component.html',
  styleUrls: ['./dform-tooltip-reject.component.scss']
})
export class DformTooltipRejectComponent implements OnInit{
  btnElement: any;
  confirm!: string;
  isAdditional = false;
  isRequired = false;
  isShowCheckBox = true;
  characterNumberandTex = /[^A-Za-z0-9 ]/g;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DformTooltipRejectComponent>,
  ) {
    this.dialogRef.disableClose = false;
  }

  ngOnInit(): void {
    this.isShowCheckBox = this.data.isShowCheckBox === false ? false : true;
    this.btnElement = document.querySelectorAll('.btnREFUSE');
    const matDialogConfig = new MatDialogConfig();
    const rect: DOMRect = this.btnElement[0].getBoundingClientRect();
    matDialogConfig.position = { left: `${rect.left - 90}px`, bottom: `70px` };
    this.dialogRef.updatePosition(matDialogConfig.position);
    this.btnElement[0].setAttribute('disabled', 'true');
    this.dialogRef.backdropClick().subscribe(() => {
      this.btnElement[0].removeAttribute('disabled');
    });
  }

  onUpdateConfirm() {
    if (!this.confirm?.trim() && this.data?.description?.trim()) {
      this.isRequired = true;
    } else {
      if (this.dialogRef.close) {
        this.dialogRef.close({ status: this.isAdditional ? 2 : 1, data: this.confirm });
      }
    }
  }

  closeDialog() {
    if (this.dialogRef.close) {
      this.btnElement[0].removeAttribute('disabled');
      this.dialogRef.close({ status: 0 });
    }
  }

  ngModelChange() {
    this.confirm = turnAlphanumberic(this.confirm?.trim(), this.characterNumberandTex);
  }
}
