import { Component, Injector } from '@angular/core';
import { ComponentAbstract, MessageSeverity, ToastService } from '@shared-sm';
import { finalize, takeUntil } from 'rxjs/operators';
import ErrorUtils from 'src/app/shared/utils/ErrorUtils';
import { BUTTON_UNDO, TYPE_BTN_FOOTER } from "../../../../../public/constants";
import { ModuleKeys } from "../../../../../public/module-permission.utils";
import { SpecialAccountService } from "../../../service/SpecialAccountService";
import { IAliasAccountHistoryContent } from '../../modal/interface';
import { STATUS_FORM } from '../../modal/constant';


@Component({
  selector: 'app-detail-alias-account-histories',
  templateUrl: './detail-alias-account-histories.component.html',
  styleUrls: ['./detail-alias-account-histories.component.scss'],
})
export class DetailAliasAccountHistoriesComponent extends ComponentAbstract {
  detailContent: IAliasAccountHistoryContent;
  isLoadedData: boolean = false;
  isRetryConfirm: boolean;

  constructor(
    protected injector: Injector,
    private toastService: ToastService,
    private specialAccountService: SpecialAccountService,
  ) {
    super(injector);
  }

  protected componentInit(): void {
    this.enableActions(ModuleKeys.alias_account);
    this.listButton = this.listButtonDynamic('', BUTTON_UNDO)
    this.getDetailSpecialAccountHistory();
  }

  getDetailSpecialAccountHistory() {
    this.indicator.showActivityIndicator();
    this.specialAccountService
      .getAliasAccountHistoryDetail(this.queryParams.idHistory)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        finalize(() => {this.indicator.hideActivityIndicator()})
      )
      .subscribe(
        (res) => {
          console.log('RESPONSE', res);
          // Gọi API thành công và có data trả về
          if (res && res.status === 200) {
            this.detailContent = res.data;
            this.hasDataSource = true;
            this.isRetryConfirm = res.data.isRetryConfirm ?? false;
          }
        },
        (error) => {
          const errMessage = ErrorUtils.getErrorMessage(error);
          this.toastService.showToastr(
            errMessage.join('\n'),
            'Thông báo',
            MessageSeverity.error
          );
        }
      );
    this.isLoadedData = true;
  }
  onClickActionBtn(event: any) {
    switch (event) {
      case TYPE_BTN_FOOTER.TYPE_UNDO:
        this.goTo('/pmp_admin/general-config/special-account/history', {aliasAccountId: this.queryParams.papAliasId});
        break;
    }
  }
  convertMoney(money : number) {
    return money !== null ? money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : null;
  }
  getLabel($state) {
    if($state) {
      const status = STATUS_FORM.find((item) => item.key === $state);
      return `<label class="wf-status ${status.class}">${status.value}</label>`;
    }
  }
}
