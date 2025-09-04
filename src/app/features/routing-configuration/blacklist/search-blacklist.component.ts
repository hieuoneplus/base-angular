import { SelectionModel } from '@angular/cdk/collections';
import { Component, Injector } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatTableDataSource } from '@angular/material/table';
import { ComponentAbstract, MessageSeverity } from '@shared-sm';
import { BehaviorSubject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { DFORM_CONFIRM_STATUS, TOAST_DEFAULT_CONFIG } from '../../../public/constants';
import { ModuleKeys } from '../../../public/module-permission.utils';
import ErrorUtils from '../../../shared/utils/ErrorUtils';
import { BankService } from '../../general-configuration/service/BankService';


import { BlacklistService } from '../service/BlacklistService';
import { ACCOUNT_NUMBER, ACCOUNT_TYPE, STATUS, TRANS_TYPE, BANK_SEARCH, STATUS_LABEL_TRANSACTION_TYPE, STATUS_LABEL_ACCOUNT_TYPE } from './modal/constant';
import { IBlacklistContent, IRequestPutAccount } from './modal/interface';
@Component({
  selector: 'search-blacklist-page',
  templateUrl: './search-blacklist.component.html',
  styleUrls: ['./search-blacklist.component.scss'],
})
export class SearchBlacklistComponent extends ComponentAbstract {
  // Table view
  displayedColumns: string[] = [
    'stt',
    'accountNumber',
    'bank',
    'transType',
    'accountType',
    'status',
    'actions',
  ];

  $accountNumber = ACCOUNT_NUMBER();
  $bank = BANK_SEARCH();
  $accountType = ACCOUNT_TYPE();
  $transType = TRANS_TYPE();
  $status = STATUS();

  hasDataSource = false;
  selection = new SelectionModel<any>(true, []);
  selectionObs = new BehaviorSubject<any>('');
  pageEvent: PageEvent = new PageEvent();
  bankCodeList?: String[];

  constructor(
    protected injector: Injector,
    private blacklistService: BlacklistService,
    private bankService: BankService
  ) {
    super(injector);
  }

  protected componentInit(): void {
    this.enableActions(ModuleKeys.routing_blacklist);
    this.form = this.itemControl.toFormGroup([
      this.$accountNumber,
      this.$bank,
      this.$transType,
      this.$accountType,
      this.$status,
    ]);
    this.$accountType.options.unshift({
      key: '',
      value: 'Tất cả',
    });
    this.$transType.options.unshift({
      key: '',
      value: 'Tất cả',
    });
    this.$status.options.unshift({
      key: '',
      value: 'Tất cả',
    });
    this.getBankName();
    this.search();
  }

  onInputChange(event: any, controlName: string): void {
    let inputValue = event.target.value;
    // inputValue = inputValue.replace(/\s+/g, '');
    inputValue = inputValue.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    inputValue = inputValue.replace(/[^a-zA-Z0-9]/g, '')
    const control = this.form.get(controlName);
    if (control) {
      control.setValue(inputValue);
    }
    event.target.value = inputValue;
  }

  getBankName() {
    const params = {
      showBranch: false,
      page: 0,
      size: 1000,
    };
    this.indicator.showActivityIndicator();
    this.bankService
      .getBankWhitelist(params)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        finalize(() => this.indicator.hideActivityIndicator())
      )
      .subscribe(
        (res) => {
          console.log('RESPONSE', res);
          if (res && res.status === 200) {
            if (res.data.content.length > 0) {
              this.$bank.options = res.data.content.map((bank) => {
                return {
                  key: bank.bankCode,
                  value: bank.bankCode + ' - ' + bank.fullName,
                };
              });
            }
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

  search() {
    this.pageIndex = 0;
    this.pageSize = 10;
    const params = Object.assign(
        {},
        Object.entries(this.form.value).reduce((acc, [key, value]) => {
          acc[key] = typeof value === 'string' ? value.trim() : value;
          return acc;
        }, {}),
    )
    this.options = {
      params: {
        ...params,
        page: this.pageIndex,
        size: this.pageSize,
        sort: 'updatedAt:DESC'
      }
    };
    this.dformPagination.goto(this.pageSize, this.pageIndex);
  }

  QueryData() {
    this.indicator.showActivityIndicator();
    console.log('QUERY', this.options);

    this.blacklistService
      .getAccounts(this.options.params)
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

  getLabelTransactionTyppe(transactionType: string) {
    const transType = STATUS_LABEL_TRANSACTION_TYPE.find(item => item.key === transactionType);
    if (transType) {
      return `${transType.value}</label>`;
    } else {
      return '';
    }
  }

  getLabelAccountTyppe(accountType: string) {
    const accType = STATUS_LABEL_ACCOUNT_TYPE.find(item => item.key === accountType);
    if (accType) {
      return `${accType.value}</label>`;
    } else {
      return '';
    }
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
    this.goTo('/pmp_admin/routing/blacklist/add');
  }

  onClickChangeStatus(event: MatSlideToggleChange, element: IBlacklistContent) {
    const onOff = element.active ? 'tắt' : 'bật';
    const ON_OFF = onOff.charAt(0).toUpperCase() + onOff.slice(1);
    const description = `Lý do ${onOff} trạng thái tài khoản`;
    this.dialogService.dformconfirm(
      {
        label: `${ON_OFF} trạng thái tài khoản`,
        title: 'Lý do',
        description: description,
        acceptBtn: 'Xác nhận',
        closeBtn: 'Hủy',
      },
      (result: any) => {
        if (result && result.status === DFORM_CONFIRM_STATUS.CONFIRMED) {
          this.indicator.showActivityIndicator()
          const body: IRequestPutAccount = {
            reason: result.data,
            active: !element.active,
            accountNo: element.accountNo,
            bankCode: element.bankCode,
            type: element.type,
            transactionType: element.transactionType,
          }
          this.blacklistService
            .putAccounts(body, element.id)
            .pipe(
              takeUntil(this.ngUnsubscribe),
              finalize(() => this.indicator.hideActivityIndicator())
            )
            .subscribe(
              (res) => {
                console.log('RESPONSE', res);
                // Gọi API thành công và có data trả về
                this.QueryData();
                if (res && res.status === 200) {
                  this.toastr.showToastr(
                    'Chuyển trạng thái tài khoản thành công',
                    'Thông báo!',
                    MessageSeverity.success,
                    TOAST_DEFAULT_CONFIG
                  );
                } else {
                  event.source.checked = element.active;
                  this.toastr.showToastr(
                    'Chuyển trạng thái tài khoản không thành công',
                    'Tắt trạng thái hoạt động thất bại',
                    MessageSeverity.error,
                    TOAST_DEFAULT_CONFIG
                  );
                }
              },
              (error) => {
                event.source.checked = element.active;
                this.QueryData();
                console.log('ERROR-500', error);
                const message =
                  error.error && error?.error?.soaErrorDesc
                    ? error?.error?.soaErrorDesc
                    : 'Có lỗi xảy ra. Vui lòng liên hệ CNTT để được hỗ trợ.';
                this.toastr.showToastr(
                  message,
                  'Chuyển trạng thái tài khoản thất bại',
                  MessageSeverity.error,
                  TOAST_DEFAULT_CONFIG
                );
              }
            );
        } else {
          event.source.checked = element.active;
        }
      }
    );
  }
  viewDetail(element) {
    console.log('VIEW ', element);

    this.goTo('/pmp_admin/routing/blacklist/detail', { id: element.id });
  }

  onClickEdit(element) {
    console.log('EDIT ', element);

    this.goTo('/pmp_admin/routing/blacklist/edit', { id: element.id });
  }

  resetFormSearch() {
    this.form.reset();
    this.search();
  }
  viewHistory(element) {
    this.goTo('/pmp_admin/routing/blacklist/history', { id: element.id });
  }
}
