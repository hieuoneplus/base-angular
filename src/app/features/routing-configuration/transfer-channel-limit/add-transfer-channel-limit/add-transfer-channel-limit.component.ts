import { Component, Injector, ViewChild } from '@angular/core';
import {
  ComponentAbstract,
  MessageSeverity,
  TextControlComponent,
  ToastService,
} from '@shared-sm';
import { finalize, takeUntil } from 'rxjs/operators';

import { SelectionModel } from '@angular/cdk/collections';
import { FormBuilder, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject } from 'rxjs';
import {
  BUTTON_CANCEL,
  BUTTON_SAVE,
  DFORM_CONFIRM_STATUS,
  TOAST_DEFAULT_CONFIG,
  TYPE_BTN_FOOTER,
} from 'src/app/public/constants';
import { displayedColumns } from 'src/app/public/constants-user';
import ErrorUtils from 'src/app/shared/utils/ErrorUtils';
import { TransferChannelLimitService } from '../../service/TransferChannelLimitService';
import {
  ACTIVE_SLIDE,
  CHANNEL,
  CURRENCY,
  EXPAND_CHANNELS,
  FRAGMENT_AMOUNT,
  FRAGMENT_MAX_AMOUNT,
  MAX_AMOUNT,
  MIN_AMOUNT,
} from '../modal/constant';
import { IPostTransferChannelLimitBody } from '../modal/interface';
import { logicValidator } from '../validator';
import { ModuleKeys } from 'src/app/public/module-permission.utils';

@Component({
  selector: 'add-transfer-channel-limit',
  templateUrl: './add-transfer-channel-limit.component.html',
  styleUrls: ['./add-transfer-channel-limit.component.scss'],
})
export class AddTransferChannelLimitComponent extends ComponentAbstract {
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
  $active = ACTIVE_SLIDE();

  displayedColumnsArr = displayedColumns;
  groupList: any = [];
  checked: boolean = false;
  isChecked: boolean = false;
  isChecker: boolean = false;
  validInputMap: Map<string, boolean> = new Map();
  hasDataSource = false;
  selection = new SelectionModel<any>(true, []);
  selectionObs = new BehaviorSubject<any>('');
  pageEvent: PageEvent = new PageEvent();
  groupListDataSource = new MatTableDataSource<any>([]);
  isExpanded: boolean = false;

  private _formatted = false;
  showTooltipFragmentMaxAmount: boolean = false;
  showTooltipFragmentAmount: boolean = false;
  showTooltipMaxAmount: boolean = false;
  showTooltipMinAmount: boolean = false;
  showExpandCheckbox: boolean = false;

  constructor(
    protected injector: Injector,
    private fb: FormBuilder,
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
    this.form
      .get('transferChannel')
      ?.valueChanges.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((value: string) => {
        this.showExpandCheckbox = EXPAND_CHANNELS.includes(value);
        if (!this.showExpandCheckbox) {
          this.isExpanded = false;
          this.trackFragmentAmount();
        }

        this.form.setValidators(logicValidator(this.isExpanded));
      });

      this.listButton = this.enableInsert
      ? this.listButtonDynamic('', BUTTON_CANCEL, BUTTON_SAVE)
      : this.listButtonDynamic('', BUTTON_CANCEL);
  }

  ngAfterViewChecked() {
    if (this.isExpanded && this.fragmentMaxAmount && !this._formatted) {
      this.minAmount.inputElement.nativeElement.value = this.convertMoney(
        this.form.get('minAmount')?.value
      );
      this.maxAmount.inputElement.nativeElement.value = this.convertMoney(
        this.form.get('maxAmount')?.value
      );
      this.fragmentMaxAmount.inputElement.nativeElement.value =
        this.convertMoney(this.form.get('fragmentMaxAmount')?.value);
      this.fragmentAmount.inputElement.nativeElement.value = this.convertMoney(
        this.form.get('fragmentAmount')?.value
      );
      this._formatted = true;
    }
  }

  trackAmount() {
    this.$maxAmount.required = true;
    this.$minAmount.required = true;
    this.$channel.required = true;
    this.$currency.required = true;
    this.$currency.readOnly = true;
    this.$fragmentAmount.required = false;
    this.$fragmentMaxAmount.required = false;
  }

  toggleExpand(event: Event) {
    this.isExpanded = (event.target as HTMLInputElement).checked;
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
      amountCtrl.setValue(null);
      maxAmountCtrl.setValue(null);
    }

    amountCtrl.updateValueAndValidity();
    maxAmountCtrl.updateValueAndValidity();
  }

  modalAdd() {
    this.dialogService.dformconfirm(
      {
        label: 'Thêm mới cấu hình',
        title: 'Lý do',
        description: 'Nhập lý do thêm mới cấu hình',
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
          const values = this.form.value;
          const body: IPostTransferChannelLimitBody = {
            transferChannel: values.transferChannel,
            minAmount: values.minAmount,
            maxAmount: values.maxAmount,
            currency: values.currency,
            fragmentAmount: this.isExpanded ? values.fragmentAmount : null,
            fragmentMaxAmount: this.isExpanded
              ? values.fragmentMaxAmount
              : null,
            active: values.activeSlide,
            reason: result.data || '',
          };
          this.indicator.showActivityIndicator();
          this.transferChannelLimitService
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
                    'Thêm mới cấu hình thành công',
                    'Thông báo!',
                    MessageSeverity.success,
                    TOAST_DEFAULT_CONFIG
                  );
                  this.goTo('/pmp_admin/routing/transfer-channel-limit');
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
        this.goTo('/pmp_admin/routing/transfer-channel-limit');
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
