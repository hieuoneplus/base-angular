import { Component, Injector } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ComponentAbstract, MessageSeverity } from '@shared-sm';
import { finalize, takeUntil } from 'rxjs/operators';

import {
  BUTTON_ADD,
  BUTTON_CANCEL,
  DFORM_CONFIRM_STATUS,
  TOAST_DEFAULT_CONFIG,
  TYPE_BTN_FOOTER,
} from 'src/app/public/constants';
import { ModuleKeys } from '../../../../public/module-permission.utils';
import ErrorUtils from '../../../../shared/utils/ErrorUtils';
import { BankService } from '../../../general-configuration/service/BankService';
import { BlacklistService } from '../../service/BlacklistService';
import {
  ACCOUNT_NUMBER,
  ACCOUNT_TYPE,
  ACTIVE_SLIDE,
  BANK,
  BANK_NAME,
  TRANS_TYPE,
} from '../modal/constant';
import { IRequestPutAccount } from '../modal/interface';

@Component({
  selector: 'add-blacklist-page',
  templateUrl: './add-blacklist.component.html',
  styleUrls: ['./add-blacklist.component.scss'],
})
export class AddBlacklistComponent extends ComponentAbstract {
  $accountNumber = ACCOUNT_NUMBER();
  $bank = BANK();
  $accountType = ACCOUNT_TYPE();
  $transType = TRANS_TYPE();
  $activeSlide = ACTIVE_SLIDE();
  $bankName = BANK_NAME();

  checked: boolean = false;
  isChecked: boolean = false;
  isChecker: boolean = false;

  hasDataSource = false;
  pageEvent: PageEvent = new PageEvent();

  constructor(
    protected injector: Injector,
    protected blacklistService: BlacklistService,
    private bankService: BankService
  ) {
    super(injector);
  }

  protected componentInit(): void {
    this.enableActions(ModuleKeys.routing_blacklist);
    this.$accountNumber.required = true;
    this.$bank.required = true;
    this.$accountType.required = true;
    this.$transType.required = true;
    this.$activeSlide.required = true;
    this.form = this.itemControl.toFormGroup([
      this.$accountNumber,
      this.$bank,
      this.$accountType,
      this.$transType,
      this.$activeSlide,
      this.$bankName,
    ]);
    this.getBankName();
    this.listButton = this.enableInsert
      ? this.listButtonDynamic('', BUTTON_CANCEL, BUTTON_ADD)
      : this.listButtonDynamic('', BUTTON_CANCEL);
  }

  modalAddBlacklist() {
    if (this.form.valid) {
      if (this.form.value.bankCode !== null) {
        this.dialogService.dformconfirm(
          {
            label: 'Thêm mới tài khoản Blacklist',
            title: 'Lý do',
            description: 'Nhập lý do thêm mới tài khoản Blacklist',
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
                active: values.activeSlide,
                reason: result.data,
              };
              this.blacklistService
                .postAccount(body)
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
                        'Tạo tài khoản thành công',
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
          'Mã ngân hàng không hợp lệ',
          'Thông báo!',
          MessageSeverity.error,
          TOAST_DEFAULT_CONFIG
        );
      }
    } else {
      this.toastr.showToastr(
        'Vui lòng nhập đúng định dạng',
        'Thông báo!',
        MessageSeverity.error,
        TOAST_DEFAULT_CONFIG
      );
    }
  }

  getBankName() {
    const params = {
      showBranch: false,
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

  onClickBtn($event?: any): void {
    switch ($event) {
      case TYPE_BTN_FOOTER.TYPE_CANCEL:
        this.goTo('/pmp_admin/routing/blacklist');
        break;
      case TYPE_BTN_FOOTER.TYPE_SAVE:
        if (this.form.valid) {
          this.modalAddBlacklist();
        } else {
          this.form.markAllAsTouched();
        }
        break;
    }
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
