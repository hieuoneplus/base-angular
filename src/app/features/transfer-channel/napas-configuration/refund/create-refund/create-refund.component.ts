import { ChangeDetectorRef, Component, ElementRef, Injector, ViewChild } from '@angular/core';
import { ComponentAbstract, MessageSeverity, TextControlComponent } from '@shared-sm';
import * as moment from 'moment';
import { EMPTY, of, forkJoin } from 'rxjs';
import { finalize, switchMap, takeUntil, catchError, map } from 'rxjs/operators';
import { BUTTON_REQUEST_APPROVER, BUTTON_CANCEL, DFORM_CONFIRM_STATUS, TOAST_DEFAULT_CONFIG, TYPE_BTN_FOOTER } from 'src/app/public/constants';
import { ModuleKeys } from 'src/app/public/module-permission.utils';
import ErrorUtils from 'src/app/shared/utils/ErrorUtils';
import { RefundService } from '../../services/refund.service';
import { URL, ORIG_TRANSACTION_REFERENCE, TRACE_NUMBER, FROM_DATE, TO_DATE, RETURN_DATA_PROCESSING_CODE, RETURN_DATA_TRANSACTION_AMOUNT, RETURN_DATA_CURRENCY_CODE, DISPUTE_ID, TRANSACTION_ACCOUNTING_TYPE, SENDER_ACC, RECEVER_ACC, CONTENT_TRANSFERS } from '../modal/constant';

import { IParamsSearch, IResponseTransactionOriginal, IResponseTransactionDispute, ICreateTransactionRefund, IParamsSearchBatch } from '../modal/interface';

@Component({
  selector: 'app-create-refund',
  templateUrl: './create-refund.component.html',
  styleUrls: ['./create-refund.component.scss']
})
export class CreateRefundComponent extends ComponentAbstract {

  $origTransactionReference = ORIG_TRANSACTION_REFERENCE();
  $traceNumber = TRACE_NUMBER();
  $fromDate = FROM_DATE();
  $toDate = TO_DATE();
  $returnDataProcessingCode = RETURN_DATA_PROCESSING_CODE();
  $returnDataTransactionAmount = RETURN_DATA_TRANSACTION_AMOUNT();
  $returnDataCurrencyCode = RETURN_DATA_CURRENCY_CODE();
  $disputeId = DISPUTE_ID();
  $transactionAccountingType = TRANSACTION_ACCOUNTING_TYPE();
  $senderAcc = SENDER_ACC();
  $receiverAcc = RECEVER_ACC();
  $contentTransfers = CONTENT_TRANSFERS();


  dataTransactionOrigin: IResponseTransactionOriginal;
  dataTransactionDispute: IResponseTransactionDispute[];
  requestTransactionRefund: ICreateTransactionRefund | null = null;

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
    this.loadBtn();
    this.$origTransactionReference.required = true
    this.$fromDate.required = true
    this.$toDate.required = true
    this.$returnDataCurrencyCode.readOnly = true

    this.form = this.itemControl.toFormGroup([
      this.$origTransactionReference,
      this.$traceNumber,
      this.$fromDate,
      this.$toDate,
      this.$returnDataProcessingCode,
      this.$returnDataTransactionAmount,
      this.$returnDataCurrencyCode,
      this.$disputeId,
      this.$transactionAccountingType,
      this.$senderAcc,
      this.$receiverAcc,
      this.$contentTransfers,
    ]);
    this.form.patchValue({returnDataCurrencyCode: 'VND'})

    this.trackDateRangeValidation()

  }

  searchTransactionOrigin() {
    this.resetFormRequestDispute()
    this.dataTransactionOrigin = null;
    const origTransactionReferenceControl = this.form.get('origTransactionReference');
    const dateTimeControl = this.form.get('fromDate');
    const toDateControl = this.form.get('toDate');

    if (origTransactionReferenceControl.invalid || dateTimeControl.invalid || toDateControl.invalid) {
      if (origTransactionReferenceControl.invalid) origTransactionReferenceControl.markAllAsTouched();
      if (dateTimeControl.invalid) dateTimeControl.markAllAsTouched()
      if (toDateControl.invalid) toDateControl.markAllAsTouched()

      let errorMessage = 'Vui lòng nhập thông tin tìm kiếm';
      if (toDateControl?.hasError('dateOrderInvalid')) {
        errorMessage = 'Ngày kết thúc không được nhỏ hơn ngày bắt đầu';
      } else if (toDateControl?.hasError('dateRangeExceeded')) {
        errorMessage = 'Khoảng thời gian tìm kiếm không được vượt quá 10 ngày';
      }

      this.dialogService.error({
        title: 'Thông báo',
        message: '',
        innerHTML: errorMessage
      });
      return;
    }

    const keys = [
      this.$origTransactionReference.key,
      this.$traceNumber.key,
      this.$fromDate.key,
      this.$toDate.key,
    ];

    const keyMap: Record<string, string> = {
      [this.$origTransactionReference.key]: 'transactionReferenceNumber',
      [this.$traceNumber.key]: 'systemTraceAuditNumber',
      [this.$fromDate.key]: 'transactionDate',
      [this.$toDate.key]: 'toTransactionDate',
    };

    const params = keys.reduce((acc, key) => {
      let value = this.form.value[key];
      if (value !== null && value !== undefined && value !== '') {
        const newKey = keyMap[key];

        if (newKey === 'transactionDate' || newKey === 'toTransactionDate') {
          const dateObj = new Date(value);
          if (!isNaN(dateObj.getTime())) {
            const day = String(dateObj.getDate()).padStart(2, '0');
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const year = String(dateObj.getFullYear()).padStart(4, '0');

            value = `${year}-${month}-${day}`;
          }
        } else if (typeof value === 'string') {
          value = value.trim();
        }

        acc[newKey] = value;
      }
      return acc;
    }, {} as Record<string, any>);

    this.options = { params };

    this.indicator.showActivityIndicator();
    this.refundService.getTransactionOrigin(this.options.params).pipe(
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
      switchMap(transactionOrigin => {
        if (!transactionOrigin || transactionOrigin.status !== 200 || !transactionOrigin.data?.content?.length) {
          console.warn('Không có thông tin yêu cầu tra soát');
          return EMPTY;
        }

        this.hasDataSource = true;
        this.dataTransactionOrigin = transactionOrigin.data.content[0];

        const rawParamsDispute: IParamsSearch = {
          origTransactionReference: this.dataTransactionOrigin.transactionReferenceNumber,
          page: 1,
          size: 1000,
        };

        this.form.patchValue({
          senderAcc: this.dataTransactionOrigin?.toAccountIdentification ?? null,
          returnDataTransactionAmount: this.dataTransactionOrigin?.settlementAmount ?? null,
          receiverAcc: this.dataTransactionOrigin?.fromAccountIdentification ?? null,
          // returnDataCurrencyCode: this.dataTransactionOrigin?.settlementCurrencyCode ?? '704',
          contentTransfers: 'Hoàn trả cho '+ this.dataTransactionOrigin?.transactionReferenceNumber,
        })

        this.cdr.detectChanges();
        setTimeout(() => {
          if (this.amountValue && this.amountValue.inputElement) {
            this.amountValue.inputElement.nativeElement.value = this.convertMoney(this.dataTransactionOrigin?.settlementAmount);
          } else {
            console.warn('amountValue vẫn chưa được gán');
          }
        });

        const paramsTransactionDispute = this.cleanObject(rawParamsDispute);

        return this.refundService.getTransactionDispute(paramsTransactionDispute as IParamsSearchBatch).pipe(
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
      }),
      finalize(() => {
        this.indicator.hideActivityIndicator();
        this.loadBtn();
      })
    ).subscribe(transactionDispute => {
      if (transactionDispute?.status === 200 && transactionDispute.data?.disputes?.length > 0) {
        this.dataTransactionDispute = transactionDispute.data.disputes

        const uniqueDisputes = Array.from(
          new Map(this.dataTransactionDispute.map((item: any) => item.transactionType==='ACQ' && [item.disputeId, item])).values()
        );
        
        this.$disputeId.options = uniqueDisputes.map((value: any) => ({
          key: value.disputeId,
          value: value.disputeId + ' - ' + value.disputeTypeCode
        }));
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

  convertMoney(money: number) {
    return money !== null
      ? money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      : null;
  }


  trackDateRangeValidation() {
    const fromDateControl = this.form.get('fromDate');
    const toDateControl = this.form.get('toDate');

    this.form.valueChanges.subscribe(() => {
      const fromDate = moment(fromDateControl?.value);
      const toDate = moment(toDateControl?.value);

      const diffDays = toDate.diff(fromDate, 'days');

      if (diffDays < 0) {
        toDateControl?.setErrors({ dateOrderInvalid: true });
      } else if (diffDays > 10) {
        toDateControl?.setErrors({ dateRangeExceeded: true });
      } else {
        const errors = toDateControl?.errors;
        if (errors) {
          delete errors.dateOrderInvalid;
          delete errors.dateRangeExceeded;
          if (Object.keys(errors).length === 0) {
            toDateControl?.setErrors(null);
          } else {
            toDateControl?.setErrors(errors);
          }
        }
      }
    });
  }

  resetFormSearch() {
    this.form.reset();
    this.dataTransactionOrigin = null;
    this.resetFormRequestDispute()
    this.loadBtn();
  }

  modalAddAccount() {
    this.dialogService.dformconfirm({
      label: 'Thêm mới yêu cầu hoàn trả',
      acceptBtn: 'Đồng ý',
      closeBtn: 'Đóng',
      innerHTML: 'Xác nhận thêm mới yêu cầu hoàn trả?'
    }, (result: any) => {
      if (result && result.status === DFORM_CONFIRM_STATUS.CONFIRMED) {
        this.createTransactionOrigin();
      }
    });
  }

  async createTransactionOrigin() {
    try {
      this.requestTransactionRefund = await this.createTransactionRefund();
    } catch (e) {
      return;
    }

    this.indicator.showActivityIndicator();
    this.refundService.createTransactionRefund(this.requestTransactionRefund).pipe(
      takeUntil(this.ngUnsubscribe),
      finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe((res) => {
      if (res && res.status === 200) {
        this.toastr.showToastr(
          'Thêm mới yêu cầu hoàn trả thành công',
          'Thông báo!',
          MessageSeverity.success,
          TOAST_DEFAULT_CONFIG
        );
        this.goTo(URL.NAPAS.IBFT_RECONCILE.OUT.REFUND.SEARCH);
      } else {
        this.toastr.showToastr(
          res.soaErrorDesc,
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

  async createTransactionRefund(): Promise<ICreateTransactionRefund> {
    const returnDataProcessingCode = this.form.get('returnDataProcessingCode')?.value;
    const returnDataTransactionAmount = this.form.get('returnDataTransactionAmount')?.value;
    const returnDataCurrencyCode = '704';
    const senderAcc = this.form.get('senderAcc')?.value;
    const receiverAcc = this.form.get('receiverAcc')?.value;
    const disputeId = this.form.get('disputeId')?.value;
    const contentTransfers = this.form.get('contentTransfers')?.value;
    const transactionAccountingType = this.form.get('transactionAccountingType')?.value;
    const date = new Date(this.dataTransactionOrigin?.createdAt);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng trong JS tính từ 0
    const year = date.getFullYear();

    const formattedDate = day + month + year;

    return {
      type: 'INSERT',
      returnId: null,
      returnDataProcessingCode: returnDataProcessingCode.trim(),
      returnDataTransactionAmount: Number(returnDataTransactionAmount),
      returnDataCurrencyCode: returnDataCurrencyCode.trim(),
      senderAcc: senderAcc.trim(),
      receiverAcc: receiverAcc.trim(),
      disputeId: disputeId,
      contentTransfers: contentTransfers.trim(),
      originalDataOrigTransactionReference: this.dataTransactionOrigin?.transactionReferenceNumber,
      transactionAccountingType: transactionAccountingType.trim(),
      origCreateDateTime: formattedDate,
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
    console.log(this.form.invalid, 'this.form.invalid');

    if (this.form.invalid) {
      console.log('here');

      this.form.markAllAsTouched();
      return false;
    }
    return true
  }

  loadBtn() {
    this.listButton = this.dataTransactionOrigin ? this.listButtonDynamic('', BUTTON_CANCEL, BUTTON_REQUEST_APPROVER) : this.listButtonDynamic('', BUTTON_CANCEL);

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

  onClickBtn($event?: any): void {
    switch ($event) {
      case TYPE_BTN_FOOTER.TYPE_CANCEL:
        this.goTo(URL.NAPAS.IBFT_RECONCILE.OUT.REFUND.SEARCH);
        break;
      case TYPE_BTN_FOOTER.TYPE_SEND_APPROVER:
        if (!this.validateFormBeforeSubmit()) return;
        this.modalAddAccount();
        break;
    }
  }
}
