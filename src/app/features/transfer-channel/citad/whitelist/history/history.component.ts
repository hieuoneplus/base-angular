import { Component, Injector } from '@angular/core';
import { Observable } from "rxjs";
import { ComponentAbstract, converDateToDate, convertDateFromServer, HttpResponse, IPageable, MessageSeverity, ToastService } from "@shared-sm";
import { finalize, takeUntil } from "rxjs/operators";
import { MatTableDataSource } from "@angular/material/table";
import * as moment from 'moment';
import { IAccountContent } from '../../model/account';
import { CitadWhitelistService } from '../../services/whitelist';
import { UPDATED_BY, UPDATE_AT_FROM, UPDATE_AT_TO } from '../../history/modal/constant';
import ErrorUtils from 'src/app/shared/utils/ErrorUtils';
import { ACCOUNT } from '../../data-form/account-data-form';
import { PaginationQueryTransactionCitadDto } from 'src/app/features/model/citad';
import { BUTTON_UNDO, TOAST_DEFAULT_CONFIG, TYPE_BTN_FOOTER } from 'src/app/public/constants';

@Component({
  selector: 'app-whitelist-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent extends ComponentAbstract {
  displayedColumns: string[] = [
   'stt','id', 'accountNo', 'action', 'updatedBy', 'updatedAt', 'reason',
  ];

  $accountNo = ACCOUNT();
  $updatedAtFrom = UPDATE_AT_FROM();
  $updatedAtTo = UPDATE_AT_TO();
  $updatedBy = UPDATED_BY();

  constructor(
    protected injector: Injector,
    private whitelistService: CitadWhitelistService,
    private toastService: ToastService,
  ) {
    super(injector);
  }

  protected componentInit(): void {
    this.form = this.itemControl.toFormGroup([
      this.$accountNo, this.$updatedAtFrom, this.$updatedAtTo, this.$updatedBy
    ]);
    this.listButton = this.listButtonDynamic('', BUTTON_UNDO);
    this.trackDateValidate()
    this.search()
  }

  trackDateValidate() {
    this.form.get('updatedAtTo')?.valueChanges.pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      next: (value) => {
        if (!value) {
          this.$updatedAtFrom.maxDate = moment(new Date).format('YYYY-MM-DD')
        } else {
          this.$updatedAtFrom.maxDate = moment(value).format('YYYY-MM-DD')
        }
      }
    })

    this.form.get('updatedAtFrom')?.valueChanges.pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      next: (value) => {
        this.$updatedAtTo.minDate = moment(value).format('YYYY-MM-DD')
        if (this.form.get('updatedAtFrom').value > this.form.get('updatedAtTo').value) {
          this.form.patchValue({ updatedAtTo: value })
        }
      }
    })
  }

  handleGetList(): Observable<HttpResponse<PaginationQueryTransactionCitadDto<IAccountContent>>> {
    this.indicator.showActivityIndicator()
    this.form.patchValue({
      updatedAtFrom: this.form.get('updatedAtFrom')?.value ? moment(this.form.get('updatedAtFrom')?.value).startOf('day').utcOffset(7).format('YYYY-MM-DDT00:00:00+07:00') : null,
      updatedAtTo: this.form.get('updatedAtTo')?.value ? moment(this.form.get('updatedAtTo')?.value).startOf('day').utcOffset(7).format('YYYY-MM-DDT23:59:59+07:00') : null,

    })
    const searchInput = Object.assign(
      {},
      Object.entries(this.form.value).reduce((acc, [key, value]) => {
        acc[key] = typeof value === 'string' ? value.trim() : value;
        return acc;
      }, {}),
    )
    this.options = {
      params: {
        ...searchInput,
        page: this.pageIndex,
        size: this.pageSize,
        sort: 'updatedAt:DESC'
      }
    };
    return this.whitelistService.getHistories(this.options.params).pipe(
      finalize(() => { this.indicator.hideActivityIndicator() }),
      takeUntil(this.ngUnsubscribe)
    )
  }

  search() {
    this.handleGetList()
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe({
        next: (res) => {
          if (res && res.status === 200) {
            this.hasDataSource = true;
            this.pageIndex = res.data.pageable.pageNumber;
            this.pageSize = res.data.pageable.pageSize;
            this.totalItem = res.data.totalElements;
            const data = res.data.content.map((obj, index) => {
              return { stt: this.pageIndex * this.pageSize + index + 1, ...obj, };
            });
            this.dataSource = new MatTableDataSource(data);
            // this.totalItem = res.data.total;
          } else {
            this.hasDataSource = false;
            this.totalItem = 0;
            this.dialogService.error({
              title: 'dialog.notification',
              message: res.soaErrorDesc ? res.soaErrorDesc : 'Lỗi hệ thống.'
            }, resp => {
              if (res) {
              }
            });
          }
          this.dataSource.sort = this.sort;
        },
        error: (err) => {
          const errMessage = ErrorUtils.getErrorMessage(err)
          this.toastService.showToastr(errMessage.join('\n'), "Thông báo", MessageSeverity.error,TOAST_DEFAULT_CONFIG)
        }
      })
  }

  onClickSearch() {
    this.pageIndex = 0
    this.search()
  }

  changePageIndex($event) {
    this.pageSize = $event.pageSize;
    this.pageIndex = $event.pageIndex;
    this.search()
  }

  convertDate(date): string {
    if (date) {
      if (date.includes('/')) {
        return date;
      } else if (date.includes('-')) {
        return converDateToDate(date, 'YYYY-MM-DD', 'DD/MM/YYYY');
      }
      return converDateToDate(convertDateFromServer(date), 'YYYY/MM/DD', 'DD/MM/YYYY');
    }
  }

  onClickBtn($event?: any): void {
    switch ($event) {
      case TYPE_BTN_FOOTER.TYPE_UNDO:
        this.goTo('pmp_admin/transfer-channel/citad/whitelist-account');
        break;
    }
  }

}
