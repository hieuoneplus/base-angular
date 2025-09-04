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
import { WhitelistService } from '../../service/WhitelistService';
import { ACCOUNT_NUMBER, ACTIVE_SLIDE, BANK, CHANNEL } from '../modal/constant';
import { IRequestPutAccount } from '../modal/interface';

@Component({
  selector: 'add-whitelist-page',
  templateUrl: './add-whitelist.component.html',
  styleUrls: ['./add-whitelist.component.scss'],
})
export class AddWhitelistComponent extends ComponentAbstract {
  $accountNumber = ACCOUNT_NUMBER();
  $bank = BANK();
  $channel = CHANNEL();
  $activeSlide = ACTIVE_SLIDE();

  groupList: any = [];
  checked: boolean = false;
  isChecked: boolean = false;
  isChecker: boolean = false;

  hasDataSource = false;
  pageEvent: PageEvent = new PageEvent();
  groupListDataSource = new MatTableDataSource<any>([]);

  constructor(
    protected injector: Injector,
    protected whitelistService: WhitelistService,
    private bankService: BankService
  ) {
    super(injector);
  }

  protected componentInit(): void {
    this.enableActions(ModuleKeys.routing_whitelist);
    this.$accountNumber.required = true;
    this.$bank.required = true;
    this.$channel.required = true;
    this.$activeSlide.required = true;
    this.form = this.itemControl.toFormGroup([
      this.$accountNumber,
      this.$bank,
      this.$channel,
      this.$activeSlide,
    ]);
    this.getBankName();
    this.listButton = this.enableInsert
      ? this.listButtonDynamic('', BUTTON_CANCEL, BUTTON_ADD)
      : this.listButtonDynamic('', BUTTON_CANCEL);
  }

  modalAddAccount() {
    if (this.form.valid) {
      this.dialogService.dformconfirm(
        {
          label: 'Thêm mới tài khoản Whitelist',
          title: 'Lý do',
          description: 'Nhập lý do thêm mới tài khoản Whitelist',
          acceptBtn: 'Xác nhận',
          closeBtn: 'Hủy',
        },
        (result: any) => {
          if (result && result.status === DFORM_CONFIRM_STATUS.CONFIRMED) {
            
            const values = this.form.value;
            const body: IRequestPutAccount = {
              accountNo: values.accountNo.trim(),
              bankCode: values.bankCode,
              transferChannel: values.transferChannel,
              active: values.activeSlide,
              reason: result.data,
            };
            this.indicator.showActivityIndicator();
            this.whitelistService
              .postAccount(body)
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
                      'Tạo tài khoản thành công',
                      'Thông báo!',
                      MessageSeverity.success,
                      TOAST_DEFAULT_CONFIG
                    );
                    this.goTo('/pmp_admin/routing/whitelist');
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
      showBranch: false,
      page: 0,
      size: 1000,
    };
    this.indicator.showActivityIndicator();
    this.bankService
      .getBankWhitelist(params)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        finalize(() => this.indicator.hideActivityIndicator())
      )
      .subscribe(
        (res) => {
          console.log('RESPONSE', res);
          if (res && res.status === 200) {
            if (res.data.content.length > 0) {
              this.$bank.options = res.data.content.map((bank) => {
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
        this.goTo('/pmp_admin/routing/whitelist');
        break;
      case TYPE_BTN_FOOTER.TYPE_SAVE:
        if (this.form.valid) {
          this.modalAddAccount();
        } else {
          this.form.markAllAsTouched();
        }
        break;
    }
  }
  onInputChange(event: any): void {
    const inputValue = event.target.value;

    event.target.value = inputValue.replace(/\s+/g, '');
  }
}
