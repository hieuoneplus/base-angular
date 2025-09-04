import { Component, Injector } from '@angular/core';
import { finalize, takeUntil } from 'rxjs/operators';
import { ComponentAbstract, MessageSeverity } from '@shared-sm';
import {
  ACCOUNT_NUMBER,
  BANK,
  ACTIVE_SLIDE,
  CHANNEL,
} from '../modal/constant';
import {
  BUTTON_CANCEL,
  TYPE_BTN_FOOTER,
  BUTTON_SAVE,
  TOAST_DEFAULT_CONFIG,
  DFORM_CONFIRM_STATUS,
} from 'src/app/public/constants';
import { PageEvent } from '@angular/material/paginator';

import { WhitelistService } from '../../service/WhitelistService';
import {
  IRequestPutAccount,
  IWhitelistContent,
} from '../modal/interface';
import ErrorUtils from '../../../../shared/utils/ErrorUtils';
import { ModuleKeys } from '../../../../public/module-permission.utils';
import { BankService } from 'src/app/features/general-configuration/service/BankService';
import { STATUS_TRANSACTION } from '../modal/constant';

@Component({
  selector: 'edit-whitelist-page',
  templateUrl: './edit-account.component.html',
  styleUrls: ['./edit-account.component.scss'],
})
export class EditAccountComponent extends ComponentAbstract {
  accDetail: IWhitelistContent;

  $accountNumber = ACCOUNT_NUMBER();
  $bank = BANK();
  $channel = CHANNEL();
  $activeSlide = ACTIVE_SLIDE();

  checked: boolean = false;
  isChecked: boolean = false;
  isChecker: boolean = false;

  hasDataSource = false;
  pageEvent: PageEvent = new PageEvent();

  constructor(
    protected injector: Injector,
    protected whitelistService: WhitelistService,
    private bankService: BankService
  ) {
    super(injector);
  }

  protected componentInit(): void {
    this.enableActions(ModuleKeys.routing_whitelist);
    this.trackOutput();
    this.form = this.itemControl.toFormGroup([
      this.$accountNumber,
      this.$bank,
      this.$channel,
      this.$activeSlide,
    ]);
    if (
      history.state.status === STATUS_TRANSACTION.REJECTED ||
      history.state.status === STATUS_TRANSACTION.APPROVED
    ) {
      this.getDetailWhitelist();
      this.listButton = this.enableUpdate
        ? this.listButtonDynamic('', BUTTON_CANCEL, BUTTON_SAVE)
        : this.listButtonDynamic('', BUTTON_CANCEL);
    } else {
      this.goTo('/pmp_admin/routing/whitelist');
    }
  }

  trackOutput() {
    this.$accountNumber.readOnly = true;
    this.$bank.readOnly = true;
    this.$channel.required = true;
    // this.$transType.readOnly = true;
  }

  getDetailWhitelist() {
    this.indicator.showActivityIndicator();
    this.whitelistService
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
            this.accDetail = res.data;
            this.getBankName(res.data.bankCode);
            this.form.patchValue({
              accountNo: res.data.accountNo,
              transferChannel: res.data.transferChannel,
              bankCode: res.data.bankCode,
              activeSlide: res.data.active.toString(),
            });
            this.hasDataSource = true;
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

  getBankName(bankCode: string) {
    const params = {
      showBranch: false,
      bankCode: bankCode,
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

  saveAccount() {
    if (this.form.valid) {
      this.dialogService.dformconfirm(
        {
          label: 'Gửi duyệt',
          title: 'Lý do',
          description: 'Nhập lý do chỉnh sửa tài khoản Whitelist',
          warning:
            'Nội dung thay đổi này sẽ không thể khôi phục. Vui lòng kiểm tra nội dung trước khi gửi duyệt.',
          acceptBtn: 'Xác nhận',
          closeBtn: 'Hủy',
        },
        (result: any) => {
          if (result && result.status === DFORM_CONFIRM_STATUS.CONFIRMED) {
            const values = this.form.value;
            const body: IRequestPutAccount = {
              accountNo: values.accountNo,
              bankCode: values.bankCode,
              transferChannel: values.transferChannel,
              active: values.activeSlide,
              reason: result.data,
            };
            this.indicator.showActivityIndicator();
            this.whitelistService
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
                    this.goTo('/pmp_admin/routing/whitelist');
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
        this.dialogService.confirm(
          {
            label: 'Xác nhận',
            acceptBtn: 'Xác nhận',
            closeBtn: 'Hủy',
            message:
              'Nội dung bạn đang chỉnh sửa chưa được lưu. Bạn có chắc chắn muốn hủy thay đổi không?',
          },
          (result: any) => {
            if (result && result.status === DFORM_CONFIRM_STATUS.CONFIRMED) {
              this.goTo('/pmp_admin/routing/whitelist');
            }
          }
        );
        break;
      case TYPE_BTN_FOOTER.TYPE_SAVE:
        if (this.form.valid) {
          this.saveAccount();
        } else {
          this.form.markAllAsTouched();
        }
    }
  }
}
