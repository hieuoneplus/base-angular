import { HttpResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Injector, ViewChild } from '@angular/core';
import { ComponentAbstract, MessageSeverity, TextControlComponent } from '@shared-sm';
import * as moment from 'moment';
import { forkJoin } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { BUTTON_CANCEL, BUTTON_SAVE, DFORM_CONFIRM_STATUS, TOAST_DEFAULT_CONFIG, TYPE_BTN_FOOTER } from 'src/app/public/constants';
import { ModuleKeys } from 'src/app/public/module-permission.utils';
import { FileHandle } from 'src/app/shared/directives/dragDrop.directive';
import ErrorUtils from 'src/app/shared/utils/ErrorUtils';
import { SearchDisputeService } from '../../services/search-dispute.service';
import { URL, DISPUTE_AMOUNT, DISPUTE_CLAIM_CODE, DISPUTE_MESSAGE, DISPUTE_SUBJECT, DISPUTE_TYPE_CODE, SELECT_DISPUTE_CLAIM_CODE, SELECT_DISPUTE_TYPE_CODE } from '../modal/constant';
import { ICreateDispute, IParamsSearch, IParamsSearchTransactionOrigin, IResponseTransactionDispute, IResponseTransactionOriginal } from '../modal/interface';

@Component({
  selector: 'app-edit-dispute',
  templateUrl: './edit-dispute.component.html',
  styleUrls: ['./edit-dispute.component.scss']
})
export class EditDisputeComponent extends ComponentAbstract {

  @ViewChild('file') myInputVariable: ElementRef;
  @ViewChild('amountDispute') amountDispute: TextControlComponent;

  $disputeTypeCode = DISPUTE_TYPE_CODE();
  $disputeClaimCode = DISPUTE_CLAIM_CODE();
  $disputeAmount = DISPUTE_AMOUNT();
  $disputeSubject = DISPUTE_SUBJECT();
  $disputeMessage = DISPUTE_MESSAGE();

  dataTransactionOrigin: IResponseTransactionOriginal;
  dataTransactionDispute: IResponseTransactionDispute;
  requestDispute: ICreateDispute | null = null;

  processBatch: any;
  percent = 0;
  selectedFiles: File;
  fileName: string
  showClaimCode: boolean = false;
  showDisputeAmount: boolean = false
  showFormDispute: boolean = false


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

    this.$disputeTypeCode.required = true;
    this.$disputeMessage.required = true;
    const filteredDisputeTypeCodeOptions = SELECT_DISPUTE_TYPE_CODE.filter(item => item.key !== 'ALL');
    const filteredDisputeClaimCodeOptions = SELECT_DISPUTE_CLAIM_CODE.filter(item => item.key !== 'ALL');
    this.$disputeTypeCode.options = filteredDisputeTypeCodeOptions;
    this.$disputeClaimCode.options = filteredDisputeClaimCodeOptions;

    this.form = this.itemControl.toFormGroup([
      this.$disputeTypeCode,
      this.$disputeClaimCode,
      this.$disputeAmount,
      this.$disputeSubject,
      this.$disputeMessage,
    ]);
    this.trackDisputeTypeCode()
    this.searchTransactionOrigin()
  }

  cleanObject<T>(obj: T): Partial<T> {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        (acc as any)[key] = value;
      }
      return acc;
    }, {} as Partial<T>);
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
          const disputeTypeCodeValues = ['RQRN', 'RQSP', 'GDFT'];
          const disputeAmountValue = disputeTypeCodeValues.includes(this.dataTransactionDispute?.disputeTypeCode) ? this.dataTransactionDispute?.disputeAmount : null;
          this.form.patchValue({
            disputeTypeCode: this.dataTransactionDispute?.disputeTypeCode ?? null,
            disputeClaimCode: this.dataTransactionDispute?.disputeClaimCode ??null,
            disputeAmount: disputeAmountValue !== null && disputeAmountValue !== undefined ? disputeAmountValue : null,
            disputeSubject: this.dataTransactionDispute?.disputeSubject ??null,
            disputeMessage: this.dataTransactionDispute?.disputeMessage ??null,
          })
          this.fileName = this.dataTransactionDispute?.fileName ? this.dataTransactionDispute?.fileName : null

          this.cdr.detectChanges();
          setTimeout(() => {
            if (this.amountDispute && this.amountDispute.inputElement) {
              this.amountDispute.inputElement.nativeElement.value = this.convertMoney(this.dataTransactionDispute?.disputeAmount);
            } else {
              console.warn('amountDispute vẫn chưa được gán');
            }
          });
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
  
  modalUpdateDispute() {
    this.dialogService.dformconfirm({
      label: 'Chỉnh sửa yêu cầu tra soát',
      acceptBtn: 'Đồng ý',
      closeBtn: 'Đóng',
      innerHTML: 'Xác nhận chỉnh sửa yêu cầu tra soát?'
    }, (result: any) => {
      if (result && result.status === DFORM_CONFIRM_STATUS.CONFIRMED) {
        this.updateTransactionDispute();
      }
    });
  }

  async updateTransactionDispute() {
    try {
      this.requestDispute = await this.updateRequestDispute();
    } catch (e) {
      return;
    }

    this.indicator.showActivityIndicator();
    this.searchDisputeService.updateTransactionDispute(this.requestDispute).pipe(
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

  async updateRequestDispute(): Promise<ICreateDispute> {
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
        origCreatedAt: this.dataTransactionOrigin?.createdAt || null,
      },
      approvalDisputeStatus: "REJECTED",
      disputeData: {
        disputeTypeCode,
        disputeClaimCode,
        disputeId: this.dataTransactionDispute?.disputeId
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
    this.fileName = '';
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

  convertMoney(money: number) {
    return money !== null
      ? money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      : null;
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

  trackDisputeTypeCode(){
    this.form.get('disputeTypeCode')?.valueChanges.subscribe(value => {
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
      
        const disputeAmountValues = ['RQRN', 'RQSP', 'GDFT'];
        this.showDisputeAmount = disputeAmountValues.includes(value);
        if (!this.showDisputeAmount) resetField('disputeAmount');
      
      } else {
        this.showClaimCode = false;
        this.showDisputeAmount = false;
        resetField('disputeClaimCode');
        resetField('disputeAmount');
      }

    })
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
    this.listButton = this.hasDataSource ? this.listButtonDynamic('', BUTTON_CANCEL, BUTTON_SAVE) : this.listButtonDynamic('', BUTTON_CANCEL);
  }
  
  onClickBtn($event?: any): void {
    switch ($event) {
      case TYPE_BTN_FOOTER.TYPE_CANCEL:
        this.goTo(URL.NAPAS.IBFT_RECONCILE.OUT.DISPUTE.SEARCH_DISPUTE);
        break;
      case TYPE_BTN_FOOTER.TYPE_SAVE:
        if (!this.validateFormBeforeSubmit()) return;
        this.modalUpdateDispute();
        break;
    }
  }

}
