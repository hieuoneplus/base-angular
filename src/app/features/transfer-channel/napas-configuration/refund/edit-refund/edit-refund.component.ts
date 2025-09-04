import { ChangeDetectorRef, Component, ElementRef, Injector, ViewChild } from '@angular/core';
import { ComponentAbstract, MessageSeverity, TextControlComponent } from '@shared-sm';
import * as moment from 'moment';
import { EMPTY, of, forkJoin } from 'rxjs';
import { finalize, switchMap, takeUntil, catchError, map } from 'rxjs/operators';
import { BUTTON_REQUEST_APPROVER, BUTTON_CANCEL, DFORM_CONFIRM_STATUS, TOAST_DEFAULT_CONFIG, TYPE_BTN_FOOTER } from 'src/app/public/constants';
import { ModuleKeys } from 'src/app/public/module-permission.utils';
import ErrorUtils from 'src/app/shared/utils/ErrorUtils';
import { RefundService } from '../../services/refund.service';
import { URL, RETURN_DATA_PROCESSING_CODE, RETURN_DATA_TRANSACTION_AMOUNT, RETURN_DATA_CURRENCY_CODE, DISPUTE_ID, TRANSACTION_ACCOUNTING_TYPE, SENDER_ACC, RECEVER_ACC, CONTENT_TRANSFERS } from '../modal/constant';

import { IParamsSearch, IResponseTransactionOriginal, IParamsSearchTransactionOrigin, ICreateTransactionRefund, IResponseTransactionRefund, IResponseTransactionDispute } from '../modal/interface';

@Component({
  selector: 'app-edit-refund',
  templateUrl: './edit-refund.component.html',
  styleUrls: ['./edit-refund.component.scss']
})
export class EditRefundComponent extends ComponentAbstract {

  $returnDataProcessingCode = RETURN_DATA_PROCESSING_CODE();
  $returnDataTransactionAmount = RETURN_DATA_TRANSACTION_AMOUNT();
  $returnDataCurrencyCode = RETURN_DATA_CURRENCY_CODE();
  $disputeId = DISPUTE_ID();
  $transactionAccountingType = TRANSACTION_ACCOUNTING_TYPE();
  $senderAcc = SENDER_ACC();
  $receiverAcc = RECEVER_ACC();
  $contentTransfers = CONTENT_TRANSFERS();


  dataTransactionOrigin: IResponseTransactionOriginal;
  dataTransactionRefund: IResponseTransactionRefund;
  dataTransactionDispute: IResponseTransactionDispute[]
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
    this.$returnDataCurrencyCode.readOnly = true
    this.loadBtn();

    this.form = this.itemControl.toFormGroup([
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

      const rawParamsRefund: IParamsSearch = {
        id: this.queryParams.id,
        page: 1,
        size: 10,
      };

      const paramsTransactionRefund = this.cleanObject(rawParamsRefund);

      const rawParamsDispute: IParamsSearch = {
        origTransactionReference: this.queryParams.origTransactionReference,
        page: 1,
        size: 1000,
      };

      const paramsTransactionDispute = this.cleanObject(rawParamsDispute);
  
      this.indicator.showActivityIndicator();
      forkJoin({
        transactionOrigin: this.refundService.getTransactionOrigin(paramsTransactionOrigin as IParamsSearchTransactionOrigin),
        transactionRefund: this.refundService.getTransactionRefund(paramsTransactionRefund as IParamsSearch),
        transactionDispute: this.refundService.getTransactionDispute(paramsTransactionDispute as IParamsSearch)
      }).pipe(
        takeUntil(this.ngUnsubscribe),
        finalize(() => this.indicator.hideActivityIndicator())
      ).subscribe(({ transactionOrigin, transactionRefund, transactionDispute }) => {
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
          this.form.patchValue({
            returnDataProcessingCode: this.dataTransactionRefund?.processingCode ?? null,
            senderAcc: this.dataTransactionRefund?.senderAcc ?? null,
            returnDataTransactionAmount: this.dataTransactionRefund?.transactionAmount ?? null,
            receiverAcc: this.dataTransactionRefund?.receiverAcc ?? null,
            // returnDataCurrencyCode: this.dataTransactionRefund?.settlementCurrencyCode ?? '704',
            contentTransfers: this.dataTransactionRefund?.contentTransfers ?? null,
            disputeId: this.dataTransactionRefund?.disputeId ?? null,
            transactionAccountingType: this.dataTransactionRefund?.transactionAccountingType.toString() ?? null
          })

          this.cdr.detectChanges();
          setTimeout(() => {
            if (this.amountValue && this.amountValue.inputElement) {
              this.amountValue.inputElement.nativeElement.value = this.convertMoney(this.dataTransactionRefund?.transactionAmount);
            } else {
              console.warn('amountValue vẫn chưa được gán');
            }
          });
        }

        if (transactionDispute && transactionDispute?.status === 200 && transactionDispute.data?.disputes?.length > 0) {
          this.dataTransactionDispute = transactionDispute.data.disputes
          const uniqueDisputes = Array.from(
            new Map(this.dataTransactionDispute.map((item: any) => item.transactionType==='ACQ' && [item.disputeId, item])).values()
          );
          
          this.$disputeId.options = uniqueDisputes.map((value: any) => ({
            key: value.disputeId,
            value: value.disputeId + ' - ' + value.disputeTypeCode
          }));
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

  convertMoney(money: number) {
    return money !== null
      ? money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      : null;
  }

  modalUpdateAccount() {
    this.dialogService.dformconfirm({
      label: 'Chỉnh sửa yêu cầu hoàn trả',
      acceptBtn: 'Đồng ý',
      closeBtn: 'Đóng',
      innerHTML: 'Xác nhận chỉnh sửa yêu cầu hoàn trả?'
    }, (result: any) => {
      if (result && result.status === DFORM_CONFIRM_STATUS.CONFIRMED) {
        this.createInputTransactionRefund();
      }
    });
  }

  async createInputTransactionRefund() {
    try {
      this.requestTransactionRefund = await this.createTransactionRefund();
    } catch (e) {
      return;
    }

    this.indicator.showActivityIndicator();
    this.refundService.updateTransactionRefund(this.requestTransactionRefund).pipe(
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
      type: 'UPDATE',
      returnId: this.dataTransactionRefund.id,
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
    if (this.form.invalid) {
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
        this.modalUpdateAccount();
        break;
    }
  }
}
