import { HttpResponse } from '@angular/common/http';
import { Component, Injector } from '@angular/core';
import { ComponentAbstract, MessageSeverity, TextboxItem } from '@shared-sm';
import { finalize, takeUntil } from "rxjs/operators";
import { TOAST_DEFAULT_CONFIG } from 'src/app/public/constants';
import { ModuleKeys } from 'src/app/public/module-permission.utils';
import ErrorUtils from 'src/app/shared/utils/ErrorUtils';
import { RefundsSignalService } from '../services/refunds-signal.service';
import { KeyConfigCitad } from './../constant'

@Component({
  selector: 'app-refunds-signal',
  templateUrl: './refunds-signal.component.html',
  styleUrls: ['./refunds-signal.component.scss']
})
export class RefundsSignalComponent extends ComponentAbstract {

  listRefundsSignal: string[] = [];
  listValueRefundsSignal: TextboxItem[] = []

  showTooltip: boolean = false;

  constructor(
    protected injector: Injector,
    private refundsSignalService: RefundsSignalService
  ) {
    super(injector);
    this.form = this.itemControl.toFormGroup([
    ]);
  }

  protected componentInit(): void {
    this.handleGetRefundsSignal()
    this.enableActions(ModuleKeys.citad_refund_pattern)
  }

  handleGetRefundsSignal() {
    this.indicator.showActivityIndicator()
    this.refundsSignalService.getRefundsSignal().pipe(
      finalize(() => {
        this.indicator.hideActivityIndicator()
      }),
      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      next: (res) => {
        if (res && res.status === 200) {          
          res.data?.value?.refundTransactionPatterns.forEach(item => {
            this.listValueRefundsSignal.push(new TextboxItem({
              key: item,
              value: item,
              readOnly: true,
            }))
          })
          this.listRefundsSignal = res.data?.value?.refundTransactionPatterns
          this.itemControl.toAddFormGroup(this.listValueRefundsSignal, this.form);
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
    const key = KeyConfigCitad.refund_transaction_pattern
    this.indicator.showActivityIndicator()
    this.refundsSignalService.exportConfigCitad(key).pipe(
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
          a.download = 'Cau_hinh_dau_hieu_hoan_tra.xlsx'
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
    this.goTo('pmp_admin/transfer-channel/citad/refunds-signal/history-config', {keyConfig: "refund.transaction.pattern"})
  }

  editRefundSignal() {
    this.goTo('pmp_admin/transfer-channel/citad/refunds-signal/edit')
  }

}
