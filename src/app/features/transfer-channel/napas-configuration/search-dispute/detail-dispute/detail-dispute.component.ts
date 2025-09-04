import { Component, Injector } from '@angular/core';
import { ComponentAbstract, MessageSeverity } from '@shared-sm';
import { finalize, takeUntil } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { BUTTON_CANCEL, BUTTON_EDIT, DFORM_CONFIRM_STATUS, TOAST_DEFAULT_CONFIG, TYPE_BTN_FOOTER } from 'src/app/public/constants';
import ErrorUtils from 'src/app/shared/utils/ErrorUtils';
import { SearchDisputeService } from '../../services/search-dispute.service';
import { BUTTON_APPROVE, BUTTON_REJECT, SELECT_DISPUTE_CLAIM_CODE, SELECT_DISPUTE_STATUS, SELECT_DISPUTE_TYPE_CODE, STATUS_LABEL_INITIALIZE_TRANSACTION, URL } from '../modal/constant';
import { IApproveTransactionDispute, IParamsSearch, IParamsSearchTransactionOrigin, IResponseTransactionDispute, IResponseTransactionOriginal } from '../modal/interface';
import { ModuleKeys } from 'src/app/public/module-permission.utils';
import { approveDisputeStatusEnum, transactionTypeEnum, typeTransactionDisputeEnum } from '../modal/enum';
import * as moment from 'moment';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-detail-dispute',
  templateUrl: './detail-dispute.component.html',
  styleUrls: ['./detail-dispute.component.scss']
})
export class DetailDisputeComponent extends ComponentAbstract {

  dataTransactionOrigin: IResponseTransactionOriginal;
  dataTransactionDispute: IResponseTransactionDispute;
  bodyApprove: IApproveTransactionDispute;

  constructor(
    protected injector: Injector,
    private searchDisputeService: SearchDisputeService,
  ) {
    super(injector)
  }

  protected componentInit(): void {
    this.enableActions(ModuleKeys.napas_ibft_reconcile_dispute);
    this.searchTransactionOrigin()
  }

  searchTransactionOrigin() {
    if (this.queryParams.origTransactionReference) {
      const rawParamsOrigin: IParamsSearchTransactionOrigin = {
        transactionReferenceNumber: this.queryParams.origTransactionReference,
        systemTraceAuditNumber: history.state.traceNumber || '',
        transactionDate: this.queryParams.transactionDate,
      };
      const paramsTransactionOrigin = this.cleanObject(rawParamsOrigin);

      const rawParamsDispute: IParamsSearch = {
        disputeId: this.queryParams.disputeId,
        disputeType: this.queryParams.disputeType,
        pageNumber: 1,
        pageSize: 10,
      };

      const paramsTransactionDispute = this.cleanObject(rawParamsDispute);

      this.indicator.showActivityIndicator();
      forkJoin({
        transactionOrigin: this.searchDisputeService.getTransactionOrigin(paramsTransactionOrigin as IParamsSearchTransactionOrigin),
        dispute: this.searchDisputeService.getTransactionDispute(paramsTransactionDispute as IParamsSearch)
      }).pipe(
        takeUntil(this.ngUnsubscribe),
        finalize(() => this.indicator.hideActivityIndicator())
      ).subscribe(({ transactionOrigin, dispute }) => {
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

        if (dispute) {
          this.dataTransactionDispute = dispute.data.disputes[0]
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
  }

  cleanObject<T>(obj: T): Partial<T> {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        (acc as any)[key] = value;
      }
      return acc;
    }, {} as Partial<T>);
  }

  convertToTimeFormat(timeStr: string): string {
    if (!timeStr || timeStr.length !== 6) return '';
    return timeStr.slice(0, 2) + ':' + timeStr.slice(2, 4) + ':' + timeStr.slice(4, 6);
  }

  convertToDateFormat(dateStr: string): string {
    if (!dateStr || dateStr.length !== 4) return '';
    return dateStr.slice(2, 4) + '-' + dateStr.slice(0, 2);
  }

  onClickReject() {
    this.dialogService.dformconfirm(
      {
        label: 'Từ chối yêu cầu tra soát',
        title: 'Lý do',
        description: 'Nhập lý do từ chối yêu cầu tra soát',
        acceptBtn: 'Xác nhận',
        closeBtn: 'Hủy',
        maxLength: 400,
      },
      (result: any) => {
        if (result && result.status === DFORM_CONFIRM_STATUS.CONFIRMED) {
          this.bodyApprove = {
            action: 'REJECT',
            disputeId: this.queryParams.disputeId,
            reason: result.data,
          }
          this.indicator.showActivityIndicator();
          this.searchDisputeService
            .approveTransactionDispute(this.bodyApprove)
            .pipe(
              takeUntil(this.ngUnsubscribe),
              finalize(() => this.indicator.hideActivityIndicator())
            )
            .subscribe(
              (res) => {
                console.log('RESPONSE', res);
                this.toastr.showToastr(
                  'Từ chối yêu cầu tra soát thành công',
                  'Thông báo!',
                  MessageSeverity.success,
                  TOAST_DEFAULT_CONFIG
                );
                this.goTo(URL.NAPAS.IBFT_RECONCILE.OUT.DISPUTE.SEARCH_DISPUTE);
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
        label: 'Duyệt yêu cầu tra soát',
        acceptBtn: 'Xác nhận',
        closeBtn: 'Hủy',
        message: 'Bạn có chắc chắn muốn duyệt yêu cầu tra soát?',
      },
      (result: any) => {
        if (result && result.status === DFORM_CONFIRM_STATUS.CONFIRMED) {
          this.bodyApprove = {
            action: 'APPROVE',
            disputeId: this.queryParams.disputeId,
            reason: result.data,
          }
          this.indicator.showActivityIndicator();
          this.searchDisputeService
            .approveTransactionDispute(this.bodyApprove)
            .pipe(
              takeUntil(this.ngUnsubscribe),
              finalize(() => this.indicator.hideActivityIndicator())
            )
            .subscribe(
              (res) => {
                if (res && res.status === 200) {
                  this.toastr.showToastr(
                    'Phê duyệt yêu cầu tra soát thành công',
                    'Thông báo!',
                    MessageSeverity.success,
                    TOAST_DEFAULT_CONFIG
                  );
                  this.goTo(URL.NAPAS.IBFT_RECONCILE.OUT.DISPUTE.SEARCH_DISPUTE);
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

  downLoadFile() {
    let idFile = '';
    idFile = this.dataTransactionDispute?.fileId ? this.dataTransactionDispute?.fileId: ''
    console.log(idFile, 'idFile');

    this.indicator.showActivityIndicator()
    this.searchDisputeService.downLoadFile(idFile).pipe(
      finalize(() => {
        this.indicator.hideActivityIndicator()
      }),
      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      next: (res) => {
        if (res instanceof HttpResponse) {
          const blob = new Blob([res.body], { type: res.headers.get('Content-Type') });
          let url = window.URL.createObjectURL(blob);
          var a = document.createElement("a");
          a.href = url;
          a.download = this.dataTransactionDispute?.fileName;
          a.click();
          window.URL.revokeObjectURL(url);
        }
      },
      error: (err) => {
        const messsageError = ErrorUtils.getErrorMessage(err);
        this.toastr.showToastr(
          messsageError.join('\n'),
          'Thông báo!',
          MessageSeverity.error,
          TOAST_DEFAULT_CONFIG
        );
      }
    })
  }

  onClickEdit() {
    // const date = moment(this.dataTransactionDispute?.origCreatedAt).startOf('day').format('YYYY-MM-DD');
    this.router.navigate([URL.NAPAS.IBFT_RECONCILE.OUT.DISPUTE.EDIT_DISPUTE],
      {queryParams: { origTransactionReference: this.dataTransactionDispute?.origTransactionReference, transactionDate: this.dataTransactionDispute?.origCreatedAt, disputeType: this.dataTransactionDispute.type, disputeId: this.queryParams?.disputeId }
    });
  }

  getLabel($status: any) {
    const status = STATUS_LABEL_INITIALIZE_TRANSACTION.find(item => item.key === $status);
    if (status) {
      return `<label class="wf-status ${status.class}">${status.value}</label>`;
    } else {
      return '';
    }
  }

  getLabelPaymentCode($code: any) {
    if($code === '91') {
      return $code + '-Chuyển tiền'
    }
    if($code === '50') {
      return $code + '-Thanh toán'
    }
  }

  getDisputeTypeCode(disputeTypeCode: string): string {
    const disputeTypeCodeValue = SELECT_DISPUTE_TYPE_CODE.find(item => item.key === disputeTypeCode);
    if (disputeTypeCodeValue) {
      return `${disputeTypeCodeValue.value}`
    } else {
      return '';
    }
  }

  getDisputeClaimCode(disputeClaimCode: string): string {
    const disputeClaimCodeValue = SELECT_DISPUTE_CLAIM_CODE.find(item => item.key === disputeClaimCode);
    if (disputeClaimCodeValue) {
      return `${disputeClaimCodeValue.value}`
    } else {
      return '';
    }
  }

  getDisputeStatus(disputeStatus: string): string {
    const disputeStatusValue = SELECT_DISPUTE_STATUS.find(item => item.key === disputeStatus);
    if (disputeStatusValue) {
      return `${disputeStatusValue.value}`
    } else {
      return '';
    }
  }

  loadBtn() {
    let listBtn = []

    if ( this.enableApprove && this.dataTransactionOrigin && this.dataTransactionDispute && this.dataTransactionDispute?.approveDisputeStatus === approveDisputeStatusEnum.WAITING && this.dataTransactionDispute.transactionType === transactionTypeEnum.ISS) {
      listBtn.push(BUTTON_REJECT, BUTTON_APPROVE)
    }
    if ( this.enableUpdate && this.dataTransactionOrigin && this.dataTransactionDispute && this.dataTransactionDispute?.approveDisputeStatus === approveDisputeStatusEnum.REJECTED && this.dataTransactionDispute.transactionType === transactionTypeEnum.ISS) {
      listBtn.push(BUTTON_EDIT)
    }

    listBtn.unshift(BUTTON_CANCEL)
    this.listButton = this.listButtonDynamic('', ...listBtn)
  }

  onClickBtn($event?: any): void {
    switch ($event) {
      case TYPE_BTN_FOOTER.TYPE_CANCEL:
        this.goTo(URL.NAPAS.IBFT_RECONCILE.OUT.DISPUTE.SEARCH_DISPUTE);
        break;
      case TYPE_BTN_FOOTER.TYPE_EDIT:
        this.onClickEdit()
        break;
      case TYPE_BTN_FOOTER.TYPE_DELETE:
        this.onClickReject()
        break;
      case TYPE_BTN_FOOTER.TYPE_APPROVER:
        this.onClickApprove()
        break;
    }
  }

}
