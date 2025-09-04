import { Component, Injector } from '@angular/core';
import { SelectionModel } from "@angular/cdk/collections";
import { BehaviorSubject, Observable } from "rxjs";
import { PageEvent } from "@angular/material/paginator";
import { ComponentAbstract, HttpResponse, IPageable, MessageSeverity, ToastService } from "@shared-sm";
import { finalize, takeUntil } from "rxjs/operators";
import { MatTableDataSource } from "@angular/material/table";

import { IConfig, PaginationBaseDto } from "../modal/interface";
import { URL } from "../modal/constant";

import { BUTTON_UNDO, TYPE_BTN_FOOTER } from 'src/app/public/constants';
import ErrorUtils from 'src/app/shared/utils/ErrorUtils';
import { TransactionFlagService } from '../../services/transaction-flag.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent extends ComponentAbstract {
  displayedColumns: string[] = [
    'key', 'value', 'createTime','reason', 'createdBy',
  ];

  hasDataSource = false;
  selection = new SelectionModel<any>(true, []);
  selectionObs = new BehaviorSubject<any>('');
  pageEvent: PageEvent = new PageEvent();

  constructor(
    protected injector: Injector,

    private transactionFlagService: TransactionFlagService,
    private toastService: ToastService,
  ) {
    super(injector);
  }

  protected componentInit(): void {
    this.search()
    this.listButton = this.listButtonDynamic('', BUTTON_UNDO);
  }

  handleGetList(): Observable<HttpResponse<PaginationBaseDto<IConfig[]>>> {
    this.indicator.showActivityIndicator()
    this.options = {
      params: {
        pageNumber: this.pageIndex + 1,
        pageSize: this.pageSize,
      }
    };
    return this.transactionFlagService.getHistoryConfigList(this.options.params).pipe(
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
          this.hasDataSource = true;
          const data = res.data.configHistories
          // this.pageIndex = res.data.pageable.pageNumber
          this.totalItem = res.data.total || 0;
          this.dataSource = new MatTableDataSource(data);
        },
        error: (err) => {
          const errMessage = ErrorUtils.getErrorMessage(err)
          this.toastService.showToastr(errMessage.join('\n'), "Thông báo", MessageSeverity.error)
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

  onClickBtn($event?: any): void {
    switch ($event) {
      case TYPE_BTN_FOOTER.TYPE_UNDO:
        this.goTo(URL.NAPAS.IBFT_RECONCILE.OUT.TRANSACTION_FLAG.SEARCH)
        break;
    }
  }

}
