
import { Component, Injector } from '@angular/core';
import { finalize, takeUntil } from 'rxjs/operators';
import {ComponentAbstract, MessageSeverity, ToastService} from '@shared-sm';
import {
  BUTTON_ADD,
  BUTTON_CANCEL,
  BUTTON_EDIT,
  BUTTON_SAVE,
  BUTTON_UNDO,
  TYPE_BTN_FOOTER
} from 'src/app/public/constants';
import {GeneralConfigService} from "../services/general-config.service";
import {ICommonConfig} from "../../../../model/ach";
import ErrorUtils from "../../../../../shared/utils/ErrorUtils";
import {ModuleKeys} from "../../../../../public/module-permission.utils";


@Component({
  selector: 'detail-tktg-ach-page',
  templateUrl: './detail-general-ach.component.html',
  styleUrls: ['./detail-general-ach.component.scss']
})
// Màn hình thông thin chi tiết tài khoản trung gian ACH
export class DetailGeneralAchComponent extends ComponentAbstract {
  configDetail: ICommonConfig

  constructor(
    protected injector: Injector,

    private generalConfigService: GeneralConfigService,
    private toastService: ToastService
    ) {
    super(injector);
  }

  protected componentInit(): void {
    this.enableActions(ModuleKeys.ach_common_config)
    this.handleGetAccDetail()

    this.listButton =  this.enableUpdate ? this.listButtonDynamic('', BUTTON_UNDO, BUTTON_EDIT) : this.listButtonDynamic('', BUTTON_CANCEL);
  }

  handleGetAccDetail() {
    if(this.enableView) {
      this.indicator.showActivityIndicator()
      this.generalConfigService.getDetailCommonConfig(this.queryParams.fc, this.queryParams?.k).pipe(
        finalize(() => {
          this.indicator.hideActivityIndicator()
        }),
        takeUntil(this.ngUnsubscribe)
      )
        .subscribe({
          next: (res) => {
            this.configDetail = res.data
          },
          error: (err) => {
            const errMessage = ErrorUtils.getErrorMessage(err)
            this.toastService.showToastr(errMessage.join('\n'), "Thông báo", MessageSeverity.error)
          }
        })
    } else {
      this.toastService.showToastr('Bạn không có quyền truy cập hợp lệ', "Thông báo", MessageSeverity.error)
    }
  }

  onClickActionBtn($event?: any): void {
    switch ($event) {
      case TYPE_BTN_FOOTER.TYPE_UNDO:
        this.goTo('pmp_admin/transfer-channel/ach/general')
        break;
      case TYPE_BTN_FOOTER.TYPE_EDIT:
        this.goTo('pmp_admin/transfer-channel/ach/general/edit',{ fc: this.configDetail.functionCode, k: this.configDetail.key })
        break;
    }
  }
}
