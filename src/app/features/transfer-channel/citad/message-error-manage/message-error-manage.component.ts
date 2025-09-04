import { Component, Injector } from '@angular/core';
import { ComponentAbstract, MessageSeverity } from '@shared-sm';
import { BehaviorSubject } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { PageEvent } from '@angular/material/paginator';
import { finalize, takeUntil } from "rxjs/operators";
import { MatTableDataSource } from "@angular/material/table";
import * as moment from 'moment';
import { IResponseQueryTransactionCitad } from 'src/app/features/model/citad';
import { KEYS, TOPICS, CREATED_AT_FROM, CREATED_AT_TO, STATUS_FORM, STATUS } from './modal/constant';
import { MessageErrorManageService } from '../services/message-error-mange';
import { DetailMessageErrorManageComponent } from './detail-message-error-manage/detail-message-error-manage.component';
import { DFORM_CONFIRM_STATUS, TOAST_DEFAULT_CONFIG } from 'src/app/public/constants';
import ErrorUtils from 'src/app/shared/utils/ErrorUtils';
import { ModuleKeys } from 'src/app/public/module-permission.utils';

@Component({
  selector: 'app-message-error-manage',
  templateUrl: './message-error-manage.component.html',
  styleUrls: ['./message-error-manage.component.scss']
})
export class MessageErrorManageComponent extends ComponentAbstract {

  displayedColumns: string[] = [
    'check', 'stt', 'key', 'topic', 'partition', 'offset', 'createdAt', 'status', 'actions'
  ];

  $keys = KEYS();
  $topics = TOPICS();
  $createdAtFrom = CREATED_AT_FROM();
  $createdAtTo = CREATED_AT_TO();
  $status = STATUS();

  hasDataSource = false;
  selection = new SelectionModel<any>(true, []);
  selectionObs = new BehaviorSubject<any>('');
  pageEvent: PageEvent = new PageEvent();
  checked: boolean = false;
  listDataSelect: Array<IResponseQueryTransactionCitad> = [];
  listRetry: Array<number> = [];

  constructor(
    protected injector: Injector,
    private messageErrorManageService: MessageErrorManageService
  ) {
    super(injector);
  }

  protected componentInit(): void {
    this.form = this.itemControl.toFormGroup([
      this.$keys, this.$topics, this.$createdAtFrom, this.$createdAtTo, this.$status
    ]);
    this.enableActions(ModuleKeys.wire_transfer_error_messages)
    this.search();
  }

  search() {
    this.pageIndex = 0;
    this.pageSize = 10;
    this.form.patchValue({
      // createdAtFrom: moment(this.form.get('createdAtFrom')?.value).startOf('day').utcOffset(7).format('YYYY-MM-DDT00:00:00.0+07:00'),
      // // createdAtFrom: "2024-08-01T00:00:00.0+07:00",
      // createdAtTo: moment(this.form.get('createdAtTo')?.value).startOf('day').utcOffset(7).format('YYYY-MM-DDT23:59:59.0+07:00'),
      createdAtFrom: this.form.get('createdAtFrom')?.value ? moment(this.form.get('createdAtFrom')?.value).startOf('day').utcOffset(7).format('YYYY-MM-DDT00:00:00+07:00') : null,
      createdAtTo: this.form.get('createdAtTo')?.value ? moment(this.form.get('createdAtTo')?.value).startOf('day').utcOffset(7).format('YYYY-MM-DDT23:59:59+07:00') : null,


    })
    this.options = {
      params: Object.assign({ ...this.form.value }, {
        page: this.pageIndex,
        size: this.pageSize,
      })
    };
    this.dformPagination.goto(this.pageSize, this.pageIndex);
  }

  handleGetMessageErrorManage() {
    this.indicator.showActivityIndicator()
    this.messageErrorManageService.getMessageErrorManage(this.options.params).pipe(
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
          this.checked = this.dataSource.data.filter((element: any) => element.status === 'INIT' && !this.checkCreatedAtOver15Days(element.createdAt)).every((element: any) => element.isChecked);
        } else {
          this.hasDataSource = false;
          this.totalItem = 0;
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
    this.handleGetMessageErrorManage();
  }

  onChange() {
    if (this.checked) {
      if (this.dataSource && this.dataSource.data) {
        this.dataSource.data.forEach((element: any) => {
          if (element.status === 'INIT' && !this.checkCreatedAtOver15Days(element.createdAt)) {
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
          if (element.status === 'INIT' && !this.checkCreatedAtOver15Days(element.createdAt)) {
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

  checkCreatedAtOver15Days(createdAt?: string): boolean {
    if (!createdAt) return false; 
  
    const currentDate = new Date();
    const createdDate = new Date(createdAt);
  
    const differenceInTime = currentDate.getTime() - createdDate.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
  
    return differenceInDays > 15;
  }
  

  onClickRetry(idMessageError?: number) {
    this.dialogService.confirm({
      message: 'Bạn có chắc chắn muốn retry message lỗi không?',
      label:"Xác nhận",
      acceptBtn: "Xác nhận",
      closeBtn:"Hủy"
    }, (result: any) => {
      if (result.status === DFORM_CONFIRM_STATUS.CONFIRMED) {
        this.retryTransaction(idMessageError);
      }
    });
  }

  retryTransaction(idMessageError?: number) {
    
    if (idMessageError) {
      this.listRetry.push(Number(idMessageError));
    } else {
      this.listDataSelect.forEach((item) => {
        this.listRetry.push(item?.id);
      });
    }

    this.indicator.showActivityIndicator()
    this.messageErrorManageService.retryMessageErrorManage(this.listRetry).pipe(
      finalize(() => {
        this.indicator.hideActivityIndicator()
      }),
      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      next: (res: any) => {
        if (res && res.status === 200) {
          const countMessageRetrySuccess = Array.isArray(res.data) ? res.data.filter(item => item === true).length : 0;
          if (countMessageRetrySuccess > 0) {
            this.toastr.showToastr(
              `Retry ` + countMessageRetrySuccess + '/' + this.listRetry.length + ` bản ghi thành công`,
              'Thông báo!',
              MessageSeverity.success,
              TOAST_DEFAULT_CONFIG
            );
          } else {
            this.toastr.showToastr(
              `Retry ` + this.listRetry.length + ` bản ghi thất bại`,
              'Thông báo!',
              MessageSeverity.error,
              TOAST_DEFAULT_CONFIG
            );
          }
          this.listDataSelect = []
          this.listRetry = []
          this.search();
        }
      },
      error: (err) => {
        this.toastr.showToastr(
          `Retry ` + this.listRetry.length + ` bản ghi thất bại`,
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

  viewDetail(element: any) {
    this.dialogService.componentDialog(DetailMessageErrorManageComponent, {
      name: 'DetailMessageErrorManageComponent',
      width: '60%',
      maxHeight: '97vh',
      maxWidth: '97vw',
      data: {
        idMessageError: element.id
      }
    }, (res) => {
      if (res) {

      }
    });
  }


  onClickDelete(element: any) {
    this.dialogService.dformconfirm({
      label: 'Xác nhận',
      title: null,
      innerHTML: 'Bạn có chắc chắn muốn xóa bản ghi này?',
      acceptBtn: 'Xác nhận',
      closeBtn: 'Đóng'
    }, (result: any) => {
      if (result.status === DFORM_CONFIRM_STATUS.CONFIRMED) {
        this.indicator.showActivityIndicator()
        this.messageErrorManageService.deleteMessageErrorManage(element.id).pipe(
          finalize(() => {
            this.indicator.hideActivityIndicator()
          }),
          takeUntil(this.ngUnsubscribe)
        ).subscribe({
          next: (res) => {
            if (res && res.status === 200 && res.data === true) {
              this.toastr.showToastr(
                `Xóa bản ghi thành công`,
                'Thông báo!',
                MessageSeverity.success,
                TOAST_DEFAULT_CONFIG
                );
              this.search();
            } else {
              this.toastr.showToastr(
                `Xóa bản ghi thất bại`,
                'Thông báo!',
                MessageSeverity.error,
                TOAST_DEFAULT_CONFIG
              );
              this.search();
            }
          },
          error: (err) => {
            this.toastr.showToastr(
              `Xóa bản ghi thất bại`,
              'Thông báo!',
              MessageSeverity.error,
              TOAST_DEFAULT_CONFIG
            );
          }
        })
      }
    }
    );
  }

  getLabel($status: any) {
    const status = STATUS_FORM.find(item => item.key === $status);
    if (status) {
      return `<label class="wf-status ${status.class}">${status.value}</label>`;
    } else {
      return '';
    }
  }
}
