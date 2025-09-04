import { Component, Injector } from '@angular/core';
import { ComponentAbstract, MessageSeverity } from '@shared-sm';
import { finalize, takeUntil } from 'rxjs/operators';

import { BankService } from 'src/app/features/general-configuration/service/BankService';
import {
  BUTTON_EDIT,
  BUTTON_UNDO,
  DFORM_CONFIRM_STATUS,
  TOAST_DEFAULT_CONFIG,
  TYPE_BTN_FOOTER,
} from 'src/app/public/constants';
import { ModuleKeys } from '../../../../public/module-permission.utils';
import ErrorUtils from '../../../../shared/utils/ErrorUtils';
import { WhitelistService } from '../../service/WhitelistService';
import {
  BUTTON_APPROVE,
  BUTTON_REJECT,
  STATUS_LABEL_TRANSACTION,
  STATUS_TRANSACTION,
} from '../modal/constant';
import { IWhitelistContent } from '../modal/interface';

@Component({
  selector: 'detail-whitelist-page',
  templateUrl: './detail-whitelist.component.html',
  styleUrls: ['./detail-whitelist.component.scss'],
})
export class DetailWhitelistComponent extends ComponentAbstract {
  accDetail: IWhitelistContent;
  bankName: string;

  constructor(
    protected injector: Injector,
    protected whitelistService: WhitelistService,
    private bankService: BankService
  ) {
    super(injector);
  }

  protected componentInit(): void {
    this.enableActions(ModuleKeys.routing_whitelist);
    this.getDetailWhitelist();
  }

  getDetailWhitelist() {
    this.indicator.showActivityIndicator();

    this.whitelistService
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
            this.loadBtn();
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
          this.listButton = this.listButtonDynamic('', BUTTON_UNDO);
        }
      );
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
      .getBankWhitelist(params)
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
                this.bankName = bank.bankCode + '-' + bank.fullName;
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

  onClickReject(id) {
    this.dialogService.dformconfirm(
      {
        label: 'Từ chối tài khoản Whitelist',
        title: 'Lý do',
        description: 'Nhập lý do từ chối tài khoản Whitelist',
        acceptBtn: 'Xác nhận',
        closeBtn: 'Hủy',
      },
      (result: any) => {
        if (result && result.status === DFORM_CONFIRM_STATUS.CONFIRMED) {
          this.indicator.showActivityIndicator();
          this.whitelistService
            .rejectAccount(id, result.data)
            .pipe(
              takeUntil(this.ngUnsubscribe),
              finalize(() => this.indicator.hideActivityIndicator())
            )
            .subscribe(
              (res) => {
                console.log('RESPONSE', res);
                // Gọi API thành công và có data trả về
                this.toastr.showToastr(
                  'Từ chối tài khoản whitelist thành công',
                  'Thông báo!',
                  MessageSeverity.success,
                  TOAST_DEFAULT_CONFIG
                );
                this.goTo('/pmp_admin/routing/whitelist');
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
  }

  onClickApprove(id?: number) {
    this.dialogService.confirm(
      {
        label: 'Duyệt tài khoản Whitelist',
        acceptBtn: 'Xác nhận',
        closeBtn: 'Hủy',
        message: 'Bạn có chắc chắn muốn duyệt tài khoản đã chọn?',
      },
      (result: any) => {
        if (result && result.status === DFORM_CONFIRM_STATUS.CONFIRMED) {
          this.indicator.showActivityIndicator();
          this.whitelistService
            .approveAccount(id)
            .pipe(
              takeUntil(this.ngUnsubscribe),
              finalize(() => this.indicator.hideActivityIndicator())
            )
            .subscribe(
              (res) => {
                if (res && res.status === 200) {
                  this.toastr.showToastr(
                    'Phê duyệt tài khoản Whitelist thành công',
                    'Thông báo!',
                    MessageSeverity.success,
                    TOAST_DEFAULT_CONFIG
                  );
                  this.goTo('/pmp_admin/routing/whitelist');
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
      }
    );
  }

  viewHistory(id: number) {
    this.goTo('/pmp_admin/routing/whitelist/history', { id: id });
  }

  loadBtn() {
    if (
      this.enableApprove &&
      this.accDetail.approvalStatus === STATUS_TRANSACTION.WAITING_APPROVAL
    ) {
      this.listButton = this.listButtonDynamic(
        '',
        BUTTON_UNDO,
        BUTTON_REJECT,
        BUTTON_APPROVE
      );
    } else if (
      this.enableUpdate &&
      this.accDetail.approvalStatus !== STATUS_TRANSACTION.WAITING_APPROVAL
    ) {
      this.listButton = this.listButtonDynamic('', BUTTON_UNDO, BUTTON_EDIT);
    } else {
      this.listButton = this.listButtonDynamic('', BUTTON_UNDO);
    }
  }

  getLabelApprovalStatus(approvalStatus: string) {
    const status = (STATUS_LABEL_TRANSACTION || []).find(
      (item) => item.key === approvalStatus
    );
    if (status) {
      return `<label class="wf-status ${status.class}">${status.value}</label>`;
    } else {
      return '';
    }
  }

  onClickActionBtn(event: any) {
    switch (event) {
      case TYPE_BTN_FOOTER.TYPE_UNDO:
        this.goTo('/pmp_admin/routing/whitelist');
        break;
      case TYPE_BTN_FOOTER.TYPE_DELETE:
        this.onClickReject(this.queryParams.id);
        break;
      case TYPE_BTN_FOOTER.TYPE_APPROVER:
        this.onClickApprove(this.queryParams.id);
        break;
      case TYPE_BTN_FOOTER.TYPE_EDIT:
        this.router.navigate(['/pmp_admin/routing/whitelist/edit'], {
          state: { status: this.accDetail.approvalStatus },
          queryParams: { id: this.accDetail.id },
        });
        break;
    }
  }
}
