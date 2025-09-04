import { Component, Injector } from '@angular/core';
import { ComponentAbstract, MessageSeverity, ToastService } from '@shared-sm';
import { BehaviorSubject } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { PageEvent } from '@angular/material/paginator';
import { finalize, takeUntil } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import ErrorUtils from '../../../shared/utils/ErrorUtils';
import { ModuleKeys } from 'src/app/public/module-permission.utils';
import {
  DFORM_CONFIRM_STATUS,
  TOAST_DEFAULT_CONFIG,
} from 'src/app/public/constants';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { CHANNEL, STATUS } from './modal/constant';
import { TransferChannelLimitService } from '../service/TransferChannelLimitService';
import {
  IPutTransferChannelLimitBody,
  ITransferChannelLimitContent,
} from './modal/interface';

@Component({
  selector: 'transfer-channel-limit-page',
  templateUrl: './transfer-channel-limit.component.html',
  styleUrls: ['./transfer-channel-limit.component.scss'],
})
export class TransferChannelLimitComponent extends ComponentAbstract {
  // Table view
  displayedColumns: string[] = [
    'stt',
    'transferChannel',
    'currency',
    'minAmount',
    'maxAmount',
    'fragmentMaxAmount',
    'fragmentAmount',
    'active',
    'actions',
  ];
  show: boolean ;
  $channel = CHANNEL();
  $status = STATUS();

  selectedPermissionIds: number[] = [];
  hasDataSource = false;
  selection = new SelectionModel<any>(true, []);
  selectionObs = new BehaviorSubject<any>('');
  pageEvent: PageEvent = new PageEvent();

  constructor(
    protected injector: Injector,
    private transferChannelLimitService: TransferChannelLimitService,
    private toastService: ToastService
  ) {
    super(injector);
  }

  protected componentInit(): void {
    this.enableActions(ModuleKeys.routing_channel_limit);
    this.search();
    this.form = this.itemControl.toFormGroup([this.$channel, this.$status]);
  }

  search() {
    this.indicator.showActivityIndicator();
    this.options = {
      params: Object.assign(
        { ...this.form.value },
        {
          transferChannel: this.form.value.transferChannel ?? null,
          active: this.form.value.active ?? null,
          page: this.pageIndex,
          size: this.pageSize,
        }
      ),
    };
    this.hasDataSource = true;
    this.transferChannelLimitService
      .search(this.options.params)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        finalize(() => this.indicator.hideActivityIndicator())
      )
      .subscribe(
        (res) => {
          console.log('RESPONSE', res);
          // Gọi API thành công và có data trả về
          if (res && res.status === 200) {
            this.hasDataSource = true;
            const page = this.pageIndex * this.pageSize;
            const data = res.data.map((obj, index) => {
              obj.stt = page + index + 1;
              return obj;
            });
            this.dataSource = new MatTableDataSource(data);
          } else {
            console.log('ERROR', res);
            this.hasDataSource = false;
            this.totalItem = 0;
            const errMessage = ErrorUtils.getErrorMessage(res);
            this.toastService.showToastr(
              errMessage.join('\n'),
              'Thông báo',
              MessageSeverity.error,
              TOAST_DEFAULT_CONFIG
            );
          }
          this.dataSource.sort = this.sort;
        },
        (error) => {
          console.log('ERROR', error);
          const errMessage = ErrorUtils.getErrorMessage(error);
          this.toastService.showToastr(
            errMessage.join('\n'),
            'Thông báo',
            MessageSeverity.error,
            TOAST_DEFAULT_CONFIG
          );
        }
      );
    this.indicator.hideActivityIndicator();
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
    this.search();
  }

  onClickCreateAccount() {
    this.goTo('/pmp_admin/routing/transfer-channel-limit/add');
  }

  viewDetail(element: ITransferChannelLimitContent) {
    this.goTo('/pmp_admin/routing/transfer-channel-limit/detail', {
      id: element.id,
    });
  }

  onClickEdit(element: ITransferChannelLimitContent) {
    this.goTo('/pmp_admin/routing/transfer-channel-limit/edit', {
      id: element.id,
    });
  }

  resetFormSearch() {
    this.form.reset();
  }

  onClickChangeStatus(
    event: MatSlideToggleChange,
    element: ITransferChannelLimitContent
  ) {
    const onOff = element.active ? 'tắt' : 'bật';
    const ON_OFF = onOff.charAt(0).toUpperCase() + onOff.slice(1);
    const description = `Lý do ${onOff} trạng thái cấu hình`;
    this.dialogService.dformconfirm(
      {
        label: `${ON_OFF} trạng thái cấu hình`,
        title: 'Lý do',
        description: description,
        acceptBtn: 'Xác nhận',
        closeBtn: 'Hủy',
      },
      (result: any) => {
        if (result && result.status === DFORM_CONFIRM_STATUS.CONFIRMED) {
          const body: IPutTransferChannelLimitBody = {
            reason: result.data,
            active: !element.active,
            minAmount: element.minAmount,
            maxAmount: element.maxAmount,
            fragmentAmount: element.fragmentAmount,
            fragmentMaxAmount: element.fragmentMaxAmount,
          };
          this.indicator.showActivityIndicator();
          this.transferChannelLimitService
            .update(element.id, body)
            .pipe(
              takeUntil(this.ngUnsubscribe),
              finalize(() => this.indicator.hideActivityIndicator())
            )
            .subscribe(
              (res) => {
                // Gọi API thành công và có data trả về
                this.search();
                if (res && res.status === 200) {
                  this.toastr.showToastr(
                    'Chuyển trạng thái cấu hình thành công',
                    'Thông báo!',
                    MessageSeverity.success,
                    TOAST_DEFAULT_CONFIG
                  );
                } else {
                  event.source.checked = !!element.active;
                  this.toastr.showToastr(
                    'Chuyển trạng thái cấu hình không thành công',
                    'Tắt trạng thái hoạt động thất bại',
                    MessageSeverity.error,
                    TOAST_DEFAULT_CONFIG
                  );
                }
              },
              (error) => {
                event.source.checked = !!element.active;
                this.search();
                const message =
                  error.error && error?.error?.soaErrorDesc
                    ? error?.error?.soaErrorDesc
                    : 'Có lỗi xảy ra. Vui lòng liên hệ CNTT để được hỗ trợ.';
                this.toastr.showToastr(
                  message,
                  'Chuyển trạng thái cấu hình thất bại',
                  MessageSeverity.error,
                  TOAST_DEFAULT_CONFIG
                );
              }
            );
        } else {
          event.source.checked = !!element.active;
        }
      }
    );
  }

  viewHistory(element: ITransferChannelLimitContent) {
    this.goTo('/pmp_admin/routing/transfer-channel-limit/history', {
      transferChannelId: element.id,
    });
  }

  onClickSearch() {
    this.pageIndex = 0;
    this.search();
  }

  onClickResetFormSearch() {
    this.form.reset();
    this.form.markAsPristine();
  }
}
