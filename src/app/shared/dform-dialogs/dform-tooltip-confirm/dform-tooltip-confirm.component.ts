import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { turnAlphanumberic } from '../../utils/utils.function';

@Component({
  selector: 'app-dform-tooltip-confirm',
  templateUrl: './dform-tooltip-confirm.component.html',
  styleUrls: ['./dform-tooltip-confirm.component.scss']
})
export class DformTooltipConfirmComponent {
  btnElement: any;
  confirm: any;
  isAdditional = false;
  isRequired = false;
  characterNumberandTex = /[^A-Za-z0-9 ]/g;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DformTooltipConfirmComponent>,
  ) {
    this.dialogRef.disableClose = false;
  }

  ngOnInit() {
    this.btnElement = document.querySelectorAll('.btnREFUSE');
    const matDialogConfig = new MatDialogConfig();
    const rect: DOMRect = this.btnElement[0].getBoundingClientRect();
    matDialogConfig.position = { left: `${rect.left - 90}px`, bottom: `70px` };
    this.dialogRef.updatePosition(matDialogConfig.position);
    this.btnElement[0].setAttribute('disabled', 'true');
    
    this.dialogRef.backdropClick().subscribe(() => { 
      this.btnElement[0].removeAttribute('disabled'); 
    });
    this.confirm = this.data.confirm;
  }

  onUpdateConfirm() {
    if (this.dialogRef.close) {
      this.dialogRef.close({ status: 2, data: this.confirm }); 
    }
  }

  closeDialog() {
    if (this.dialogRef.close) {
      this.btnElement[0].removeAttribute('disabled'); 
      this.dialogRef.close({ status: 0 });
    }
  }

  ngModelChange() {
    this.confirm = turnAlphanumberic(this.confirm, this.characterNumberandTex)
    this.confirm = this.confirm;
  }

  onCancelConfirm() {
    this.dialogRef.close({ status: 1, data: this.confirm }); 
  }
}
