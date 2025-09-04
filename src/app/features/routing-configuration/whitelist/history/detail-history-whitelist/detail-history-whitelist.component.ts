
import { Component, Injector } from '@angular/core';
import { finalize, takeUntil } from 'rxjs/operators';
import {ComponentAbstract, MessageSeverity} from '@shared-sm';

import {BUTTON_UNDO, TOAST_DEFAULT_CONFIG, TYPE_BTN_FOOTER} from 'src/app/public/constants';
import {STATUS_LABEL_TRANSACTION, } from '../../modal/constant';
import {WhitelistService} from "../../../service/WhitelistService";
import ErrorUtils from "../../../../../shared/utils/ErrorUtils";
import {ModuleKeys} from "../../../../../public/module-permission.utils";
import { BankService } from 'src/app/features/general-configuration/service/BankService';
import { IDetailHistoryWhitelist } from '../../modal/interface';

@Component({
  selector: 'detail-history-whitelist-page',
  templateUrl: './detail-history-whitelist.component.html',
  styleUrls: ['./detail-history-whitelist.component.scss']
})

export class DetailHistoryWhitelistComponent extends ComponentAbstract {

  accDetail: IDetailHistoryWhitelist;
  bankName: string

  constructor(
    protected injector: Injector,
    protected whitelistService: WhitelistService,
    private bankService: BankService
    ) {
    super(injector);
  }

  protected componentInit(): void {
    this.enableActions(ModuleKeys.routing_whitelist)
    this.getHistoryDetail();
    this.listButton = this.listButtonDynamic('', BUTTON_UNDO)
  }

  getHistoryDetail() {
    this.indicator.showActivityIndicator();
    this.whitelistService.getHistoryDetail(this.queryParams.id).pipe(
      takeUntil(this.ngUnsubscribe),
      finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe((res) => {
      // Gọi API thành công và có data trả về
      if (res && res.status === 200) {
        this.getBankName(res.data.bankCode)
        this.accDetail = res.data
        this.hasDataSource = true;
      }
    }, error => {
      const messageError = ErrorUtils.getErrorMessage(error);
      this.toastr.showToastr(
        messageError.join('\n'),
        'Thông báo!',
        MessageSeverity.error,
        TOAST_DEFAULT_CONFIG
      )
      this.listButton = this.listButtonDynamic('', BUTTON_UNDO);
    });
  }

  getBankName(bankCode: string) {
    const params = {
      showBranch: false,
      bankCode: bankCode,
      page: 0,
      size: 1000,
    }
    this.indicator.showActivityIndicator();
    this.bankService.getBankWhitelist(params).pipe(
      takeUntil(this.ngUnsubscribe),
      finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe((res) => {
      if (res && res.status === 200) {
        if (res.data.content.length > 0) {
          const bank = res.data.content.find((bank) => bank.bankCode === bankCode);
          if (bank) {
            this.bankName = bank.bankCode + '-' + bank.fullName
          } else {
            this.bankName = bankCode
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
        )
      }
    }, error => {
      const messageError = ErrorUtils.getErrorMessage(error);
      this.toastr.showToastr(
        messageError.join('\n'),
        'Thông báo!',
        MessageSeverity.error,
        TOAST_DEFAULT_CONFIG
      )
    });

  }

  viewHistory(id: number) {
    this.goTo('/pmp_admin/routing/whitelist/history', { id: id });
  }

  getLabelApprovalStatus(approvalStatus: string) {
    const status = (STATUS_LABEL_TRANSACTION || []).find(item => item.key === approvalStatus);
    if (status) {
      return `<label class="wf-status ${status.class}">${status.value}</label>`;
    } else {
      return '';
    }
  }

  onClickActionBtn(event: any) {
    switch (event) {
      case TYPE_BTN_FOOTER.TYPE_UNDO:
        window.history.back()
        break;
    }
  }
}
