import { Component, Injector } from '@angular/core';
import { ComponentAbstract, MessageSeverity } from '@shared-sm';
import { BehaviorSubject } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { PageEvent } from '@angular/material/paginator';
import { finalize, takeUntil } from "rxjs/operators";
import { MatTableDataSource } from "@angular/material/table";
import {
  CURRENCY,
  DEBIT_VALUE_DATE,
  MAX_AMOUNT,
  MIN_AMOUNT,
  T24_REFERENCE_NUMBER,
  STATUS,
  TRANSACTION_ID,
  SHOWING_CONDITION,
  DEBIT_THEIR_REF,
  TYPE_OF_T24_REFERENCE_NUMBER,
  STATUS_LABEL_TRANSACTION,
  INWARD_RETRYING_CONDITION,
  TRANSACTION_TYPE
} from '../constant';
import { TransactionManagerService } from './../services/transaction-manager'
import * as moment from 'moment';
import { IResponseQueryTransactionCitad } from 'src/app/features/model/citad';
import { DFORM_CONFIRM_STATUS, TOAST_DEFAULT_CONFIG } from 'src/app/public/constants';
import { HttpResponse } from '@angular/common/http';
import ErrorUtils from 'src/app/shared/utils/ErrorUtils';
import { ModuleKeys } from 'src/app/public/module-permission.utils';

@Component({
  selector: 'app-transaction-manager-in',
  templateUrl: './transaction-manager-in.component.html',
  styleUrls: ['./transaction-manager-in.component.scss']
})
export class TransactionManagerInComponent extends ComponentAbstract {

  displayedColumns: string[] = [
    'check', 'stt', 'transactionId', 'soFt', 'debitValueDate', 'senderName', 'receiverName', 'receiverAccountNo', 'debitTheirRef', 'creditTheirRef', 'debitAmount', 'debitCurrency', 'status', 'message', 'actions'
  ];

  $transactionId = TRANSACTION_ID();
  $t24ReferenceNumber = T24_REFERENCE_NUMBER();
  $debitValueDate = DEBIT_VALUE_DATE();
  $isRetryable = INWARD_RETRYING_CONDITION();
  $status = STATUS();
  $minAmount = MIN_AMOUNT();
  $maxAmount = MAX_AMOUNT();
  $debitTheirRef = DEBIT_THEIR_REF();
  $currency = CURRENCY();
  $transactionType = TRANSACTION_TYPE();

  hasDataSource = false;
  selection = new SelectionModel<any>(true, []);
  selectionObs = new BehaviorSubject<any>('');
  pageEvent: PageEvent = new PageEvent();
  checked: boolean = false;
  listDataSelect: Array<IResponseQueryTransactionCitad> = [];
  listRetry: Array<number> = [];

  constructor(
    protected injector: Injector,
    private transactionManagerService: TransactionManagerService
  ) {
    super(injector);
  }

  protected componentInit(): void {
    this.form = this.itemControl.toFormGroup([
      this.$transactionId,this.$transactionType,this.$t24ReferenceNumber, this.$debitValueDate, this.$isRetryable, this.$status, this.$minAmount, this.$maxAmount, this.$debitTheirRef, this.$currency
    ]);
    this.enableActions(ModuleKeys.citad_transactions_inward)
    this.onTransactionTypeChange();
    this.search();
    this.trackIsRetryable();
  }

  trackIsRetryable() {
    this.form.get('isRetryable')?.valueChanges.subscribe(isRetryable => {
      this.search()
    })
  }
  onTransactionTypeChange() {
    this.form.get('hasT24ReferenceNumber').valueChanges.subscribe((transactionType) => {
      if (transactionType ==='false') {
        this.form.get('t24ReferenceNumber').setValue(null)
        this.$t24ReferenceNumber.readOnly=true
        this.$t24ReferenceNumber.placeholder=null
      } else {
        this.$t24ReferenceNumber.readOnly=false
        this.$t24ReferenceNumber.placeholder="Nhập số FT"
      }
    });
  }
  search() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastr.showToastr(
        'Vui lòng nhập đúng định dạng',
        'Thông báo!',
        MessageSeverity.error,
        TOAST_DEFAULT_CONFIG
      );
    } else {
      this.pageIndex = 0;
      this.pageSize = 10;
      this.listDataSelect = []
      this.listRetry = []
      this.form.patchValue({
        debitValueDate: moment(this.form.get('debitValueDate')?.value).format('YYYY-MM-DD')
      });

      const retryable = this.form.get('isRetryable')?.value
      this.options = {
        params: Object.assign({
          ...this.form.value,
          isRetryable: retryable !== 'isReprocessing' ? retryable : null,
          isReprocessing: retryable === 'isReprocessing' ? true : null
        }, {
          page: this.pageIndex,
          size: this.pageSize,
          sort: 'id:DESC'
        })
      };
      this.dformPagination.goto(this.pageSize, this.pageIndex);
    }
  }

  handleGetTransactionCitadOut() {
    const type = 'INWARD'
    this.indicator.showActivityIndicator()
    this.transactionManagerService.getTransactionCitad(this.options.params, type).pipe(
      finalize(() => {
        this.indicator.hideActivityIndicator()
      }),
      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      next: (res) => {
        if (res && res.status === 200) {
          this.hasDataSource = true;
          this.pageIndex = res.data.pageable.pageNumber;
          this.pageSize = res.data.pageable.pageSize;
          this.totalItem = res.data.totalElements;
          res.data.content.forEach((e: any) => {
            const dataSelected = this.listDataSelect.some(item => item.id === e.id);
            e.isChecked = dataSelected
          });
          const data = res.data.content.map((obj, index) => {
            return { stt: this.pageIndex * this.pageSize + index + 1, ...obj, };
          });
          this.dataSource = new MatTableDataSource(data);
          this.checked = this.dataSource.data.length > 0 && this.dataSource.data.every((element: any) => element.isChecked);
        } else {
          this.hasDataSource = false;
          this.totalItem = 0;
          this.dialogService.error({
            title: 'dialog.notification',
            message: res.soaErrorDesc ? res.soaErrorDesc : 'Lỗi hệ thống.'
          }, resp => {
            if (res) {
            }
          });
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

  changePageIndex($event) {
    this.pageSize = $event.pageSize;
    this.pageIndex = $event.pageIndex;
    this.options = {
      params: {
        ...this.options.params,
        size: this.pageSize,
        page: this.pageIndex
      }
    };
    this.handleGetTransactionCitadOut();
  }

  onChange() {
    if (this.checked) {
      if (this.dataSource && this.dataSource.data) {
        this.dataSource.data.forEach((element: any) => {
          element.isChecked = true;
          if (!this.listDataSelect.some(item => item.id === element.id)) {
            this.listDataSelect.push(element);
          }
        });
      }
    } else {
      if (this.dataSource && this.dataSource.data) {
        this.dataSource.data.forEach((element: any) => {
          element.isChecked = false;
          const index = this.listDataSelect.findIndex(item => item.id === element.id);
          if (index > -1) {
            this.listDataSelect.splice(index, 1);
          }
        });
      }
    }
  }

  onChangeRegister(element: any) {
    if (element.isChecked) {
      if (!this.listDataSelect.some(item => item.id === element.id)) {
        this.listDataSelect.push({ ...element });
      }
    } else {
      const index = this.listDataSelect.findIndex(item => item.id === element.id);
      if (index > -1) {
        this.listDataSelect.splice(index, 1);
      }
    }
    this.checked = this.dataSource.data.every((element: any) => element.isChecked);
  }

  exportExcel() {
    const type = 'INWARD'
    this.listDataSelect = []
    this.listRetry = []

    this.options.params.size = null
    this.options.params.page = null
    this.indicator.showActivityIndicator()
    this.transactionManagerService.exportTransactionCitad(this.options.params, type).pipe(
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
          a.download = 'TruyVanDienDen_' + moment(this.form.get('debitValueDate')?.value).format('YYYY-MM-DD') + '.xlsx'
          a.click();
          window.URL.revokeObjectURL(url);
        }
      }
    })
  }
  onClickRetry() {
    this.dialogService.confirm({
      message: 'Bạn có chắc chắn muốn retry giao dịch không?',
      label:"Xác nhận",
      acceptBtn: "Xác nhận",
      closeBtn:"Hủy"
    }, (result: any) => {
      if (result.status === DFORM_CONFIRM_STATUS.CONFIRMED) {
        this.retryTransaction();
      }
    });
  }
  retryTransaction() {
    const type = 'inward'
    // this.listRetry = []
    this.listDataSelect.forEach((item) => {
      this.listRetry.push(item?.id);
    });
    if (this.listDataSelect.length === 0) {
      this.toastr.showToastr(
        `Vui lòng chọn ít nhất 1 bản ghi`,
        'Thông báo!',
        MessageSeverity.error,
        TOAST_DEFAULT_CONFIG
      );
    } else {
      this.indicator.showActivityIndicator()
      this.transactionManagerService.retryTransactionCitad(this.listRetry, type).pipe(
        finalize(() => {
          this.indicator.hideActivityIndicator()
        }),
        takeUntil(this.ngUnsubscribe)
      ).subscribe({
        next: (res) => {
          if (res && res.status === 200) {
            this.toastr.showToastr(
              `Retry ` + this.listRetry.length + ` bản ghi thành công`,
              'Thông báo!',
              MessageSeverity.success,
              TOAST_DEFAULT_CONFIG
            );
            this.listDataSelect = []
            this.listRetry = []
            this.search();
          }
        },
        error: (err) => {
          const messsageError = ErrorUtils.getErrorMessage(err);
          this.toastr.showToastr(
            `Retry ` + this.listRetry.length + ` bản ghi thất bại`,
            // messsageError.join('\n'),
            'Thông báo!',
            MessageSeverity.error,
            TOAST_DEFAULT_CONFIG
          );
          this.listDataSelect = []
          this.listRetry = []
          this.search();
        }
      })
    }

  }

  viewDetail(element: any) {
    this.goTo('pmp_admin/transfer-channel/citad/transaction-manager-in/detail', { "transactionId": element.transactionId })
  }

  getLabel($status: any) {
    const status = (STATUS_LABEL_TRANSACTION || []).find(item => item.key === $status);
    if (status) {
      return `<label class="wf-status ${status.class}">${status.value}</label>`;
    } else {
      return '';
    }
  }

}
