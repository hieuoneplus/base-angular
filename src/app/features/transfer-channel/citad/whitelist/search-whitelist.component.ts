import { Component, Injector } from '@angular/core';
import { ComponentAbstract, MessageSeverity } from '@shared-sm';
import { BehaviorSubject } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { PageEvent } from '@angular/material/paginator';
import { finalize, takeUntil } from "rxjs/operators";
import { MatTableDataSource } from "@angular/material/table";
import { CitadWhitelistService } from '../services/whitelist';
import { IAccountContent } from '../model/account';
import { DFORM_CONFIRM_STATUS, TOAST_DEFAULT_CONFIG } from 'src/app/public/constants';
import { ACCOUNT } from '../data-form/account-data-form';
import ErrorUtils from 'src/app/shared/utils/ErrorUtils';
import { HttpResponse } from '@angular/common/http';
import { ModuleKeys } from 'src/app/public/module-permission.utils';

@Component({
  selector: 'citad-search-whilelist-page',
  templateUrl: './search-whitelist.component.html',
  styleUrls: ['./search-whitelist.component.scss']
})
export class SearchWhitelistComponent extends ComponentAbstract {

  // Table view
  displayedColumns: string[] = [
    'stt', 'account', 'reason', 'actions'
  ];

  $account = ACCOUNT();

  hasDataSource = false;
  selection = new SelectionModel<any>(true, []);
  selectionObs = new BehaviorSubject<any>('');
  pageEvent: PageEvent = new PageEvent();

  constructor(
    protected injector: Injector,
    private whitelistService: CitadWhitelistService
  ) {
    super(injector);
  }

  protected componentInit(): void {
    this.form = this.itemControl.toFormGroup([
      this.$account
    ]);
    this.enableActions(ModuleKeys.citad_whitelist_accounts)
    this.search();
  }

  search() {
    this.pageIndex = 0;
    this.pageSize = 10;
    this.options = {
      params: Object.assign({ ...this.form.value }, {
        page: this.pageIndex,
        size: this.pageSize,
        sort: 'id:DESC'
      })
    };
    this.dformPagination.goto(this.pageSize, this.pageIndex);
  }

  QueryData() {
    this.indicator.showActivityIndicator();
    this.whitelistService.getWhitelistAccounts(this.options.params).pipe(
      takeUntil(this.ngUnsubscribe),
      finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe((res) => {
      console.log("RESPONSE", res)
      // Gọi API thành công và có data trả về
      if (res && res.status === 200) {
        this.hasDataSource = true;
        const page = this.pageIndex * this.pageSize;
        const data = res.data.content.map((obj, index) => {
          obj.stt = page + index + 1;
          return obj;
        });
        this.dataSource = new MatTableDataSource(data);
        this.totalItem = res.data.totalElements;
      } else {
        console.log("ERROR", res)
        this.hasDataSource = false;
        this.totalItem = 0;

      }
      this.dataSource.sort = this.sort;
    }, error => {
      console.log("ERROR", error)
      const messsageError = ErrorUtils.getErrorMessage(error);
      this.toastr.showToastr(
        messsageError.join('\n'),
        'Thông báo!',
        MessageSeverity.error,
        TOAST_DEFAULT_CONFIG
      );
    });
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
  onClickCreateAccount() {
    this.goTo('/pmp_admin/transfer-channel/citad/whitelist-account/add')
  }

  onClickEdit(element: IAccountContent) {
    console.log("EDIT ", element);
    this.goTo('/pmp_admin/transfer-channel/citad/whitelist-account/edit', { id: element.id });
  }

  onClickDelete(element: IAccountContent) {
    this.dialogService.confirm({
      message: 'Bạn có chắc chắn muốn xóa không?',
      label:"Xác nhận",
      acceptBtn: "Xóa",
      closeBtn:"Hủy"
    }, (result: any) => {
      if (result.status === DFORM_CONFIRM_STATUS.CONFIRMED) {
        this.deleteAccount(element.id);
      }
    });
  }

  deleteAccount(id: string) {
    this.indicator.showActivityIndicator();
    this.whitelistService.deleteAccount(id).pipe(
      takeUntil(this.ngUnsubscribe),
      finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe((res) => {
      console.log("RESPONSE", res)
      // Gọi API thành công và có data trả về
      if (res && res.status === 200) {
        this.toastr.showToastr(
          'Xóa tài khoản thành công',
          'Thông báo!',
          MessageSeverity.success,
          TOAST_DEFAULT_CONFIG
        );
      } else {
        this.toastr.showToastr(
          'Xóa tài khoản không thành công',
          'Thông báo!',
          MessageSeverity.success,
          TOAST_DEFAULT_CONFIG
        );
      }
      this.QueryData();
    }, error => {
      const messsageError = ErrorUtils.getErrorMessage(error);
      this.toastr.showToastr(
        messsageError.join('\n'),
        'Thông báo!',
        MessageSeverity.error,
        TOAST_DEFAULT_CONFIG
      );
    });
  }

  resetFormSearch() {
    this.form.reset();
    this.search();
  }

  onClickHistory() {
    this.goTo('/pmp_admin/transfer-channel/citad/whitelist-account/histories')
  }

  exportExcel() {
    this.indicator.showActivityIndicator()
    this.whitelistService.exportWhitelistAccounts().pipe(
      finalize(() => {
        this.indicator.hideActivityIndicator()
      }),
      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      next: (res) => {
        if (res instanceof HttpResponse) {
          const blob = new Blob([res.body], { type: res.headers.get('Content-Type') });
          let url = window.URL.createObjectURL(blob);
          var a = document.createElement("a");
          a.href = url;
          a.download = 'Tai_khoan_duoc_ghi_co_tu_dong.xlsx'
          a.click();
          window.URL.revokeObjectURL(url);
        }
      },
      error: (err) => {
        const messsageError = ErrorUtils.getErrorMessage(err);
        this.toastr.showToastr(
          messsageError.join('\n'),
          'Thông báo!',
          MessageSeverity.error,
          TOAST_DEFAULT_CONFIG
        );
      }
    })
  }
}
