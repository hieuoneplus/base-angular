import { Component, Injector } from '@angular/core';
import { ComponentAbstract, MessageSeverity } from '@shared-sm';
import { finalize, takeUntil } from 'rxjs/operators';
import { BUTTON_CANCEL, BUTTON_EDIT, DFORM_CONFIRM_STATUS, TOAST_DEFAULT_CONFIG, TYPE_BTN_FOOTER } from 'src/app/public/constants';
import ErrorUtils from 'src/app/shared/utils/ErrorUtils';
import { URL, STATUS_LABEL, LABEL_SERVICE, LABEL_RECEIVING_ROLE, SELECT_REPORT_NAME } from '../modal/constant';
import { IParamsSearch, IResponseFlagReport } from '../modal/interface';
import { ModuleKeys } from 'src/app/public/module-permission.utils';
import * as moment from 'moment';
import { FlagReportService } from '../../services/flag-report.service';

@Component({
  selector: 'app-detail-flag-report',
  templateUrl: './detail-flag-report.component.html',
  styleUrls: ['./detail-flag-report.component.scss']
})
export class DetailFlagReportComponent extends ComponentAbstract {

  dataFlagReport: IResponseFlagReport;
  requestParams: any

  constructor(
    protected injector: Injector,
    private flagReportService: FlagReportService,
  ) {
    super(injector)
  }

  protected componentInit(): void {
    this.enableActions(ModuleKeys.napas_ibft_reconcile_flag_report);
    this.searchTransactionOrigin()
    this.listButton = this.listButtonDynamic('', BUTTON_CANCEL)
  }

  searchTransactionOrigin() {
    if (this.queryParams.id) {
      const rawParamsOrigin: IParamsSearch = {
        id: this.queryParams?.id
        // transactionReferenceNumber: this.queryParams?.transactionReferenceNumber,
        // transactionDate: this.queryParams?.transactionDate,
        // toTransactionDate: this.queryParams?.transactionDate,
      };
      const paramsTransactionOrigin = this.cleanObject(rawParamsOrigin);
      this.requestParams = {
        page: 0,
        size: 10,
      }

      this.indicator.showActivityIndicator();
      this.flagReportService.getFlagReport(paramsTransactionOrigin, this.requestParams).pipe(
        takeUntil(this.ngUnsubscribe),
        finalize(() => {
          this.indicator.hideActivityIndicator();
          this.loadBtn()
        })
      ).subscribe((res) => {
        // Gọi API thành công và có data trả về
        if (res && res.status === 200) {
          this.hasDataSource = true;
          const page = this.pageIndex * this.pageSize;
          const data = res.data.flagReportResponses.map((obj, index) => {
            obj.stt = page + index + 1;
            return obj;
          });
          this.dataFlagReport = data[0]

          this.totalItem = res.data.total;
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

  getLabel($status: any) {
    const status = STATUS_LABEL.find(item => item.key === $status);
    if (status) {
      return `<label class="wf-status ${status.class}">${status.value}</label>`;
    } else {
      return '';
    }
  }

  getLabelService($status: any) {
    const status = LABEL_SERVICE.find(item => item.key === $status);
    if (status) {
      return `<label>${status.value}</label>`;
    } else {
      return '';
    }
  }

  getLabelReceivingRole($status: any) {
    const status = LABEL_RECEIVING_ROLE.find(item => item.key === $status);
    if (status) {
      return `<label>${status.value}</label>`;
    } else {
      return '';
    }
  }

  getLabelReportName($status: any) {
    const status = SELECT_REPORT_NAME.find(item => item.key === $status);
    if (status) {
      return `<label>${status.value}</label>`;
    } else {
      return '';
    }
  }

  loadBtn() {
    this.listButton = this.enableUpdate && this.hasDataSource ? this.listButtonDynamic('', BUTTON_CANCEL, BUTTON_EDIT) : this.listButtonDynamic('', BUTTON_CANCEL);

  }

  onClickBtn($event?: any): void {
    switch ($event) {
      case TYPE_BTN_FOOTER.TYPE_CANCEL:
        this.goTo(URL.NAPAS.IBFT_RECONCILE.OUT.FLAG_REPORT.SEARCH);
        break;
      case TYPE_BTN_FOOTER.TYPE_EDIT:
        this.goTo(URL.NAPAS.IBFT_RECONCILE.OUT.FLAG_REPORT.EDIT, { id: this.queryParams?.id });
        break
    }
  }

}
