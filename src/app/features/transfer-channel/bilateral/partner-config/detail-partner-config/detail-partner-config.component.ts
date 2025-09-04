
import { Component, Injector } from '@angular/core';
import { environment } from '@env/environment';
import { finalize, takeUntil } from 'rxjs/operators';
import { ComponentAbstract, MessageSeverity, TextAreaItem } from '@shared-sm';
import { FormGroup } from '@angular/forms';
import { PATH, PATH_BILATERAL, TOAST_DEFAULT_CONFIG } from 'src/app/public/constants';
import { ROLE } from '../../constants';
import { SWIFTCODE_TEXT_SEARCH, KEY_ID_TEXT } from '../../data-form';

export const VALUE_ID = () => new TextAreaItem({
  key: 'value',
  label: 'Value',
  placeholder: '',
  value: '',
  layout: '50',
  maxLength: 500
});

@Component({
  selector: 'app-detail-partner-config',
  templateUrl: './detail-partner-config.component.html',
  styleUrls: ['./detail-partner-config.component.scss']
})

export class DetailConfigComponent extends ComponentAbstract {

  saveDisabled = true;
  answerDisabled = true;
  isDisputeIncome = false;
  showSave = false;
  detail = null;

  get general() {
    return this.form.controls.general as FormGroup;
  }

  $swiftCode = SWIFTCODE_TEXT_SEARCH();
  $key = KEY_ID_TEXT();
  $value = VALUE_ID();

  constructor(protected injector: Injector) {
    super(injector);
    this.initRole(ROLE.BILATERAL_MAKER, ROLE.BILATERAL_APPROVER);
  }

  protected componentInit(): void {
    this.form.addControl('general', this.itemControl.toFormGroup([
      this.$swiftCode,
      this.$key, this.$value,
    ]));

    const dataView = this.convertDataOnView(this.queryParams.swiftCode, this.queryParams.key, this.queryParams.value);
    this.form.patchValue(dataView);
  }

  goBack() {
    this.goTo(environment.key + '/transfer-channel/bilateral/partner-config', {});
  }

  numberRegex = /^[0-9][0-9]?$|^100$/;

  saveDispute() {

    const values = this.form.get('general').value;
    console.log("values", values);

    if (this.queryParams.key === 'PERCENT' && !this.numberRegex.test(values.value)) {
      this.toastr.showToastr(
        `Value chỉ được nhập số và nhỏ hơn 100`,
        'Thông báo!',
        MessageSeverity.error,
        TOAST_DEFAULT_CONFIG
      );
      return;
    }
    if (this.queryParams.key === 'OFF_SERVICE') {
      if (values.value !== '0' && values.value !== '1') {
        this.toastr.showToastr(
          `Value chỉ được nhập 0 hoặc 1`,
          'Thông báo!',
          MessageSeverity.error,
          TOAST_DEFAULT_CONFIG
        );
        return;
      }
    }

    const options = {
      url: environment.urlBilateralBE,
      path: PATH_BILATERAL.PARTNER_CONFIG.EDIT,
      body: Object.assign({
        ...values,
        id: this.queryParams.id,
        swiftCode: this.queryParams.swiftCode,
        key: this.queryParams.key,
      },

        {})
    };

    this.indicator.showActivityIndicator();
    this.httpClient.post(options).pipe(
      takeUntil(this.ngUnsubscribe),
      finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe((res: any) => {
      console.log("RESPONSE", res)
      // Gọi API thành công và có data trả về
      if (res && res.status === 200 && res.error === "OK") {
        this.toastr.showToastr(
          `Cập nhật cấu hình thành công`,
          'Thông báo!',
          MessageSeverity.success,
          TOAST_DEFAULT_CONFIG
        );
        this.goBack()

      } else {
        this.toastr.showToastr(
          res.soaErrorDesc ? res.soaErrorDesc : 'Lỗi hệ thống.',
          'Thông báo!',
          MessageSeverity.error,
          TOAST_DEFAULT_CONFIG
        );
      }
    }, error => {
      this.indicator.hideActivityIndicator();
      console.log("ERROR", error)
      this.toastr.showToastr(
        error.error.soaErrorDesc ? error.error.soaErrorDesc : 'Lỗi hệ thống.',
        'Thông báo!',
        MessageSeverity.error,
        TOAST_DEFAULT_CONFIG
      );

    });
  }

  convertDataOnView(swiftCode, key, value) {

    this.showSave = true;
    this.form.get('general').get('swiftCode').disable();
    this.form.get('general').get('key').disable();
    this.form.get('general').get('value').enable();

    const objectDATA: any = {
      general: {
        swiftCode: swiftCode,
        key: key,
        value: value,
      }
    };
    console.log("objectdata", objectDATA);
    return objectDATA;
  }

}
