
import { Component, Injector } from '@angular/core';
import { finalize, takeUntil } from 'rxjs/operators';
import {ComponentAbstract, HttpResponse, MessageSeverity, ToastService} from '@shared-sm';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {BUTTON_CANCEL, BUTTON_ADD, TYPE_BTN_FOOTER, BUTTON_SAVE, DFORM_CONFIRM_STATUS} from 'src/app/public/constants';
import {
  ACCOUNT_NAME,
  ACCOUNT_NUMBER,
  ACCOUNT_TYPE,
  CURRENCY,
  DESCRIPTION,
  FUNCTION_CODE,
  IS_ACTIVE_SLIDE, REASON
} from "../constant";
import {TktgAchService} from "../services/tktg-ach.service";
import {Observable} from "rxjs";
import {IIntermediateAccountConfig, IIntermediateAccountUpdateConfiReq} from "../../../../model/ach";
import ErrorUtils from "../../../../../shared/utils/ErrorUtils";
import {ModuleKeys} from "../../../../../public/module-permission.utils";

@Component({
  selector: 'edit-tktg-ach-page',
  templateUrl: './edit-tktg-ach.component.html',
  styleUrls: ['./edit-tktg-ach.component.scss']
})
// Màn hình chỉnh sửa tài khoản trung gian ach
export class EditTktgACHComponent extends ComponentAbstract {
  accDetail: IIntermediateAccountConfig

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

  protected componentInit(): void {
    this.enableActions(ModuleKeys.ach_tktg_config)

    this.form = this.itemControl.toFormGroup([
      this.$functionCode, this.$accountNumber, this.$accountType, this.$accountName, this.$currency, this.$description, this.$isActive, this.$reason
    ]);
    this.$functionCode.readOnly = true
    this.$currency.readOnly = true
    this.form.patchValue({currency: "VND"})
    this.handleGetAccDetail()
    this.listButton = this.enableUpdate ? this.listButtonDynamic('', BUTTON_CANCEL, BUTTON_SAVE) : this.listButtonDynamic('', BUTTON_CANCEL);
  }

  handleUpdate(): Observable<HttpResponse<IIntermediateAccountConfig>> {
    const data = {
      ...this.form.value,
      accountNumber: this.accDetail.accountNumber.trim(),
      newAccountNumber: this.form.get('accountNumber')?.value.toString().trim(),
      accountName: this.form.get('accountName')?.value.toString().trim(),
      currency: this.form.get('currency')?.value.toString().trim(),
      description: this.form.get('description')?.value.toString().trim(),
      isActive: this.form.get('isActive')?.value ? "Y" : "N"
    }
    return this.tktgAchService.updateIntermediateAccountConfig(data)
  }

  handleGetAccDetail() {
    this.indicator.showActivityIndicator()
    this.tktgAchService.getIntermediateAccountDetailConfig(this.queryParams.way, this.queryParams?.acc).pipe(
      finalize(() => {
        this.indicator.hideActivityIndicator()
      }),
      takeUntil(this.ngUnsubscribe)
    )
      .subscribe({
        next: (res) => {
          this.accDetail = res.data
          const arr = [
            'functionCode', 'accountNumber', 'accountType', 'accountName', 'currency', 'description', 'isActive',
          ]
          arr.forEach((key) => {
            if(key === "isActive"){
              this.form.patchValue({[key]: res.data[key] === "Y"})
            }else{
              this.form.patchValue({[key]: res.data[key]})
            }
          })
        },
        error: (err) => {
          const errMessage = ErrorUtils.getErrorMessage(err)
          this.toastService.showToastr(errMessage.join('\n'), "Thông báo", MessageSeverity.error)        }
      })
  }

  onClickUpdate() {
    this.dialogService.dformconfirm({
        title: 'Xác nhận cập nhật',
        description: 'Nhập lý do sửa',
        acceptBtn: 'Xác nhận',
        closeBtn: 'Đóng',
      },
      (result: {status: number, data: string}) => {
        if (result && result.data.length > 2000) {
          this.toastService.showToastr('Lý do đã vượt quá 2000 kí tự!', 'Thông báo!', MessageSeverity.error, '');
        }
        else if (result && result.status === DFORM_CONFIRM_STATUS.CONFIRMED) {
          this.form.patchValue({reason: result.data})
          this.indicator.showActivityIndicator()
          this.handleUpdate().pipe(
            finalize(() => this.indicator.hideActivityIndicator()),
            takeUntil(this.ngUnsubscribe)
          ).subscribe({
            next: (res) => {
              this.toastService.showToastr('Cập nhật thành công', 'Thông báo!', MessageSeverity.success, '');
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

  onClickActionBtn($event?: any): void {
    switch ($event) {
      case TYPE_BTN_FOOTER.TYPE_CANCEL:
        this.goTo('pmp_admin/transfer-channel/ach/tktg')
        break;
      case TYPE_BTN_FOOTER.TYPE_SAVE:
        if (this.form.valid) {
          this.onClickUpdate()
        } else {
          this.form.markAllAsTouched();
        }
        break;
    }
  }
}
