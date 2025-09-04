import { Component, Injector } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ComponentAbstract, MessageSeverity } from '@shared-sm';
import { EMPTY, of, forkJoin } from 'rxjs';
import { finalize, switchMap, takeUntil, catchError, map } from 'rxjs/operators';
import { BUTTON_CANCEL, TOAST_DEFAULT_CONFIG, TYPE_BTN_FOOTER, BUTTON_EDIT, BUTTON_UNDO } from 'src/app/public/constants';
import { ModuleKeys } from 'src/app/public/module-permission.utils';
import ErrorUtils from 'src/app/shared/utils/ErrorUtils';
import { RefundService } from '../../../services/refund.service';
import { URL, COLUMS, BUTTON_REJECT, BUTTON_APPROVE, STATUS_LABEL_STATUS, STATUS_LABEL_STATUS_BATCH } from '../../modal/constant';

import { IParamsSearch, IResponseTransactionOriginal, IResponseTransactionRefund, IParamsSearchBatch, IResponseTransactionRefundBatch } from '../../modal/interface';

@Component({
  selector: 'app-detail-refund-batch',
  templateUrl: './detail-refund-batch.component.html',
  styleUrls: ['./detail-refund-batch.component.scss']
})
export class DetailRefundBatchComponent extends ComponentAbstract {

  displayedColumns = COLUMS;
  paramsTransactionRefund: IParamsSearch;

  dataTransactionOrigin: IResponseTransactionOriginal;
  dataTransactionRefund: IResponseTransactionRefund;
  dataTransactionRefundBatch: IResponseTransactionRefundBatch;

  constructor(
    protected injector: Injector,
    private refundService: RefundService,
  ) {
    super(injector);
  }

  componentInit(): void {
    this.enableActions(ModuleKeys.napas_ibft_reconcile_return);
    this.displayedColumns = this.displayedColumns.filter(col => col !== 'actions');
    this.searchTransactionOrigin()
  }

  searchTransactionOrigin() {
    if (!this.queryParams.batchId) return
    const rawParamsOrigin: IParamsSearchBatch = {
      id: this.queryParams?.batchId,
      page: 1,
      size: 10,
    };
    const paramsTransactionOrigin = this.cleanObject(rawParamsOrigin);

    const rawParamsRefund: IParamsSearch = {
      batchId: this.queryParams.batchId,
      page: this.pageIndex + 1,
      size: this.pageSize,
    };

    this.paramsTransactionRefund = this.cleanObject(rawParamsRefund);

    this.indicator.showActivityIndicator();
    forkJoin({
      transactionRefundBatch: this.pageIndex === 0 ? this.refundService.getTransactionRefundBatch(paramsTransactionOrigin as IParamsSearchBatch) : of(null),
      transactionRefund: this.refundService.getTransactionRefund(this.paramsTransactionRefund as IParamsSearch),
    }).pipe(
      takeUntil(this.ngUnsubscribe),
      finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe(({ transactionRefundBatch, transactionRefund }) => {
      if(transactionRefundBatch) {
        this.dataTransactionRefundBatch = transactionRefundBatch.data.batchReturnResponses[0]
      }
      if (transactionRefund) {
        this.hasDataSource = true;
        const page = this.pageIndex * this.pageSize;
        const data = transactionRefund.data.returnResponses.filter(s => s.returnType ==='REQUEST').map((obj, index) => {
          obj.stt = page + index + 1;
          return obj;
        });

        this.dataSource = new MatTableDataSource(data);
        this.totalItem = transactionRefund.data.total;
      }

      this.loadBtn();
    }, error => {
      this.hasDataSource = false;
      const messageError = ErrorUtils.getErrorMessage(error);
      this.toastr.showToastr(
        messageError.join('\n'),
        'Thông báo!',
        MessageSeverity.error,
        TOAST_DEFAULT_CONFIG
      );
      this.loadBtn();
    });
  }

  cleanObject<T>(obj: T): Partial<T> {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        (acc as any)[key] = value;
      }
      return acc;
    }, {} as Partial<T>);
  }

  changePageIndex($event) {
    this.pageSize = $event.pageSize;
    this.pageIndex = $event.pageIndex;
    this.paramsTransactionRefund = {
      ...this.paramsTransactionRefund,
      size: this.pageSize,
      page: this.pageIndex + 1,
    };
    this.searchTransactionOrigin();
  }

  getLabel($status: any) {
    const status = STATUS_LABEL_STATUS.find(item => item.key === $status);
    if (status) {
      return `<label class="wf-status ${status.class}">${status.value}</label>`;
    } else {
      return '';
    }
  }

  getLabelStatusBatch($status: any) {
    const status = STATUS_LABEL_STATUS_BATCH.find(item => item.key === $status);
    if (status) {
      return `<label class="wf-status ${status.class}">${status.value}</label>`;
    } else {
      return '';
    }
  }

  loadBtn() {
    let listBtn = []
    listBtn.unshift(BUTTON_UNDO)
    this.listButton = this.listButtonDynamic('', ...listBtn)
  }

  onClickBtn($event?: any): void {
    switch ($event) {
      case TYPE_BTN_FOOTER.TYPE_UNDO:
        this.goTo(URL.NAPAS.IBFT_RECONCILE.OUT.REFUND.SEARCH_BATCH);
        break;
      case TYPE_BTN_FOOTER.TYPE_DELETE:
        break;
      case TYPE_BTN_FOOTER.TYPE_APPROVER:
        break;
      case TYPE_BTN_FOOTER.TYPE_EDIT:
    }
  }
}
