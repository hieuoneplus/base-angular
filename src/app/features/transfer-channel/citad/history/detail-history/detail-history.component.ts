import { Component, Inject, Injector } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { finalize, takeUntil } from 'rxjs/operators';
import { HistoryConfigCitadService } from '../history.service';
import {IDetailHistoryConfig} from '../modal/interface';
import ErrorUtils from 'src/app/shared/utils/ErrorUtils';
import {ComponentAbstract, MessageSeverity} from '@shared-sm';


@Component({
  selector: 'app-detail-history',
  templateUrl: './detail-history.component.html',
  styleUrls: ['./detail-history.component.scss']
})
export class DetailHistoryConfigCitadComponent extends ComponentAbstract{

  readonly abbreviationType = 'abbreviation'
  readonly accountParameter = 'account_parameter'
  readonly credit_account = 'credit_account'
  readonly dedit_account = 'dedit_account'
  readonly transactionReplacement = 'replacement'

  dataHistoryConfig: IDetailHistoryConfig
  detailHistoryConfigObjectEntry: any
  private dataLoaded = false;

  constructor(
    protected injector: Injector,
    public dialogRef: MatDialogRef<DetailHistoryConfigCitadComponent>,
    private historyConfigCitadService: HistoryConfigCitadService,
    @Inject(MAT_DIALOG_DATA) private data: any,

  ) {
    super(injector);
   }

   protected componentInit(): void {
    if (!this.dataLoaded) {
      this.getDetailHistoryConfigList();
    }
  }

  getDetailHistoryConfigList() {
    this.historyConfigCitadService.getDetailHistoryConfigList(this.data.idMessageError,this.data.key).pipe(
      finalize(() => {
      }),
      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      next: (res) => {
        if (res && res.data) {
          this.dataHistoryConfig = res.data
          const entries = Object.entries(res.data.value);
          const typeIndex = entries.findIndex(([key]) => key === '$type');

          if (res.data.value.$type == this.abbreviationType || res.data.value.$type == this.accountParameter) {
            this.detailHistoryConfigObjectEntry = Object.entries(entries[typeIndex + 1][1]).map(([key, value]) => {
              return {
                key,
                values: value,
              };
            });
            this.dataLoaded = true;
          } else if (res.data.value.$type == this.credit_account) {
            this.detailHistoryConfigObjectEntry = Object.keys(this.dataHistoryConfig.value.creditAccounts).map((e) => ({
              value: e,
              content: this.dataHistoryConfig.value.creditAccounts[e]
            }))
            this.dataLoaded = true;
          } else if (res.data.value.$type == this.dedit_account) {
            this.detailHistoryConfigObjectEntry = Object.keys(this.dataHistoryConfig.value.deditAccounts).map((e) => ({
              value: e,
              content: this.dataHistoryConfig.value.deditAccounts[e]
            }))
            this.dataLoaded = true;
          } else if (res.data.value.$type == this.transactionReplacement) {
              const data = {replacement: Object.entries(res.data.value.replacements)}
              this.detailHistoryConfigObjectEntry = JSON.stringify(data, null, 2);
              this.dataLoaded = true;
          }
           else {
            this.detailHistoryConfigObjectEntry = Object.entries(entries[typeIndex + 1][1])
            this.dataLoaded = true;
          }
        }
      },
      error: (err) => {
        this.closeDialog()
        const errMessage = ErrorUtils.getErrorMessage(err)
        this.toastr.showToastr(errMessage.join('\n'), "Thông báo", MessageSeverity.error)
      }
    })
  }

  closeDialog() {
    if (this.dialogRef.close) { this.dialogRef.close(null); }
  }

}
