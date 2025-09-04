import { HttpResponse } from '@angular/common/http';
import { Component, Injector } from '@angular/core';
import { ComponentAbstract, MessageSeverity, TextboxItem } from '@shared-sm';
import { finalize, takeUntil } from "rxjs/operators";
import { TOAST_DEFAULT_CONFIG } from 'src/app/public/constants';
import { ModuleKeys } from 'src/app/public/module-permission.utils';
import ErrorUtils from 'src/app/shared/utils/ErrorUtils';
import { KeyConfigCitad } from '../constant';
import { HoldReceiverNameService } from '../services/hold-receiver-name.service';

@Component({
  selector: 'app-hold-receiver-name',
  templateUrl: './hold-receiver-name.component.html',
  styleUrls: ['./hold-receiver-name.component.scss']
})
export class HoldReceiverNameComponent extends ComponentAbstract {

  listHoldReceiverName: string[] = [];
  listValueHoldReceiverName: TextboxItem[] = []

  showTooltip: boolean = false;

  constructor(
    protected injector: Injector,
    private holdReceiverNameService: HoldReceiverNameService
  ) {
    super(injector);
    this.form = this.itemControl.toFormGroup([
    ]);
  }

  protected componentInit(): void {
    this.handleGetHoldReceiverName()
    this.enableActions(ModuleKeys.citad_hold_receiver_name_pattern)
  }

  handleGetHoldReceiverName() {
    this.indicator.showActivityIndicator()
    this.holdReceiverNameService.getHoldReceiverName().pipe(
      finalize(() => {
        this.indicator.hideActivityIndicator()
      }),
      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      next: (res) => {
        if (res && res.status === 200) {          
          res.data?.value?.holdReceiverNamePatterns.forEach(item => {
            this.listValueHoldReceiverName.push(new TextboxItem({
              key: item,
              value: item,
              readOnly: true,
            }))
          })
          this.listHoldReceiverName = res.data?.value?.holdReceiverNamePatterns
          this.itemControl.toAddFormGroup(this.listValueHoldReceiverName, this.form);
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
    const key = KeyConfigCitad.hold_receiver_name_pattern
    this.indicator.showActivityIndicator()
    this.holdReceiverNameService.exportConfigCitad(key).pipe(
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
          a.download = 'DVH_khong_auto_treo.xlsx'
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
    this.goTo('pmp_admin/transfer-channel/citad/hold-receiver-name/history-config', {keyConfig: "hold.receiver-name.pattern"})
  }

  editHoldReceiverName() {
    this.goTo('pmp_admin/transfer-channel/citad/hold-receiver-name/edit')
  }

}
