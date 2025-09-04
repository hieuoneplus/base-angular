
import { Component, Injector } from '@angular/core';
import { ComponentAbstract, MessageSeverity, ToastService } from '@shared-sm';
import {BUTTON_CANCEL, BUTTON_ADD, TYPE_BTN_FOOTER, DFORM_CONFIRM_STATUS} from 'src/app/public/constants';
import { DESCRIPTION, FUNCTION_CODE, IS_ACTIVE_SLIDE, KEY, REASON, VALUE } from "../constant";
import { GeneralConfigService } from "../services/general-config.service";
import { finalize, takeUntil } from "rxjs/operators";
// import { keyBasedOnGeneralTransactionWay } from "../../constant";
import ErrorUtils from "../../../../../shared/utils/ErrorUtils";
import {ModuleKeys} from "../../../../../public/module-permission.utils";

@Component({
  selector: 'add-general-ach-page',
  templateUrl: './add-general-ach.component.html',
  styleUrls: ['./add-general-ach.component.scss']
})
// Màn hình thêm mới tài khoản trung gian ACH
export class AddGeneralAchComponent extends ComponentAbstract {
  $functionCode = FUNCTION_CODE();
  $key = KEY();
  $value = VALUE();
  $description = DESCRIPTION()
  $isActive = IS_ACTIVE_SLIDE();
  $reason = REASON()

  constructor(
    protected injector: Injector,

    private generalConfigService: GeneralConfigService,
    private toastService: ToastService
  ) {
    super(injector);
  }

  protected componentInit(): void {
    this.enableActions(ModuleKeys.ach_common_config)

    this.form = this.itemControl.toFormGroup([
      this.$functionCode, this.$key, this.$value, this.$description, this.$isActive, this.$reason
    ]);
    // this.handleKeyBasedOnFunctionCode()
    this.listButton =  this.enableInsert ? this.listButtonDynamic('', BUTTON_CANCEL, BUTTON_ADD) : this.listButtonDynamic('', BUTTON_CANCEL);
  }

  // handleKeyBasedOnFunctionCode() {
  //   this.form.get('functionCode')?.valueChanges.subscribe({next: (res) => {
  //       const key = keyBasedOnGeneralTransactionWay[res]
  //       if(key) {
  //         this.$key.options = Object.entries(key).map(([key, value]) => ({
  //           key,
  //           value: value as string
  //         }))
  //       } else {
  //         this.$key.options = Object.entries(keyBasedOnGeneralTransactionWay)
  //           .map(([_, keys]) =>
  //             Object.entries(keys).map(([key, value]) => ({
  //               key,
  //               value: value as string,
  //             }))
  //           )
  //           .reduce((acc, curr) => acc.concat(curr), []);
  //       }
  //       this.form.patchValue({key: null})
  //       this.form.get("key").markAsUntouched()
  //     }})
  // }

  onClickCreate() {
    this.dialogService.dformconfirm({
        label: 'Thêm mới cấu hình chung ACH',
        title: 'Lý do',
        description: 'Nhập lý do thêm mới cấu hình chung ACH',
        acceptBtn: 'Xác nhận',
        closeBtn: 'Đóng',
      },
      (result: {status: number, data: string}) => {
        if (result.status === DFORM_CONFIRM_STATUS.CANCELED) {
          return
        }
        else if (result && result.data.length > 2000) {
          this.toastService.showToastr('Lý do đã vượt quá 2000 kí tự!', 'Thông báo!', MessageSeverity.error, '');
          return
        }
        else if (result && result.status === DFORM_CONFIRM_STATUS.CONFIRMED) {
          this.form.patchValue({reason: result.data})
          this.handleCreate().subscribe({
            next: (res) => {
              this.goTo('/pmp_admin/transfer-channel/ach/general');
              this.toastService.showToastr("Thêm mới thành công", "Thông báo", MessageSeverity.success)
            },
            error: (err) => {
              const errMessage = ErrorUtils.getErrorMessage(err)
              this.toastService.showToastr(errMessage.join('\n'), "Thông báo", MessageSeverity.error)            }
          })
        }
      })
  }

  handleCreate() {
    const data = {
      ...this.form.value,
      functionCode: this.form.get("functionCode").value.toString().trim(),
      key: this.form.get("key").value.toString().trim(),
      value: this.form.get("value").value.toString().trim(),
      description: this.form.get("description").value.toString().trim(),
      isActive: this.form.get('isActive')?.value ? "Y" : "N"
    }
    this.indicator.showActivityIndicator()
    return this.generalConfigService.createCommonConfig(data).pipe(
      finalize(() => {
        this.indicator.hideActivityIndicator()
      }),
      takeUntil(this.ngUnsubscribe)
    )
  }

  onClickActionBtn($event?: any): void {
    switch ($event) {
      case TYPE_BTN_FOOTER.TYPE_CANCEL:
        this.goTo('pmp_admin/transfer-channel/ach/general')
        break;
      case TYPE_BTN_FOOTER.TYPE_SAVE:
        if(this.form.invalid) {
          this.form.markAllAsTouched()
        } else {
          this.onClickCreate()
        }
        break;
    }
  }
}
