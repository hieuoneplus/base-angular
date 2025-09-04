import { Component, Inject, Injector } from '@angular/core';
import { finalize, takeUntil } from 'rxjs/operators';
import { ComponentAbstract, MessageSeverity, ToastService } from '@shared-sm';
import ErrorUtils from '../../../../../shared/utils/ErrorUtils';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {BlacklistService} from "../../../service/BlacklistService";
import {IBlacklistHistoryContent} from "../../modal/interface";
import {STATUS_LABEL_TRANSACTION_TYPE, STATUS_LABEL_ACCOUNT_TYPE} from '../../modal/constant'

@Component({
  selector: 'app-detail-history-blacklist',
  templateUrl: './detail-history.component.html',
  styleUrls: ['./detail-history.component.scss'],
})
export class DetailHistoryComponent extends ComponentAbstract {
  detailContent: IBlacklistHistoryContent;
  isLoadedData: boolean = false;
  constructor(
    protected injector: Injector,
    private toastService: ToastService,
    public dialogRef: MatDialogRef<DetailHistoryComponent>,
    private blacklistService: BlacklistService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(injector);
  }

  protected componentInit(): void {
    if (!this.isLoadedData) {
      this.getBlacklistHistoryDetail();
    }
  }

  getBlacklistHistoryDetail() {
    this.blacklistService
      .getDetailHistory(this.data.idHistory)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        finalize(() => {})
      )
      .subscribe(
        (res) => {
          console.log('RESPONSE', res);
          // Gọi API thành công và có data trả về
          if (res && res.status === 200) {
            this.detailContent = res.data;
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
    this.isLoadedData = true;
  }

  getLabelTransactionTyppe(transactionType: string) {
    const transType = STATUS_LABEL_TRANSACTION_TYPE.find(item => item.key === transactionType);
    if (transType) {
      return `${transType.value}</label>`;
    } else {
      return '';
    }
  }

  getLabelAccountTyppe(accountType: string) {
    const accType = STATUS_LABEL_ACCOUNT_TYPE.find(item => item.key === accountType);
    if (accType) {
      return `${accType.value}</label>`;
    } else {
      return '';
    }
  }

  closeDialog() {
    if (this.dialogRef.close) {
      this.dialogRef.close(null);
    }
  }
}
