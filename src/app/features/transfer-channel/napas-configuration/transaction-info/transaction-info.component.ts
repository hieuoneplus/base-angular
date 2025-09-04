import { Component, Injector, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ComponentAbstract, MessageSeverity } from '@shared-sm';
import * as moment from 'moment';
import { finalize, takeUntil } from 'rxjs/operators';
import { TOAST_DEFAULT_CONFIG } from 'src/app/public/constants';
import { ModuleKeys } from 'src/app/public/module-permission.utils';
import ErrorUtils from 'src/app/shared/utils/ErrorUtils';
import { TransactionInfoService } from '../services/transaction-info.service';
import { COLUMS, URL, TRANSACTION_REFERENCE_NUMBER, TRANSACTION_ID, TRANSACTION_DATE, TO_TRANSACTION_DATE, TRACE_NUMBER, FT, FROM_ACCOUNT_INDENTIFICATION, TO_ACCOUNT_INDENTIFICATION } from './modal/constant';

@Component({
  selector: 'app-transaction-info',
  templateUrl: './transaction-info.component.html',
  styleUrls: ['./transaction-info.component.scss']
})
export class TransactionInfoComponent extends ComponentAbstract {

  displayedColumns = COLUMS;

  $transactionReferenceNumber = TRANSACTION_REFERENCE_NUMBER();
  $transactionId = TRANSACTION_ID();
  $transactionDate = TRANSACTION_DATE();
  $toTransactionDate = TO_TRANSACTION_DATE();
  $systemTraceAuditNumber = TRACE_NUMBER();
  $ft = FT();
  $fromAccountIdentification = FROM_ACCOUNT_INDENTIFICATION();
  $toAccountIdentification = TO_ACCOUNT_INDENTIFICATION();

  hasDataSource = false;
  requestParams: any

  constructor(
    protected injector: Injector,
    private transactionInfoService: TransactionInfoService,
  ) {
    super(injector)
  }

  protected componentInit(): void {
    this.enableActions(ModuleKeys.napas_ibft_reconcile_transaction);
    this.$transactionDate.required = true
    this.$toTransactionDate.required = true
    this.form = this.itemControl.toFormGroup([
      this.$transactionReferenceNumber,
      this.$transactionId,
      this.$transactionDate,
      this.$toTransactionDate,
      this.$systemTraceAuditNumber,
      this.$ft,
      this.$fromAccountIdentification,
      this.$toAccountIdentification,
    ]);
    if(history.state.transactionReferenceNumber && history.state.transactionDate) {
      this.form.patchValue({transactionReferenceNumber: history.state.transactionReferenceNumber})
      const date = history.state.transactionDate ? moment(history.state.transactionDate) : null;
      this.form.get('transactionDate')?.setValue(date, { emitEvent: false });
      this.form.get('toTransactionDate')?.setValue(date, { emitEvent: false });
      this.search();
    }
    this.trackDateRangeValidation()
  }

  search() {
    this.pageIndex = 0;
    this.pageSize = 10;
    const transactionIdControl = this.form.get('transactionId');
    const transactionReferenceNumberControl = this.form.get('transactionReferenceNumber');
    const systemTraceAuditNumberControl = this.form.get('systemTraceAuditNumber');
    const ftControl = this.form.get('ft');


    const fromDateControl = this.form.get('transactionDate');
    const toDateControl = this.form.get('toTransactionDate');

    if (fromDateControl?.invalid || toDateControl?.invalid) {
      if (fromDateControl.invalid) fromDateControl.markAllAsTouched()
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

    if ( !transactionIdControl?.value && !transactionReferenceNumberControl?.value && !systemTraceAuditNumberControl?.value && !ftControl?.value ) {
      this.dialogService.error({
        title: 'Thông báo',
        message: '',
        innerHTML: 'Vui lòng nhập ít nhất một trong các trường: Mã giao dịch từ các kênh, Mã giao dịch, Số trace hoặc FT'
      });
      return;
    }


    const params = Object.assign(
      {},
      Object.entries(this.form.value).reduce((acc, [key, value]) => {
        if (key === 'transactionDate' || key === 'toTransactionDate') {
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
      }
    };

    this.requestParams = {
      page: this.pageIndex,
      size: this.pageSize,
    }
    this.dformPagination.goto(this.pageSize, this.pageIndex);
  }

  QueryData() {
    this.indicator.showActivityIndicator();
    this.transactionInfoService.getTransactionInfo(this.options.params, this.requestParams).pipe(
      takeUntil(this.ngUnsubscribe),
      finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe((res) => {
      // Gọi API thành công và có data trả về
      if (res && res.status === 200) {
        this.hasDataSource = true;
        const page = this.pageIndex * this.pageSize;
        const data = res.data.content.map((obj, index) => {
          obj.stt = page + index + 1;
          return obj;
        });

        this.dataSource = new MatTableDataSource(data);
        this.totalItem = res.data.totalElements;
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
    const fromDateControl = this.form.get('transactionDate');
    const toDateControl = this.form.get('toTransactionDate');
  
    this.form.valueChanges.subscribe(() => {
      const fromDate = moment(fromDateControl?.value);
      let toDate = moment(toDateControl?.value);
  
      if (fromDate.isValid() && !toDateControl?.value) {
        toDateControl?.setValue(fromDate.format('YYYY-MM-DD'), { emitEvent: false });
        toDate = moment(fromDateControl?.value);
      }
  
      if (!fromDate.isValid() || !toDate.isValid()) {
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
      }
    };
    this.requestParams = {
      page: this.pageIndex,
      size: this.pageSize,
    }
    this.QueryData();
  }

  resetFormSearch() {
    this.form.reset();
    this.dataSource = null
  }

  viewDetail(element) {
    this.goTo(URL.NAPAS.IBFT_RECONCILE.OUT.TRANSACTION.DETAIL, { transactionReferenceNumber: element?.transactionReferenceNumber, transactionDate: element?.createdAt});
  }

}
