import { HttpResponse } from '@angular/common/http';
import { Component, ElementRef, Injector, ViewChild } from '@angular/core';
import { ComponentAbstract, MessageSeverity, TextControlComponent } from '@shared-sm';
import * as moment from 'moment';
import { EMPTY, of, forkJoin } from 'rxjs';
import { finalize, switchMap, takeUntil, catchError, map } from 'rxjs/operators';
import { BUTTON_EDIT, BUTTON_CANCEL, TOAST_DEFAULT_CONFIG, TYPE_BTN_FOOTER } from 'src/app/public/constants';
import { ModuleKeys } from 'src/app/public/module-permission.utils';
import ErrorUtils from 'src/app/shared/utils/ErrorUtils';
import { ChargeCreditService } from '../../services/charge-credit.service';
import { URL, STATUS_LABLE, BUTTON_APPROVE, BUTTON_REJECT,  SELECT_DISPUTE_CLAIM_CODE, SELECT_DISPUTE_STATUS, SELECT_DISPUTE_TYPE_CODE} from '../modal/constant';
import { approveChargeCreditStatusEnum, typeTransactionDisputeEnum, transactionTypeEnum } from '../modal/enum';

import { IParamsSearch, IResponseTransactionDispute, IResponseTransactionOriginal, IParamsSearchTransactionOrigin, IResponseChargeCredit } from '../modal/interface';

@Component({
  selector: 'app-detail-charge-credit',
  templateUrl: './detail-charge-credit.component.html',
  styleUrls: ['./detail-charge-credit.component.scss']
})
export class DetailChargeCreditComponent extends ComponentAbstract {

  dataTransactionOrigin: IResponseTransactionOriginal;
  dataTransactionDispute: IResponseTransactionDispute;
  dataChargeCredit: IResponseChargeCredit;

  processBatch: any;
  percent = 0;
  selectedFiles: File;
  idDispute: string;

  @ViewChild('file') myInputVariable: ElementRef;
  @ViewChild('amountChargeCredit') amountChargeCredit: TextControlComponent;

  constructor(
    protected injector: Injector,
    private chargeCreditService: ChargeCreditService,
  ) {
    super(injector);
  }

  componentInit(): void {
    this.enableActions(ModuleKeys.napas_ibft_reconcile_dispute);
    this.loadBtn();
    this.searchTransactionOrigin()
  }

  searchTransactionOrigin() {
    const rawParamsDispute: IParamsSearch = {
      disputeId: this.queryParams.disputeId,
      disputeType: typeTransactionDisputeEnum.REQUEST,
      pageNumber: 1,
      pageSize: 10,
    };
    const paramsTransactionDispute = this.cleanObject(rawParamsDispute);
  
    this.indicator.showActivityIndicator();
  
    const dispute = this.chargeCreditService.searchDispute(paramsTransactionDispute).pipe(
      catchError(err => {
        const messageError = ErrorUtils.getErrorMessage(err);
        this.toastr.showToastr(
          messageError.join('\n'),
          'Thông báo!',
          MessageSeverity.error,
          TOAST_DEFAULT_CONFIG
        );
        return of(null);
      })
    );

    const requestParams = {
      page: 0,
      size: 10,
    }
  
    const chargeCreditApi = this.chargeCreditService.getChargeCredit({id: this.queryParams.id}, requestParams).pipe(
      catchError(err => {
        const messageError = ErrorUtils.getErrorMessage(err);
        this.toastr.showToastr(
          messageError.join('\n'),
          'Thông báo!',
          MessageSeverity.error,
          TOAST_DEFAULT_CONFIG
        );
        return of(null);
      })
    );
  
    forkJoin([dispute, chargeCreditApi]).pipe(
      takeUntil(this.ngUnsubscribe),
      switchMap(([dispute, chargeCreditData]) => {
        if (!dispute || dispute.status !== 200 || !dispute.data?.disputes?.length) {
          console.warn('Không có thông tin yêu cầu tra soát');
          return EMPTY;
        }
        this.dataTransactionDispute = dispute.data.disputes[0];
        if(chargeCreditData && chargeCreditData.data.chargeCredits.length > 0) {
          this.dataChargeCredit = chargeCreditData.data.chargeCredits[0]
        }
        // const date = moment(this.dataTransactionDispute?.createdAt).startOf('day').format('YYYY-MM-DD');
  
        const rawParamsOrigin: IParamsSearchTransactionOrigin = {
          transactionReferenceNumber: this.dataTransactionDispute.origTransactionReference,
          systemTraceAuditNumber: history.state?.traceNumber || '',
          transactionDate: this.dataTransactionDispute?.origCreatedAt,
        };
        const paramsTransactionOrigin = this.cleanObject(rawParamsOrigin);
  
        return this.chargeCreditService.getTransactionOrigin(paramsTransactionOrigin as IParamsSearchTransactionOrigin).pipe(
          catchError(err => {
            console.error('transactionOrigin error', err);
            const messageError = ErrorUtils.getErrorMessage(err);
            this.toastr.showToastr(
              messageError.join('\n'),
              'Thông báo!',
              MessageSeverity.error,
              TOAST_DEFAULT_CONFIG
            );
            return of(null);
          })
        );
      }),
      finalize(() => {
        this.indicator.hideActivityIndicator();
        this.loadBtn();
      })
    ).subscribe(transactionOrigin => {
      if (transactionOrigin?.status === 200 && transactionOrigin.data?.content?.length > 0) {
        this.dataTransactionOrigin = transactionOrigin.data.content[0];
        this.idDispute = this.dataTransactionDispute.disputeId;
      }
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

  downLoadFile() {
    let idFile = '';
    idFile = this.dataTransactionDispute?.fileId ? this.dataTransactionDispute?.fileId: ''
    this.indicator.showActivityIndicator()
    this.chargeCreditService.downLoadFile(idFile).pipe(
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


  convertToTimeFormat(timeStr: string): string {
    if (!timeStr || timeStr.length !== 6) return '';
    return timeStr.slice(0, 2) + ':' + timeStr.slice(2, 4) + ':' + timeStr.slice(4, 6);
  }

  convertToDateFormat(dateStr: string): string {
    if (!dateStr || dateStr.length !== 4) return '';
    return dateStr.slice(2, 4) + '-' + dateStr.slice(0, 2);
  }

  getLabel($status: any) {
    const status = STATUS_LABLE.find(item => item.key === $status);
    if (status) {
      return `<label class="wf-status ${status.class}">${status.value}</label>`;
    } else {
      return '';
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
    if ( this.enableApprove && this.dataTransactionOrigin && this.dataTransactionDispute && this.dataChargeCredit && this.dataChargeCredit?.approvalStatus === approveChargeCreditStatusEnum.WAITING && this.dataChargeCredit.transactionType === transactionTypeEnum.ISS) {
      listBtn.push(BUTTON_REJECT, BUTTON_APPROVE)
    } 
    if ( this.enableUpdate && this.dataTransactionOrigin && this.dataTransactionDispute && this.dataChargeCredit && (this.dataChargeCredit?.approvalStatus === approveChargeCreditStatusEnum.REJECTED_BY_MB || this.dataChargeCredit?.approvalStatus === approveChargeCreditStatusEnum.REJECTED_BY_NAPAS) && this.dataChargeCredit.transactionType === transactionTypeEnum.ISS) {
      listBtn.push(BUTTON_EDIT)
    }

    listBtn.unshift(BUTTON_CANCEL)
    this.listButton = this.listButtonDynamic('', ...listBtn)
  }

  onClickBtn($event?: any): void {
    switch ($event) {
      case TYPE_BTN_FOOTER.TYPE_CANCEL:
        this.goTo(URL.NAPAS.IBFT_RECONCILE.OUT.CHARGE_CREDIT.SEARCH);
        break;
      case TYPE_BTN_FOOTER.TYPE_EDIT:
        this.goTo(URL.NAPAS.IBFT_RECONCILE.OUT.CHARGE_CREDIT.EDIT, {disputeId: this.queryParams?.disputeId,id: this.queryParams.id})
        break;
    }
  }
}
