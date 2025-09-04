import { SelectionModel } from '@angular/cdk/collections';
import { Component, Injector } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ComponentAbstract, MessageSeverity } from '@shared-sm';
import { BehaviorSubject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import {
  DFORM_CONFIRM_STATUS,
  TOAST_DEFAULT_CONFIG,
} from 'src/app/public/constants';
import { ModuleKeys } from '../../../public/module-permission.utils';
import ErrorUtils from '../../../shared/utils/ErrorUtils';

import { SpecialAccountService } from '../service/SpecialAccountService';
import {
  ACCOUNT_TYPE,
  APPROVE_STATUS,
  STATUS,
  STATUS_APPROVAL,
  STATUS_FORM,
} from './modal/constant';
import { IReasonReject } from './modal/interface';

@Component({
  selector: 'special-account-page',
  templateUrl: './special-account.component.html',
  styleUrls: ['./special-account.component.scss'],
})
export class SpecialAccountComponent extends ComponentAbstract {
  // Table view
  displayedColumns: string[] = [
    'stt',
    'accountType',
    'key',
    'status',
    'approve',
    'actions',
  ];

  $accountType = ACCOUNT_TYPE();
  $approvalStatus = APPROVE_STATUS();
  $status = STATUS();

  hasDataSource = false;
  selection = new SelectionModel<any>(true, []);
  selectionObs = new BehaviorSubject<any>('');
  pageEvent: PageEvent = new PageEvent();

  waitingApproval = STATUS_APPROVAL.WAITING_APPROVAL;

  constructor(
    protected injector: Injector,
    private specialAccountService: SpecialAccountService
  ) {
    super(injector);
  }

  protected componentInit(): void {
    this.enableActions(ModuleKeys.alias_account);
    this.form = this.itemControl.toFormGroup([
      this.$accountType,
      this.$status,
      this.$approvalStatus,
    ]);
    this.search();
  }

  search() {
    this.pageIndex = 0;
    this.pageSize = 10;
    this.options = {
      params: Object.assign(
        { ...this.form.value },
        {
          page: this.pageIndex,
          size: this.pageSize,
          sort: 'updatedAt:DESC',
        }
      ),
    };
    this.dformPagination.goto(this.pageSize, this.pageIndex);
  }

  QueryData() {
    this.indicator.showActivityIndicator();
    console.log('QUERY', this.options);

    this.specialAccountService
      .getAlias(this.options.params)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        finalize(() => this.indicator.hideActivityIndicator())
      )
      .subscribe(
        (res) => {
          console.log('RESPONSE', res);
          // Gọi API thành công và có data trả về
          if (res && res.status === 200) {
            this.hasDataSource = true;
            const page = this.pageIndex * this.pageSize;
            const data = res.data.content.map((obj, index) => {
              obj.stt = page + index + 1;
              return obj;
            });
            this.dataSource = new MatTableDataSource(data);
            this.totalItem = res.data.total;
          } else {
            console.log('ERROR', res);
            this.hasDataSource = false;
            this.totalItem = 0;
            this.toastr.showToastr(
              res.soaErrorDesc ? res.soaErrorDesc : 'Lỗi hệ thống.',
              'Thông báo!',
              MessageSeverity.error,
              TOAST_DEFAULT_CONFIG
            );
          }
          this.dataSource.sort = this.sort;
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
    this.indicator.hideActivityIndicator();
  }

  changePageIndex($event) {
    this.pageSize = $event.pageSize;
    this.pageIndex = $event.pageIndex;
    this.options = {
      params: {
        ...this.options.params,
        size: this.pageSize,
        page: this.pageIndex,
      },
    };
    this.QueryData();
  }
  onClickCreateAccount() {
    this.goTo('/pmp_admin/general-config/special-account/add');
  }
  viewDetail(element) {
    this.goTo('/pmp_admin/general-config/special-account/detail', {
      id: element.id,
    });
  }

  onClickEdit(element) {
    // this.goTo('/pmp_admin/general-config/special-account/edit', { id: element.id });
    this.router.navigate(['/pmp_admin/general-config/special-account/edit'], {
      state: { status: element.approvalStatus },
      queryParams: { id: element.id },
    });
  }
  resetFormSearch() {
    this.form.reset();
    this.search();
  }
  getLabel($state) {
    const status = STATUS_FORM.find((item) => item.key === $state);
    return `<label class="wf-status ${status.class}">${status.value}</label>`;
  }

  viewHistoryChange(element) {
    this.goTo('pmp_admin/general-config/special-account/history', {
      aliasAccountId: element.id,
    });
  }

  onClickApprove(element, isApprove: boolean) {
    if (isApprove) {
      this.dialogService.confirm(
        {
          label: 'Duyệt tài khoản đặc biệt',
          acceptBtn: 'Xác nhận',
          closeBtn: 'Hủy',
          message: 'Bạn có chắc chắn muốn duyệt tài khoản đã chọn?',
        },
        (result: any) => {
          if (result && result.status === DFORM_CONFIRM_STATUS.CONFIRMED) {
            this.indicator.showActivityIndicator();
            this.specialAccountService
              .approveAccount(element.id)
              .pipe(
                takeUntil(this.ngUnsubscribe),
                finalize(() => this.indicator.hideActivityIndicator())
              )
              .subscribe(
                (res) => {
                  console.log('RESPONSE', res);
                  // Gọi API thành công và có data trả về
                  if (res && res.status === 200) {
                    this.toastr.showToastr(
                      'Duyệt tài khoản đặc biệt thành công',
                      'Thông báo!',
                      MessageSeverity.success,
                      TOAST_DEFAULT_CONFIG
                    );
                    this.resetFormSearch();
                  }
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
                  this.resetFormSearch();
                }
              );
          }
        }
      );
    } else {
      this.dialogService.dformconfirm(
        {
          label: 'Từ chối tài khoản đặc biệt',
          title: 'Lý do',
          description: 'Nhập lý do từ chối duyệt tài khoản đặc biệt',
          acceptBtn: 'Xác nhận',
          closeBtn: 'Hủy',
        },
        (result: any) => {
          if (result && result.status === DFORM_CONFIRM_STATUS.CONFIRMED) {
            const body: IReasonReject = {
              reason: result.data,
            };
            this.indicator.showActivityIndicator();
            this.specialAccountService
              .rejectAccount(body, element.id)
              .pipe(
                takeUntil(this.ngUnsubscribe),
                finalize(() => this.indicator.hideActivityIndicator())
              )
              .subscribe(
                (res) => {
                  console.log('RESPONSE', res);
                  // Gọi API thành công và có data trả về
                  if (res && res.status === 200) {
                    this.toastr.showToastr(
                      'Từ chối tài khoản đặc biệt thành công',
                      'Thông báo!',
                      MessageSeverity.success,
                      TOAST_DEFAULT_CONFIG
                    );
                    this.resetFormSearch();
                  }
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
                  this.resetFormSearch();
                }
              );
          }
        }
      );
    }
  }
  trimInput(event: any, controlName: string): void {
    let inputValue = event.target.value;
    const trimmedValue = inputValue.trim();

    event.target.value = trimmedValue;
    const control = this.form.get(controlName);
    if (control) {
      control.setValue(trimmedValue);
    }
  }
}
