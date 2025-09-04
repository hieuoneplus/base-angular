import { Component, Injector, ViewChild } from '@angular/core';
import { finalize, takeUntil } from 'rxjs/operators';
import {
  ComponentAbstract,
  MessageSeverity,
  TextControlComponent,
} from '@shared-sm';
import { FormBuilder, Validators } from '@angular/forms';
import {
  BUTTON_CANCEL,
  TYPE_BTN_FOOTER,
  BUTTON_SAVE,
  TOAST_DEFAULT_CONFIG,
  DFORM_CONFIRM_STATUS,
} from 'src/app/public/constants';
import { SelectionModel } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { SpecialAccountService } from '../../service/SpecialAccountService';

import ErrorUtils from '../../../../shared/utils/ErrorUtils';
import { ModuleKeys } from '../../../../public/module-permission.utils';
import { IPutAliasBody, ISpecialAccountContent } from '../modal/interface';
import {
  ACCOUNT_NUMBER,
  ACCOUNT_TYPE,
  ACTIVE_SLIDE,
  CHANNEL,
  KEY,
  MAX_LIMIT,
  MIN_LIMIT,
  PARTNER_TYPE,
  PRIVATE_KEY,
  PROTOCOL,
  PUBLIC_KEY,
  STATUS_APPROVAL,
  URL_CALLBACK,
  URL_NAME,
} from '../modal/constant';

@Component({
  selector: 'edit-special-account-page',
  templateUrl: './edit-special-account.component.html',
  styleUrls: ['./edit-special-account.component.scss'],
})
export class EditSpecialAccountComponent extends ComponentAbstract {
  @ViewChild('minTransInput') minTransInput: TextControlComponent;
  @ViewChild('maxTransInput') maxTransInput: TextControlComponent;

  accDetail: ISpecialAccountContent;

  $accountNumber = ACCOUNT_NUMBER();
  $urlName = URL_NAME();
  $urlCallback = URL_CALLBACK();
  $accountType = ACCOUNT_TYPE();
  $protocol = PROTOCOL();
  $key = KEY();
  $privateKey = PRIVATE_KEY();
  $publicKey = PUBLIC_KEY();
  $partnerType = PARTNER_TYPE();
  $channel = CHANNEL();
  $minTrans = MIN_LIMIT();
  $maxTrans = MAX_LIMIT();
  $activeSlide = ACTIVE_SLIDE();

  groupList: any = [];
  checked: boolean = false;
  isChecked: boolean = false;
  isChecker: boolean = false;
  isRetryConfirm = false;

  hasDataSource = false;
  selection = new SelectionModel<any>(true, []);
  selectionObs = new BehaviorSubject<any>('');
  pageEvent: PageEvent = new PageEvent();
  groupListDataSource = new MatTableDataSource<any>([]);

  constructor(
    protected injector: Injector,
    private fb: FormBuilder,
    private specialAccountService: SpecialAccountService
  ) {
    super(injector);
  }

  protected componentInit(): void {
    this.enableActions(ModuleKeys.alias_account);
    this.trackOutput();
    this.form = this.itemControl.toFormGroup([
      this.$accountNumber,
      this.$key,
      this.$channel,
      this.$urlName,
      this.$urlCallback,
      this.$accountType,
      this.$protocol,
      this.$privateKey,
      this.$publicKey,
      this.$partnerType,
      this.$minTrans,
      this.$maxTrans,
      this.$activeSlide,
    ]);
    this.form
    .get('partnerType')
    ?.valueChanges.pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next: (value) => {
        const partnerAccountCtrl = this.form.get('partnerAccount');
        const urlNameCtrl = this.form.get('getNameUrl');
        const urlCallbackCtrl = this.form.get('confirmUrl');
        const protocolCtrl = this.form.get('protocol');

        const isNormal = value === 'NORMAL_PARTNER';

        if (partnerAccountCtrl) {
          this.$accountNumber.required = isNormal;
          partnerAccountCtrl.setValidators(
            isNormal ? Validators.required : null
          );
          partnerAccountCtrl.updateValueAndValidity();
        }

        if (urlNameCtrl) {
          this.$urlName.required = isNormal;
          urlNameCtrl.setValidators(isNormal ? Validators.required : null);
          urlNameCtrl.updateValueAndValidity();
        }

        if (urlCallbackCtrl) {
          this.$urlCallback.required = isNormal;
          urlCallbackCtrl.setValidators(
            isNormal ? Validators.required : null
          );
          urlCallbackCtrl.updateValueAndValidity();
        }

        if (protocolCtrl) {
          this.$protocol.required = isNormal;
          protocolCtrl.setValidators(isNormal ? Validators.required : null);
          protocolCtrl.updateValueAndValidity();
        }
      },
    });
    if (
      history.state.status === STATUS_APPROVAL.REJECTED ||
      history.state.status === STATUS_APPROVAL.APPROVED
    ) {
      this.listButton = this.enableUpdate
        ? this.listButtonDynamic('', BUTTON_CANCEL, BUTTON_SAVE)
        : this.listButtonDynamic('', BUTTON_CANCEL);
      this.getDetailAlias();
    } else {
      this.goTo('/pmp_admin/general-config/special-account');
    }
  }

  trackOutput() {
    this.$accountType.readOnly = true;
    this.$key.required = true;
    this.$accountType.required = true;
    this.$partnerType.required = true;
    this.$key.value = '';
    this.$urlName.value = '';
    this.$urlCallback.value = '';
    this.$protocol.value = '';
    this.$publicKey.value = '';
    this.$privateKey.value = '';
  }

  getDetailAlias() {
    this.indicator.showActivityIndicator();

    this.specialAccountService
      .getAliasDetail(this.queryParams.id)
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
            this.form.patchValue({
              name: res.data.name ? res.data.name.trim() : '',
              activeSlide: res.data.active,
              partnerType: res.data.partnerType
                ? res.data.partnerType.trim()
                : '',
              partnerAccount: res.data.partnerAccount
                ? res.data.partnerAccount.trim()
                : '',
              getNameUrl: res.data.getNameUrl ? res.data.getNameUrl.trim() : '',
              confirmUrl: res.data.confirmUrl ? res.data.confirmUrl.trim() : '',
              protocol: res.data.protocol ? res.data.protocol.trim() : '',
              channel: res.data.channel ? res.data.channel.trim() : '',
              regex: res.data.regex ? res.data.regex.trim() : '',
              minTransLimit: res.data.minTransLimit,
              maxTransLimit: res.data.maxTransLimit,
              partnerPublicKey: res.data.partnerPublicKey
                ? res.data.partnerPublicKey.trim()
                : '',
              mbPrivateKey: res.data.mbPrivateKey
                ? res.data.mbPrivateKey.trim()
                : '',
            });
            this.minTransInput.inputElement.nativeElement.value =
              this.convertMoney(res.data.minTransLimit);
            this.maxTransInput.inputElement.nativeElement.value =
              this.convertMoney(res.data.maxTransLimit);
            this.hasDataSource = true;
            this.isRetryConfirm = res.data.isRetryConfirm ?? false;
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

  saveAccount() {
    if (this.form.valid) {
      const formValue = this.form.value;
      for (const key in formValue) {
        if (formValue[key] === '') {
          formValue[key] = null;
        }
      }

      this.dialogService.dformconfirm(
        {
          label: 'Gửi duyệt',
          title: 'Lý do',
          description: 'Nhập lý do chỉnh sửa tài khoản đặc biệt',
          acceptBtn: 'Xác nhận',
          closeBtn: 'Hủy',
          warning:
            'Nội dung thay đổi này sẽ không thể khôi phục. Vui lòng kiểm tra nội dung trước khi gửi duyệt.',
        },
        (result: any) => {
          if (result && result.status === DFORM_CONFIRM_STATUS.CONFIRMED) {
            const values = this.form.value;
            const body: IPutAliasBody = {
              reason: result.data,
              active: values.activeSlide,
              partnerType: values.partnerType,
              partnerAccount: values.partnerAccount,
              getNameUrl: values.getNameUrl,
              confirmUrl: values.confirmUrl,
              protocol: values.protocol,
              channel: values.channel,
              regex: values.regex,
              minTransLimit: values.minTransLimit,
              maxTransLimit: values.maxTransLimit,
              partnerPublicKey: values.partnerPublicKey,
              mbPrivateKey: values.mbPrivateKey,
              isRetryConfirm: this.isRetryConfirm,
            };
            this.indicator.showActivityIndicator();
            this.specialAccountService
              .putAlias(body, this.queryParams.id)
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
                    this.goTo('/pmp_admin/general-config/special-account');
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
        this.goTo('/pmp_admin/general-config/special-account');
        break;
      case TYPE_BTN_FOOTER.TYPE_SAVE:
        if (this.form.valid) {
          this.saveAccount();
        } else {
          this.form.markAllAsTouched();
        }
        break;
    }
  }

  onInputChange(event: any, controlName: string): void {
    let inputValue = event.target.value;

    inputValue = inputValue.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (controlName === this.$partnerType.key) {
      inputValue = inputValue.replace(/[^a-zA-Z0-9_-]/g, '').toUpperCase();
    } else {
      inputValue = inputValue.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    }
    const control = this.form.get(controlName);
    if (control) {
      control.setValue(inputValue);
    }
    event.target.value = inputValue;
  }
  upperCase(event: any, controlName: string) {
    let inputValue = event.target.value;
    inputValue = inputValue.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    inputValue = inputValue.replace(/[^a-zA-Z0-9_-]/g, '').toUpperCase();
    const control = this.form.get(controlName);
    if (control) {
      control.setValue(inputValue);
    }
    event.target.value = inputValue;
  }

  trimInput(event: any, controlName: string): void {
    let inputValue = event.target.value;
    const trimmedValue = inputValue.trim();

    event.target.value = trimmedValue;
    const control = this.form.get(controlName);
    if (control) {
      control.setValue(trimmedValue);
    }
  }

  validateMoney(event: any, controlName: string): void {
    const inputElement = event.target as HTMLInputElement;
    let value = inputElement.value;

    value = value.replace(/[^0-9]/g, '');

    // Nếu có số 0 ở đầu, loại bỏ nó (chỉ giữ lại một số 0 nếu là số 0 duy nhất)
    if (value.startsWith('0') && value.length > 1) {
      if (value[1] === '0') {
        value = value.replace(/^0+/, '0');
      } else {
        value = value.replace(/^0+/, '');
      }
    }
    const control = this.form.get(controlName);
    if (control) {
      control.setValue(value);
    }
    value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    inputElement.value = value;
  }
  convertMoney(money: number) {
    return money !== null
      ? money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      : null;
  }

  toggleIsRetryConfirm(event: Event) {
    const input = event.target as HTMLInputElement;
    this.isRetryConfirm = input.checked;
  }
}
