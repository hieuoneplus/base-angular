import { HttpResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Injector, ViewChild } from '@angular/core';
import { ComponentAbstract, MessageSeverity, TextControlComponent } from '@shared-sm';
import { EMPTY, of, forkJoin } from 'rxjs';
import { finalize, switchMap, takeUntil, catchError, map } from 'rxjs/operators';
import { BUTTON_CANCEL, BUTTON_REQUEST_APPROVER, DFORM_CONFIRM_STATUS, TOAST_DEFAULT_CONFIG, TYPE_BTN_FOOTER } from 'src/app/public/constants';
import { ModuleKeys } from 'src/app/public/module-permission.utils';
import { FileHandle } from 'src/app/shared/directives/dragDrop.directive';
import ErrorUtils from 'src/app/shared/utils/ErrorUtils';
import { SearchDisputeService } from '../../services/search-dispute.service';
import { URL, DISPUTE_AMOUNT, DISPUTE_CLAIM_CODE, DISPUTE_MESSAGE, DISPUTE_SUBJECT, DISPUTE_TYPE_CODE, SELECT_DISPUTE_CLAIM_CODE, SELECT_DISPUTE_TYPE_CODE, REFUND_AMOUNT, REFUND_CREATED_DATE, REFUND_CODE, REFUND_ACCOUNT, REFUND_DESCRIPTION, DISPUTE_STATUS, SELECT_DISPUTE_STATUS } from '../modal/constant';
import { typeTransactionDisputeEnum } from '../modal/enum';
import { ICreateDisputeResponse, IParamsSearch, IParamsSearchTransactionOrigin, IResponseChargeCredits, IResponseTransactionDispute, IResponseTransactionOriginal, IResponseTransactionRefund } from '../modal/interface';


@Component({
  selector: 'app-reply-dispute',
  templateUrl: './reply-dispute.component.html',
  styleUrls: ['./reply-dispute.component.scss']
})
export class ReplyDisputeComponent extends ComponentAbstract {

  $disputeTypeCode = DISPUTE_TYPE_CODE();
  $disputeClaimCode = DISPUTE_CLAIM_CODE();
  $disputeSubject = DISPUTE_SUBJECT();
  $disputeMessage = DISPUTE_MESSAGE();
  $disputeStatus = DISPUTE_STATUS();
  $disputeAmount = DISPUTE_AMOUNT();
  $refundAmount = REFUND_AMOUNT();
  $refundCreatedDate = REFUND_CREATED_DATE();
  $refundCode = REFUND_CODE();
  $refundAccount = REFUND_ACCOUNT();
  $refundDescription = REFUND_DESCRIPTION();

  dataTransactionOrigin: IResponseTransactionOriginal;
  dataTransactionDisputeRequest: IResponseTransactionDispute;
  dataTransactionDisputeReponse: IResponseTransactionDispute;
  dataTransactionRefund: IResponseTransactionRefund[];
  dataChargecredit: IResponseChargeCredits[];

  createDisputeResponse: ICreateDisputeResponse;
  showDisputeAmount: boolean = false

  processBatch: any;
  percent = 0;
  selectedFiles: File;
  @ViewChild('file') myInputVariable: ElementRef;
  @ViewChild('amountDispute') amountDispute: TextControlComponent;
  @ViewChild('amountRefund') amountRefund: TextControlComponent;

  constructor(
    protected injector: Injector,
    private searchDisputeService: SearchDisputeService,
    private cdr: ChangeDetectorRef,
  ) {
    super(injector)
  }

  componentInit(): void {
    this.enableActions(ModuleKeys.napas_ibft_reconcile_dispute);
    this.listButton = this.hasDataSource ? this.listButtonDynamic('', BUTTON_CANCEL, BUTTON_REQUEST_APPROVER) : this.listButtonDynamic('', BUTTON_CANCEL, BUTTON_REQUEST_APPROVER)
    this.$disputeMessage.required = true;
    this.$disputeSubject.required = true;
    this.$disputeStatus.required = true;


    const filteredDisputeStatusOptions = SELECT_DISPUTE_STATUS.filter(item => item.key === 'PRCD' || item.key === 'RJCT');
    this.$disputeStatus.options = filteredDisputeStatusOptions;


    this.form = this.itemControl.toFormGroup([
      this.$disputeTypeCode,
      this.$disputeClaimCode,
      this.$disputeSubject,
      this.$disputeMessage,
      this.$disputeStatus,
      this.$disputeAmount,
      this.$refundAmount,
      this.$refundCreatedDate,
      this.$refundCode,
      this.$refundAccount,
      this.$refundDescription,
    ])
    this.form.patchValue({ disputeSubject: "Trả lời tra soát " + this.queryParams.disputeId })
    this.form.patchValue({ disputeMessage: "Phản hồi tra soát " + this.queryParams.disputeId })

    this.search()
    this.trackDisputeStatus()
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
        disputeType: this.queryParams.disputeType,
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
            } else if (transactionOrigin.status !== 200 || !transactionOrigin.data.content || transactionOrigin.data.content.length === 0) {
              this.hasDataSource = false;
              this.toastr.showToastr(
                transactionOrigin?.soaErrorDesc || 'Không tồn tại giao dịch gốc',
                'Thông báo!',
                MessageSeverity.error,
                TOAST_DEFAULT_CONFIG
              );
            }

            if (!dispute) {
              console.warn('Không có thông tin yêu cầu tra soát');
            }
            return EMPTY;
          }

          if (transactionOrigin.status === 200 && transactionOrigin.data.content && transactionOrigin.data.content.length > 0) {
            this.dataTransactionOrigin = transactionOrigin.data.content[0];
          }

          if (dispute.status === 200 && dispute.data.disputes && dispute.data.disputes.length > 0) {
            const dataRequest = dispute.data.disputes.filter((item) => item.type === typeTransactionDisputeEnum.REQUEST);
            if (dataRequest.length > 0) {
              this.dataTransactionDisputeRequest = dataRequest[0]
            }

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

  convertToTimeFormat(timeStr: string): string {
    if (!timeStr || timeStr.length !== 6) return '';
    return timeStr.slice(0, 2) + ':' + timeStr.slice(2, 4) + ':' + timeStr.slice(4, 6);
  }

  convertToDateFormat(dateStr: string): string {
    if (!dateStr || dateStr.length !== 4) return '';
    return dateStr.slice(2, 4) + '-' + dateStr.slice(0, 2);
  }

  cleanObject<T>(obj: T): Partial<T> {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        (acc as any)[key] = value;
      }
      return acc;
    }, {} as Partial<T>);
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
    idFile = this.dataTransactionDisputeRequest?.fileId ? this.dataTransactionDisputeRequest?.fileId : ''
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
          a.download = this.dataTransactionDisputeRequest?.fileName;
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
    this.percent = 0;
  }

  trackDisputeStatus() {
    this.form.get('disputeStatus')?.valueChanges.subscribe(value => {
      const resetField = (fieldName: string) => {
        const field = this.form.get(fieldName);
        if (field) {
          field.setValue(null);
          field.markAsPristine();
          field.markAsUntouched();
        }
      };

      if (value === 'PRCD') {
        if (this.dataTransactionDisputeRequest?.disputeAmount) {
          this.showDisputeAmount = true;
          this.$disputeAmount.required = true;
          this.form.patchValue({
            disputeAmount: this.dataTransactionDisputeRequest?.origTransactionAmount
          });
          this.cdr.detectChanges();

          // Đẩy việc thao tác DOM sang event loop tiếp theo
          setTimeout(() => {
            if (this.amountDispute && this.amountDispute.inputElement) {
              this.amountDispute.inputElement.nativeElement.value = this.convertMoney(this.dataTransactionDisputeRequest?.origTransactionAmount);
            } else {
              console.warn('amountDispute vẫn chưa được gán');
            }
          }, 0);

        }
      } else if (value === 'RJCT') {
        this.showDisputeAmount = false;
        this.$disputeAmount.required = false;
        resetField('disputeAmount');
      }
    });

  }

  modalConfirmReplyTransactionDispute() {
    this.dialogService.dformconfirm({
      label: 'Thêm mới yêu cầu phản hồi tra soát',
      acceptBtn: 'Đồng ý',
      closeBtn: 'Đóng',
      innerHTML: 'Xác nhận thêm mới yêu cầu phản hồi tra soát?'
    }, (result: any) => {
      if (result && result.status === DFORM_CONFIRM_STATUS.CONFIRMED) {
        this.createReplyTransactionDispute();
      }
    });
  }

  async createReplyTransactionDispute() {
    try {
      this.createDisputeResponse = await this.updateRequestDispute();
    } catch (e) {
      return;
    }

    this.indicator.showActivityIndicator();
    this.searchDisputeService.createReplyTransactionDispute(this.createDisputeResponse).pipe(
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

  async updateRequestDispute(): Promise<ICreateDisputeResponse> {
    const origTransactionReference = this.queryParams.origTransactionReference
    const disputeId = this.queryParams.disputeId
    const disputeTypeCode = this.form.get('disputeTypeCode')?.value;
    const disputeClaimCode = this.form.get('disputeClaimCode')?.value;
    const disputeStatus = this.form.get('disputeStatus')?.value;
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
      originalRequest: {
        originalData: {
          origTransactionReference,
          origCreatedAt: this.dataTransactionOrigin?.createdAt ? this.dataTransactionOrigin?.createdAt : null
        }
      },
      disputeData: {
        disputeId,
        disputeSubject,
        disputeMessage,
        disputeAmount: disputeAmount !== null  ? {
          value: disputeAmount,
          currencyCode: '704'
        } : null,
        disputeStatus,
        fileAttachment: convertedFile ? [convertedFile] : null
      }
    }
  }

  loadBtn() {
    this.listButton = this.dataTransactionOrigin && this.dataTransactionDisputeRequest ? this.listButton = this.listButtonDynamic('', BUTTON_CANCEL, BUTTON_REQUEST_APPROVER) : this.listButtonDynamic('', BUTTON_CANCEL);
  }

  private validateFormBeforeSubmit(): boolean {
    const disputeSubjectControl = this.form.get('disputeSubject');
    const disputeMessageControl = this.form.get('disputeMessage');
    const disputeStatusControl = this.form.get('disputeStatus');

    if (disputeSubjectControl.invalid || disputeMessageControl.invalid || disputeStatusControl.invalid) {
      disputeSubjectControl?.markAllAsTouched();
      disputeMessageControl?.markAllAsTouched();
      disputeStatusControl?.markAllAsTouched();
      return false;
    }

    const typeCode = this.form.get('disputeTypeCode')?.value;
    const claimCode = this.form.get('disputeClaimCode')?.value;

    if (typeCode === 'RQSP' && !claimCode) {
      this.dialogService.error({ title: 'Thông báo', innerHTML: 'Vui lòng nhập thông tin mã yêu cầu thu hồi' });
      return false;
    } else if (typeCode !== 'RQSP' && claimCode) {
      this.dialogService.error({ title: 'Thông báo', innerHTML: 'Vui lòng không nhập thông tin mã yêu cầu thu hồi' });
      return false;
    }

    return true;
  }

  onClickBtn($event?: any): void {
    switch ($event) {
      case TYPE_BTN_FOOTER.TYPE_CANCEL:
        this.goTo(URL.NAPAS.IBFT_RECONCILE.OUT.DISPUTE.SEARCH_DISPUTE);
        break;
      case TYPE_BTN_FOOTER.TYPE_SEND_APPROVER:
        if (!this.validateFormBeforeSubmit()) return;
        this.modalConfirmReplyTransactionDispute()
        break;
    }
  }

  convertMoney(money: number) {
    return money !== null
      ? money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      : null;
  }

  validateMoney(event: any, controlName: string): void {
    const inputElement = event.target as HTMLInputElement;
    const originalCursorPos = inputElement.selectionStart ?? 0;
    const originalValue = inputElement.value;
  
    let rawValue = originalValue.replace(/[^0-9]/g, '');
    if (rawValue === '0') {
    } else {
      rawValue = rawValue.replace(/^0+/, '');
    }
    rawValue = rawValue.slice(0, 12);
    const control = this.form.get(controlName);
    if (control) {
      control.setValue(rawValue);
    }
    const formattedValue = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    inputElement.value = formattedValue;
    if (originalCursorPos === originalValue.length) {
      inputElement.setSelectionRange(formattedValue.length, formattedValue.length);
    } else {
      let digitsBeforeCursor = originalValue
        .slice(0, originalCursorPos)
        .replace(/[^0-9]/g, '');
      if (digitsBeforeCursor !== '0') {
        digitsBeforeCursor = digitsBeforeCursor.replace(/^0+/, '');
      }
      digitsBeforeCursor = digitsBeforeCursor.slice(0, 12);
      let cursorPos = 0;
      let digitCount = 0;
      for (let i = 0; i < formattedValue.length; i++) {
        if (/\d/.test(formattedValue[i])) {
          digitCount++;
        }
        if (digitCount === digitsBeforeCursor.length) {
          cursorPos = i + 1;
          break;
        }
      }
  
      inputElement.setSelectionRange(cursorPos, cursorPos);
    }
  }

}
