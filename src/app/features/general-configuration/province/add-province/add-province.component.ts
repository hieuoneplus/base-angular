import {Component, Injector} from '@angular/core';
import {ComponentAbstract, MessageSeverity, ToastService,} from '@shared-sm';
import {finalize, takeUntil} from 'rxjs/operators';

import {FormBuilder} from '@angular/forms';
import {PageEvent} from '@angular/material/paginator';

import {
  BUTTON_ADD,
  BUTTON_CANCEL,
  DFORM_CONFIRM_STATUS,
  TOAST_DEFAULT_CONFIG,
  TYPE_BTN_FOOTER,
} from 'src/app/public/constants';
import ErrorUtils from 'src/app/shared/utils/ErrorUtils';
import {ACTIVE, CITY_CODE, CITY_NAME, DESCRIPTION} from '../modal/constant';
import {IPostProvinceBody} from '../modal/interface';
import {ModuleKeys} from 'src/app/public/module-permission.utils';
import {ProvinceService} from "../../service/ProvinceService";
import {trimFormValues} from "../modal/utils";

@Component({
  selector: 'add-async',
  templateUrl: './add-province.component.html',
  styleUrls: ['./add-province.component.scss'],
})
export class AddProvinceComponent extends ComponentAbstract {
  $cityCode = CITY_CODE();
  $cityName = CITY_NAME();
  $description = DESCRIPTION();
  $status = ACTIVE();

  hasDataSource = false;
  pageEvent: PageEvent = new PageEvent();

  constructor(
    protected injector: Injector,
    private fb: FormBuilder,
    private provinceService: ProvinceService,
    private toastService: ToastService
  ) {
    super(injector);
  }

  protected componentInit(): void {
    this.enableActions(ModuleKeys.city);
    this.$cityCode.required = true;
    this.$cityName.required = true;
    this.form = this.itemControl.toFormGroup([
      this.$cityCode,
      this.$cityName,
      this.$description,
      this.$status,
    ]);
      this.listButton = this.enableInsert
      ? this.listButtonDynamic('', BUTTON_CANCEL, BUTTON_ADD)
      : this.listButtonDynamic('', BUTTON_CANCEL);
  }

  modalAdd() {
    this.dialogService.dformconfirm(
      {
        label: 'Thêm mới tỉnh thành',
        title: 'Lý do',
        description: 'Nhập lý do thêm mới tỉnh thành',
        acceptBtn: 'Xác nhận',
        closeBtn: 'Hủy',
        maxLength: 2000,
      },
      (result: any) => {
        if (
          result.status === DFORM_CONFIRM_STATUS.CONFIRMED &&
          result.data.length > 2000
        ) {
          this.toastr.showToastr(
            'Lý do đã vượt quá 2000 kí tự!',
            'Thông báo!',
            MessageSeverity.error,
            ''
          );
        } else if (result.status === DFORM_CONFIRM_STATUS.CONFIRMED) {
          const trimmedFormValue = trimFormValues(this.form.value);
          const trimmedReason = result.data.trim() || '';
          const body: IPostProvinceBody = {
            cityCode : trimmedFormValue.cityCode,
            cityName: trimmedFormValue.cityName,
            description: trimmedFormValue.description,
            active: true,
            reason: trimmedReason,
          };
          this.indicator.showActivityIndicator();
          this.provinceService
            .create(body)
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
                    'Thêm mới tỉnh thành thành công',
                    'Thông báo!',
                    MessageSeverity.success,
                    TOAST_DEFAULT_CONFIG
                  );
                  this.goTo('/pmp_admin/general-config/province');
                }
              },
              (error) => {
                console.log('ERROR', error);
                const errMessage = ErrorUtils.getErrorMessage(error)
                this.toastService.showToastr(
                  errMessage.join('\n'),
                  'Thông báo',
                  MessageSeverity.error
                );
              }
            );
        }
      }
    );
  }

  onClickBtn($event?: any): void {
    switch ($event) {
      case TYPE_BTN_FOOTER.TYPE_CANCEL:
        this.goTo('/pmp_admin/general-config/province');
        break;
      case TYPE_BTN_FOOTER.TYPE_SAVE:
        if (this.form.valid) {
          this.modalAdd();
        } else {
          this.form.markAllAsTouched();
        }
        break;
    }
  }

  onInputChange(event: any, controlName: string): void {
    let inputValue = event.target.value;
    inputValue = inputValue.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    inputValue = inputValue.replace(/[^0-9]/g, '');

    const control = this.form.get(controlName);
    if (control) {
      control.setValue(inputValue);
    }
    event.target.value = inputValue;
  }
}
