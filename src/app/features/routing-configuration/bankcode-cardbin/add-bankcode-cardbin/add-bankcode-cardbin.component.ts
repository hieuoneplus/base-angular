import { Component, Injector } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ComponentAbstract, MessageSeverity } from '@shared-sm';
import { finalize, takeUntil } from 'rxjs/operators';
import {
  BUTTON_ADD,
  BUTTON_CANCEL,
  DFORM_CONFIRM_STATUS,
  TOAST_DEFAULT_CONFIG,
  TYPE_BTN_FOOTER,
} from 'src/app/public/constants';
import { ModuleKeys } from '../../../../public/module-permission.utils';
import ErrorUtils from '../../../../shared/utils/ErrorUtils';
import { BankService } from '../../../general-configuration/service/BankService';
import {
  BANK_CODE,
  CARD_BIN,
  displayedColumnsBCAdd,
  TRANSFER_CHANNEL_ADD,
} from '../modal/constant';
import {
  IAddTransferChannelModel,
  IRequestPostBankCodeCardBin,
} from '../modal/interface';
import { RoutingBankCodeCardbinService } from '../../service/RoutingBankCodeCardbinService';

@Component({
  selector: 'add-bankcode-cardbin-page',
  templateUrl: './add-bankcode-cardbin.component.html',
  styleUrls: ['./add-bankcode-cardbin.component.scss'],
})
export class AddBankCodeCardBinComponent extends ComponentAbstract {
  $bankCode = BANK_CODE();
  $cardBin = CARD_BIN();
  $transferChannel = TRANSFER_CHANNEL_ADD();

  hasDataSource = false;
  pageEvent: PageEvent = new PageEvent();
  groupListDataSource = new MatTableDataSource<any>([]);

  displayedColumnsArr = displayedColumnsBCAdd;
  tableRecord: IAddTransferChannelModel[];

  constructor(
    protected injector: Injector,
    private bankCodeCardbinService: RoutingBankCodeCardbinService,
    private bankService: BankService
  ) {
    super(injector);
  }

  protected componentInit(): void {
    this.enableActions(ModuleKeys.routing_transfer_channel_bank_config);
    this.$transferChannel.type = 'multiple';
    this.$transferChannel.required = true;
    this.form = this.itemControl.toFormGroup([
      this.$bankCode,
      this.$cardBin,
      this.$transferChannel,
    ]);
    this.getBankName();
    this.listButton = this.enableInsert
      ? this.listButtonDynamic('', BUTTON_CANCEL, BUTTON_ADD)
      : this.listButtonDynamic('', BUTTON_CANCEL);
  }

  modalAddAccount() {
    if (!this.tableRecord || this.tableRecord.length === 0) {
      this.toastr.showToastr(
        'Vui lòng chọn kênh thực hiện thanh toán',
        'Thông báo!',
        MessageSeverity.error,
        TOAST_DEFAULT_CONFIG
      );
      return;
    }
    if (this.form.get('bankCode').valid && this.tableRecord && this.tableRecord.length >0) {
      this.dialogService.dformconfirm(
        {
          label: 'Thêm mới cấu hình',
          title: 'Lý do',
          description: 'Nhập lý do thêm mới cấu hình',
          acceptBtn: 'Xác nhận',
          closeBtn: 'Hủy',
        },
        (result: any) => {
          if (result && result.status === DFORM_CONFIRM_STATUS.CONFIRMED) {
            const values = this.form.value;
            const body: IRequestPostBankCodeCardBin = {
              cardBin: values.cardBin,
              bankCode: values.bankCode,
              transferChannels: this.tableRecord,
              reason: result.data,
            };
            this.indicator.showActivityIndicator();
            this.bankCodeCardbinService
              .postBankCode(body)
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
                      'Thêm cấu hình thành công',
                      'Thông báo!',
                      MessageSeverity.success,
                      TOAST_DEFAULT_CONFIG
                    );
                    this.goTo('/pmp_admin/routing/bankcode-cardbin');
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

  getBankName() {
    const params = {
      page: 0,
      size: 1000,
    };
    this.indicator.showActivityIndicator();
    this.bankService
      .getBanks(params)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        finalize(() => this.indicator.hideActivityIndicator())
      )
      .subscribe(
        (res) => {
          console.log('RESPONSE', res);
          if (res && res.status === 200) {
            if (res.data.content.length > 0) {
              this.$bankCode.options = res.data.content.map((bank) => {
                return {
                  key: bank.bankCode,
                  value: bank.bankCode + ' - ' + bank.fullName,
                };
              });
            }
          } else {
            console.log('ERROR', res);
            this.hasDataSource = false;
            this.totalItem = 0;
            this.toastr.showToastr(
              res.soaErrorDesc ? res.soaErrorDesc : 'Lỗi hệ thống.',
              'Thông báo!',
              MessageSeverity.error,
              TOAST_DEFAULT_CONFIG
            );
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

  onClickBtn($event?: any): void {
    switch ($event) {
      case TYPE_BTN_FOOTER.TYPE_CANCEL:
        this.goTo('/pmp_admin/routing/bankcode-cardbin');
        break;
      case TYPE_BTN_FOOTER.TYPE_SAVE:
        if (this.form.get('bankCode').valid && this.tableRecord && this.tableRecord.length > 0) {
          let arr = [];
          this.tableRecord.forEach((item, index) => {
            arr.push(item.transferChannel);
          })
          this.form.patchValue({transferChannel: arr});
          this.modalAddAccount();
        } else {
          this.form.markAllAsTouched();
          if (!this.tableRecord || this.tableRecord.length === 0) {
            this.toastr.showToastr(
                'Vui lòng chọn kênh thực hiện thanh toán',
                'Thông báo!',
                MessageSeverity.error,
                TOAST_DEFAULT_CONFIG
            );
            return;
          }
        }
        break;
    }
  }
  onInputChange(event: any, controlName: string): void {
    let inputValue = event.target.value;
    inputValue = inputValue.replace(/[^0-9]/g, '');
    const control = this.form.get(controlName);
    if (control) {
      control.setValue(inputValue);
    }
    event.target.value = inputValue;
  }

  onClickChangeStatus(element) {
    element.active = !element.active;
  }

  onClickDelete(element) {
    if (this.form.get('transferChannel')?.value) {
      const newFilterValue = this.form.get('transferChannel')?.value.filter(
        (item) => item !== element.transferChannel);
      this.form.get('transferChannel').setValue(newFilterValue);
    }

    this.tableRecord = this.tableRecord.filter(
      (record) => record.transferChannel !== element.transferChannel
    );
    this.tableRecord.forEach((record, index) => {
      record.stt = index + 1;
    });
    this.dataSource = new MatTableDataSource(this.tableRecord);
  }
  onclickAddChannel() {
    if (
      this.form.get(this.$transferChannel.key).value &&
      this.form.get(this.$transferChannel.key).value.length > 0
    ) {
      this.tableRecord = [];
      const channelList = this.form.get(this.$transferChannel.key)
        .value as string[];
      channelList.forEach((item, index) => {
        let pt: IAddTransferChannelModel = {
          stt: index + 1,
          transferChannel: item,
          active: true,
        };
        this.tableRecord.push(pt);
      });
      this.dataSource = new MatTableDataSource(this.tableRecord);
    }
  }
}
