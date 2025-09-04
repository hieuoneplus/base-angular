import { Component, Injector } from '@angular/core';
import { ComponentAbstract, MessageSeverity,ToastService } from '@shared-sm';
import { BehaviorSubject } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections'
import { PageEvent } from '@angular/material/paginator';
import { DFORM_CONFIRM_STATUS, TOAST_DEFAULT_CONFIG } from 'src/app/public/constants';
import { STATUS, SUBPRODUCT, CATEGORY,CODE,SUB_PRODUCT_REQUIRED } from '../../../data-form/whitelist-categories-form';
import {finalize, takeUntil} from "rxjs/operators";
import {MatTableDataSource} from "@angular/material/table";
import { IWhitelistCategoryContent } from 'src/app/features/model/citad';
import { WhitelistCategoriesService } from '../services/whitelist-categories';
import ErrorUtils from 'src/app/shared/utils/ErrorUtils';
import { ModuleKeys } from 'src/app/public/module-permission.utils';
import { HttpResponse } from '@angular/common/http';
@Component({
  selector: 'whitelist-categories-page',
  templateUrl: './whitelist-categories.component.html',
  styleUrls: ['./whitelist-categories.component.scss']
})
export class WhitelistCategoriesComponent extends ComponentAbstract {

  // Table view
  displayedColumns: string[] = [
    'stt', 'code', 'category','subProduct','subProductRequired','status', 'actions'
  ];



  $category =  CATEGORY();
  $code = CODE();
  $subProduct = SUBPRODUCT();
  $status = STATUS();
  $subProductRequired = SUB_PRODUCT_REQUIRED();


  hasDataSource = false;
  selection = new SelectionModel<any>(true, []);
  selectionObs = new BehaviorSubject<any>('');
  pageEvent: PageEvent = new PageEvent();
  listDataSelect: Array<IWhitelistCategoryContent> = [];

  constructor(
    protected injector: Injector,
      private whitelistCategoriesService: WhitelistCategoriesService,
      private toastService: ToastService
  ) {
    super(injector);
  }

  protected componentInit(): void {
    this.enableActions(ModuleKeys.citad_whitelist_categories);
    this.form = this.itemControl.toFormGroup([
      this.$category,this.$code,this.$subProduct,this.$subProductRequired,this.$status
    ]);
    this.search();
  }


  search() {
    if (this.enableView) {
    this.pageIndex = 0;
    this.pageSize = 10;
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
  else {
    this.toastService.showToastr('Bạn không có quyền truy cập hợp lệ', "Thông báo", MessageSeverity.error)
  }
  }
  QueryData() {
    this.listDataSelect = []
    this.indicator.showActivityIndicator()
    this.whitelistCategoriesService.getWhitelistCategories(this.options.params).pipe(
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
            return { stt: this.pageIndex * this.pageSize +index + 1, ...obj, };
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
  onClickCreateWhitelistCategory() {
    this.goTo('/pmp_admin/transfer-channel/citad/whitelist-categories/add')
  }
  onClickGetWhitelistCategoriesHistories() {
    this.goTo('/pmp_admin/transfer-channel/citad/whitelist-categories/history')
  }

  viewDetail(element) {
    this.goTo('/pmp_admin/transfer-channel/citad/whitelist-categories/detail', { id: element.id });
  }

  onClickDelete(element) {
    this.dialogService.dformconfirm({
      label: 'Xóa cấu hình',
      title: 'Lý do',
      description: 'Nhập lý do xóa cấu hình',
      acceptBtn: 'Xác nhận',
      closeBtn: 'Hủy',
      maxLength: 1024
    }, (result: any) => {
      if (result && result.data.length > 1024) {
        this.toastService.showToastr('Lý do đã vượt quá 1024 kí tự!', 'Thông báo!', MessageSeverity.error, '');
      } else
      if (result.status === DFORM_CONFIRM_STATUS.CONFIRMED) {
        this.indicator.showActivityIndicator();
        this.whitelistCategoriesService.deleteWhitelistCategory(element.id).pipe(
          takeUntil(this.ngUnsubscribe),
          finalize(() => this.indicator.hideActivityIndicator())
        ).subscribe((res) => {
          console.log("RESPONSE", res);
          // Gọi API thành công và có data trả về
          this.toastr.showToastr(
            'Xóa cấu hình thành công',
            'Thông báo!',
            MessageSeverity.success,
            TOAST_DEFAULT_CONFIG
          );
          this.resetFormSearch();
        }, error => {
          const errMessage = ErrorUtils.getErrorMessage(error)
          this.toastService.showToastr(errMessage.join('\n'), "Thông báo", MessageSeverity.error,TOAST_DEFAULT_CONFIG)
        });
      }
    })

  }
  onClickEdit(element) {
    console.log("EDIT ", element);
    this.goTo('/pmp_admin/transfer-channel/citad/whitelist-categories/edit', { id: element.id });
  }
  resetFormSearch() {
    this.form.reset();
    this.search();
  }

  exportExcel() {
    this.indicator.showActivityIndicator()
    this.whitelistCategoriesService.exportWhitelistCategoriesCitad().pipe(
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
          a.download = 'CauHinhCategoryDuocPhepGhiCoTuDong.xlsx'
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
