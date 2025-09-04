import { Injectable } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class DialogManagementService {

  dialogRefs: MatDialogRef<any, any>[] = new Array();

  constructor() { }

  addDialogRef(dialogRef: MatDialogRef<any, any>) {
    dialogRef.afterClosed().subscribe(() => {
      _.remove(this.dialogRefs, (ref: { id: string; }) => {
        if (ref.id === dialogRef.id) {
          return true;
        }
        return false;
      });
    });
    this.dialogRefs.push(dialogRef);
  }

  closeAll() {
    this.dialogRefs.forEach(dialogRef => {
      dialogRef.close();
    });
  }
}
