import { Component, Injector } from '@angular/core';
import { ComponentAbstract, MessageSeverity, ToastService } from '@shared-sm';

import { finalize, takeUntil } from 'rxjs/operators';
import {
  BUTTON_EDIT,
  BUTTON_UNDO,
  TOAST_DEFAULT_CONFIG,
  TYPE_BTN_FOOTER,
} from 'src/app/public/constants';
import { ModuleKeys } from 'src/app/public/module-permission.utils';
import ErrorUtils from '../../../../shared/utils/ErrorUtils';
import { TransferChannelLimitService } from '../../service/TransferChannelLimitService';
import { ITransferChannelLimitContent } from '../modal/interface';

@Component({
  selector: 'detail-transfer-channel-limit-page',
  templateUrl: './detail-transfer-channel-limit.component.html',
  styleUrls: ['./detail-transfer-channel-limit.component.scss'],
})
export class DetailTransferChannelLimitComponent extends ComponentAbstract {
  transferChannelLimitContent: ITransferChannelLimitContent;

  constructor(
    protected injector: Injector,
    private transferChannelLimitService: TransferChannelLimitService,
    private toastService: ToastService
  ) {
    super(injector);
  }

  protected componentInit(): void {
    this.enableActions(ModuleKeys.routing_channel_limit);
    this.listButton = this.listButtonDynamic('', BUTTON_UNDO);
    if (this.enableUpdate) {
      this.listButton = this.listButtonDynamic('', BUTTON_UNDO, BUTTON_EDIT);
    }
    this.getDetailTransferChannelLimit();
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
          console.log('RESPONSE', res);
          // Gọi API thành công và có data trả về
          if (res && res.status === 200) {
            this.transferChannelLimitContent = res.data;
            this.hasDataSource = true;
          }
        },
        (error) => {
          console.log('ERROR', error);
          const errMessage = ErrorUtils.getErrorMessage(error);
          this.toastService.showToastr(
            errMessage.join('\n'),
            'Thông báo',
            MessageSeverity.error,
            TOAST_DEFAULT_CONFIG
          );
        }
      );
  }
  onClickActionBtn(event: any) {
    switch (event) {
      case TYPE_BTN_FOOTER.TYPE_UNDO:
        this.goTo('/pmp_admin/routing/transfer-channel-limit');
        break;
      case TYPE_BTN_FOOTER.TYPE_EDIT:
        this.goTo('/pmp_admin/routing/transfer-channel-limit/edit', {
          id: this.transferChannelLimitContent.id,
        });
        break;
    }
  }

  onClickHistory() {
    this.goTo('/pmp_admin/routing/transfer-channel-limit/history', {
      transferChannelId: this.queryParams.id,
    });
  }
}
