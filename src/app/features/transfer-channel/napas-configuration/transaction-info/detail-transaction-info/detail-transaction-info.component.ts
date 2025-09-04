import { Component, Injector } from '@angular/core';
import { ComponentAbstract, MessageSeverity } from '@shared-sm';
import { finalize, takeUntil } from 'rxjs/operators';
import { BUTTON_UNDO, BUTTON_EDIT, DFORM_CONFIRM_STATUS, TOAST_DEFAULT_CONFIG, TYPE_BTN_FOOTER } from 'src/app/public/constants';
import ErrorUtils from 'src/app/shared/utils/ErrorUtils';
import { URL } from '../modal/constant';
import { IParamsSearch, IResponseTransactionInfo } from '../modal/interface';
import { ModuleKeys } from 'src/app/public/module-permission.utils';
import * as moment from 'moment';
import { TransactionInfoService } from '../../services/transaction-info.service';

@Component({
  selector: 'app-detail-transaction-info',
  templateUrl: './detail-transaction-info.component.html',
  styleUrls: ['./detail-transaction-info.component.scss']
})
export class DetailTransactionInfoComponent extends ComponentAbstract {

  dataTransactionOrigin: IResponseTransactionInfo;
  requestParams: any

  constructor(
    protected injector: Injector,
    private transactionInfoService: TransactionInfoService,
  ) {
    super(injector)
  }

  protected componentInit(): void {
    this.enableActions(ModuleKeys.napas_ibft_reconcile_transaction);
    this.searchTransactionOrigin()
    this.listButton = this.listButtonDynamic('', BUTTON_UNDO)
  }

  searchTransactionOrigin() {
    if (this.queryParams.transactionDate) {
      const rawParamsOrigin: IParamsSearch = {
        transactionReferenceNumber: this.queryParams?.transactionReferenceNumber,
        transactionDate: this.queryParams?.transactionDate,
        toTransactionDate: this.queryParams?.transactionDate,
      };
      const paramsTransactionOrigin = this.cleanObject(rawParamsOrigin);
      this.requestParams = {
        page: 0,
        size: 10,
      }

      this.indicator.showActivityIndicator();
      this.transactionInfoService.getTransactionInfo(paramsTransactionOrigin, this.requestParams).pipe(
        takeUntil(this.ngUnsubscribe),
        finalize(() => this.indicator.hideActivityIndicator())
      ).subscribe((res) => {
        // Gọi API thành công và có data trả về
        if (res && res.status === 200) {
          this.hasDataSource = true;
          const page = this.pageIndex * this.pageSize;
          const data = res.data.content.map((obj, index) => {
            obj.stt = page + index + 1;
            return obj;
          });
          this.dataTransactionOrigin = data[0]

          this.totalItem = res.data.totalElements;
        } else {
          this.hasDataSource = false;
          this.totalItem = 0;
          this.toastr.showToastr(
            res.soaErrorDesc ? res.soaErrorDesc : 'Lỗi hệ thống.',
            'Thông báo!',
            MessageSeverity.error,
            TOAST_DEFAULT_CONFIG
          )
        }
        this.dataSource.sort = this.sort;
      }, error => {
        console.log('error');
        this.hasDataSource = false;
        const messageError = ErrorUtils.getErrorMessage(error);
        this.toastr.showToastr(
          messageError.join('\n'),
          'Thông báo!',
          MessageSeverity.error,
          TOAST_DEFAULT_CONFIG
        )
      });
    }
  }

  cleanObject<T>(obj: T): Partial<T> {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        (acc as any)[key] = value;
      }
      return acc;
    }, {} as Partial<T>);
  }

  convertToTimeFormat(timeStr: string): string {
    if (!timeStr || timeStr.length !== 6) return '';
    return timeStr.slice(0, 2) + ':' + timeStr.slice(2, 4) + ':' + timeStr.slice(4, 6);
  }

  convertToDateFormat(dateStr: string): string {
    if (!dateStr || dateStr.length !== 4) return '';
    return dateStr.slice(2, 4) + '-' + dateStr.slice(0, 2);
  }

  // getLabel($status: any) {
  //   const status = STATUS_LABEL_INITIALIZE_TRANSACTION.find(item => item.key === $status);
  //   if (status) {
  //     return `<label class="wf-status ${status.class}">${status.value}</label>`;
  //   } else {
  //     return '';
  //   }
  // }

  onClickBtn($event?: any): void {
    switch ($event) {
      case TYPE_BTN_FOOTER.TYPE_UNDO:
        this.router.navigate([URL.NAPAS.IBFT_RECONCILE.OUT.TRANSACTION.SEARCH_TRANSACTION], { state: { transactionReferenceNumber: this.dataTransactionOrigin?.transactionReferenceNumber, transactionDate: this.dataTransactionOrigin?.createdAt}});
        break;
    }
  }

}
