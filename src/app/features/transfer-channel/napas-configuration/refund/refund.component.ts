import { Component, Injector, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ComponentAbstract, MessageSeverity } from '@shared-sm';
import * as moment from 'moment';
import { finalize, takeUntil } from 'rxjs/operators';
import { TOAST_DEFAULT_CONFIG } from 'src/app/public/constants';
import { ModuleKeys } from 'src/app/public/module-permission.utils';
import ErrorUtils from 'src/app/shared/utils/ErrorUtils';
import { RefundService } from '../services/refund.service';
import { COLUMS, URL, CASE_ID, CREATION_DATE_TIME, TO_CREATION_DATE_TIME, BATCH_ID, ORIG_TRANSACTION_REFERENCE, ORIG_SYSTEM_TRACE, ORIG_FT, DIRECTION, RECEIVING_MEMBER, SENDING_MEMBER, RETURN_STATUS, SELECT_RETURN_STATUS, STATUS_LABEL_STATUS } from './modal/constant';

@Component({
  selector: 'app-refund',
  templateUrl: './refund.component.html',
  styleUrls: ['./refund.component.scss']
})
export class RefundComponent extends ComponentAbstract {

  displayedColumns = COLUMS;

  $caseId = CASE_ID();
  $creationDateTime = CREATION_DATE_TIME();
  $toCreationDateTime = TO_CREATION_DATE_TIME();
  $batchId = BATCH_ID();
  $origTransactionReference = ORIG_TRANSACTION_REFERENCE();
  $origSystemTrace = ORIG_SYSTEM_TRACE();
  $origFT = ORIG_FT();
  $direction = DIRECTION();
  $receivingMember = RECEIVING_MEMBER();
  $sendingMember = SENDING_MEMBER();
  $returnStatus = RETURN_STATUS();


  hasDataSource = false;
  requestParams: any

  constructor(
    protected injector: Injector,
    private refundService: RefundService,
  ) {
    super(injector)
  }

  protected componentInit(): void {
    this.enableActions(ModuleKeys.napas_ibft_reconcile_return);
    this.form = this.itemControl.toFormGroup([
      this.$caseId,
      this.$creationDateTime,
      this.$toCreationDateTime,
      this.$batchId,
      this.$origTransactionReference,
      this.$origSystemTrace,
      this.$origFT,
      this.$direction,
      this.$receivingMember,
      this.$sendingMember,
      this.$returnStatus,
    ]);
    this.search();
    this.trackDateRangeValidation()
  }

  handleMapStatusForSearching(status: any) {
    if (status === 'FAIL') {
      return [
        'GET_TOKEN_FAILED',
        'ACCOUNTING_FAILED',
        'REVERT_FAILED',
        'INCOMPLETE',
        'VALIDATE_FAILED',
        'FAIL'
      ]
    } else if (status === 'PROC') {
      return [
        'REVERT_TIMEOUT',
        'TIMEOUT',
        'ACCOUNTING_TIMEOUT',
      ]
    } else if (status === 'RJCT') {
      return [
        'SEND_NAPAS_FAILED',
        'NAPAS_REJECTED'
      ]
    }
    else {
      return status ? [status] : null
    }

  }

  search() {
    this.pageIndex = 0;
    this.pageSize = 10;
    const fromDateControl = this.form.get('creationDateTime');
    const toDateControl = this.form.get('toCreationDateTime');

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
        if (key === 'creationDateTime' || key === 'toCreationDateTime') {
          const rawDate = this.form.get(key)?.value;
          if (rawDate) {
            const date = moment(rawDate).startOf('day').format('YYYY-MM-DD');
            acc[key] = date;
          } else {
            acc[key] = null;
          }
        } else {
          if (key === 'returnStatus') {
            acc[key] = this.handleMapStatusForSearching(this.form.get('returnStatus')?.value)
          } else {
            acc[key] = typeof value === 'string' && value.trim() !== '' ? value.trim() : null;
          }
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
    this.refundService.getTransactionRefund(this.options.params).pipe(
      takeUntil(this.ngUnsubscribe),
      finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe((res) => {
      // Gọi API thành công và có data trả về
      if (res && res.status === 200) {
        this.hasDataSource = true;
        const page = this.pageIndex * this.pageSize;
        const data = res.data.returnResponses.map((obj, index) => {
          obj.stt = page + index + 1;
          return obj;
        });

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
    const fromDateControl = this.form.get('creationDateTime');
    const toDateControl = this.form.get('toCreationDateTime');

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
  }

  getLabel($status: any) {
    const status = STATUS_LABEL_STATUS.find(item => item.key === $status);
    if (status) {
      return `<label class="wf-status ${status.class}">${status.value}</label>`;
    } else {
      return '';
    }
  }

  onOpenRefundBatch() {
    this.goTo(URL.NAPAS.IBFT_RECONCILE.OUT.REFUND.SEARCH_BATCH);

  }

  onClickCreateReq() {
    this.goTo(URL.NAPAS.IBFT_RECONCILE.OUT.REFUND.CREATE_SINGLE);
  }

  viewDetail(element) {
    const date = moment(element?.origCreatedAt).startOf('day').format('YYYY-MM-DD');
    this.goTo(URL.NAPAS.IBFT_RECONCILE.OUT.REFUND.DETAIL_SINGLE,
      {
        id: element?.id,
        origTransactionReference: element?.origTransactionReference,
        transactionDate: date
      });
  }

  onClickEdit(element) {
    const date = moment(element?.origCreatedAt).startOf('day').format('YYYY-MM-DD');
    this.goTo(URL.NAPAS.IBFT_RECONCILE.OUT.REFUND.EDIT_SINGLE, { id: element?.id, origTransactionReference: element?.origTransactionReference, transactionDate: date, });
  }

}
