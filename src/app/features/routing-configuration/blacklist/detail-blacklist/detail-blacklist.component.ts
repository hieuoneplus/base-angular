import { Component, Injector } from '@angular/core';
import { ComponentAbstract, MessageSeverity, ToastService } from '@shared-sm';
import { finalize, takeUntil } from 'rxjs/operators';
import {
  BUTTON_EDIT,
  BUTTON_UNDO,
  TOAST_DEFAULT_CONFIG,
  TYPE_BTN_FOOTER
} from 'src/app/public/constants';
import { ModuleKeys } from '../../../../public/module-permission.utils';
import { BlacklistService } from '../../service/BlacklistService';
import { IBlacklistContent } from '../modal/interface';
import { STATUS_LABEL_ACCOUNT_TYPE, STATUS_LABEL_TRANSACTION_TYPE} from '../modal/constant'
import ErrorUtils from "../../../../shared/utils/ErrorUtils";
import {BankService} from "../../../general-configuration/service/BankService";

@Component({
  selector: 'detail-blacklist-page',
  templateUrl: './detail-blacklist.component.html',
  styleUrls: ['./detail-blacklist.component.scss'],
})
export class DetailBlacklistComponent extends ComponentAbstract {
  accDetail: IBlacklistContent;
  bankName: string;

  constructor(
    protected injector: Injector,
    protected blacklistService: BlacklistService,
    private toastService: ToastService,
    private bankService: BankService
  ) {
    super(injector);
  }

  protected componentInit(): void {
    this.enableActions(ModuleKeys.routing_blacklist);
    this.listButton = this.enableUpdate
      ? this.listButtonDynamic('', BUTTON_UNDO, BUTTON_EDIT)
      : this.listButtonDynamic('', BUTTON_UNDO);
    this.getDetailBlacklist();
  }

  getDetailBlacklist() {
    if (this.enableView) {
      this.indicator.showActivityIndicator();

      this.blacklistService
        .getAccountDetail(this.queryParams.id)
        .pipe(
          takeUntil(this.ngUnsubscribe),
          finalize(() => this.indicator.hideActivityIndicator())
        )
        .subscribe(
          (res) => {
            console.log('RESPONSE', res);
            // Gọi API thành công và có data trả về
            if (res && res.status === 200) {
              this.getBankName(res.data.bankCode);
              this.accDetail = res.data;

              this.hasDataSource = true;
            }
          },
          (error) => {
            console.log('ERROR', error);
            this.toastr.showToastr(
              error.error.soaErrorDesc
                ? error.error.soaErrorDesc
                : 'Lỗi hệ thống.',
              'Thông báo!',
              MessageSeverity.error,
              TOAST_DEFAULT_CONFIG
            );
          }
        );
    } else {
      this.toastService.showToastr(
        'Bạn không có quyền truy cập hợp lệ',
        'Thông báo',
        MessageSeverity.error
      );
    }
  }

  onClickActionBtn(event: any) {
    switch (event) {
      case TYPE_BTN_FOOTER.TYPE_UNDO:
        this.goTo('/pmp_admin/routing/blacklist');
        break;
      case TYPE_BTN_FOOTER.TYPE_EDIT:
        this.goTo('/pmp_admin/routing/blacklist/edit', {
          id: this.accDetail.id,
        });
        break;
    }
  }

  getBankName(bankCode: string) {
    const params = {
      showBranch: false,
      bankCode: bankCode,
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
              if (res && res.status === 200) {
                if (res.data.content.length > 0) {
                  const bank = res.data.content.find(
                      (bank) => bank.bankCode === bankCode
                  );
                  if (bank) {
                    this.bankName = bank.bankCode + ' - ' + bank.fullName;
                  } else {
                    this.bankName = bankCode;
                  }
                }
              } else {
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

  getLabelTransactionTyppe(transactionType: string) {
    const transType = STATUS_LABEL_TRANSACTION_TYPE.find(item => item.key === transactionType);
    if (transType) {
      return `${transType.value}</label>`;
    } else {
      return '';
    }
  }

  getLabelAccountTyppe(accountType: string) {
    const accType = STATUS_LABEL_ACCOUNT_TYPE.find(item => item.key === accountType);
    if (accType) {
      return `${accType.value}</label>`;
    } else {
      return '';
    }
  }
}
