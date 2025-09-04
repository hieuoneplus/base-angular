import { Component, Injector } from '@angular/core';
import { Observable } from "rxjs";
import { PageEvent } from "@angular/material/paginator";
import { ComponentAbstract, HttpResponse, MessageSeverity, ToastService } from "@shared-sm";
import { finalize, takeUntil } from "rxjs/operators";
import { MatTableDataSource } from "@angular/material/table";

import ErrorUtils from "../../../../shared/utils/ErrorUtils";
import * as moment from 'moment';
import { BUTTON_UNDO, TYPE_BTN_FOOTER } from 'src/app/public/constants';
import {UPDATE_BY, UPDATE_AT_FROM, UPDATE_AT_TO, STATUS_LABEL_TRANSACTION} from '../modal/constant';
import {IHistory, IPageable} from '../modal/interface'
import { WhitelistService } from '../../service/WhitelistService';
import { ModuleKeys } from 'src/app/public/module-permission.utils';

@Component({
  selector: 'app-historys',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent extends ComponentAbstract {
  displayedColumns: string[] = [
    'stt', 'accountNo', 'bankCode', 'transferChannel', 'active', 'approvalStatus', 'typeUpdate', 'updatedAt','updatedBy', 'reason', 'actions'
  ];

  $updatedAtFrom = UPDATE_AT_FROM();
  $updatedAtTo = UPDATE_AT_TO();
  $updatedBy = UPDATE_BY();

  hasDataSource = false;
  pageEvent: PageEvent = new PageEvent();

  constructor(
    protected injector: Injector,
    protected whitelistService: WhitelistService,
    private toastService: ToastService,
  ) {
    super(injector);
  }

  protected componentInit(): void {

    this.enableActions(ModuleKeys.routing_whitelist)

    this.form = this.itemControl.toFormGroup([
      this.$updatedAtFrom, this.$updatedAtTo, this.$updatedBy
    ]);
    // this.trackDateValidate()
    this.search()
    this.listButton = this.listButtonDynamic('', BUTTON_UNDO);
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

      }
    })
  }

  handleGetList(): Observable<HttpResponse<IPageable<IHistory>>> {
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
      }
    };
    return this.whitelistService.getHistoryConfigList(this.options.params, this.queryParams?.id).pipe(
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
          // const data = res.data.content
          this.pageIndex = res.data.page
          this.totalItem = res.data.total;
          const page = this.pageIndex * this.pageSize;
          const data = res.data.content.map((obj, index) => {
            obj.stt = page + index + 1;
            obj.approvalStatusLabel = this.getLabelApprovalStatus(obj.approvalStatus);
            return obj;
          });
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

  viewDetailHistory(id: number) {
    this.goTo('/pmp_admin/routing/whitelist/detail-history', {id: id})
  }

  getLabelApprovalStatus(approvalStatus: string) {
    const status = (STATUS_LABEL_TRANSACTION || []).find(item => item.key === approvalStatus);
    if (status) {
      return `<label class="wf-status ${status.class}">${status.value}</label>`;
    } else {
      return '';
    }
  }
  onClickBtn(event: any) {
    switch (event) {
      case TYPE_BTN_FOOTER.TYPE_UNDO:
        window.history.back()
        break;
    }
  }
}
