import { Component, Inject, Injector } from '@angular/core';
import { finalize, takeUntil } from 'rxjs/operators';
import { ComponentAbstract, MessageSeverity, ToastService } from '@shared-sm';
import { IStateTreasuriesHistoryContent, IWhitelistCategoryHistoryContent } from 'src/app/features/model/citad';
import { WhitelistCategoriesService } from '../../services/whitelist-categories';
import ErrorUtils from 'src/app/shared/utils/ErrorUtils';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StateTreasuryConfigService } from '../../services/state-treasury-config-service.service';

@Component({
  selector: 'app-detail-state-treasuries-histories',
  templateUrl: './detail-state-treasuries-histories.component.html',
  styleUrls: ['./detail-state-treasuries-histories.component.scss'],
})
export class DetailStateTreasuriesHistoryComponent extends ComponentAbstract {
  stateTreasuriesHistoryDetail: IStateTreasuriesHistoryContent;
  isLoadedData: boolean = false;
  constructor(
    protected injector: Injector,
    private toastService: ToastService,
    public dialogRef: MatDialogRef<DetailStateTreasuriesHistoryComponent>,
    private stateTreasuryConfigService: StateTreasuryConfigService,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    super(injector);
  }

  protected componentInit(): void {
    if (!this.isLoadedData) {
      this.getStateTreasuryDetail();
    }
  }

  getStateTreasuryDetail() {
    this.stateTreasuryConfigService
      .getStateTreasuriesHistoryDetail(this.data.idHistory)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        finalize(() => {})
      )
      .subscribe(
        (res) => {
          console.log('RESPONSE', res);
          this.isLoadedData = true;
          // Gọi API thành công và có data trả về
          if (res && res.status === 200) {
            this.stateTreasuriesHistoryDetail = res.data;

            this.hasDataSource = true;
          }
        },
        (error) => {
          const errMessage = ErrorUtils.getErrorMessage(error);
          this.toastService.showToastr(
            errMessage.join('\n'),
            'Thông báo',
            MessageSeverity.error
          );
        }
      );
  }
  closeDialog() {
    if (this.dialogRef.close) {
      this.dialogRef.close(null);
    }
  }
}
