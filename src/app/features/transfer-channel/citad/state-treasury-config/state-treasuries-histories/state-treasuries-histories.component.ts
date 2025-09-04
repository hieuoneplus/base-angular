import { Component, Injector } from '@angular/core';
import { ComponentAbstract, MessageSeverity, ToastService } from '@shared-sm';
import { BehaviorSubject } from 'rxjs';
import { TYPE_BTN_FOOTER, TOAST_DEFAULT_CONFIG, BUTTON_UNDO } from 'src/app/public/constants';
import { SelectionModel } from '@angular/cdk/collections'
import { PageEvent } from '@angular/material/paginator';
import {
  BRANCHCODE_GET,
  CODE_GET,
  CREDIT_ACC_NO_GET,
  JSON_EX,
  NAME_GET,
  UPDATED_BY,
  UPDATED_FROM,
  UPDATED_TO,
  displayedColumns
} from '../constants';
import { finalize, takeUntil } from "rxjs/operators";
import { MatTableDataSource } from "@angular/material/table";
import ErrorUtils from 'src/app/shared/utils/ErrorUtils';
import * as moment from 'moment';
import { StateTreasuryConfigService } from '../../services/state-treasury-config-service.service';
import { DetailWhitelistCategoriesHistoryComponent } from '../../whitelist-categories/detail-whitelist-categories-histories/detail-whitelist-categories-histories.component';
import { DetailStateTreasuriesHistoryComponent } from '../detail-state-treasuries-histories/detail-state-treasuries-histories.component';
@Component({
  selector: 'state-treasuries-histories-page',
  templateUrl: './state-treasuries-histories.component.html',
  styleUrls: ['./state-treasuries-histories.component.scss']
})
export class StateTreasuriesHistoriesComponent extends ComponentAbstract {

  // Table view
  displayedColumns:string[] =  displayedColumns;



  $code = CODE_GET();
  $branchCode = BRANCHCODE_GET();
  $name = NAME_GET();
  $creditAccountNo = CREDIT_ACC_NO_GET();
  $updatedFrom = UPDATED_FROM();
  $updatedTo = UPDATED_TO();
  $updatedBy = UPDATED_BY();
  hasDataSource = false;
  selection = new SelectionModel<any>(true, []);
  selectionObs = new BehaviorSubject<any>('');
  pageEvent: PageEvent = new PageEvent();

  constructor(
    protected injector: Injector,
    private stateTreasuryConfigService: StateTreasuryConfigService,
    private toastService: ToastService
  ) {
    super(injector);
  }

  protected componentInit(): void {
    this.form = this.itemControl.toFormGroup([
      this.$name, this.$code,this.$creditAccountNo,this.$branchCode, this.$updatedBy, this.$updatedFrom, this.$updatedTo
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
          this.$updatedFrom.maxDate = moment(new Date).format('YYYY-MM-DD')
        } else {
          this.$updatedFrom.maxDate = moment(value).format('YYYY-MM-DD')
        }
      }
    })

    this.form.get('updatedAtFrom')?.valueChanges.pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      next: (value) => {
        this.$updatedTo.minDate = moment(value).format('YYYY-MM-DD')
        // if (this.form.get('updatedAtFrom').value > this.form.get('updatedAtTo').value) {
        //   this.form.patchValue({ updatedAtTo: value })
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
             sort: 'id:DESC'
        }
      ),
    };
    this.dformPagination.goto(this.pageSize, this.pageIndex);
  }

  QueryData() {
    this.indicator.showActivityIndicator()
    this.stateTreasuryConfigService.getStateTreasuriesHistory(this.options.params).pipe(
      finalize(() => {
        this.indicator.hideActivityIndicator()
      }),
      takeUntil(this.ngUnsubscribe)
    ).subscribe({
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
        this.goTo('/pmp_admin/transfer-channel/citad/state-treasuries');
        break;
    }
  }
  viewDetail(element: any) {
    this.dialogService.componentDialog(DetailStateTreasuriesHistoryComponent, {
      name: 'DetailMessageErrorManageComponent',
      width: '60%',
      maxHeight: '97vh',
      maxWidth: '97vw',
      data: {
        idHistory: element.id
      }
    }, (res) => {
      if (res) {

      }
    });
  }
}
