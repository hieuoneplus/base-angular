import { ChangeDetectorRef, Component, ElementRef, Injector, ViewChild } from '@angular/core';
import { ComponentAbstract, MessageSeverity, TextControlComponent } from '@shared-sm';
import * as moment from 'moment';
import { finalize, takeUntil } from 'rxjs/operators';
import { BUTTON_ADD, BUTTON_CANCEL, DFORM_CONFIRM_STATUS, TOAST_DEFAULT_CONFIG, TYPE_BTN_FOOTER } from 'src/app/public/constants';
import { ModuleKeys } from 'src/app/public/module-permission.utils';
import { FileHandle } from 'src/app/shared/directives/dragDrop.directive';
import ErrorUtils from 'src/app/shared/utils/ErrorUtils';
import { SearchDisputeService } from '../../services/search-dispute.service';
import {
  URL, FROM_DATE, TO_DATE, DISPUTE_AMOUNT, DISPUTE_CLAIM_CODE, DISPUTE_MESSAGE, DISPUTE_SUBJECT,
  DISPUTE_TYPE_CODE, ORIG_TRANSACTION_REFERENCE, SELECT_DISPUTE_CLAIM_CODE, SELECT_DISPUTE_TYPE_CODE, TRACE_NUMBER
} from '../modal/constant';
import { ICreateDispute, IResponseTransactionOriginal } from '../modal/interface';

@Component({
  selector: 'app-create-dispute',
  templateUrl: './create-dispute.component.html',
  styleUrls: ['./create-dispute.component.scss']
})
export class CreateDisputeComponent extends ComponentAbstract {
  $origTransactionReference = ORIG_TRANSACTION_REFERENCE();
  $traceNumber = TRACE_NUMBER();
  $dateTime = FROM_DATE();
  $toDate = TO_DATE();
  $disputeTypeCode = DISPUTE_TYPE_CODE();
  $disputeClaimCode = DISPUTE_CLAIM_CODE();
  $disputeAmount = DISPUTE_AMOUNT();
  $disputeSubject = DISPUTE_SUBJECT();
  $disputeMessage = DISPUTE_MESSAGE();

  dataTransactionOrigin: IResponseTransactionOriginal;
  requestDispute: ICreateDispute | null = null;

  processBatch: any;
  percent = 0;
  selectedFiles: File;
  showClaimCode: boolean = false
  showDisputeAmount: boolean = false
  showFormDispute: boolean = false


  @ViewChild('file') myInputVariable: ElementRef;
  @ViewChild('amountDispute') amountDispute: TextControlComponent;

  constructor(
    protected injector: Injector,
    private searchDisputeService: SearchDisputeService,
    private cdr: ChangeDetectorRef
  ) {
    super(injector);
  }

  componentInit(): void {
    this.enableActions(ModuleKeys.napas_ibft_reconcile_dispute);
    this.loadBtn();

    this.$origTransactionReference.required = true;
    this.$dateTime.required = true;
    this.$toDate.required = true;
    this.$disputeTypeCode.required = true;
    this.$disputeMessage.required = true;

    const filteredDisputeTypeCodeOptions = SELECT_DISPUTE_TYPE_CODE.filter(item => item.key !== 'ALL');
    const filteredDisputeClaimCodeOptions = SELECT_DISPUTE_CLAIM_CODE.filter(item => item.key !== 'ALL');
    this.$disputeTypeCode.options = filteredDisputeTypeCodeOptions;
    this.$disputeClaimCode.options = filteredDisputeClaimCodeOptions;

    this.form = this.itemControl.toFormGroup([
      this.$origTransactionReference,
      this.$traceNumber,
      this.$dateTime,
      this.$toDate,
      this.$disputeTypeCode,
      this.$disputeClaimCode,
      this.$disputeAmount,
      this.$disputeSubject,
      this.$disputeMessage,
    ]);
    this.trackDisputeTypeCode()
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
      this.$dateTime.key,
      this.$toDate.key,
    ];

    const keyMap: Record<string, string> = {
      [this.$origTransactionReference.key]: 'transactionReferenceNumber',
      [this.$traceNumber.key]: 'systemTraceAuditNumber',
      [this.$dateTime.key]: 'transactionDate',
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
    this.searchDisputeService.getTransactionOrigin(this.options.params).pipe(
      takeUntil(this.ngUnsubscribe),
      finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe((res) => {
      if (res && res.status === 200 && res.data.content && res.data.content.length > 0) {
        this.hasDataSource = true;
        this.dataTransactionOrigin = res.data.content[0];
        this.loadBtn();
      } else {
        this.hasDataSource = false;
        this.toastr.showToastr(
          res.soaErrorDesc ? res.soaErrorDesc : 'Không tồn tại giao dịch gốc',
          'Thông báo!',
          MessageSeverity.error,
          TOAST_DEFAULT_CONFIG
        );
        this.loadBtn();
      }
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
    this.hasDataSource = false;
    this.resetFormRequestDispute()
    this.loadBtn();
  }

  modalAddAccount() {
    this.dialogService.dformconfirm({
      label: 'Thêm mới yêu cầu tra soát',
      acceptBtn: 'Đồng ý',
      closeBtn: 'Đóng',
      innerHTML: 'Xác nhận thêm mới yêu cầu tra soát?'
    }, (result: any) => {
      if (result && result.status === DFORM_CONFIRM_STATUS.CONFIRMED) {
        this.createTransactionOrigin();
      }
    });
  }

  async createTransactionOrigin() {
    try {
      this.requestDispute = await this.createRequestDispute();
    } catch (e) {
      return;
    }

    this.indicator.showActivityIndicator();
    this.searchDisputeService.createTransactionDispute(this.requestDispute).pipe(
      takeUntil(this.ngUnsubscribe),
      finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe((res) => {
      if (res && res.status === 200) {
        this.toastr.showToastr(
          'Thêm mới yêu cầu tra soát thành công',
          'Thông báo!',
          MessageSeverity.success,
          TOAST_DEFAULT_CONFIG
        );
        this.goTo(URL.NAPAS.IBFT_RECONCILE.OUT.DISPUTE.SEARCH_DISPUTE);
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

  async createRequestDispute(): Promise<ICreateDispute> {
    const disputeTypeCode = this.form.get('disputeTypeCode')?.value;
    const disputeClaimCode = this.form.get('disputeClaimCode')?.value;
    const disputeAmountRaw = this.form.get('disputeAmount')?.value;
    const disputeSubjectRaw = this.form.get('disputeSubject')?.value;
    const disputeMessageRaw = this.form.get('disputeMessage')?.value;

    const disputeAmount = disputeAmountRaw ? Number(disputeAmountRaw) : null;
    const disputeSubject = disputeSubjectRaw?.trim() || '';
    const disputeMessage = disputeMessageRaw?.trim() || '';

    let convertedFile: {
      fileName: string;
      mimeType: string;
      encodeType: string;
      charSet: string;
      fileBinary: string;
    } | null = null;

    if (this.selectedFiles) {
      convertedFile = await this.convertFileToPdfJson(this.selectedFiles);
    }

    return {
      originalData: {
        origTransactionReference: this.dataTransactionOrigin?.transactionReferenceNumber,
        origCreatedAt: this.dataTransactionOrigin?.createdAt || null
      },
      approvalDisputeStatus: "WAITING",
      disputeData: {
        disputeTypeCode,
        disputeClaimCode
      },
      disputeAmount: disputeAmount ? {
        value: disputeAmount ? Number(disputeAmount) : null,
        currencyCode: "VND"
      } : null,
      disputeSubject,
      disputeMessage,
      disputeStatus: "NEWT",
      fileAttachments: convertedFile ? [convertedFile] : null
    };
  }

  dragFileInput(files: FileHandle[]): void {
    const file = [files[0].file];
    if (file.length > 1) {
      this.dialogService.error({ title: 'Thông báo', message: 'Chỉ chọn 1 file' });
      return;
    }
    this.percent = 0;
    this.selectedFiles = file[0];
  }

  handleFileInput(event) {
    if (event.target.files.length) {
      const file = <File>event.target.files[0];
      const fileName = file.name.toLowerCase();
      const allSpecialChars = "@#$%^&*+=[]{|}\\;/:'\",<>?!~`^"
      const containsSpecialChars = allSpecialChars.split('').some((char: any) => fileName.includes(char));
      if (containsSpecialChars) {
        this.dialogService.error({
          title: 'dialog.notification',
          message: 'Tên file không được chứa các ký tự đặc biệt.',
        }, res => { if (res) { } });
        return;
      }
      // const allowedExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx'];
      // const extension = fileName.split('.').pop();

      // if (!allowedExtensions.includes(extension)) {
      //   this.dialogService.error({
      //     title: 'Thông báo',
      //     message: 'Định dạng file không hợp lệ. Vui lòng chọn file có định dạng: ' + allowedExtensions.join(', ')
      //   });
      //   return;
      // }

      const baseFileName = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
      if (baseFileName.length > 40) {
        this.dialogService.error({ title: 'Thông báo', message: 'Tên file không được quá 40 ký tự' });
        return;
      }

      this.percent = 0;
      this.selectedFiles = file;
    }
  }

  convertFileToPdfJson(file: File): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        const base64String = this.arrayBufferToBase64(arrayBuffer);
        resolve({
          fileName: file.name,
          mimeType: file.type || 'application/octet-stream',
          encodeType: 'UTF-8',
          charSet: 'UTF-8',
          fileBinary: base64String
        });
      };
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  }

  arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  destroyFile() {
    this.myInputVariable.nativeElement.value = "";
    this.selectedFiles = null;
    this.processBatch = null;
    this.percent = 0;
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
      'disputeTypeCode',
      'disputeClaimCode',
      'disputeAmount',
      'disputeSubject',
      'disputeMessage',
    ];

    fields.forEach(fieldName => {
      const field = this.form.get(fieldName);
      if (field) {
        field.setValue(null);
        field.markAsPristine();
        field.markAsUntouched();
      }
    });

    this.selectedFiles = null
  }

  trackDisputeTypeCode() {
    this.form.get('disputeTypeCode')?.valueChanges.subscribe(value => {
      this.form.patchValue({ disputeMessage: "Yêu cầu tra soát cho giao dịch " + this.dataTransactionOrigin?.transactionReferenceNumber})
      this.form.patchValue({ disputeSubject: "Yêu cầu tra soát cho giao dịch " + this.dataTransactionOrigin?.transactionReferenceNumber})
      this.showFormDispute = !!value;

      const resetField = (fieldName: string) => {
        const field = this.form.get(fieldName);
        if (field) {
          field.setValue(null);
          field.markAsPristine();
          field.markAsUntouched();
        }
      };

      if (this.showFormDispute) {
        this.showClaimCode = value === 'RQSP';
        if (!this.showClaimCode) resetField('disputeClaimCode');

        const disputeTypeCodeValues = ['RQRN', 'RQSP', 'GDFT'];
        this.showDisputeAmount = disputeTypeCodeValues.includes(value);
        if (!this.showDisputeAmount) {
          resetField('disputeAmount');
        } else {
          this.form.patchValue({disputeAmount: this.dataTransactionOrigin?.settlementAmount})
          this.cdr.detectChanges();
          setTimeout(() => {
            if (this.amountDispute && this.amountDispute.inputElement) {
              this.amountDispute.inputElement.nativeElement.value = this.convertMoney(this.dataTransactionOrigin?.settlementAmount);
            } else {
              console.warn('amountDispute vẫn chưa được gán');
            }
          });
        }
      } else {
        this.showClaimCode = false;
        this.showDisputeAmount = false;
        resetField('disputeClaimCode');
        resetField('disputeAmount');
      }

    })
  }

  convertMoney(money: number) {
    return money !== null
      ? money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      : null;
  }

  private validateFormBeforeSubmit(): boolean {
    const disputeTypeCode = this.form.get('disputeTypeCode');
    const disputeMessageControl = this.form.get('disputeMessage');
    if (disputeTypeCode?.invalid || !disputeTypeCode.value?.toString().trim() || disputeMessageControl.invalid) {
      disputeTypeCode?.markAllAsTouched();
      disputeMessageControl?.markAllAsTouched();
      return false;
    }

    // if (!this.selectedFiles) valid = false;

    // if (!valid) {
    //   this.dialogService.error({ title: 'Thông báo', innerHTML: 'Vui lòng nhập đầy đủ thông tin và đính kèm file' });
    //   return false;
    // }

    const typeCode = this.form.get('disputeTypeCode')?.value;
    const claimCode = this.form.get('disputeClaimCode')?.value;
    const amount = this.form.get('disputeAmount')?.value;


    if (typeCode === 'RQSP' && !claimCode) {
      this.dialogService.error({ title: 'Thông báo', innerHTML: 'Vui lòng nhập thông tin mã yêu cầu thu hồi' });
      return false;
    } else if (typeCode !== 'RQSP' && claimCode) {
      this.dialogService.error({ title: 'Thông báo', innerHTML: 'Vui lòng không nhập thông tin mã yêu cầu thu hồi' });
      return false;
    }

    if ((typeCode === 'RQRN' || typeCode === 'RQSP') && !amount) {
      this.dialogService.error({ title: 'Thông báo', innerHTML: 'Vui lòng nhập thông tin số tiền tra soát' });
      return false;
    } else if (!(typeCode === 'RQRN' || typeCode === 'RQSP' || typeCode === 'GDFT') && amount) {
      this.dialogService.error({ title: 'Thông báo', innerHTML: 'Vui lòng không nhập thông tin số tiền tra soát' });
      return false;
    }

    return true;
  }

  loadBtn() {
    this.listButton = this.hasDataSource ? this.listButtonDynamic('', BUTTON_CANCEL, BUTTON_ADD) : this.listButtonDynamic('', BUTTON_CANCEL);
  }

  onClickBtn($event?: any): void {
    switch ($event) {
      case TYPE_BTN_FOOTER.TYPE_CANCEL:
        this.goTo(URL.NAPAS.IBFT_RECONCILE.OUT.DISPUTE.SEARCH_DISPUTE);
        break;
      case TYPE_BTN_FOOTER.TYPE_SAVE:
        if (!this.validateFormBeforeSubmit()) return;
        this.modalAddAccount();
        break;
    }
  }
}
