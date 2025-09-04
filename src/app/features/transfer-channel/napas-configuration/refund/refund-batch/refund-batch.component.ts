import { Component, ElementRef, Injector, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ComponentAbstract, MessageSeverity } from '@shared-sm';
import * as moment from 'moment';
import { interval, Subscription } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { BUTTON_UNDO, DFORM_CONFIRM_STATUS, TOAST_DEFAULT_CONFIG, TYPE_BTN_FOOTER } from 'src/app/public/constants';
import { ModuleKeys } from 'src/app/public/module-permission.utils';
import { FileHandle } from 'src/app/shared/directives/dragDrop.directive';
import ErrorUtils from 'src/app/shared/utils/ErrorUtils';
import { RefundService } from '../../services/refund.service';
import { COLUMS_BATCH, URL, ID_BATCH, CREATE_AT, TO_CREATE_AT, FILE_NAME, BATCH_REFUND_STATUS, STATUS_LABEL_STATUS_BATCH } from '../modal/constant';
import { environment } from "@env/environment";
import { IApproveTransactionRefund, IResponseTransactionRefundBatch } from '../modal/interface';


@Component({
  selector: 'app-refund-batch',
  templateUrl: './refund-batch.component.html',
  styleUrls: ['./refund-batch.component.scss']
})
export class RefundBatchComponent extends ComponentAbstract {

  displayedColumns = COLUMS_BATCH;

  $id = ID_BATCH();
  $createAt = CREATE_AT();
  $toCreateAt = TO_CREATE_AT();
  $fileName = FILE_NAME();
  $status = BATCH_REFUND_STATUS();

  hasDataSource = false;
  requestParams: any
  bodyApprove: IApproveTransactionRefund;
  dataTransactionRefund: IResponseTransactionRefundBatch;


  @ViewChild('file') myInputVariable: ElementRef;
  percent = 0;
  private layoutChangesSubscription: Subscription;
  selectedFiles: File;
  subscribe_interval: Subscription;
  urlBase = environment.base_url;

  constructor(
    protected injector: Injector,
    private refundService: RefundService,
  ) {
    super(injector)
  }

  protected componentInit(): void {
    this.enableActions(ModuleKeys.napas_ibft_reconcile_dispute);
    this.form = this.itemControl.toFormGroup([
      this.$id,
      this.$createAt,
      this.$toCreateAt,
      this.$fileName,
      this.$status,
    ]);
    this.listButton = this.listButtonDynamic('', BUTTON_UNDO);
    this.trackDateRangeValidation();
    this.search();
  }

  search() {
    this.pageIndex = 0;
    this.pageSize = 10;
    const fromDateControl = this.form.get('createAt');
    const toDateControl = this.form.get('toCreateAt');

    if (fromDateControl?.invalid || toDateControl?.invalid) {
      fromDateControl?.markAllAsTouched();
      toDateControl?.markAllAsTouched();

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


    const params = Object.assign(
      {},
      Object.entries(this.form.value).reduce((acc, [key, value]) => {
        if (key === 'createAt' || key === 'toCreateAt') {
          const rawDate = this.form.get(key)?.value;
          if (rawDate) {
            const date = moment(rawDate).startOf('day').format('YYYY-MM-DD');
            acc[key] = date;
          } else {
            acc[key] = null;
          }
        } else {
          acc[key] = typeof value === 'string' && value.trim() !== '' ? value.trim() : null;
        }
        return acc;
      }, {})
    );

    this.options = {
      params: {
        ...params,
        page: this.pageIndex + 1,
        size: this.pageSize,
      }
    };

    this.dformPagination.goto(this.pageSize, this.pageIndex);
  }

  QueryData() {
    this.indicator.showActivityIndicator();
    this.refundService.getTransactionRefundBatch(this.options.params).pipe(
      takeUntil(this.ngUnsubscribe),
      finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe((res) => {
      // Gọi API thành công và có data trả về
      if (res && res.status === 200) {
        this.hasDataSource = true;
        const page = this.pageIndex * this.pageSize;
        const data = res.data.batchReturnResponses.map((obj, index) => {
          obj.stt = page + index + 1;
          return obj;
        });
        this.dataTransactionRefund = data[0]

        this.dataSource = new MatTableDataSource(data);
        this.totalItem = res.data.total;
      } else {
        this.hasDataSource = false;
        this.totalItem = 0;
        this.toastr.showToastr(
          res.soaErrorDesc ? res.soaErrorDesc : 'Lỗi hệ thống.',
          'Thông báo!',
          MessageSeverity.error,
          TOAST_DEFAULT_CONFIG
        )
      }
      this.dataSource.sort = this.sort;
    }, error => {
      console.log('error');
      this.hasDataSource = false;
      const messageError = ErrorUtils.getErrorMessage(error);
      this.toastr.showToastr(
        messageError.join('\n'),
        'Thông báo!',
        MessageSeverity.error,
        TOAST_DEFAULT_CONFIG
      )
    });
  }

  trackDateRangeValidation() {
    const fromDateControl = this.form.get('createAt');
    const toDateControl = this.form.get('toCreateAt');

    this.form.valueChanges.subscribe(() => {
      const fromDate = moment(fromDateControl?.value);
      const toDate = moment(toDateControl?.value);

      if (!fromDate.isValid() && !toDate.isValid()) {
        toDateControl?.setErrors(null);
        return;
      }

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


  convertToTimeFormat(timeStr: string): string {
    if (!timeStr || timeStr.length !== 6) return '';
    return timeStr.slice(0, 2) + ':' + timeStr.slice(2, 4) + ':' + timeStr.slice(4, 6);
  }

  convertToDateFormat(dateStr: string): string {
    if (!dateStr || dateStr.length !== 4) return '';
    return dateStr.slice(2, 4) + '-' + dateStr.slice(0, 2);
  }

  changePageIndex($event) {
    this.pageSize = $event.pageSize;
    this.pageIndex = $event.pageIndex;
    this.options = {
      params: {
        ...this.options.params,
        size: this.pageSize,
        page: this.pageIndex + 1,
      }
    };
    this.QueryData();
  }

  resetFormSearch() {
    this.form.reset();
    // this.search();
  }

  destroyData() {
    if (this.layoutChangesSubscription) {
      this.layoutChangesSubscription.unsubscribe();
    }
  }

  handleFileInput(event) {
    const lengthListFile = event.target.files.length;
    if (lengthListFile) {
      const fileName = (<File>event.target.files[0])?.name;
      if (!fileName.toLowerCase().includes('.xlsx') && !fileName.toLowerCase().includes('.xls')) {
        this.toastr.showToastr('Vui lòng chọn đúng định đạng File xlsx hoặc xls', 'Thông báo!', MessageSeverity.error, TOAST_DEFAULT_CONFIG);
        return;
      }
      this.percent = 0;
      this.selectedFiles = <File>event.target.files[0];
    }
  }

  dragFileInput(files: FileHandle[]): void {
    const file = [files[0].file];
    if (file && file.length > 1) {
      this.toastr.showToastr('Chỉ cho phép chọn một file định dạng xlsx hoặc xls', 'Thông báo!', MessageSeverity.error, TOAST_DEFAULT_CONFIG);
      return;
    }
    if (file && file.length == 1) {
      const fileName = file[0].name;
      if (!fileName.toLowerCase().includes('.xlsx') && !fileName.toLowerCase().includes('.xls')) {
        this.toastr.showToastr('Vui lòng chọn đúng định đạng file xlsx hoặc xls', 'Thông báo!', MessageSeverity.error, TOAST_DEFAULT_CONFIG);
        return;
      }
      this.percent = 0;
      this.selectedFiles = file[0];
    }
  }

  destroyFile() {
    this.myInputVariable.nativeElement.value = "";
    this.selectedFiles = null;
    this.percent = 0;
  }

  handleImportFile() {
    if (!this.selectedFiles) {
      this.toastr.showToastr('Bạn chưa chọn file', 'Thông báo!', MessageSeverity.error, TOAST_DEFAULT_CONFIG);
      return;
    }

    const fileName = this.selectedFiles?.name || '';
    this.indicator.showActivityIndicator();
    this.start_process_upload();
    const formData = new FormData();
    
    if (this.selectedFiles) {
      formData.append('file', this.selectedFiles, fileName);
    }

    this.refundService.importTransactionRefundBatch(formData).pipe(
      takeUntil(this.ngUnsubscribe),
      finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe((res: any) => {
      this.end_process_upload(100);
      if (res && res.status === 200) {
        this.toastr.showToastr('Upload thành công', 'Thông báo!', MessageSeverity.success, TOAST_DEFAULT_CONFIG);
        this.destroyFile()
        this.search()
      } else {
        this.end_process_upload(0);
        this.toastr.showToastr(res.soaErrorDesc || 'Upload không thành công', 'Thông báo!', MessageSeverity.error, TOAST_DEFAULT_CONFIG);
      }
    }, error => {
      this.createBatchError(0);
      this.toastr.showToastr( error?.error?.soaErrorDesc || 'Upload không thành công', 'Thông báo!', MessageSeverity.error, TOAST_DEFAULT_CONFIG);
    });
  }

  start_process_upload() {
    const timer$ = interval(100);
    this.subscribe_interval = timer$.subscribe(second => {
      this.percent = second;
      if (this.percent === 100) {
        this.subscribe_interval.unsubscribe();
      }
    });
  }

  end_process_upload(percent) {
    this.percent = percent;
    this.subscribe_interval.unsubscribe();
  }

  createBatchError(percent) {
    this.end_process_upload(percent);
    this.myInputVariable.nativeElement.value = "";
  }

  onClickReject(element) {
    this.dialogService.dformconfirm(
      {
        label: 'Từ chối yêu cầu hoàn trả lô',
        title: 'Lý do',
        description: 'Nhập lý do từ chối yêu cầu hoàn trả lô',
        acceptBtn: 'Xác nhận',
        closeBtn: 'Hủy',
        maxLength: 400,
      },
      (result: any) => {
        if (result && result.status === DFORM_CONFIRM_STATUS.CONFIRMED) {
          this.bodyApprove = {
            action: 'REJECT',
            batchId: element.id,
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
                  'Từ chối yêu cầu hoàn trả lô thành công',
                  'Thông báo!',
                  MessageSeverity.success,
                  TOAST_DEFAULT_CONFIG
                );
                this.search();
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

  onClickApprove(element) {
    this.dialogService.confirm(
      {
        label: 'Duyệt yêu cầu hoàn trả lô',
        acceptBtn: 'Xác nhận',
        closeBtn: 'Hủy',
        message: 'Bạn có chắc chắn muốn duyệt yêu cầu hoàn trả lô?',
      },
      (result: any) => {
        if (result && result.status === DFORM_CONFIRM_STATUS.CONFIRMED) {
          this.bodyApprove = {
            action: 'APPROVE',
            batchId: element.id,
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
                    'Phê duyệt yêu cầu hoàn trả lô thành công',
                    'Thông báo!',
                    MessageSeverity.success,
                    TOAST_DEFAULT_CONFIG
                  );
                  this.search();
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

  getLabelStatusBatch($status: any) {
    const status = STATUS_LABEL_STATUS_BATCH.find(item => item.key === $status);
    if (status) {
      return `<label class="wf-status ${status.class}">${status.value}</label>`;
    } else {
      return '';
    }
  }

  viewDetail(element) {
    const date = moment(element?.origCreatedAt).startOf('day').format('YYYY-MM-DD');
    this.goTo(URL.NAPAS.IBFT_RECONCILE.OUT.REFUND.DETAIL_BATCH,
      {
        batchId: element?.id,
        origTransactionReference: element?.origTransactionReference,
        transactionDate: date
      });
  }

  onClickBtn($event?: any): void {
    switch ($event) {
      case TYPE_BTN_FOOTER.TYPE_UNDO:
        this.goTo(URL.NAPAS.IBFT_RECONCILE.OUT.REFUND.SEARCH);
        break;
    }
  }

}
