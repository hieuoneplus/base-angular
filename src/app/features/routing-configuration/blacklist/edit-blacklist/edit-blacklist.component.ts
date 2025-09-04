import { Component, Injector } from '@angular/core';
import { finalize, takeUntil } from 'rxjs/operators';
import { ComponentAbstract, MessageSeverity } from '@shared-sm';

import {
  BUTTON_CANCEL,
  TYPE_BTN_FOOTER,
  BUTTON_SAVE,
  TOAST_DEFAULT_CONFIG,
  DFORM_CONFIRM_STATUS,
} from 'src/app/public/constants';
import { PageEvent } from '@angular/material/paginator';
import { BlacklistService } from '../../service/BlacklistService';

import ErrorUtils from '../../../../shared/utils/ErrorUtils';
import { ModuleKeys } from '../../../../public/module-permission.utils';
import { IBlacklistContent, IRequestPutAccount } from '../modal/interface';
import { ACCOUNT_NUMBER, ACCOUNT_TYPE, ACTIVE_SLIDE_EDIT, BANK, TRANS_TYPE } from '../modal/constant';
import {BankService} from "../../../general-configuration/service/BankService";

@Component({
  selector: 'edit-blacklist-page',
  templateUrl: './edit-blacklist.component.html',
  styleUrls: ['./edit-blacklist.component.scss'],
})
export class EditBlacklistComponent extends ComponentAbstract {
  accDetail: IBlacklistContent;

  $accountNumber = ACCOUNT_NUMBER();
  $bank = BANK();
  $accountType = ACCOUNT_TYPE();
  $transType = TRANS_TYPE();
  $active = ACTIVE_SLIDE_EDIT();

  groupList: any = [];
  checked: boolean = false;
  isChecked: boolean = false;
  isChecker: boolean = false;

  hasDataSource = false;
  pageEvent: PageEvent = new PageEvent();
  originalData: any;

  constructor(
    protected injector: Injector,
    protected blacklistService: BlacklistService,
    private bankService: BankService
  ) {
    super(injector);
  }

  protected componentInit(): void {
    this.enableActions(ModuleKeys.routing_blacklist);
    this.trackOutput();
    this.form = this.itemControl.toFormGroup([
      this.$accountNumber,
      this.$bank,
      this.$accountType,
      this.$transType,
      this.$active,
    ]);
    this.getDetailBlacklist();
    this.listButton = this.enableUpdate ? this.listButtonDynamic('', BUTTON_CANCEL, BUTTON_SAVE) : this.listButtonDynamic('', BUTTON_CANCEL) ;
    this.trackValueForm()
  }

  trackOutput() {
    this.$accountNumber.readOnly = true;
    this.$bank.readOnly = true;

    this.$accountType.required = true;
    this.$transType.required = true;
  }

  trackValueForm() {
    this.form.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
      this.isFormChanged();
    });
  }

  getDetailBlacklist() {
    this.indicator.showActivityIndicator();

    this.blacklistService
      .getAccountDetail(this.queryParams.id)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        finalize(() => this.indicator.hideActivityIndicator())
      )
      .subscribe(
        (res) => {
          console.log('RESPONSE', res);
          // Gọi API thành công và có data trả về
          if (res && res.status === 200) {
            this.getBankName(res.data.bankCode);
            this.accDetail = res.data;
            this.form.patchValue({
              accountNo: res.data.accountNo,
              type: res.data.type,
              bankCode: res.data.bankCode,
              transactionType: res.data.transactionType,
              active: res.data.active,
            });

            this.hasDataSource = true;
          }
        },
        (error) => {
          console.log('ERROR', error);
          this.toastr.showToastr(
            error.error.soaErrorDesc
              ? error.error.soaErrorDesc
              : 'Lỗi hệ thống.',
            'Thông báo!',
            MessageSeverity.error,
            TOAST_DEFAULT_CONFIG
          );
        }
      );
  }

  isFormChanged(): boolean {
    const currentValue = this.form.value;

    if (!this.accDetail) return false;
    const allValuesMatch = Object.keys(currentValue).every(key => {
      return this.accDetail[key] === currentValue[key];
    });
  
    BUTTON_SAVE.disable = allValuesMatch;
    return allValuesMatch;
  }

  saveAccount() {
    if (this.form.valid) {
      this.dialogService.dformconfirm(
        {
          label: 'Chỉnh sửa tài khoản Blacklist',
          title: 'Lý do',
          description: 'Nhập lý do chỉnh sửa tài khoản Blacklist',
          acceptBtn: 'Xác nhận',
          closeBtn: 'Hủy',
        },
        (result: any) => {
          if (result && result.status === DFORM_CONFIRM_STATUS.CONFIRMED) {
            this.indicator.showActivityIndicator();
            const values = this.form.value;
            const body: IRequestPutAccount = {
              accountNo: values.accountNo,
              bankCode: values.bankCode,
              type: values.type,
              transactionType: values.transactionType,
              active: values.active,
              reason: result.data,
            };
            this.blacklistService
              .putAccounts(body, this.queryParams.id)
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
                      'Cập nhật tài khoản thành công',
                      'Thông báo!',
                      MessageSeverity.success,
                      TOAST_DEFAULT_CONFIG
                    );
                    this.goTo('/pmp_admin/routing/blacklist');
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
        }
      );
    } else {
      this.toastr.showToastr(
        'Vui lòng nhập đúng định dạng',
        'Thông báo!',
        MessageSeverity.error,
        TOAST_DEFAULT_CONFIG
      );
    }
  }

  onClickBtn($event?: any): void {
    switch ($event) {
      case TYPE_BTN_FOOTER.TYPE_CANCEL:
        this.goTo('/pmp_admin/routing/blacklist');
        break;
      case TYPE_BTN_FOOTER.TYPE_SAVE:
        if (this.form.valid) {
          this.saveAccount();
        } else {
          this.form.markAllAsTouched();
        }
        break;
    }
  }

  getBankName(bankCode: string) {
    const params = {
      showBranch: false,
      bankCode: bankCode,
      page: 0,
      size: 1000,
    };
    this.indicator.showActivityIndicator();
    this.bankService
        .getBanks(params)
        .pipe(
            takeUntil(this.ngUnsubscribe),
            finalize(() => this.indicator.hideActivityIndicator())
        )
        .subscribe(
            (res) => {
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
  
}
