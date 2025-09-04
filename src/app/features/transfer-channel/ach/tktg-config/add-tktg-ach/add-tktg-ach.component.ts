import {Component, Injector} from '@angular/core';
import {ComponentAbstract, HttpResponse, MessageSeverity, ToastService} from '@shared-sm';
import {Observable} from "rxjs";

import {BUTTON_ADD, BUTTON_CANCEL, DFORM_CONFIRM_STATUS, TYPE_BTN_FOOTER} from 'src/app/public/constants';
import {
  ACCOUNT_NAME,
  ACCOUNT_NUMBER,
  ACCOUNT_TYPE,
  CURRENCY,
  DESCRIPTION,
  FUNCTION_CODE,
  IS_ACTIVE_SLIDE,
  REASON,
} from "../constant";
import {TktgAchService} from "../services/tktg-ach.service";
import {IIntermediateAccountConfig} from "../../../../model/ach";
import {finalize, takeUntil} from "rxjs/operators";
import ErrorUtils from "../../../../../shared/utils/ErrorUtils";
import {ModuleKeys} from "../../../../../public/module-permission.utils";

@Component({
  selector: 'add-tktg-ach-page',
  templateUrl: './add-tktg-ach.component.html',
  styleUrls: ['./add-tktg-ach.component.scss']
})
// Màn hình thêm mới tài khoản trung gian ACH
export class AddTktgACHComponent extends ComponentAbstract {

  $functionCode = FUNCTION_CODE();
  $accountNumber = ACCOUNT_NUMBER();
  $accountName = ACCOUNT_NAME();
  $accountType = ACCOUNT_TYPE();
  $currency = CURRENCY();
  $description = DESCRIPTION();
  $isActive = IS_ACTIVE_SLIDE();
  $reason = REASON();

  constructor(
    protected injector: Injector,
    private tktgAchService: TktgAchService,
    private toastService: ToastService
  ) {
    super(injector);
  }

  onClickCreate() {
    this.dialogService.dformconfirm({
        title: 'Lý do thêm mới',
        description: 'Nhập lý do thêm mới',
        acceptBtn: 'Xác nhận',
        closeBtn: 'Đóng',
      },
      (result: { status: number, data: string }) => {
        if (result.status === DFORM_CONFIRM_STATUS.CANCELED) {
          return
        } else if (result && result.data.length > 2000) {
          this.toastService.showToastr('Lý do đã vượt quá 2000 kí tự!', 'Thông báo!', MessageSeverity.error, '');
          return
        } else if (result && result.status === 1) {
          this.form.patchValue({reason: result.data})
          this.indicator.showActivityIndicator()
          this.handleCreate().pipe(
            finalize(() => this.indicator.hideActivityIndicator()),
            takeUntil(this.ngUnsubscribe)
          ).subscribe({
            next: (res) => {
              this.toastService.showToastr('Thêm mới thành công', 'Thông báo!', MessageSeverity.success, '');
              this.goTo('/pmp_admin/transfer-channel/ach/tktg')
            },
            error: (err) => {
              const errMessage = ErrorUtils.getErrorMessage(err)
              this.toastService.showToastr(errMessage.join('\n'), "Thông báo", MessageSeverity.error)
            },
          })
        }
      })
  }

  handleCreate(): Observable<HttpResponse<IIntermediateAccountConfig>> {
    const data = {
      ...this.form.value,
      accountNumber: this.form.get('accountNumber')?.value.toString().trim(),
      accountName: this.form.get('accountName')?.value.toString().trim(),
      currency: this.form.get('currency')?.value.toString().trim(),
      description: this.form.get('description')?.value.toString().trim(),
      isActive: this.form.get('isActive')?.value ? "Y" : "N"
    }
    return this.tktgAchService.createIntermediateAccountConfig(data)
  }

  onClickActionBtn($event?: any): void {
    switch ($event) {
      case TYPE_BTN_FOOTER.TYPE_CANCEL:
        this.goTo('pmp_admin/transfer-channel/ach/tktg')
        break;
      case TYPE_BTN_FOOTER.TYPE_SAVE:
        if (this.form.valid) {
          this.onClickCreate()
        } else {
          this.form.markAllAsTouched();
        }
        break;
    }
  }

  protected componentInit(): void {
    this.enableActions(ModuleKeys.ach_tktg_config)

    this.form = this.itemControl.toFormGroup([
      this.$functionCode, this.$accountNumber, this.$accountType, this.$accountName, this.$currency, this.$description, this.$isActive, this.$reason
    ]);
    this.$currency.readOnly = true
    this.form.patchValue({currency: "VND"})
    this.listButton = this.enableInsert ? this.listButtonDynamic('', BUTTON_CANCEL, BUTTON_ADD) : this.listButtonDynamic('', BUTTON_CANCEL);
  }
}
