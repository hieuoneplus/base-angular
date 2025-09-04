import { Component, Inject, Injector } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ComponentAbstract, MessageSeverity } from '@shared-sm';
import { finalize, takeUntil } from 'rxjs/operators';
import ErrorUtils from 'src/app/shared/utils/ErrorUtils';
import { TransferChannelLimitService } from '../../../service/TransferChannelLimitService';
import { IDetailHistoryConfig } from '../../modal/interface';

@Component({
  selector: 'app-detail-history',
  templateUrl: './detail-history.component.html',
  styleUrls: ['./detail-history.component.scss']
})
export class DetailHistoryTransferChannelLimitComponent extends ComponentAbstract{

  dataHistoryConfig: IDetailHistoryConfig
  private dataLoaded = false;

  constructor(
    protected injector: Injector,
    public dialogRef: MatDialogRef<DetailHistoryTransferChannelLimitComponent>,
    private transferChannelLimitService: TransferChannelLimitService,
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
    this.transferChannelLimitService.getDetailHistory(this.data.id).pipe(
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
