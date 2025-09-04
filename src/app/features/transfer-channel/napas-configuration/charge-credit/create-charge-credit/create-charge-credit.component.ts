import { HttpResponse } from '@angular/common/http';
import { Component, ElementRef, Injector, ViewChild } from '@angular/core';
import { ComponentAbstract, MessageSeverity, TextControlComponent } from '@shared-sm';
import * as moment from 'moment';
import { EMPTY, of, forkJoin } from 'rxjs';
import { finalize, switchMap, takeUntil, catchError, map } from 'rxjs/operators';
import { BUTTON_REQUEST_APPROVER, BUTTON_CANCEL, DFORM_CONFIRM_STATUS, TOAST_DEFAULT_CONFIG, TYPE_BTN_FOOTER } from 'src/app/public/constants';
import { ModuleKeys } from 'src/app/public/module-permission.utils';
import ErrorUtils from 'src/app/shared/utils/ErrorUtils';
import { ChargeCreditService } from '../../services/charge-credit.service';
import { COLUMS, URL, DISPUTE_ID, AMOUNT, CURRENCY_CODE, STATUS_LABLE, SELECT_DISPUTE_CLAIM_CODE, SELECT_DISPUTE_STATUS, SELECT_DISPUTE_TYPE_CODE} from '../modal/constant';
import { typeTransactionDisputeEnum } from '../modal/enum';

import { ICreateChargeCredit, IParamsSearch, IResponseTransactionDispute, IResponseTransactionOriginal, IParamsSearchTransactionOrigin } from '../modal/interface';

@Component({
  selector: 'app-create-charge-credit',
  templateUrl: './create-charge-credit.component.html',
  styleUrls: ['./create-charge-credit.component.scss']
})
export class CreateChargeCreditComponent extends ComponentAbstract {
  $disputeId = DISPUTE_ID();
  $amount = AMOUNT();
  $currencyCode = CURRENCY_CODE();

  dataTransactionOrigin: IResponseTransactionOriginal;
  dataTransactionDispute: IResponseTransactionDispute;
  requestChargeCredit: ICreateChargeCredit | null = null;

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
    this.$disputeId.required =  true
    this.$amount.required = true
    this.$currencyCode.readOnly = true
    this.form = this.itemControl.toFormGroup([
      this.$disputeId,
      this.$amount,
      this.$currencyCode,
    ]);
  }

  searchTransactionOrigin() {
    const disIdControl = this.form.get('disputeId');
    if (disIdControl.invalid) {
      disIdControl.markAllAsTouched();
      this.dialogService.error({
        title: 'Thông báo',
        message: '',
        innerHTML: `Vui lòng nhập thông tin tìm kiếm`
      });
      return;
    }

    const disId = this.form.get('disputeId')?.value.trim()
  
    const rawParamsDispute: IParamsSearch = {
      disputeId: disId,
      disputeType: typeTransactionDisputeEnum.REQUEST,
      pageNumber: 1,
      pageSize: 10,
    };
    const paramsTransactionDispute = this.cleanObject(rawParamsDispute);
  
    this.indicator.showActivityIndicator();
  
    this.chargeCreditService.searchDispute(paramsTransactionDispute).pipe(
      catchError(err => {
        const messageError = ErrorUtils.getErrorMessage(err);
        this.toastr.showToastr(
          messageError.join('\n'),
          'Thông báo!',
          MessageSeverity.error,
          TOAST_DEFAULT_CONFIG
        );
        return of(null);
      }),
      takeUntil(this.ngUnsubscribe),
      switchMap(dispute => {
        if (!dispute || dispute.status !== 200 || !dispute.data?.disputes?.length) {
          console.warn('Không có thông tin yêu cầu tra soát');
          return EMPTY;
        }
  
        this.dataTransactionDispute = dispute.data.disputes[0];

        // const date = moment(this.dataTransactionDispute?.origCreatedAt).startOf('day').format('YYYY-MM-DD');
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
        this.idDispute = this.dataTransactionDispute.disputeId
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

  resetFormSearch() {
    this.form.reset();
    this.dataTransactionDispute = null;
    this.dataTransactionOrigin = null;
    this.resetFormRequestDispute()
    this.loadBtn();
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


  modalAddAccount() {
    this.dialogService.dformconfirm({
      label: 'Thêm mới yêu cầu báo có',
      acceptBtn: 'Đồng ý',
      closeBtn: 'Đóng',
      innerHTML: 'Xác nhận thêm mới yêu cầu báo có?'
    }, (result: any) => {
      if (result && result.status === DFORM_CONFIRM_STATUS.CONFIRMED) {
        this.createTransactionOrigin();
      }
    });
  }

  async createTransactionOrigin() {
    try {
      this.requestChargeCredit = await this.createRequestDispute();
    } catch (e) {
      return;
    }

    this.indicator.showActivityIndicator();
    this.chargeCreditService.createChargeCredit(this.requestChargeCredit).pipe(
      takeUntil(this.ngUnsubscribe),
      finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe((res) => {
      if (res && res.status === 200) {
        this.toastr.showToastr(
          'Thêm mới yêu cầu báo có thành công',
          'Thông báo!',
          MessageSeverity.success,
          TOAST_DEFAULT_CONFIG
        );
        this.goTo(URL.NAPAS.IBFT_RECONCILE.OUT.CHARGE_CREDIT.SEARCH);
      } else {
        this.toastr.showToastr(
          res.soaErrorDesc ,
          'Thông báo!',
          MessageSeverity.error,
          TOAST_DEFAULT_CONFIG
        );
      }
    }, error => {
      const messageError = ErrorUtils.getErrorMessage(error);
      this.toastr.showToastr(
        messageError.join('\n'),
        'Thông báo!',
        MessageSeverity.error,
        TOAST_DEFAULT_CONFIG
      );
    });
  }

  async createRequestDispute(): Promise<ICreateChargeCredit> {
    return {
      disputeId: this.idDispute,
      chargeCreditData: {
          chargeCreditAmount: {
              value: Number(this.form.get('amount')?.value),
              currencyCode: '704' //vnd
          }
      }
    }
  }


  validateMoney(event: any, controlName: string): void {
    const inputElement = event.target as HTMLInputElement;
    const originalCursorPos = inputElement.selectionStart ?? 0;
    const originalValue = inputElement.value;
  
    let rawValue = originalValue.replace(/[^0-9]/g, '').replace(/^0+/, '');
    rawValue = rawValue.slice(0, 12);
  
    const control = this.form.get(controlName);
    if (control) control.setValue(rawValue);
  
    const formattedValue = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    inputElement.value = formattedValue;
  
    if (originalCursorPos === originalValue.length) {
      inputElement.setSelectionRange(formattedValue.length, formattedValue.length);
    } else {
      const digitsBeforeCursor = originalValue
        .slice(0, originalCursorPos)
        .replace(/[^0-9]/g, '')
        .replace(/^0+/, '')
        .slice(0, 12);
  
      let cursorPos = 0, digitCount = 0;
      for (let i = 0; i < formattedValue.length; i++) {
        if (/\d/.test(formattedValue[i])) digitCount++;
        if (digitCount === digitsBeforeCursor.length) {
          cursorPos = i + 1;
          break;
        }
      }
      inputElement.setSelectionRange(cursorPos, cursorPos);
    }
  }

  resetFormRequestDispute() {
    const fields = [
      'amount',
    ];
   
    fields.forEach(fieldName => {
      const field = this.form.get(fieldName);
      if (field) {
        field.setValue(null);
        field.markAsPristine();
        field.markAsUntouched();
      }
    });
  }

  private validateFormBeforeSubmit(): boolean {
    const disputeIdControl = this.form.get('disputeId');
    if (disputeIdControl.invalid) {
      this.form.patchValue({disputeId: this.idDispute})
    }
    const amountControl = this.form.get('amount');
    if ( amountControl.invalid) {
      if(amountControl.invalid) amountControl.markAllAsTouched()
      this.dialogService.error({
        title: 'Thông báo',
        message: '',
        innerHTML: `Vui lòng nhập số tiền`
      });
      return false;
    }
    return true;
  }

  loadBtn() {
    this.listButton = this.dataTransactionOrigin && this.dataTransactionDispute ? this.listButtonDynamic('', BUTTON_CANCEL, BUTTON_REQUEST_APPROVER) : this.listButtonDynamic('', BUTTON_CANCEL);

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


  onClickBtn($event?: any): void {
    switch ($event) {
      case TYPE_BTN_FOOTER.TYPE_CANCEL:
        this.goTo(URL.NAPAS.IBFT_RECONCILE.OUT.CHARGE_CREDIT.SEARCH);
        break;
      case TYPE_BTN_FOOTER.TYPE_SEND_APPROVER:
        if (!this.validateFormBeforeSubmit()) return;
        this.modalAddAccount();
        break;
    }
  }
}
