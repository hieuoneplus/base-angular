
import { Component, Injector } from '@angular/core';
import { finalize, takeUntil } from 'rxjs/operators';
import {ComponentAbstract, MessageSeverity, ToastService} from '@shared-sm';
import {BUTTON_CANCEL, TYPE_BTN_FOOTER, BUTTON_SAVE, DFORM_CONFIRM_STATUS} from 'src/app/public/constants';
import {DESCRIPTION_EDIT, FUNCTION_CODE, IS_ACTIVE_SLIDE, KEY, REASON, VALUE_GET} from "../constant";
import {GeneralConfigService} from "../services/general-config.service";
import {ICommonConfig} from "../../../../model/ach";
import ErrorUtils from "../../../../../shared/utils/ErrorUtils";
import { ModuleKeys } from "../../../../../public/module-permission.utils";

@Component({
  selector: 'edit-tktg-ach-page',
  templateUrl: './edit-general-ach.component.html',
  styleUrls: ['./edit-general-ach.component.scss']
})
// Màn hình chỉnh sửa tài khoản trung gian ach
export class EditGeneralAchComponent extends ComponentAbstract {
  accDetail: ICommonConfig

  $functionCode = FUNCTION_CODE();
  $key = KEY();
  $value = VALUE_GET();
  $description = DESCRIPTION_EDIT()
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
    this.$functionCode.readOnly = true
    this.$key.readOnly = true
    this.handleGetAccDetail()
    // this.handleKeyBasedOnFunctionCode()
    this.listButton = this.enableUpdate ? this.listButtonDynamic('', BUTTON_CANCEL, BUTTON_SAVE) : this.listButtonDynamic('', BUTTON_CANCEL);
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

  handleGetAccDetail() {
    this.indicator.showActivityIndicator()
    this.generalConfigService.getDetailCommonConfig(this.queryParams.fc, this.queryParams?.k).pipe(
      finalize(() => {
        this.indicator.hideActivityIndicator()
      }),
      takeUntil(this.ngUnsubscribe)
    )
      .subscribe({
        next: (res) => {
          this.accDetail = res.data
          const arr = [
            'functionCode', 'key', 'value', 'description', 'isActive',
          ]
          arr.forEach((key) => {
            if (key === "isActive") {
              this.form.patchValue({ [key]: res.data[key] === "Y" })
            } else {
              this.form.patchValue({ [key]: res.data[key] })
            }
          })
        },
        error: (err) => {
          const errMessage = ErrorUtils.getErrorMessage(err)
          this.toastService.showToastr(errMessage.join('\n'), "Thông báo", MessageSeverity.error)
        }
      })
  }

  onClickUpdate() {
    this.dialogService.dformconfirm({
      label: 'Chỉnh sửa cấu hình chung ACH',
      title: 'Lý do',
      description: 'Nhập lý do chỉnh sửa cấu hình chung ACH',
      acceptBtn: 'Xác nhận',
      closeBtn: 'Đóng',
    },
      (result: { status: number, data: string }) => {
        if (result.status === 0) {
          return
        }
        else if (result && result.data.length > 2000) {
          this.toastService.showToastr('Lý do đã vượt quá 2000 kí tự!', 'Thông báo!', MessageSeverity.error, '');
          return
        }
        else if (result && result.status === DFORM_CONFIRM_STATUS.CONFIRMED) {
          this.form.patchValue({ reason: result.data })
          this.handleUpdate().subscribe({
            next: (res) => {
              this.goTo('/pmp_admin/transfer-channel/ach/general');
              this.toastService.showToastr("Cập nhật thành công", "Thông báo", MessageSeverity.success)
            },
            error: (err) => {
              const errMessage = ErrorUtils.getErrorMessage(err)
              this.toastService.showToastr(errMessage.join('\n'), "Thông báo", MessageSeverity.error)
            }
          })
        }
      })
  }

  handleUpdate() {
    const data = {
      ...this.form.value,
      functionCode: this.form.get("functionCode").value.toString().trim(),
      key: this.form.get("key").value.toString().trim(),
      value: this.form.get("value").value ? this.form.get("value").value.toString().trim() : null,
      description: this.form.get("description").value ? this.form.get("description").value.toString().trim() : null,
      isActive: this.form.get('isActive')?.value ? "Y" : "N"
    }
    this.indicator.showActivityIndicator()
    return this.generalConfigService.updateCommonConfig(data).pipe(
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
        if (this.form.invalid) {
          this.form.markAllAsTouched()
        } else {
          this.onClickUpdate()
        }
        break;
    }
  }
}
