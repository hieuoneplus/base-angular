import { HttpResponse } from '@angular/common/http';
import { Component, Injector } from '@angular/core';
import { ComponentAbstract, MessageSeverity } from '@shared-sm';
import * as moment from 'moment';
import { EMPTY, of, forkJoin } from 'rxjs';
import { finalize, switchMap, takeUntil, catchError, map } from 'rxjs/operators';
import { BUTTON_CANCEL, BUTTON_EDIT, DFORM_CONFIRM_STATUS, TOAST_DEFAULT_CONFIG, TYPE_BTN_FOOTER } from 'src/app/public/constants';
import { ModuleKeys } from 'src/app/public/module-permission.utils';
import ErrorUtils from 'src/app/shared/utils/ErrorUtils';
import { SearchDisputeService } from '../../services/search-dispute.service';
import {
  URL,
  BUTTON_APPROVE,
  BUTTON_REJECT,
  STATUS_LABEL_INITIALIZE_TRANSACTION,
  SELECT_DISPUTE_TYPE_CODE, SELECT_DISPUTE_STATUS
} from '../modal/constant';
import { approveDisputeStatusEnum, transactionTypeEnum, typeTransactionDisputeEnum } from '../modal/enum';
import { IApproveTransactionDispute, IParamsSearch, IParamsSearchTransactionOrigin, IResponseChargeCredits, IResponseTransactionDispute, IResponseTransactionOriginal, IResponseTransactionRefund } from '../modal/interface';


@Component({
  selector: 'app-reply-detail-dispute',
  templateUrl: './reply-detail-dispute.component.html',
  styleUrls: ['./reply-detail-dispute.component.scss']
})
export class ReplyDetailDisputeComponent extends ComponentAbstract {

  dataTransactionOrigin: IResponseTransactionOriginal;
  dataTransactionDispute: IResponseTransactionDispute;
  dataTransactionDisputeRequest: IResponseTransactionDispute;
  dataTransactionDisputeResponse: IResponseTransactionDispute;
  dataTransactionRefund: IResponseTransactionRefund[];
  dataChargecredit: IResponseChargeCredits[];
  bodyApprove: IApproveTransactionDispute;


  constructor(
    protected injector: Injector,
    private searchDisputeService: SearchDisputeService,
  ) {
    super(injector)
  }

  componentInit(): void {
    this.enableActions(ModuleKeys.napas_ibft_reconcile_dispute);

    this.search()
  }

  search() {
    if (this.queryParams.origTransactionReference) {
      const rawParamsOrigin: IParamsSearchTransactionOrigin = {
        transactionReferenceNumber: this.queryParams.origTransactionReference,
        systemTraceAuditNumber: history.state.traceNumber || '',
        transactionDate: this.queryParams.transactionDate,
      };
      const paramsTransactionOrigin = this.cleanObject(rawParamsOrigin);

      const rawParamsDispute: IParamsSearch = {
        disputeId: this.queryParams.disputeId,
        pageNumber: 1,
        pageSize: 10,
      };
      const paramsTransactionDispute = this.cleanObject(rawParamsDispute);

      const rawParamsRefund: IParamsSearch = {
        disputeId: this.queryParams.disputeId,
        page: 1,
        size: 100
      };
      const paramsTransactionRefund = this.cleanObject(rawParamsRefund);

      const rawParamsChargecredit: IParamsSearch = {
        disputeId: this.queryParams.disputeId,
      };
      const paramsTransactionChargecredit = this.cleanObject(rawParamsChargecredit);

      this.indicator.showActivityIndicator();

      forkJoin({
        transactionOrigin: this.searchDisputeService.getTransactionOrigin(paramsTransactionOrigin as IParamsSearchTransactionOrigin)
          .pipe(
            catchError(err => {
              console.error('transactionOrigin error', err);
              return of(null);
            })
          ),
        dispute: this.searchDisputeService.getTransactionDispute(paramsTransactionDispute as IParamsSearch)
          .pipe(
            catchError(err => {
              console.error('dispute error', err);
              return of(null);
            })
          )
      }).pipe(
        takeUntil(this.ngUnsubscribe),
        switchMap(({ transactionOrigin, dispute }) => {
          if (!transactionOrigin || !dispute) {
            this.indicator.hideActivityIndicator();

            if (!transactionOrigin) {
              this.hasDataSource = false;
              this.toastr.showToastr(
                'Lỗi khi lấy giao dịch gốc',
                'Thông báo!',
                MessageSeverity.error,
                TOAST_DEFAULT_CONFIG
              );
            }

            if (!dispute) {
              this.toastr.showToastr(
                'Lỗi khi lấy được thông tin yêu cầu tra soát',
                'Thông báo!',
                MessageSeverity.error,
                TOAST_DEFAULT_CONFIG
              );
            }
            return EMPTY;
          }

          if (transactionOrigin.status === 200 && transactionOrigin.data.content && transactionOrigin.data.content.length > 0) {
            this.dataTransactionOrigin = transactionOrigin.data.content[0];
          } else {
            console.log('here');
            this.toastr.showToastr(
              transactionOrigin.soaErrorDesc ? transactionOrigin.soaErrorDesc : 'Không tồn tại giao dịch gốc',
              'Thông báo!',
              MessageSeverity.error,
              TOAST_DEFAULT_CONFIG
            );
            return EMPTY;
          }

          if (dispute.status === 200 && dispute.data.disputes && dispute.data.disputes.length > 0) {
            this.dataTransactionDispute = dispute.data.disputes[0]

            const dataRequest = dispute.data.disputes.filter((item) => item.type === typeTransactionDisputeEnum.REQUEST);
            this.dataTransactionDisputeRequest = dataRequest[0]

            const dataResponse = dispute.data.disputes.filter((item) => item.type === typeTransactionDisputeEnum.RESPONSE);
            this.dataTransactionDisputeResponse = dataResponse[0]
          }
          return forkJoin({
            transactionRefund: this.searchDisputeService.getTransactionRefund(paramsTransactionRefund as IParamsSearch)
              .pipe(
                catchError(err => {
                  console.error('transactionRefund error', err);
                  return of(null);
                })
              ),
            chargecredit: this.searchDisputeService.getChargecreditInfo(paramsTransactionChargecredit as IParamsSearch)
              .pipe(
                catchError(err => {
                  console.error('chargecredit error', err);
                  return of(null);
                })
              )
          });
        }),
        finalize(() => {
          this.indicator.hideActivityIndicator(),
            this.loadBtn();
        })
      ).subscribe(result => {
        if (result) {
          const { transactionRefund, chargecredit } = result;
          if (transactionRefund && transactionRefund.data && transactionRefund.data.returnResponses.length > 0) {
            this.dataTransactionRefund = transactionRefund.data.returnResponses
          }

          if (chargecredit && chargecredit.data && chargecredit.data.chargeCredits.length > 0) {
            this.dataChargecredit = chargecredit.data.chargeCredits
          }
        }
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
        label: 'Từ chối yêu cầu phản hồi tra soát',
        title: 'Lý do',
        description: 'Nhập lý do từ chối yêu cầu phản hồi tra soát',
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
            .approveReplyTransactionDispute(this.bodyApprove)
            .pipe(
              takeUntil(this.ngUnsubscribe),
              finalize(() => this.indicator.hideActivityIndicator())
            )
            .subscribe(
              (res) => {
                console.log('RESPONSE', res);
                this.toastr.showToastr(
                  'Từ chối yêu cầu phản hồi tra soát thành công',
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
        label: 'Duyệt yêu cầu phản hồi tra soát',
        acceptBtn: 'Xác nhận',
        closeBtn: 'Hủy',
        message: 'Bạn có chắc chắn muốn duyệt yêu cầu phản hồi tra soát?',
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
            .approveReplyTransactionDispute(this.bodyApprove)
            .pipe(
              takeUntil(this.ngUnsubscribe),
              finalize(() => this.indicator.hideActivityIndicator())
            )
            .subscribe(
              (res) => {
                if (res && res.status === 200) {
                  this.toastr.showToastr(
                    'Phê duyệt yêu cầu phản hồi tra soát thành công',
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

  onClickEdit() {
    // const date = moment(this.dataTransactionDispute?.origCreatedAt).startOf('day').format('YYYY-MM-DD');
    this.router.navigate([URL.NAPAS.IBFT_RECONCILE.OUT.DISPUTE.REPLY_EDIT_DISPUTE],
      {
        queryParams: { origTransactionReference: this.queryParams?.origTransactionReference, transactionDate: this.dataTransactionDispute?.origCreatedAt, disputeId: this.queryParams?.disputeId }
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
    if ($code === '91') {
      return $code + '-Chuyển tiền'
    }
    if ($code === '50') {
      return $code + '-Thanh toán'
    }
  }

  downLoadFile(fileId: string, fileName: string) {
    let idFile = '';
    idFile = fileId ? fileId: ''

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
          a.download = fileName;
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

  loadBtn() {
    let listBtn = []
    if (this.enableUpdate && this.dataTransactionOrigin && this.dataTransactionDispute && this.dataTransactionDispute.approveDisputeStatus !== approveDisputeStatusEnum.APPROVED && this.dataTransactionDispute.type === typeTransactionDisputeEnum.RESPONSE && this.dataTransactionDispute.transactionType === transactionTypeEnum.ACQ) {
      listBtn.push(BUTTON_EDIT)
    }
    if (this.enableApprove && this.dataTransactionOrigin && this.dataTransactionDispute && this.dataTransactionDispute.approveDisputeStatus === approveDisputeStatusEnum.WAITING && this.dataTransactionDispute.transactionType === transactionTypeEnum.ACQ) {
      listBtn.push(BUTTON_REJECT, BUTTON_APPROVE)
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

  getDisputeTypeCode(disputeTypeCode: string): string {
    const disputeTypeCodeValue = SELECT_DISPUTE_TYPE_CODE.find(item => item.key === disputeTypeCode);
    if (disputeTypeCodeValue) {
      return `${disputeTypeCodeValue.value}`
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
}
