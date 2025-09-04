
import { Component, Injector } from '@angular/core';
import { finalize, takeUntil } from 'rxjs/operators';
import {ComponentAbstract, MessageSeverity, ToastService} from '@shared-sm';
import {BUTTON_EDIT, BUTTON_UNDO, TYPE_BTN_FOOTER} from 'src/app/public/constants';
import {TktgAchService} from "../services/tktg-ach.service";
import {IIntermediateAccountConfig} from "../../../../model/ach";
import ErrorUtils from "../../../../../shared/utils/ErrorUtils";
import {ModuleKeys} from "../../../../../public/module-permission.utils";

@Component({
  selector: 'detail-tktg-ach-page',
  templateUrl: './detail-tktg-ach.component.html',
  styleUrls: ['./detail-tktg-ach.component.scss']
})
// Màn hình thông thin chi tiết tài khoản trung gian ACH
export class DetailTktgACHComponent extends ComponentAbstract {
  accDetail: IIntermediateAccountConfig

  constructor(
    protected injector: Injector,

    private tktgAchService: TktgAchService,
    private toastService: ToastService
  ) {
    super(injector);
  }

  protected componentInit(): void {
    this.enableActions(ModuleKeys.ach_tktg_config)

    this.listButton = this.enableUpdate ?  this.listButtonDynamic('', BUTTON_UNDO, BUTTON_EDIT) :  this.listButtonDynamic('', BUTTON_UNDO);
    this.handleGetAccDetail()
  }

  handleGetAccDetail() {
    if(this.enableView) {
      this.indicator.showActivityIndicator()
      this.tktgAchService.getIntermediateAccountDetailConfig(this.queryParams.way, this.queryParams.acc).pipe(
        finalize(() => {
          this.indicator.hideActivityIndicator()
        }),
        takeUntil(this.ngUnsubscribe)
      )
        .subscribe({
          next: (res) => {
            this.accDetail = {
              ...res.data,
            }
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

  onClickEdit() {
    this.goTo('/pmp_admin/transfer-channel/ach/tktg/edit', { acc: this.accDetail.accountNumber, way: this.accDetail.functionCode })
  }

  onClickActionBtn($event?: any): void {
    switch ($event) {
      case TYPE_BTN_FOOTER.TYPE_UNDO:
        this.goTo('pmp_admin/transfer-channel/ach/tktg')
        break;

      case TYPE_BTN_FOOTER.TYPE_EDIT:
        this.onClickEdit()
        break;
    }
  }
}
