
import { Component, Injector } from '@angular/core';
import { finalize, takeUntil } from 'rxjs/operators';
import { ComponentAbstract, MessageSeverity } from '@shared-sm';
import { BUTTON_CANCEL, TYPE_BTN_FOOTER, TOAST_DEFAULT_CONFIG } from 'src/app/public/constants';
import { IAccountContent } from '../../model/account';
import { CitadWhitelistService } from '../../services/whitelist';
import { REASON } from '../../../ach/general-config/constant';
import { ACCOUNT } from '../../data-form/account-data-form';
import ErrorUtils from 'src/app/shared/utils/ErrorUtils';

const BUTTON_SAVE = {
  title: 'Lưu thông tin',
  classBtn: 'btn-primary',
  typeBtn: TYPE_BTN_FOOTER.TYPE_SAVE,
  disable: true
};


@Component({
  selector: 'citad-edit-whitelist-page',
  templateUrl: './edit-account.component.html',
  styleUrls: ['./edit-account.component.scss']
})

export class EditAccountComponent extends ComponentAbstract {
  accDetail: IAccountContent;
  $account = ACCOUNT();
  $reason = REASON();

  enableButtonSave = false;

  constructor(
    protected injector: Injector,
    protected whitelistService: CitadWhitelistService,
  ) {
    super(injector);
  }

  protected componentInit(): void {
    this.$account.required = true;
    this.$reason.maxLength = 1024;
    this.form = this.itemControl.toFormGroup([
      this.$account, this.$reason
    ]);
    this.getDetailAccount();
    this.listButton = this.listButtonDynamic('', BUTTON_CANCEL, BUTTON_SAVE);

    this.onValueChange()
  }

  onValueChange() {
    this.form.get('accountNo').valueChanges.subscribe(newAcc => {

      let status = this.accDetail.accountNo !== newAcc;
      if (this.enableButtonSave !== status) {
        BUTTON_SAVE.disable = !status;
        this.enableButtonSave = status;
      }
    })
  }

  getDetailAccount() {
    this.indicator.showActivityIndicator();
    this.whitelistService.getDetailAccount(this.queryParams.id).pipe(
      takeUntil(this.ngUnsubscribe),
      finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe((res) => {
      console.log("RESPONSE", res)
      // Gọi API thành công và có data trả về
      if (res && res.status === 200) {
        this.accDetail = res.data;
        this.form.patchValue({
          accountNo: res.data.accountNo,
          reason: res.data.reason,
        })
      }
    }, error => {
      const messsageError = ErrorUtils.getErrorMessage(error);
      this.toastr.showToastr(
        messsageError.join('\n'),
        'Thông báo!',
        MessageSeverity.error,
        TOAST_DEFAULT_CONFIG
      );
    });
  }

  saveAccount() {
    if (this.form.valid) {
      this.indicator.showActivityIndicator();
      this.whitelistService.editAccount(this.queryParams.id, this.form.value.accountNo.trim(), this.form.value.reason).pipe(
        takeUntil(this.ngUnsubscribe),
        finalize(() => this.indicator.hideActivityIndicator())
      ).subscribe((res) => {
        console.log("RESPONSE", res)
        // Gọi API thành công và có data trả về
        if (res && res.status === 200) {
          this.toastr.showToastr(
            'Chỉnh sửa tài khoản thành công',
            'Thông báo!',
            MessageSeverity.success,
            TOAST_DEFAULT_CONFIG
          );
          this.goTo('/pmp_admin/transfer-channel/citad/whitelist-account');
        } else {
          this.toastr.showToastr(
            'Chỉnh sửa tài khoản không thành công',
            'Thông báo!',
            MessageSeverity.success,
            TOAST_DEFAULT_CONFIG
          );
        }
      }, error => {
        const messsageError = ErrorUtils.getErrorMessage(error);
        this.toastr.showToastr(
          messsageError.join('\n'),
          'Thông báo!',
          MessageSeverity.error,
          TOAST_DEFAULT_CONFIG
        );
      });
    } else {
      this.toastr.showToastr(
        'Tài khoản bắt buộc nhập',
        'Thông báo!',
        MessageSeverity.error,
        TOAST_DEFAULT_CONFIG
      );
    }
  }

  onClickBtn($event?: any): void {
    switch ($event) {
      case TYPE_BTN_FOOTER.TYPE_CANCEL:
        this.goTo('/pmp_admin/transfer-channel/citad/whitelist-account');
        break;
      case TYPE_BTN_FOOTER.TYPE_SAVE:
        this.saveAccount()
        break;
    }
  }

}
