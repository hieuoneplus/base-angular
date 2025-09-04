import { Component, Injector, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ComponentAbstract, MessageSeverity } from '@shared-sm';
import * as moment from 'moment';
import { finalize, takeUntil } from 'rxjs/operators';
import { TOAST_DEFAULT_CONFIG } from 'src/app/public/constants';
import { ModuleKeys } from 'src/app/public/module-permission.utils';
import ErrorUtils from 'src/app/shared/utils/ErrorUtils';
import { FlagReportService } from '../services/flag-report.service';
import { COLUMS, CREATED_AT, FLAG, FLAG_ORS, REPORT_NAME, URL, VERSION_RECONCILE, STATUS_LABEL, LABEL_SERVICE, LABEL_RECEIVING_ROLE, SELECT_REPORT_NAME } from './modal/constant';

@Component({
  selector: 'app-flag-report',
  templateUrl: './flag-report.component.html',
  styleUrls: ['./flag-report.component.scss']
})
export class FlagReportComponent extends ComponentAbstract {

  displayedColumns = COLUMS;

  $reportName = REPORT_NAME();
  $flag = FLAG();
  $flagOrs = FLAG_ORS();
  $versionReconcile = VERSION_RECONCILE();
  $createdAt = CREATED_AT();

  hasDataSource = false;
  requestParams: any

  constructor(
    protected injector: Injector,
    private flagReportService: FlagReportService,
  ) {
    super(injector)
  }

  protected componentInit(): void {
    this.enableActions(ModuleKeys.napas_ibft_reconcile_flag_report);
    this.form = this.itemControl.toFormGroup([
      this.$reportName,
      this.$flag,
      this.$flagOrs,
      this.$versionReconcile,
      this.$createdAt,
    ]);
    this.search();
  }

  search() {
    this.pageIndex = 0;
    this.pageSize = 10;

    const params = Object.assign(
      {},
      Object.entries(this.form.value).reduce((acc, [key, value]) => {
        if (key === 'createdAt') {
          const rawDate = this.form.get(key)?.value;
          if (rawDate) {
            const date = moment(rawDate).startOf('day').format('YYYY-MM-DD');
            acc[key] = date;
          } else {
            acc[key] = null;
          }
        } else {
          acc[key] = typeof value === 'string' && value.trim() !== '' ? value.trim() : null;
        }
        return acc;
      }, {})
    );

    this.options = {
      params: {
        ...params,
      }
    };

    this.requestParams = {
      page: this.pageIndex,
      size: this.pageSize,
    }
    this.dformPagination.goto(this.pageSize, this.pageIndex);
  }

  QueryData() {
    this.indicator.showActivityIndicator();
    this.flagReportService.getFlagReport(this.options.params, this.requestParams).pipe(
      takeUntil(this.ngUnsubscribe),
      finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe((res) => {
      // Gọi API thành công và có data trả về
      if (res && res.status === 200) {
        this.hasDataSource = true;
        const page = this.pageIndex * this.pageSize;
        const data = res.data.flagReportResponses.map((obj, index) => {
          obj.stt = page + index + 1;
          return obj;
        });

        this.dataSource = new MatTableDataSource(data);
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

  convertToTimeFormat(timeStr: string): string {
    if (!timeStr || timeStr.length !== 6) return '';
    return timeStr.slice(0, 2) + ':' + timeStr.slice(2, 4) + ':' + timeStr.slice(4, 6);
  }

  convertToDateFormat(dateStr: string): string {
    if (!dateStr || dateStr.length !== 4) return '';
    return dateStr.slice(2, 4) + '-' + dateStr.slice(0, 2);
  }


  changePageIndex($event) {
    this.pageSize = $event.pageSize;
    this.pageIndex = $event.pageIndex;
    this.options = {
      params: {
        ...this.options.params,
      }
    };
    this.requestParams = {
      page: this.pageIndex,
      size: this.pageSize,
    }
    this.QueryData();
  }

  resetFormSearch() {
    this.form.reset();
  }

  viewDetail(element) {
    this.goTo(URL.NAPAS.IBFT_RECONCILE.OUT.FLAG_REPORT.DETAIL, { id: element?.id});
  }

  onClickCreateReq() {
    this.goTo(URL.NAPAS.IBFT_RECONCILE.OUT.FLAG_REPORT.CREATE);
  }

  onClickEdit(element) {
    this.goTo(URL.NAPAS.IBFT_RECONCILE.OUT.FLAG_REPORT.EDIT, { id: element?.id});
  }

}
