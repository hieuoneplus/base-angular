import { SelectionModel } from '@angular/cdk/collections';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Injector } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ComponentAbstract, MessageSeverity } from '@shared-sm';
import { BehaviorSubject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import {
  BUTTON_CANCEL,
  BUTTON_SAVE,
  DFORM_CONFIRM_STATUS,
  TOAST_DEFAULT_CONFIG,
  TYPE_BTN_FOOTER,
} from '../../../../public/constants';
import { ModuleKeys } from '../../../../public/module-permission.utils';
import ErrorUtils from '../../../../shared/utils/ErrorUtils';
import { TransferChannelConfigService } from '../../service/TransferChannelConfig.service';
import { IListPriorities, IPutListPriorities } from '../model/interface';

@Component({
  selector: 'edit-transfer-channel-config-page',
  templateUrl: './edit-transfer-channel-config.component.html',
  styleUrls: ['./edit-transfer-channel-config.component.scss'],
})
export class EditTransferChannelConfigComponent extends ComponentAbstract {
  // Table viewa
  displayedColumns: string[] = [
    'drag',
    'priority',
    'transferChannel',
    'typeChannel',
    'active',
  ];

  hasDataSource = false;
  selection = new SelectionModel<any>(true, []);
  selectionObs = new BehaviorSubject<any>('');
  pageEvent: PageEvent = new PageEvent();

  requestPutPriority: IPutListPriorities = {
    priorities: [],
    reason: ""
  };

  constructor(
    protected injector: Injector,
    private transferChannelConfigService: TransferChannelConfigService
  ) {
    super(injector);
  }

  protected componentInit(): void {
    this.enableActions(ModuleKeys.routing_channel_config);
    this.search();
    this.listButton = this.enableUpdate
      ? this.listButtonDynamic('', BUTTON_CANCEL, BUTTON_SAVE)
      : this.listButtonDynamic('', BUTTON_CANCEL);
  }

  search() {
    this.pageIndex = 0;
    this.pageSize = 10;
    this.options = {
      params: Object.assign(
        { ...this.form.value },
        {
          page: this.pageIndex,
          size: this.pageSize,
        }
      ),
    };
    this.dformPagination.goto(this.pageSize, this.pageIndex);
  }

  QueryData() {
    this.indicator.showActivityIndicator();
    this.transferChannelConfigService
      .getTransferChannelConfig(this.options.params)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        finalize(() => this.indicator.hideActivityIndicator())
      )
      .subscribe(
        (res) => {
          // Gọi API thành công và có data trả về
          if (res && res.status === 200) {
            let data = res.data.sort((a, b) => a.priority - b.priority);
            data = data.map((item, index) => ({
              ...item,
              priority: index + 1
            }));
            this.hasDataSource = true;
            const page = this.pageIndex * this.pageSize;
            this.dataSource = new MatTableDataSource(data);
          } else {
            console.log('ERROR', res);
            this.hasDataSource = false;
            this.totalItem = 0;
            this.toastr.showToastr(
              res.soaErrorDesc ? res.soaErrorDesc : 'Lỗi hệ thống.',
              'Thông báo!',
              MessageSeverity.error,
              TOAST_DEFAULT_CONFIG
            );
          }
          this.dataSource.sort = this.sort;
        },
        (error) => {
          console.log('ERROR', error);
          this.toastr.showToastr(
            error.error.soaErrorDesc
              ? error.error.soaErrorDesc
              : 'Lỗi hệ thống.',
            'Thông báo!',
            MessageSeverity.error,
            TOAST_DEFAULT_CONFIG
          );
        }
      );
  }

  changePageIndex($event) {
    this.pageSize = $event.pageSize;
    this.pageIndex = $event.pageIndex;
    this.options = {
      params: {
        ...this.options.params,
        size: this.pageSize,
        page: this.pageIndex,
      },
    };
    this.QueryData();
  }

  saveUpdate() {
    this.dialogService.dformconfirm(
      {
        label: 'Chỉnh sửa thứ tự ưu tiên',
        title: 'Lý do',
        description: 'Nhập lý do chỉnh sửa thứ tự ưu tiên',
        acceptBtn: 'Xác nhận',
        closeBtn: 'Hủy',
      },
      (result: any) => {
        if (result && result.status === DFORM_CONFIRM_STATUS.CONFIRMED) {
          let dataPut = [...this.dataSource.data];
          let arr = [];
          dataPut.forEach((item) => {
            const pt: IListPriorities = {
              id: item.id,
              priority: item.priority,
            };
            arr.push(pt);
          });
          this.requestPutPriority.priorities = arr;
          this.requestPutPriority.reason = result.data;
          this.indicator.showActivityIndicator();
          this.transferChannelConfigService
            .putPriority(this.requestPutPriority)
            .pipe(
              takeUntil(this.ngUnsubscribe),
              finalize(() => this.indicator.hideActivityIndicator())
            )
            .subscribe(
              (res) => {
                console.log('RESPONSE', res);
                if (res && res.status === 200) {
                  this.toastr.showToastr(
                    'Chuyển thứ tự ưu tiên thành công',
                    'Thông báo!',
                    MessageSeverity.success,
                    TOAST_DEFAULT_CONFIG
                  );
                  this.goTo('/pmp_admin/routing/transfer-channel-config');
                }
              },
              (error) => {
                console.log('ERROR', error);
                const messageError = ErrorUtils.getErrorMessage(error);
                this.toastr.showToastr(
                  messageError.join('\n'),
                  'Thông báo!',
                  MessageSeverity.error,
                  TOAST_DEFAULT_CONFIG
                );
              }
            );
        }
      }
    );
  }

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousIndex !== event.currentIndex) {
      moveItemInArray(
        this.dataSource.data,
        event.previousIndex,
        event.currentIndex
      );
      this.updatePositions(event.previousIndex, event.currentIndex);
    }
  }

  updatePositions(previousIndex: number, currentIndex: number) {
    const data = [...this.dataSource.data];
    const start = Math.min(previousIndex, currentIndex);
    const end = Math.max(previousIndex, currentIndex);

    for (let i = start; i <= end; i++) {
      data[i].priority = i + 1;
    }
    this.dataSource = new MatTableDataSource<any>(data);
  }

  resetFormSearch() {
    this.form.reset();
    this.search();
  }

  onClickActionBtn(event: any) {
    switch (event) {
      case TYPE_BTN_FOOTER.TYPE_CANCEL:
        this.goTo('/pmp_admin/routing/transfer-channel-config');
        break;
      case TYPE_BTN_FOOTER.TYPE_SAVE:
        this.saveUpdate();
        break;
    }
  }
}
