import {Component, Injector} from '@angular/core';
import {ComponentAbstract, MessageSeverity, ToastService,} from '@shared-sm';
import {finalize, takeUntil} from 'rxjs/operators';
import {
  BUTTON_CANCEL,
  BUTTON_SAVE,
  DFORM_CONFIRM_STATUS,
  TOAST_DEFAULT_CONFIG,
  TYPE_BTN_FOOTER,
} from 'src/app/public/constants';
import ErrorUtils from '../../../../shared/utils/ErrorUtils';
import {IProvinceContent, IPutProvinceBody,} from '../modal/interface';
import {ModuleKeys} from 'src/app/public/module-permission.utils';
import {ProvinceService} from "../../service/ProvinceService";
import {CITY_CODE, CITY_NAME, DESCRIPTION, ACTIVE} from '../modal/constant';
import {trimFormValues} from "../modal/utils";

@Component({
  selector: 'edit-province-page',
  templateUrl: './edit-province.component.html',
  styleUrls: ['./edit-province.component.scss'],
})
export class EditProvinceComponent extends ComponentAbstract {
  $cityCode = CITY_CODE();
  $cityName = CITY_NAME();
  $description = DESCRIPTION();
  $active = ACTIVE();
  hasDataSource = false;

  provinceContent: IProvinceContent;

  constructor(
    protected injector: Injector,
    private provinceService: ProvinceService,
    private toastService: ToastService
  ) {
    super(injector);
  }

  protected componentInit(): void {
    this.enableActions(ModuleKeys.city);
    this.$cityCode.required = true;
    this.$cityCode.readOnly = true;
    this.$cityName.required = true;
    this.form = this.itemControl.toFormGroup([
      this.$cityCode,
      this.$cityName,
      this.$description,
      this.$active,
    ]);
    this.getDetailProvince();
    this.listButton = this.enableUpdate
    ? this.listButtonDynamic('', BUTTON_CANCEL, BUTTON_SAVE)
    : this.listButtonDynamic('', BUTTON_CANCEL);
  }

  getDetailProvince() {
    this.indicator.showActivityIndicator();
    this.provinceService
      .getDetail(this.queryParams.id)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        finalize(() => this.indicator.hideActivityIndicator())
      )
      .subscribe(
        (res) => {
          // Gọi API thành công và có data trả về
          if (res && res.status === 200) {
            this.provinceContent = res.data;
            this.form.patchValue({
              cityCode : res.data.cityCode ?? null,
              cityName: res.data.cityName ?? null,
              description: res.data.description ?? null,
              active: res.data.active ?? null,
            });
            this.hasDataSource = true;
          }
        },
        (error) => {
          console.log('ERROR', error);
          const errMessage = ErrorUtils.getErrorMessage(error);
          this.toastService.showToastr(
            errMessage.join('\n'),
            'Thông báo',
            MessageSeverity.error
          );
        }
      );
  }

  saveProvince() {
    this.dialogService.dformconfirm(
      {
        label: 'Chỉnh sửa tỉnh thành',
        title: 'Lý do',
        description: 'Nhập lý do chỉnh sửa tỉnh thành',
        acceptBtn: 'Xác nhận',
        closeBtn: 'Hủy',
        maxLength: 2000,
      },
      (result: any) => {
        if (result?.status === DFORM_CONFIRM_STATUS.CONFIRMED) {
          if (!result || result.data.length > 2000) {
            this.toastr.showToastr(
              'Lý do đã vượt quá 2000 kí tự!',
              'Thông báo!',
              MessageSeverity.error,
              ''
            );
            return;
          }

          const trimmedFormValue = trimFormValues(this.form.value);
          const trimmedReason = result.data.trim() || '';
          const body: IPutProvinceBody = {
            cityCode : trimmedFormValue.cityCode,
            cityName: trimmedFormValue.cityName,
            description: trimmedFormValue.description,
            active: trimmedFormValue.active,
            reason: trimmedReason,
          };
          this.indicator.showActivityIndicator();
          this.provinceService
            .update(this.queryParams.id, body)
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
                    'Cập nhật tỉnh thành thành công',
                    'Thông báo!',
                    MessageSeverity.success,
                    TOAST_DEFAULT_CONFIG
                  );
                  this.goTo('/pmp_admin/general-config/province');
                }
              },
              (error) => {
                console.log('ERROR', error);
                const errMessage = ErrorUtils.getErrorMessage(error);
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
          this.saveProvince();
        } else {
          this.form.markAllAsTouched();
        }
        break;
    }
  }
}
