import { Component, Injector } from '@angular/core';
import { ComponentAbstract, MessageSeverity, TextboxItem } from '@shared-sm';
import { finalize, takeUntil } from "rxjs/operators";
import { TOAST_DEFAULT_CONFIG } from 'src/app/public/constants';
import { ModuleKeys } from 'src/app/public/module-permission.utils';
import { MbsSignalService } from '../services/mbs-signal.service';

@Component({
  selector: 'app-mbs-signal',
  templateUrl: './mbs-signal.component.html',
  styleUrls: ['./mbs-signal.component.scss']
})
export class MbsSignalComponent extends ComponentAbstract {

  listMbsSignal: string[] = [];
  listValueMbsSignal: TextboxItem[] = []

  showTooltip: boolean = false;

  constructor(
    protected injector: Injector,
    private mbsSignalService: MbsSignalService
  ) {
    super(injector);
    this.form = this.itemControl.toFormGroup([
    ]);
  }

  protected componentInit(): void {
    this.handleGetMbsSignal()
    this.enableActions(ModuleKeys.citad_partner_pattern)
  }

  handleGetMbsSignal() {
    this.indicator.showActivityIndicator()
    this.mbsSignalService.getMbsSignal().pipe(
      finalize(() => {
        this.indicator.hideActivityIndicator()
      }),
      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      next: (res) => {
        if (res && res.status === 200) {          
          res.data?.value?.partnerTransactionPatterns.forEach(item => {
            this.listValueMbsSignal.push(new TextboxItem({
              key: item,
              value: item,
              readOnly: true,
            }))
          })
          this.listMbsSignal = res.data?.value?.partnerTransactionPatterns
          this.itemControl.toAddFormGroup(this.listValueMbsSignal, this.form);
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

  onClickHistory() {
    this.goTo('pmp_admin/transfer-channel/citad/mbs-signal/history-config', {keyConfig: "partner.transaction.pattern"})
  }

  editMbsSignal() {
    this.goTo('pmp_admin/transfer-channel/citad/mbs-signal/edit')
  }

}
