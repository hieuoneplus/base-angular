
import { Component, Injector } from '@angular/core';
import { finalize, takeUntil } from 'rxjs/operators';
import { ComponentAbstract, MessageSeverity } from '@shared-sm';
import { BUTTON_CANCEL, BUTTON_ADD, TYPE_BTN_FOOTER, TOAST_DEFAULT_CONFIG } from 'src/app/public/constants';
import { REASON } from '../../../ach/general-config/constant';
import { ACCOUNT } from '../../data-form/account-data-form';
import { CitadBlacklistService } from '../../services/blacklist';
import ErrorUtils from 'src/app/shared/utils/ErrorUtils';

@Component({
  selector: 'citad-add-blacklist-page',
  templateUrl: './add-blacklist.component.html',
  styleUrls: ['./add-blacklist.component.scss']
})

export class AddBlacklistComponent extends ComponentAbstract {

  $account = ACCOUNT();
  $reason = REASON();

  constructor(
    protected injector: Injector,
    protected whitelistService: CitadBlacklistService
  ) {
    super(injector);
  }

  protected componentInit(): void {
    this.$account.required = true;
    // this.$reason.required = true;
    this.$reason.maxLength = 1024;
    this.form = this.itemControl.toFormGroup([
      this.$account, this.$reason
    ]);

    this.listButton = this.listButtonDynamic('', BUTTON_CANCEL, BUTTON_ADD);

  }

  modalAddAccount() {
    if (this.form.valid) {
      this.indicator.showActivityIndicator();
      this.whitelistService.addAccount(this.form.value.accountNo.trim(), this.form.value.reason).pipe(
        takeUntil(this.ngUnsubscribe),
        finalize(() => this.indicator.hideActivityIndicator())
      ).subscribe((res) => {
        console.log("RESPONSE", res)
        // Gọi API thành công và có data trả về
        if (res && res.status === 200) {
          this.toastr.showToastr(
            'Thêm tài khoản thành công',
            'Thông báo!',
            MessageSeverity.success,
            TOAST_DEFAULT_CONFIG
          );
          this.goTo('/pmp_admin/transfer-channel/citad/blacklist-account');
        } else {
          this.toastr.showToastr(
            'Thêm tài khoản không thành công',
            'Thông báo!',
            MessageSeverity.error,
            TOAST_DEFAULT_CONFIG
          );
        }

      }, error => {
        console.log("ERROR", error)
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
        this.goTo('/pmp_admin/transfer-channel/citad/blacklist-account');
        break;
      case TYPE_BTN_FOOTER.TYPE_SAVE:
        this.modalAddAccount()
        break;
    }
  }

}
