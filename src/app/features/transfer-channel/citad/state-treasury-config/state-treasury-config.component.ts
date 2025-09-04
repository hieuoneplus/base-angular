import { Component, Injector } from '@angular/core';
import { StateTreasuryConfigService } from '../services/state-treasury-config-service.service';
import { ComponentAbstract, MessageSeverity, ToastService } from '@shared-sm';

import {
  BRANCHCODE_GET,
  CODE_GET,
  CREDIT_ACC_NO_GET,
  JSON_EX,
  NAME_GET,
} from './constants';
import { BehaviorSubject } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { PageEvent } from '@angular/material/paginator';
import ErrorUtils from 'src/app/shared/utils/ErrorUtils';
import { MatTableDataSource } from '@angular/material/table';
import { finalize, takeUntil } from 'rxjs/operators';
import {
  DFORM_CONFIRM_STATUS,
  TOAST_DEFAULT_CONFIG,
} from 'src/app/public/constants';
import { ModuleKeys } from 'src/app/public/module-permission.utils';
import { HttpResponse } from '@angular/common/http';
import * as moment from 'moment';

@Component({
  selector: 'state-treasury-config-page',
  templateUrl: './state-treasury-config.component.html',
  styleUrls: ['./state-treasury-config.component.scss'],
})
export class StateTreasuryConfigComponent extends ComponentAbstract {
  displayedColumns: string[] = [
    'stt',
    'code',
    'name',
    'creditAccountNo',
    'branchCode',
    'actions',
  ];

  $code = CODE_GET();
  $branchCode = BRANCHCODE_GET();
  $name = NAME_GET();
  $creditAccountNo = CREDIT_ACC_NO_GET();

  hasDataSource = false;
  selection = new SelectionModel<any>(true, []);
  selectionObs = new BehaviorSubject<any>('');
  pageEvent: PageEvent = new PageEvent();
  // listDataSelect: Array<IStateTreasuryContent> = [];

  constructor(
    protected injector: Injector,
    private toastService: ToastService,
    private stateTreasuryConfigService: StateTreasuryConfigService
  ) {
    super(injector);
  }

  protected componentInit(): void {
    this.enableActions(ModuleKeys.citad_state_treasuries);
    this.form = this.itemControl.toFormGroup([
      this.$name,
      this.$code,
      this.$branchCode,
      this.$name,
      this.$creditAccountNo,
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
            sort: 'updatedAt:DESC',
          }
        ),
      };
      this.dformPagination.goto(this.pageSize, this.pageIndex);
    } else {
      this.toastService.showToastr(
        'Bạn không có quyền truy cập hợp lệ',
        'Thông báo',
        MessageSeverity.error
      );
    }
  }
  QueryData() {
    this.indicator.showActivityIndicator();

    this.stateTreasuryConfigService
      .getStateTreasuries(this.options.params)
      .pipe(
        finalize(() => {
          this.indicator.hideActivityIndicator();
        }),
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
              return {
                stt: this.pageIndex * this.pageSize + index + 1,
                ...obj,
              };
            });
            this.dataSource = new MatTableDataSource(data);
            // this.totalItem = res.data.total;
          } else {
            this.hasDataSource = false;
            this.totalItem = 0;
            this.dialogService.error(
              {
                title: 'dialog.notification',
                message: res.soaErrorDesc ? res.soaErrorDesc : 'Lỗi hệ thống.',
              },
              (resp) => {
                if (res) {
                }
              }
            );
          }
          this.dataSource.sort = this.sort;
        },
        error: (err) => {
          const errMessage = ErrorUtils.getErrorMessage(err);
          this.toastService.showToastr(
            errMessage.join('\n'),
            'Thông báo',
            MessageSeverity.error,
            TOAST_DEFAULT_CONFIG
          );
        },
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
        sort: 'updatedAt:DESC',
      },
    };
    this.QueryData();
  }
  onClickCreateStateTreasury() {
    this.goTo('/pmp_admin/transfer-channel/citad/state-treasuries/add');
  }
  onClickGetTreasuriesHistories() {
    this.goTo('/pmp_admin/transfer-channel/citad/state-treasuries/history');
  }

  viewDetail(element) {
    this.goTo('/pmp_admin/transfer-channel/citad/state-treasuries/detail', {
      code: element.code,
    });
  }

  onClickDelete(element) {
    this.dialogService.dformconfirm(
      {
        label: 'Xóa cấu hình',
        title: 'Lý do',
        description: 'Nhập lý do xóa cấu hình',
        acceptBtn: 'Xác nhận',
        closeBtn: 'Hủy',
        maxLength: 1024
      },
      (result: any) => {
        if (result && result.data.length > 1024) {
          this.toastService.showToastr('Lý do đã vượt quá 1024 kí tự!', 'Thông báo!', MessageSeverity.error, '');
        } else
        if (result.status === DFORM_CONFIRM_STATUS.CONFIRMED) {
          this.indicator.showActivityIndicator();
          this.stateTreasuryConfigService
            .deleteStateTreasury(element.code)
            .pipe(
              takeUntil(this.ngUnsubscribe),
              finalize(() => this.indicator.hideActivityIndicator())
            )
            .subscribe(
              (res) => {
                console.log('RESPONSE', res);
                // Gọi API thành công và có data trả về
                this.toastr.showToastr(
                  'Xóa cấu hình thành công',
                  'Thông báo!',
                  MessageSeverity.success,
                  TOAST_DEFAULT_CONFIG
                );
                this.resetFormSearch();
              },
              (error) => {
                const errMessage = ErrorUtils.getErrorMessage(error);
                this.toastService.showToastr(
                  errMessage.join('\n'),
                  'Thông báo',
                  MessageSeverity.error,
                  TOAST_DEFAULT_CONFIG
                );
              }
            );
        }
      }
    );
  }
  onClickEdit(element) {
    console.log('EDIT ', element);
    this.goTo('/pmp_admin/transfer-channel/citad/state-treasuries/edit', {
      code: element.code,
    });
  }
  resetFormSearch() {
    this.form.reset();
    this.search();
  }
  exportExcel() {
    this.indicator.showActivityIndicator();
    this.stateTreasuryConfigService
      .exportStateTreasure()
      .pipe(
        finalize(() => {
          this.indicator.hideActivityIndicator();
        }),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(
        (res) => {
          if (res instanceof HttpResponse) {
            const blob = new Blob([res.body], {
              type: res.headers.get('Content-Type'),
            });
            let url = window.URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = 'State_Treasury' + '.xlsx';
            a.click();
            window.URL.revokeObjectURL(url);
          }
        },
        (error) => {
          const errMessage = ErrorUtils.getErrorMessage(error);
          this.toastService.showToastr(
            errMessage.join('\n'),
            'Thông báo',
            MessageSeverity.error,
            TOAST_DEFAULT_CONFIG
          );
        }
      );
  }
}
