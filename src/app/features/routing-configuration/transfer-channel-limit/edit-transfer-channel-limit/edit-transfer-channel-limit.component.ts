import { Component, Injector, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import {
  ComponentAbstract,
  MessageSeverity,
  TextControlComponent,
  ToastService,
} from '@shared-sm';
import { finalize, takeUntil } from 'rxjs/operators';
import {
  BUTTON_CANCEL,
  BUTTON_SAVE,
  DFORM_CONFIRM_STATUS,
  TOAST_DEFAULT_CONFIG,
  TYPE_BTN_FOOTER,
} from 'src/app/public/constants';
import ErrorUtils from '../../../../shared/utils/ErrorUtils';
import { logicValidator } from '../validator';

import { TransferChannelLimitService } from '../../service/TransferChannelLimitService';
import {
  CHANNEL,
  CURRENCY,
  EXPAND_CHANNELS,
  FRAGMENT_AMOUNT,
  FRAGMENT_MAX_AMOUNT,
  MAX_AMOUNT,
  MIN_AMOUNT,
  STATUS,
} from '../modal/constant';
import {
  IPutTransferChannelLimitBody,
  ITransferChannelLimitContent,
} from '../modal/interface';
import { ModuleKeys } from 'src/app/public/module-permission.utils';

@Component({
  selector: 'edit-transfer-channel-limit-page',
  templateUrl: './edit-transfer-channel-limit.component.html',
  styleUrls: ['./edit-transfer-channel-limit.component.scss'],
})
export class EditTransferChannelLimitComponent extends ComponentAbstract {
  @ViewChild('minAmount') minAmount: TextControlComponent;
  @ViewChild('maxAmount') maxAmount: TextControlComponent;
  @ViewChild('fragmentMaxAmount') fragmentMaxAmount: TextControlComponent;
  @ViewChild('fragmentAmount') fragmentAmount: TextControlComponent;
  $channel = CHANNEL();
  $fragmentAmount = FRAGMENT_AMOUNT();
  $fragmentMaxAmount = FRAGMENT_MAX_AMOUNT();
  $minAmount = MIN_AMOUNT();
  $maxAmount = MAX_AMOUNT();
  $currency = CURRENCY();
  $active = STATUS();

  checked: boolean = false;
  isChecked: boolean = false;
  isChecker: boolean = false;
  validInputMap: Map<string, boolean> = new Map();
  hasDataSource = false;
  pageEvent: PageEvent = new PageEvent();
  isExpanded: boolean = false;

  transferChannelLimit: ITransferChannelLimitContent;
  showTooltipFragmentMaxAmount: boolean = false;
  showTooltipFragmentAmount: boolean = false;
  showTooltipMaxAmount: boolean = false;
  showTooltipMinAmount: boolean = false;
  showExpandCheckbox: boolean = false;

  constructor(
    protected injector: Injector,
    private transferChannelLimitService: TransferChannelLimitService,
    private toastService: ToastService
  ) {
    super(injector);
  }

  protected componentInit(): void {
    this.enableActions(ModuleKeys.routing_channel_limit);
    this.trackAmount();
    this.form = this.itemControl.toFormGroup([
      this.$minAmount,
      this.$channel,
      this.$maxAmount,
      this.$currency,
      this.$fragmentMaxAmount,
      this.$fragmentAmount,
      this.$active,
    ]);
    this.getDetailTransferChannelLimit();
    this.form.setValidators(logicValidator(this.isExpanded));
    this.listButton = this.enableUpdate
    ? this.listButtonDynamic('', BUTTON_CANCEL, BUTTON_SAVE)
    : this.listButtonDynamic('', BUTTON_CANCEL);
  }

  trackAmount() {
    this.$maxAmount.required = true;
    this.$minAmount.required = true;
    this.$channel.required = true;
    this.$channel.readOnly = true;
    this.$currency.required = true;
    this.$currency.readOnly = true;
  }

  toggleExpand(event: Event) {
    this.isExpanded = (event.target as HTMLInputElement).checked;
    if (!this.isExpanded) {
      this.form.patchValue({
        fragmentAmount: null,
        fragmentMaxAmount: null,
      });
    }
    this.trackFragmentAmount();
    this.form.setValidators(logicValidator(this.isExpanded));
  }

  trackFragmentAmount() {
    const amountCtrl = this.f['fragmentAmount'];
    const maxAmountCtrl = this.f['fragmentMaxAmount'];
    if (this.isExpanded) {
      this.$fragmentAmount.required = true;
      this.$fragmentMaxAmount.required = true;
      amountCtrl.setValidators([Validators.required]);
      maxAmountCtrl.setValidators([Validators.required]);
    } else {
      amountCtrl.clearValidators();
      maxAmountCtrl.clearValidators();
    }

    amountCtrl.updateValueAndValidity();
    maxAmountCtrl.updateValueAndValidity();
  }

  getDetailTransferChannelLimit() {
    this.indicator.showActivityIndicator();
    this.transferChannelLimitService
      .getDetail(this.queryParams.id)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        finalize(() => this.indicator.hideActivityIndicator())
      )
      .subscribe(
        (res) => {
          // Gọi API thành công và có data trả về
          if (res && res.status === 200) {
            this.transferChannelLimit = res.data;
            this.form.patchValue({
              transferChannel: res.data.transferChannel ?? null,
              minAmount: res.data.minAmount ?? null,
              maxAmount: res.data.maxAmount ?? null,
              fragmentMaxAmount: res.data.fragmentMaxAmount ?? null,
              fragmentAmount: res.data.fragmentAmount ?? null,
              active: res.data.active ?? null,
            });
            this.isExpanded =
              res.data.fragmentMaxAmount !== null &&
              res.data.fragmentAmount !== null;
              this.showExpandCheckbox = EXPAND_CHANNELS.includes(res.data.transferChannel);
              this.trackFragmentAmount()
              this.form.setValidators(logicValidator(this.isExpanded));
            this.minAmount.inputElement.nativeElement.value = this.convertMoney(
              res.data.minAmount
            );
            this.maxAmount.inputElement.nativeElement.value = this.convertMoney(
              res.data.maxAmount
            );
            setTimeout(() => {
              if (this.isExpanded) {
                this.fragmentAmount.inputElement.nativeElement.value =
                  this.convertMoney(res.data.fragmentAmount);
                this.fragmentMaxAmount.inputElement.nativeElement.value =
                  this.convertMoney(res.data.fragmentMaxAmount);
              }
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

  saveTransferChannelLimit() {
    this.dialogService.dformconfirm(
      {
        label: 'Chỉnh sửa cấu hình',
        title: 'Lý do',
        description: 'Nhập lý do chỉnh sửa cấu hình',
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

          const values = this.form.value;
          const body: IPutTransferChannelLimitBody = {
            minAmount: values.minAmount !== null ? +values.minAmount : null,
            maxAmount: values.maxAmount !== null ? +values.maxAmount : null,
            fragmentAmount:
              values.fragmentAmount !== null ? +values.fragmentAmount : null,
            fragmentMaxAmount:
              values.fragmentMaxAmount !== null
                ? +values.fragmentMaxAmount
                : null,
            active: values.active,
            reason: result.data,
          };
          this.indicator.showActivityIndicator();
          this.transferChannelLimitService
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
                    'Cập nhật cấu hình thành công',
                    'Thông báo!',
                    MessageSeverity.success,
                    TOAST_DEFAULT_CONFIG
                  );
                  this.goTo('/pmp_admin/routing/transfer-channel-limit');
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
        this.goTo('/pmp_admin/routing/transfer-channel-limit');
        break;
      case TYPE_BTN_FOOTER.TYPE_SAVE:
        if (this.form.valid) {
          this.saveTransferChannelLimit();
        } else {
          this.form.markAllAsTouched();
        }
        break;
    }
  }

  validateMoney(event: any, controlName: string): void {
    const inputElement = event.target as HTMLInputElement;
    let value = inputElement.value;

    value = value.replace(/[^0-9]/g, '');

    if (value.startsWith('0') && value.length > 0) {
      value = value.replace(/^0+/, '');
    }
    const control = this.form.get(controlName);
    if (control) {
      control.setValue(value);
    }
    value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    inputElement.value = value;
    // BUTTON_SAVE.disable = !this.form.valid;
  }
  convertMoney(money: number) {
    return money !== null
      ? money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      : null;
  }
}
