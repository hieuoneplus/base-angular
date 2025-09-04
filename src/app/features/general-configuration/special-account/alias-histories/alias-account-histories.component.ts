import { SelectionModel } from '@angular/cdk/collections';
import { Component, Injector } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from "@angular/material/table";
import { ComponentAbstract, MessageSeverity, ToastService } from '@shared-sm';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { finalize, takeUntil } from "rxjs/operators";
import { BUTTON_UNDO, TOAST_DEFAULT_CONFIG, TYPE_BTN_FOOTER } from 'src/app/public/constants';
import ErrorUtils from 'src/app/shared/utils/ErrorUtils';
import { ModuleKeys } from "../../../../public/module-permission.utils";
import { SpecialAccountService } from "../../service/SpecialAccountService";
import { displayedColumnsHistory, STATUS_FORM, UPDATE_AT_FROM, UPDATE_AT_TO, UPDATED_BY } from '../modal/constant';

@Component({
  selector: 'alias-account-histories-page',
  templateUrl: './alias-account-histories.component.html',
  styleUrls: ['./alias-account-histories.component.scss']
})
export class AliasAccountHistoriesComponent extends ComponentAbstract {

  // Table view
  displayedColumns:string[] =  displayedColumnsHistory;

  $updatedAtFrom = UPDATE_AT_FROM();
  $updatedAtTo = UPDATE_AT_TO();
  $updatedBy = UPDATED_BY();

  hasDataSource = false;
  selection = new SelectionModel<any>(true, []);
  selectionObs = new BehaviorSubject<any>('');
  pageEvent: PageEvent = new PageEvent();
  keyBack: string;

  constructor(
    protected injector: Injector,
    private specialAccountService: SpecialAccountService,
    private toastService: ToastService
  ) {
    super(injector);
  }

  protected componentInit(): void {
    this.enableActions(ModuleKeys.alias_account);
    this.form = this.itemControl.toFormGroup([
      this.$updatedAtFrom,this.$updatedAtTo,this.$updatedBy
    ]);
    this.trackDateValidate()
    this.search();

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
  search() {
    this.pageIndex = 0;
    this.pageSize = 10;
    this.form.patchValue({
      updatedAtFrom: this.form.get('updatedAtFrom')?.value ? moment(this.form.get('updatedAtFrom')?.value).startOf('day').utcOffset(7).format('YYYY-MM-DDT00:00:00+07:00') : null,
      updatedAtTo: this.form.get('updatedAtTo')?.value ? moment(this.form.get('updatedAtTo')?.value).startOf('day').utcOffset(7).format('YYYY-MM-DDT23:59:59+07:00') : null,

    })
    this.options = {
      params: Object.assign(
        {},
        Object.entries(this.form.value).reduce((acc, [key, value]) => {
          acc[key] = typeof value === 'string' ? value.trim() : value;
          return acc;
        }, {}),
        {
          page: this.pageIndex,
          size: this.pageSize,
          sort: 'id:DESC',
        }
      ),
    };
    this.dformPagination.goto(this.pageSize, this.pageIndex);
  }

  QueryData() {
    this.indicator.showActivityIndicator()
    this.specialAccountService.getAliasAccountHistory(this.queryParams.aliasAccountId, this.options.params).pipe(
      finalize(() => {
        this.indicator.hideActivityIndicator()
      }),
      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      next: (res) => {
        if (res && res.status === 200) {
          this.hasDataSource = true;
          this.pageIndex = res.data.page;
          this.pageSize = res.data.size;
          this.totalItem = res.data.total;
          const data = res.data.content.map((obj, index) => {
            return { stt: this.pageIndex * this.pageSize + index + 1, ...obj, };
          });
          this.dataSource = new MatTableDataSource(data);
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
      },
      error: (err) => {
        const errMessage = ErrorUtils.getErrorMessage(err)
        this.toastService.showToastr(errMessage.join('\n'), "Thông báo", MessageSeverity.error, TOAST_DEFAULT_CONFIG)
      }
    })
  }

  changePageIndex($event) {
    this.pageSize = $event.pageSize;
    this.pageIndex = $event.pageIndex;
    this.options = {
      params: {
        ...this.options.params,
        size: this.pageSize,
        page: this.pageIndex,
        sort: 'id:DESC'
      }
    };
    this.QueryData();
  }
  onClickBtn($event?: any): void {
    switch ($event) {
      case TYPE_BTN_FOOTER.TYPE_UNDO:
        this.goTo('/pmp_admin/general-config/special-account');
        break;
    }
  }
  viewDetail(element) {
    this.goTo('/pmp_admin/general-config/special-account/history/detail', {papAliasId: element.papAliasAccountId, idHistory: element.id });
  }

  convertMoney(money : number) {
    return money !== null ? money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : null;
  }
  getLabel($state) {
    const status = STATUS_FORM.find((item) => item.key === $state);
    return `<label class="wf-status ${status.class}">${status.value}</label>`;
  }
  trimInput(event: any, controlName: string): void {
    let inputValue = event.target.value;
    const trimmedValue = inputValue.trim();

    event.target.value = trimmedValue;
    const control = this.form.get(controlName);
    if (control) {
      control.setValue(trimmedValue);
    }
  }
}
