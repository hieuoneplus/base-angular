import { Component, Injector } from '@angular/core';
import { ComponentAbstract, MessageSeverity, ToastService } from '@shared-sm';
import { finalize, takeUntil } from 'rxjs/operators';

import {
  BUTTON_APPROVER,
  BUTTON_EDIT,
  BUTTON_REJECT,
  BUTTON_UNDO,
  DFORM_CONFIRM_STATUS,
  TOAST_DEFAULT_CONFIG,
  TYPE_BTN_FOOTER,
} from 'src/app/public/constants';
import { ModuleKeys } from '../../../../public/module-permission.utils';
import ErrorUtils from '../../../../shared/utils/ErrorUtils';

import { SpecialAccountService } from '../../service/SpecialAccountService';
import { STATUS_APPROVAL, STATUS_FORM } from '../modal/constant';
import { IReasonReject, ISpecialAccountContent } from '../modal/interface';

@Component({
  selector: 'detail-special-account-page',
  templateUrl: './detail-special-account.component.html',
  styleUrls: ['./detail-special-account.component.scss'],
})
export class DetailSpecialAccountComponent extends ComponentAbstract {
  accDetail: ISpecialAccountContent;
  statusApprove: string;
  isRetryConfirm: boolean;

  constructor(
    protected injector: Injector,
    private specialAccountService: SpecialAccountService,
    private toastService: ToastService
  ) {
    super(injector);
  }

  protected componentInit(): void {
    this.enableActions(ModuleKeys.alias_account);
    this.getDetailSpecialAccount();
  }

  getDetailSpecialAccount() {
    let butList = [];
    butList.push(BUTTON_UNDO);

    if (this.enableView) {
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
              this.statusApprove = res.data.approvalStatus;
              this.hasDataSource = true;
              this.isRetryConfirm = res.data.isRetryConfirm ?? false;

              if (
                this.enableApprove &&
                this.statusApprove === STATUS_APPROVAL.WAITING_APPROVAL
              ) {
                butList.push(BUTTON_REJECT, BUTTON_APPROVER);
              }
              if (
                this.enableUpdate &&
                this.statusApprove !== STATUS_APPROVAL.WAITING_APPROVAL
              ) {
                butList.push(BUTTON_EDIT);
              }
              this.listButton = this.listButtonDynamic('', ...butList);
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
            this.listButton = this.listButtonDynamic('', ...butList);
          }
        );
    } else {
      this.toastService.showToastr(
        'Bạn không có quyền truy cập hợp lệ',
        'Thông báo',
        MessageSeverity.error
      );
      this.listButton = this.listButtonDynamic('', ...butList);
    }
  }

  onClickActionBtn(event: any) {
    switch (event) {
      case TYPE_BTN_FOOTER.TYPE_UNDO:
        this.goTo('/pmp_admin/general-config/special-account/');
        break;
      case TYPE_BTN_FOOTER.TYPE_EDIT:
        this.router.navigate(
          ['/pmp_admin/general-config/special-account/edit'],
          {
            state: { status: this.accDetail.approvalStatus },
            queryParams: { id: this.accDetail.id },
          }
        );
        break;
      case TYPE_BTN_FOOTER.TYPE_APPROVER:
        this.onClickApprove(this.queryParams.id, true);
        break;
      case TYPE_BTN_FOOTER.TYPE_REJECT:
        this.onClickApprove(this.queryParams.id, false);
        break;
    }
  }
  convertMoney(money: number) {
    return money !== null
      ? money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      : null;
  }
  getLabel($state) {
    if ($state) {
      const status = STATUS_FORM.find((item) => item.key === $state);
      return `<label class="wf-status ${status.class}">${status.value}</label>`;
    }
  }

  viewHistoryChange(id: string) {
    this.goTo('pmp_admin/general-config/special-account/history', {
      aliasAccountId: id,
    });
  }
  onClickApprove(id: string, isApprove: boolean) {
    if (isApprove) {
      this.dialogService.confirm(
        {
          label: 'Duyệt tài khoản đặc biệt',
          acceptBtn: 'Xác nhận',
          closeBtn: 'Hủy',
          message: 'Bạn có chắc chắn muốn duyệt tài khoản đã chọn?',
        },
        (result: any) => {
          if (result && result.status === DFORM_CONFIRM_STATUS.CONFIRMED) {
            this.indicator.showActivityIndicator();
            this.specialAccountService
              .approveAccount(id)
              .pipe(
                takeUntil(this.ngUnsubscribe),
                finalize(() => {
                  this.indicator.hideActivityIndicator();
                })
              )
              .subscribe(
                (res) => {
                  console.log('RESPONSE', res);
                  // Gọi API thành công và có data trả về
                  if (res && res.status === 200) {
                    this.toastr.showToastr(
                      'Duyệt tài khoản đặc biệt thành công',
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
      this.dialogService.dformconfirm(
        {
          label: 'Từ chối tài khoản đặc biệt',
          title: 'Lý do',
          description: 'Nhập lý do từ chối duyệt tài khoản đặc biệt',
          acceptBtn: 'Xác nhận',
          closeBtn: 'Hủy',
        },
        (result: any) => {
          if (result && result.status === DFORM_CONFIRM_STATUS.CONFIRMED) {
            const body: IReasonReject = {
              reason: result.data,
            };
            this.indicator.showActivityIndicator();
            this.specialAccountService
              .rejectAccount(body, id)
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
                      'Từ chối tài khoản đặc biệt thành công',
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
    }
  }
}
