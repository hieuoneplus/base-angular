import { SelectionModel } from "@angular/cdk/collections";
import { Component, Injector } from '@angular/core';
import { PageEvent } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { ComponentAbstract, HttpResponse, IPageable, MessageSeverity, ToastService } from "@shared-sm";
import { BehaviorSubject, Observable } from "rxjs";
import { finalize, takeUntil } from "rxjs/operators";

import * as moment from 'moment';
import { BUTTON_UNDO, TYPE_BTN_FOOTER } from 'src/app/public/constants';
import ErrorUtils from "../../../../shared/utils/ErrorUtils";
import { IConfig } from "../../../model/citad";
import { KeyConfigCitad } from '../constant';
import { DetailHistoryConfigCitadComponent } from './detail-history/detail-history.component';
import { HistoryConfigCitadService } from "./history.service";
import { KEY, UPDATE_AT_FROM, UPDATE_AT_TO, UPDATED_BY } from "./modal/constant";

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent extends ComponentAbstract {
  displayedColumns: string[] = [
    'id', 'configId', 'key', 'action', 'updatedBy', 'updatedAt', 'reason', 'actions'
  ];

  $key = KEY();
  $updatedAtFrom = UPDATE_AT_FROM();
  $updatedAtTo = UPDATE_AT_TO();
  $updatedBy = UPDATED_BY();

  hasDataSource = false;
  selection = new SelectionModel<any>(true, []);
  selectionObs = new BehaviorSubject<any>('');
  pageEvent: PageEvent = new PageEvent();

  constructor(
    protected injector: Injector,

    private historyConfigCitadService: HistoryConfigCitadService,
    private toastService: ToastService,
  ) {
    super(injector);
  }

  protected componentInit(): void {
    this.form = this.itemControl.toFormGroup([
      this.$key, this.$updatedAtFrom, this.$updatedAtTo, this.$updatedBy
    ]);
    this.form.patchValue({ key: this.queryParams.keyConfig })
    this.trackDateValidate()
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
        // if(this.form.get('updatedAtFrom').value > this.form.get('updatedAtTo').value){
        //   this.form.patchValue({updatedAtTo: value})
        // }
      }
    })
  }

  handleGetList(): Observable<HttpResponse<IPageable<IConfig[]>>> {
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
    return this.historyConfigCitadService.getHistoryConfigList(this.options.params).pipe(
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
          const data = res.data.content
          this.pageIndex = res.data.pageable.pageNumber
          this.totalItem = res.data.totalElements || 0;
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

  viewDetail(element: number) {
    this.dialogService.componentDialog(DetailHistoryConfigCitadComponent, {
      name: 'DetailHistoryConfigCitadComponent',
      width: '60%',
      maxHeight: '97vh',
      maxWidth: '97vw',
      data: {
        idMessageError: element,
        key:this.queryParams.keyConfig
      }
    }, (res) => {
      if (res) {

      }
    });
  }

  handelCheckGoto() {
    let valueToCheck = ''
    if(this.queryParams.typeConfig) {
      valueToCheck = this.queryParams.typeConfig;
    } else {
      valueToCheck = this.queryParams.keyConfig;
    }
    switch (valueToCheck) {
      case KeyConfigCitad.transaction_abbreviation:
        this.goTo('pmp_admin/transfer-channel/citad/abbreviation-config');
        break;
      case KeyConfigCitad.refund_transaction_pattern:
        this.goTo('pmp_admin/transfer-channel/citad/refunds-signal');
        break;
      case KeyConfigCitad.partner_transaction_pattern:
        this.goTo('pmp_admin/transfer-channel/citad/mbs-signal');
        break;
      case KeyConfigCitad.hold_receiver_account:
        this.goTo('pmp_admin/transfer-channel/citad/hold-receiver-account');
        break;
      case KeyConfigCitad.hold_receiver_name_pattern:
        this.goTo('pmp_admin/transfer-channel/citad/hold-receiver-name');
        break;
      case KeyConfigCitad.account_parameter:
        this.goTo('pmp_admin/transfer-channel/citad/account.parameter');
        break;
      case KeyConfigCitad.transaction_replacement:
        this.goTo('pmp_admin/transfer-channel/citad/transaction-replacement');
        break;
      case KeyConfigCitad.gateway:
        this.goTo('pmp_admin/transfer-channel/citad/gateway');
        break;
      default:
        break;
    }
  }

  onClickBtn($event?: any): void {
    switch ($event) {
      case TYPE_BTN_FOOTER.TYPE_UNDO:
        this.handelCheckGoto()
        break;
    }
  }

}
