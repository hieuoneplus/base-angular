import { Component, Injector } from '@angular/core';
import { ComponentAbstract } from '@shared-sm';
import { finalize, takeUntil } from 'rxjs/operators';
import { IResponseQueryTransactionCitad } from 'src/app/features/model/citad';
import { BUTTON_UNDO, TYPE_BTN_FOOTER } from 'src/app/public/constants';
import { STATUS_LABEL_TRANSACTION } from '../../constant';
import { TransactionManagerService } from '../../services/transaction-manager';


@Component({
  selector: 'app-detail-transaction-manager-in',
  templateUrl: './detail-transaction-manager-in.component.html',
  styleUrls: ['./detail-transaction-manager-in.component.scss']
})
export class DetailTransactionManagerInComponent extends ComponentAbstract {

  queryTransactionInDetail: IResponseQueryTransactionCitad

  constructor(
    protected injector: Injector,
    protected transactionManagerService: TransactionManagerService
  ) {
    super(injector);
  }

  protected componentInit(): void {
    this.handleGetTransactionCitadOut()
    this.listButton = this.listButtonDynamic('', BUTTON_UNDO);
  }

  handleGetTransactionCitadOut() {
    const type = 'INWARD'
    this.indicator.showActivityIndicator()
    this.transactionManagerService.getTransactionCitadDetail(this.queryParams.transactionId).pipe(
      finalize(() => {
        this.indicator.hideActivityIndicator()
      }),
      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      next: (res) => {
        if (res) {
          this.queryTransactionInDetail = res.data
          console.log(this.queryTransactionInDetail, 'this.queryTransactionInDetail');
          
        }

      },
      error: (err) => {

      }
    })
  }

  onClickBtn($event?: any): void {
    switch ($event) {
      case TYPE_BTN_FOOTER.TYPE_UNDO:
        this.goTo('pmp_admin/transfer-channel/citad/transaction-manager-in');
        break;
    }
  }

  getLabel($status: any) {
    const status = (STATUS_LABEL_TRANSACTION || []).find(item => item.key === $status);
    if (status) {
      return `<label class="">${status.value}</label>`;
    } else {
      return '';
    }
  }

}
