import { Component, Injector } from '@angular/core';
import { ComponentAbstract, LocalStoreEnum, MessageSeverity } from '@shared-sm';
import ErrorUtils from 'src/app/shared/utils/ErrorUtils';
import { MatTableDataSource } from "@angular/material/table";
import { finalize, takeUntil } from "rxjs/operators";
import { DFORM_CONFIRM_STATUS, TOAST_DEFAULT_CONFIG } from 'src/app/public/constants';
import {COLUMS, DISPUTE_ID, TRACE_NUMBER, TRANSACTION_TYPE, DISPUTE_ASSIGNEE, DISPUTE_ASSIGNER, FROM_DATE, TO_DATE, ORIG_TRANSACTION_REFERENCE, DISPUTE_TYPE_CODE, DISPUTE_CLAIM_CODE, DISPUTE_STATUS, USER, USERT, URL, STATUS_LABEL_INITIALIZE_TRANSACTION} from './modal/constant'
import { SearchDisputeService } from '../services/search-dispute.service';
import { ModuleKeys } from 'src/app/public/module-permission.utils';
import { typeTransactionDisputeEnum, approveDisputeStatusEnum, transactionTypeEnum } from './modal/enum';
import * as moment from 'moment';
import { IApproveBatchDispute, IResponseTransactionDispute } from './modal/interface';
import { HttpResponse } from '@angular/common/http';
import { AuthService } from 'src/app/features/auth/service/AuthService';

@Component({
  selector: 'app-search-dispute',
  templateUrl: './search-dispute.component.html',
  styleUrls: ['./search-dispute.component.scss']
})
export class SearchDisputeComponent extends ComponentAbstract {

  displayedColumns = COLUMS;
  dataTransactionDispute: IResponseTransactionDispute[];
  bodyApproveBatch: IApproveBatchDispute;

  typeTransactionDisputeEnum = typeTransactionDisputeEnum;
  approveDisputeStatusEnum = approveDisputeStatusEnum;


  checked: boolean = false;
  listDataSelect: Array<IResponseTransactionDispute> = [];
  listBatchDispute: Array<string> = [];

  userOptions = null;


  $disputeId = DISPUTE_ID();
  $traceNumber = TRACE_NUMBER();
  $transactionType = TRANSACTION_TYPE();
  $disputeAssignee = DISPUTE_ASSIGNEE();
  $disputeAssigner = DISPUTE_ASSIGNER();
  $fromDate = FROM_DATE();
  $toDate = TO_DATE();
  $origTransactionReference = ORIG_TRANSACTION_REFERENCE();
  $disputeTypeCode = DISPUTE_TYPE_CODE();
  $disputeClaimCode = DISPUTE_CLAIM_CODE();
  $disputeStatus = DISPUTE_STATUS();
  $user = USER();
  // $user = USERT();


  hasDataSource = false;

  constructor(
    protected injector: Injector,
    private searchDisputeService: SearchDisputeService,
    private authService : AuthService,
  ) {
    super(injector)
   }

  protected componentInit(): void {
    this.enableActions(ModuleKeys.napas_ibft_reconcile_dispute);
    // this.$fromDate.required = true
    // this.$toDate.required = true

    this.form = this.itemControl.toFormGroup([
      this.$disputeId,
      this.$traceNumber,
      this.$transactionType,
      this.$disputeAssignee,
      this.$disputeAssigner,
      this.$fromDate,
      this.$toDate,
      this.$origTransactionReference,
      this.$disputeTypeCode,
      this.$disputeClaimCode,
      this.$disputeStatus,
      this.$user,
    ]);

    // if (localStorage.getItem(LocalStoreEnum.User_System)) {
    //   this.userOptions = this.localStore.getData(LocalStoreEnum.User_System);
    //   if (Array.isArray(this.userOptions)) {
    //     this.$user.options = this.userOptions.map(value => ({
    //       key: value.username,
    //       value: value.username
    //     }));
    //   } else {
    //     this.$user.options = [];
    //   }
    // } else {
    //   // this.getUserSystem();
    // }
    this.trackDateRangeValidation()
    this.search();

  }

  search() {
    this.pageIndex = 0;
    this.pageSize = 10;
    this.listDataSelect = []
    this.listBatchDispute = []
    // const fromDateControl = this.form.get('fromDate');
    // const toDateControl = this.form.get('toDate');

    // if (fromDateControl?.invalid || toDateControl?.invalid) {
    //   if (fromDateControl.invalid) fromDateControl.markAllAsTouched()
    //   if (toDateControl.invalid) toDateControl.markAllAsTouched()

    //   let errorMessage = 'Vui lòng nhập thông tin tìm kiếm';
    //   if (toDateControl?.hasError('dateOrderInvalid')) {
    //     errorMessage = 'Ngày kết thúc không được nhỏ hơn ngày bắt đầu';
    //   } else if (toDateControl?.hasError('dateRangeExceeded')) {
    //     errorMessage = 'Khoảng thời gian tìm kiếm không được vượt quá 10 ngày';
    //   }

    //   this.dialogService.error({
    //     title: 'Thông báo',
    //     message: '',
    //     innerHTML: errorMessage
    //   });
    //   return;
    // }

    const params = Object.assign(
      {},
      Object.entries(this.form.value).reduce((acc, [key, value]) => {
        if (key === 'fromDate' || key === 'toDate') {
          const dateValue = this.form.get(key)?.value;

          if (dateValue) {
            const formattedDate = moment(dateValue).startOf('day').format('yyyy-MM-DD');
            acc[key] = formattedDate;
          } else {
            acc[key] = null;
          }
        } else {
          acc[key] = typeof value === 'string' && value.trim() !== '' ? value.trim() : null;
        }
        if (key === 'disputeTypeCode') {
          const disputeTypeCodeValue = this.form.get(key)?.value;
          if (disputeTypeCodeValue === 'ALL') {
            acc[key] = null
          }
        }
        if (key === 'disputeClaimCode') {
          const disputeClaimCodeValue = this.form.get(key)?.value;
          if (disputeClaimCodeValue === 'ALL') {
            acc[key] = null
          }
        }
        return acc;
      }, {})
    );

    this.options = {
      params: {
        ...params,
        pageNumber: this.pageIndex + 1,
        pageSize: this.pageSize,
      }
    };
    this.dformPagination.goto(this.pageSize, this.pageIndex);
  }

  QueryData() {
    this.indicator.showActivityIndicator();
    this.searchDisputeService.getTransactionDispute(this.options.params).pipe(
      takeUntil(this.ngUnsubscribe),
      finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe((res) => {
      // Gọi API thành công và có data trả về
      if (res && res.status === 200) {
        this.hasDataSource = true;
        const page = this.pageIndex * this.pageSize;
        res.data.disputes.forEach((e: any) => {
          const dataSelected = this.listDataSelect.some(item => item.id === e.id);
          e.isChecked = dataSelected
        });

        const data = res.data.disputes.map((obj, index) => {
          obj.stt = page + index + 1;
          // obj.origCreatedAt = moment(obj.origCreatedAt).startOf('day').format('DD-MM-YYYY');
          return obj;
        });

        this.dataTransactionDispute = data

        this.dataSource = new MatTableDataSource(data);
        const initElements = (this.dataSource.data || []).filter((e: any) => e.approveDisputeStatus === approveDisputeStatusEnum.WAITING);

        this.checked = this.checked = initElements.length > 0 && initElements.every((e: any) => e.isChecked);

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
        pageSize: this.pageSize,
        pageNumber: this.pageIndex + 1,
      }
    };
    this.QueryData();
  }

  trackDateRangeValidation() {
    const fromDateControl = this.form.get('fromDate');
    const toDateControl = this.form.get('toDate');

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

  downLoadFile(element) {
    let idFile = '';
    idFile = element?.fileId ? element?.fileId: ''
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
          a.download = element?.fileName;
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

  // getUserSystem() {
  //   localStorage.removeItem(LocalStoreEnum.User_System)
  //   this.indicator.showActivityIndicator();
  //   this.authService.getUsers().pipe(
  //     takeUntil(this.ngUnsubscribe),
  //     finalize(() => this.indicator.hideActivityIndicator())
  //   ).subscribe((res) => {
  //     if (res && res.status == 200) {
  //       const userSystem = res.data.content;
  //       localStorage.setItem(LocalStoreEnum.User_System, JSON.stringify(userSystem));
  //       if (Array.isArray(userSystem)) {
  //         this.$user.options = userSystem.map(value => ({
  //           key: value.username,
  //           value: value.username
  //         }));
  //       } else {
  //         this.$user.options = [];
  //       }
  //     }
  //   }, () => {});
  // }

  getLabel($status: any) {
    const status = STATUS_LABEL_INITIALIZE_TRANSACTION.find(item => item.key === $status);
    if (status) {
      return `<label class="wf-status ${status.class}">${status.value}</label>`;
    } else {
      return '';
    }
  }

  exportExcel() {
    this.indicator.showActivityIndicator()
    this.searchDisputeService.exportTransactionDispute(this.options.params).pipe(
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
          const now = new Date();
          const pad = (n: number) => n.toString().padStart(2, '0');
          const formattedDate = `${pad(now.getDate())}${pad(now.getMonth() + 1)}${now.getFullYear()}`;
          const formattedTime = `${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
          const fileName = `Danh_sach_tra_soat_${formattedDate}${formattedTime}.xlsx`;

          a.download = fileName;
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

  onChange() {
    if (this.checked) {
      if (this.dataSource && this.dataSource.data) {
        this.dataSource.data.forEach((element: any) => {
          if(element.approveDisputeStatus === approveDisputeStatusEnum.WAITING) { // TODO: thêm điều kiện
            element.isChecked = true;
            if (!this.listDataSelect.some(item => item.id === element.id)) {
              this.listDataSelect.push(element);
            }
          }
        });
      }
    } else {
      if (this.dataSource && this.dataSource.data) {
        this.dataSource.data.forEach((element: any) => {
          if(element.approveDisputeStatus === approveDisputeStatusEnum.WAITING) { // TODO: thêm điều kiện
            element.isChecked = false;
            const index = this.listDataSelect.findIndex(item => item.id === element.id);
            if (index > -1) {
              this.listDataSelect.splice(index, 1);
            }
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

  approveBatchDispute() {
    this.listDataSelect.forEach((item: any) => {
      this.listBatchDispute.push(item?.disputeId);
    });
    this.dialogService.confirm(
      {
        label: 'Xác nhận',
        acceptBtn: 'Xác nhận',
        closeBtn: 'Hủy',
        message: 'Bạn có chắc chắn muốn duyệt yêu cầu ?',
      },
      (result: any) => {
        if (result && result.status === DFORM_CONFIRM_STATUS.CONFIRMED) {
          this.bodyApproveBatch = {
            action: 'APPROVE',
            disputeIds: this.listBatchDispute,
            reason: result.data,
          }
          this.indicator.showActivityIndicator();
          this.searchDisputeService
            .approveBatchDispute(this.bodyApproveBatch)
            .pipe(
              takeUntil(this.ngUnsubscribe),
              finalize(() => this.indicator.hideActivityIndicator())
            )
            .subscribe(
              (res) => {
                if (res && res.status === 200) {
                  this.toastr.showToastr(
                    'Đang xử lý duyệt lô. Vui lòng upload lại trang để cập nhật kết quả',
                    'Thông báo!',
                    MessageSeverity.warning,
                    TOAST_DEFAULT_CONFIG
                  );
                  this.listDataSelect = []
                  this.listBatchDispute = []
                  this.search()
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
                this.listDataSelect = []
                this.listBatchDispute = []
                this.search()

              }
            );
        }
      }
    );
  }

  onClickCreateReq() {
    this.goTo(URL.NAPAS.IBFT_RECONCILE.OUT.DISPUTE.CREATE_DISPUTE);
  }

  enableBtnEdit(element) {
    if(this.enableReply && element.type === typeTransactionDisputeEnum.RESPONSE && element.transactionType === 'ACQ' && element.approveDisputeStatus !== approveDisputeStatusEnum.APPROVED) {
      return true
    }
    if(this.enableUpdate && element.type === typeTransactionDisputeEnum.REQUEST && element.transactionType === 'ISS' && element.approveDisputeStatus === approveDisputeStatusEnum.REJECTED) {
      return true
    }
    return false
  }

  onClickEdit(element) {
    // const date = moment(element?.origCreatedAt).startOf('day').format('YYYY-MM-DD');
    if(element.type === typeTransactionDisputeEnum.REQUEST) {
      this.router.navigate([URL.NAPAS.IBFT_RECONCILE.OUT.DISPUTE.EDIT_DISPUTE],
        {queryParams: { origTransactionReference: element?.origTransactionReference, transactionDate: element?.origCreatedAt, disputeType: typeTransactionDisputeEnum.REQUEST, disputeId: element?.disputeId }
      });
    } else if(element.type === typeTransactionDisputeEnum.RESPONSE) {
      this.goTo(URL.NAPAS.IBFT_RECONCILE.OUT.DISPUTE.REPLY_EDIT_DISPUTE, { origTransactionReference: element?.origTransactionReference, transactionDate: element?.origCreatedAt, disputeId: element?.disputeId });
    }
  }

  enableBtnReply(element) {
    if(element.type === typeTransactionDisputeEnum.REQUEST && element.transactionType === transactionTypeEnum.ACQ && element.approveDisputeStatus !== approveDisputeStatusEnum.RESPONDED) {
      return true
    }
    return false
  }


  onClickReplyDispute(element) {
    // const date = moment(element?.origCreatedAt).startOf('day').format('YYYY-MM-DD');
    this.router.navigate([URL.NAPAS.IBFT_RECONCILE.OUT.DISPUTE.REPLY_DISPUTE], { queryParams: { origTransactionReference: element?.origTransactionReference, transactionDate: element?.origCreatedAt, disputeType: element.type, disputeId: element?.disputeId } });
  }

  viewDetail(element) {
    // const date = moment(element?.origCreatedAt).startOf('day').format('YYYY-MM-DD');
    if((element.transactionType === transactionTypeEnum.ISS && element.type === typeTransactionDisputeEnum.REQUEST) || (element.transactionType === transactionTypeEnum.ACQ && element.type === typeTransactionDisputeEnum.REQUEST)) {
      this.goTo(URL.NAPAS.IBFT_RECONCILE.OUT.DISPUTE.DETAIL_DISPUTE,
        {
         origTransactionReference: element?.origTransactionReference,
          transactionDate: element?.origCreatedAt,
          disputeType: element.type,
          disputeId: element?.disputeId
        });
    } else if((element.transactionType === transactionTypeEnum.ISS && element.type === typeTransactionDisputeEnum.RESPONSE) || (element.transactionType === transactionTypeEnum.ACQ && element.type === typeTransactionDisputeEnum.RESPONSE)) {
      this.goTo(URL.NAPAS.IBFT_RECONCILE.OUT.DISPUTE.REPLY_DETAIL_DISPUTE, { origTransactionReference: element?.origTransactionReference, transactionDate: element?.origCreatedAt, disputeType: element.type, disputeId: element?.disputeId });
    }
  }

  resetFormSearch() {
    this.form.reset();
    // this.search();
  }

}

