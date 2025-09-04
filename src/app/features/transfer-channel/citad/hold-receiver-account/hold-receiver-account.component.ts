import { HttpResponse } from '@angular/common/http';
import { Component, Injector } from '@angular/core';
import { ComponentAbstract, MessageSeverity, TextboxItem } from '@shared-sm';
import { finalize, takeUntil } from "rxjs/operators";
import { TOAST_DEFAULT_CONFIG } from 'src/app/public/constants';
import { ModuleKeys } from 'src/app/public/module-permission.utils';
import ErrorUtils from 'src/app/shared/utils/ErrorUtils';
import { KeyConfigCitad } from '../constant';
import { HoldReceiverAccountService } from '../services/hold-receiver-account.service';

@Component({
  selector: 'app-hold-receiver-account',
  templateUrl: './hold-receiver-account.component.html',
  styleUrls: ['./hold-receiver-account.component.scss']
})
export class HoldReceiverAccountComponent extends ComponentAbstract {

  listHoldReceiverAccount: string[] = [];
  listValueHoldReceiverAccount: TextboxItem[] = []

  showTooltip: boolean = false;

  constructor(
    protected injector: Injector,
    private holdReceiverAccountService: HoldReceiverAccountService
  ) {
    super(injector);
    this.form = this.itemControl.toFormGroup([
    ]);
  }

  protected componentInit(): void {
    this.handleGetHoldReceiverAccount()
    this.enableActions(ModuleKeys.citad_hold_receiver_account)
  }

  handleGetHoldReceiverAccount() {
    this.indicator.showActivityIndicator()
    this.holdReceiverAccountService.getHoldReceiverAccount().pipe(
      finalize(() => {
        this.indicator.hideActivityIndicator()
      }),
      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      next: (res) => {
        if (res && res.status === 200) {          
          res.data?.value?.holdReceiverAccounts.forEach(item => {
            this.listValueHoldReceiverAccount.push(new TextboxItem({
              key: item,
              value: item,
              readOnly: true,
              customDirectives: /^[àáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữự]*$/g
            }))
          })
          this.listHoldReceiverAccount = res.data?.value?.holdReceiverAccounts
          this.itemControl.toAddFormGroup(this.listValueHoldReceiverAccount, this.form);
        } else {
        }
      },
      error: (err) => {
        if (err.status === 403) {
          this.toastr.showToastr(
            `Không có quyền cấu hình dấu hiệu hoàn trả `,
            'Thông báo!',
            MessageSeverity.error,
            TOAST_DEFAULT_CONFIG
          );
        }
      }
    })
  }

  exportExcel() {
    const key = KeyConfigCitad.hold_receiver_account
    this.indicator.showActivityIndicator()
    this.holdReceiverAccountService.exportConfigCitad(key).pipe(
      finalize(() => {
        this.indicator.hideActivityIndicator()
      }),
      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      next: (res) => {
        if (res instanceof HttpResponse) {
          const blob = new Blob([res.body], { type: res.headers.get('Content-Type') });
          let url = window.URL.createObjectURL(blob);
          var a = document.createElement("a");
          a.href = url;
          a.download = 'TK_khong_auto_treo.xlsx'
          a.click();
          window.URL.revokeObjectURL(url);
        }
      },
      error: (err) => {
        const messsageError = ErrorUtils.getErrorMessage(err);
        this.toastr.showToastr(
          messsageError.join('\n'),
          'Thông báo!',
          MessageSeverity.error,
          TOAST_DEFAULT_CONFIG
        );
      }
    })
  }

  onClickHistory() {
    this.goTo('pmp_admin/transfer-channel/citad/hold-receiver-account/history-config', {keyConfig: "hold.receiver-account"})
  }

  editHoldReceiverAccount() {
    this.goTo('pmp_admin/transfer-channel/citad/hold-receiver-account/edit')
  }

}
