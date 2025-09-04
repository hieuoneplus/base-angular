import { ChangeDetectorRef, Component, ElementRef, Injector, ViewChild } from '@angular/core';
import { ComponentAbstract, MessageSeverity, TextControlComponent } from '@shared-sm';
import * as moment from 'moment';
import { EMPTY, of, forkJoin } from 'rxjs';
import { finalize, switchMap, takeUntil, catchError, map } from 'rxjs/operators';
import {  BUTTON_CANCEL, DFORM_CONFIRM_STATUS, TOAST_DEFAULT_CONFIG, TYPE_BTN_FOOTER, BUTTON_EDIT } from 'src/app/public/constants';
import { ModuleKeys } from 'src/app/public/module-permission.utils';
import ErrorUtils from 'src/app/shared/utils/ErrorUtils';
import { RefundService } from '../../services/refund.service';
import { URL, BUTTON_REJECT, BUTTON_APPROVE, STATUS_LABEL_STATUS, STATUS_LABEL_STATUS_BATCH } from '../modal/constant';

import {IApproveTransactionRefund, IParamsSearch, IResponseTransactionOriginal, IParamsSearchTransactionOrigin, ICreateTransactionRefund, IResponseTransactionRefund, IResponseTransactionDispute } from '../modal/interface';

@Component({
  selector: 'app-detail-refund',
  templateUrl: './detail-refund.component.html',
  styleUrls: ['./detail-refund.component.scss']
})
export class DetailRefundComponent extends ComponentAbstract {


  dataTransactionOrigin: IResponseTransactionOriginal;
  dataTransactionRefund: IResponseTransactionRefund;
  dataTransactionDispute: IResponseTransactionDispute[]
  requestTransactionRefund: ICreateTransactionRefund | null = null;

  bodyApprove: IApproveTransactionRefund;

  processBatch: any;
  percent = 0;
  selectedFiles: File;
  idDispute: string;

  @ViewChild('file') myInputVariable: ElementRef;
  @ViewChild('amountValue') amountValue: TextControlComponent;

  constructor(
    protected injector: Injector,
    private refundService: RefundService,
    private cdr: ChangeDetectorRef
  ) {
    super(injector);
  }

  componentInit(): void {
    this.enableActions(ModuleKeys.napas_ibft_reconcile_return);
    this.searchTransactionOrigin()
  }

  searchTransactionOrigin() {
    if (!this.queryParams.origTransactionReference) return 
      const rawParamsOrigin: IParamsSearchTransactionOrigin = {
        transactionReferenceNumber: this.queryParams.origTransactionReference,
        systemTraceAuditNumber: history.state.traceNumber || '',
        transactionDate: this.queryParams.transactionDate,
      };
      const paramsTransactionOrigin = this.cleanObject(rawParamsOrigin);

      const rawParamsRefund: IParamsSearch = {
        id: this.queryParams.id,
        page: 1,
        size: 10,
      };

      const paramsTransactionRefund = this.cleanObject(rawParamsRefund);
  
      this.indicator.showActivityIndicator();
      forkJoin({
        transactionOrigin: this.refundService.getTransactionOrigin(paramsTransactionOrigin as IParamsSearchTransactionOrigin),
        transactionRefund: this.refundService.getTransactionRefund(paramsTransactionRefund as IParamsSearch),
      }).pipe(
        takeUntil(this.ngUnsubscribe),
        finalize(() => this.indicator.hideActivityIndicator())
      ).subscribe(({ transactionOrigin, transactionRefund }) => {
        if (transactionOrigin && transactionOrigin.status === 200 && transactionOrigin.data.content && transactionOrigin.data.content.length > 0) {
          this.hasDataSource = true;
          this.dataTransactionOrigin = transactionOrigin.data.content[0];
        } else {
          this.hasDataSource = false;
          this.toastr.showToastr(
            transactionOrigin.soaErrorDesc || 'Không tồn tại giao dịch gốc',
            'Thông báo!',
            MessageSeverity.error,
            TOAST_DEFAULT_CONFIG
          );
        }
  
        if (transactionRefund) {
          this.dataTransactionRefund = transactionRefund.data.returnResponses[0]
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

  convertMoney(money: number) {
    return money !== null
      ? money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      : null;
  }

  convertToTimeFormat(timeStr: string): string {
    if (!timeStr || timeStr.length !== 6) return '';
    return timeStr.slice(0, 2) + ':' + timeStr.slice(2, 4) + ':' + timeStr.slice(4, 6);
  }

  convertToDateFormat(dateStr: string): string {
    if (!dateStr || dateStr.length !== 4) return '';
    return dateStr.slice(2, 4) + '-' + dateStr.slice(0, 2);
  }

  // getLabel($status: any) {
  //   const status = STATUS_LABLE.find(item => item.key === $status);
  //   if (status) {
  //     return `<label class="wf-status ${status.class}">${status.value}</label>`;
  //   } else {
  //     return '';
  //   }
  // }

  onClickReject() {
    this.dialogService.dformconfirm(
      {
        label: 'Từ chối yêu cầu hoàn trả',
        title: 'Lý do',
        description: 'Nhập lý do từ chối yêu cầu hoàn trả',
        acceptBtn: 'Xác nhận',
        closeBtn: 'Hủy',
        maxLength: 400,
      },
      (result: any) => {
        if (result && result.status === DFORM_CONFIRM_STATUS.CONFIRMED) {
          this.bodyApprove = {
            action: 'REJECT',
            id: this.dataTransactionRefund.id,
            reason: result.data,
          }
          this.indicator.showActivityIndicator();
          this.refundService
            .approveTransactionRefund(this.bodyApprove)
            .pipe(
              takeUntil(this.ngUnsubscribe),
              finalize(() => this.indicator.hideActivityIndicator())
            )
            .subscribe(
              (res) => {
                console.log('RESPONSE', res);
                this.toastr.showToastr(
                  'Từ chối yêu cầu hoàn trả thành công',
                  'Thông báo!',
                  MessageSeverity.success,
                  TOAST_DEFAULT_CONFIG
                );
                this.goTo(URL.NAPAS.IBFT_RECONCILE.OUT.REFUND.SEARCH);
              },
              (error) => {
                console.log('ERROR', error);
                const messageError = ErrorUtils.getErrorMessage(error);
                this.toastr.showToastr(
                  messageError.join('\n'),
                  'Thông báo!',
                  MessageSeverity.error,
                  TOAST_DEFAULT_CONFIG
                );
              }
            );
        }
      }
    );
  }

  onClickApprove() {
    this.dialogService.confirm(
      {
        label: 'Duyệt yêu cầu hoàn trả',
        acceptBtn: 'Xác nhận',
        closeBtn: 'Hủy',
        message: 'Bạn có chắc chắn muốn duyệt yêu cầu hoàn trả?',
      },
      (result: any) => {
        if (result && result.status === DFORM_CONFIRM_STATUS.CONFIRMED) {
          this.bodyApprove = {
            action: 'APPROVE',
            id: this.dataTransactionRefund.id,
            reason: result.data,
          }
          this.indicator.showActivityIndicator();
          this.refundService
            .approveTransactionRefund(this.bodyApprove)
            .pipe(
              takeUntil(this.ngUnsubscribe),
              finalize(() => this.indicator.hideActivityIndicator())
            )
            .subscribe(
              (res) => {
                if (res && res.status === 200) {
                  this.toastr.showToastr(
                    'Phê duyệt yêu cầu hoàn trả thành công',
                    'Thông báo!',
                    MessageSeverity.success,
                    TOAST_DEFAULT_CONFIG
                  );
                  this.goTo(URL.NAPAS.IBFT_RECONCILE.OUT.REFUND.SEARCH);
                }
              },
              (error) => {
                const messageError = ErrorUtils.getErrorMessage(error);
                this.toastr.showToastr(
                  messageError.join('\n'),
                  'Thông báo!',
                  MessageSeverity.error,
                  TOAST_DEFAULT_CONFIG
                );
              }
            );
        }
      }
    );
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
  
  onClickEdit() {
    this.goTo(URL.NAPAS.IBFT_RECONCILE.OUT.REFUND.EDIT_SINGLE, { id: this.dataTransactionRefund?.id, origTransactionReference: this.dataTransactionRefund?.origTransactionReference, transactionDate: this.dataTransactionOrigin?.createdAt, });
  }

  loadBtn() {
    let listBtn = []
    
    if ( this.enableApprove && !this.dataTransactionRefund?.batchId && (this.dataTransactionRefund?.status==='VALIDATED')) {
      listBtn.push(BUTTON_REJECT, BUTTON_APPROVE)
    } 
    if ( this.enableUpdate && !this.dataTransactionRefund?.batchId && (this.dataTransactionRefund?.status==='VALIDATED' || this.dataTransactionRefund?.status ==='VALIDATE_FAILED')) {
      listBtn.push(BUTTON_EDIT)
    }

    listBtn.unshift(BUTTON_CANCEL)
    this.listButton = this.listButtonDynamic('', ...listBtn)
  }

  onClickBtn($event?: any): void {
    switch ($event) {
      case TYPE_BTN_FOOTER.TYPE_CANCEL:
        this.goTo(URL.NAPAS.IBFT_RECONCILE.OUT.REFUND.SEARCH);
        break;
        case TYPE_BTN_FOOTER.TYPE_DELETE:
          this.onClickReject()
          break;
        case TYPE_BTN_FOOTER.TYPE_APPROVER:
          this.onClickApprove()
          break;
        case TYPE_BTN_FOOTER.TYPE_EDIT:
          this.onClickEdit()
    }
  }
}
