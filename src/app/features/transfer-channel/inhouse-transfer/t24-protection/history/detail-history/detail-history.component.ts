import {ChangeDetectorRef, Component, Inject, Injector} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ComponentAbstract, MessageSeverity } from '@shared-sm';
import { finalize, takeUntil } from 'rxjs/operators';
import ErrorUtils from 'src/app/shared/utils/ErrorUtils';
import { T24ProtectionService } from '../../../services/t24-protection.service';
import { IDetailHistoryConfig } from '../../model/interface';

@Component({
  selector: 'app-detail-history',
  templateUrl: './detail-history.component.html',
  styleUrls: ['./detail-history.component.scss']
})
export class DetailHistoryComponent extends ComponentAbstract{
  protected readonly JSON = JSON;
  dataHistoryConfig: IDetailHistoryConfig
  private dataLoaded = false;

  constructor(
    protected injector: Injector,
    public dialogRef: MatDialogRef<DetailHistoryComponent>,
    private t24ProtectionService: T24ProtectionService,
    @Inject(MAT_DIALOG_DATA) private data: any,
  ) {
    super(injector);
   }

   protected componentInit(): void {
    if (!this.dataLoaded) {
      this.getDetailHistoryConfig();
    }
  }

  getDetailHistoryConfig() {
    this.indicator.showActivityIndicator();
    this.t24ProtectionService.getDetailHistory(this.data.id).pipe(
      finalize(() => {
        this.indicator.hideActivityIndicator();
      }),
      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      next: (res) => {
        if (res && res.data) {
          this.dataHistoryConfig = res.data
          this.dataLoaded = true;
        }
      },
      error: (err) => {
        this.closeDialog()
        const errMessage = ErrorUtils.getErrorMessage(err)
        this.toastr.showToastr(errMessage.join('\n'), "Thông báo", MessageSeverity.error)
      }
    })
  }

  closeDialog() {
    if (this.dialogRef.close) { this.dialogRef.close(null); }
  }
}
