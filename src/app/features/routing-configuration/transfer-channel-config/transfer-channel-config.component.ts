import { SelectionModel } from '@angular/cdk/collections';
import { Component, Injector } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatTableDataSource } from '@angular/material/table';
import { ComponentAbstract, MessageSeverity } from '@shared-sm';
import { BehaviorSubject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { DFORM_CONFIRM_STATUS, TOAST_DEFAULT_CONFIG } from '../../../public/constants';
import { ModuleKeys } from '../../../public/module-permission.utils';
import { TransferChannelConfigService } from '../service/TransferChannelConfig.service';
import { TRANSFER_CHANNEL, TRANSFER_TYPE } from './model/constant';
import { IPutActive, ITransferChannelConfigsContent } from './model/interface';

@Component({
  selector: 'transfer-channel-config-page',
  templateUrl: './transfer-channel-config.component.html',
  styleUrls: ['./transfer-channel-config.component.scss'],
})
export class TransferChannelConfigComponent extends ComponentAbstract {
  // Table view
  displayedColumns: string[] = [
    'priority',
    'transferChannel',
    'typeChannel',
    'active',
  ];

  $transferChannel = TRANSFER_CHANNEL();
  $transferType = TRANSFER_TYPE();

  hasDataSource = false;
  selection = new SelectionModel<any>(true, []);
  selectionObs = new BehaviorSubject<any>('');
  pageEvent: PageEvent = new PageEvent();

  constructor(
    protected injector: Injector,
    private transferChannelConfigService: TransferChannelConfigService
  ) {
    super(injector);
  }

  protected componentInit(): void {
    this.enableActions(ModuleKeys.routing_channel_config);
    this.form = this.itemControl.toFormGroup([
      this.$transferChannel,
      this.$transferType,
    ]);
    this.search();
  }

  search() {
    this.pageIndex = 0;
    this.pageSize = 10;
    this.options = {
      params: Object.assign(
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
    console.log('QUERY', this.options);
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
            this.hasDataSource = true;
            let data = res.data.sort((a, b) => a.priority - b.priority);
            data = data.map((item, index) => ({
              ...item,
              priority: index + 1
            }));
 
            const selectedChannel = this.form.get('transferChannel')?.value;
            const selectedType = this.form.get('transferType')?.value;
            
            if (selectedChannel) {
              data = data.filter(i => i.transferChannel === selectedChannel);
            }
            
            if (selectedType) {
              data = data.filter(i => i.transferType === selectedType);
            }
            
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

  onClickEdit() {
    this.goTo('/pmp_admin/routing/transfer-channel-config/edit');
  }

  onClickChangeStatus(
    event: MatSlideToggleChange,
    element: ITransferChannelConfigsContent
  ) {
    const onOff = element.active ? 'tắt' : 'bật';
    const ON_OFF = onOff.charAt(0).toUpperCase() + onOff.slice(1);
    const description = `Lý do ${onOff} trạng thái tài khoản`;
    this.dialogService.dformconfirm(
      {
        label: `${ON_OFF} trạng thái tài khoản`,
        title: 'Lý do',
        description: description,
        acceptBtn: 'Xác nhận',
        closeBtn: 'Hủy',
      },
      (result: any) => {
        if (result && result.status === DFORM_CONFIRM_STATUS.CONFIRMED) {
          const body: IPutActive = {
            id: element.id,
            active: !element.active,
            reason: result.data,
          };
          this.indicator.showActivityIndicator();
          this.transferChannelConfigService
            .putActive(body)
            .pipe(
              takeUntil(this.ngUnsubscribe),
              finalize(() => this.indicator.hideActivityIndicator())
            )
            .subscribe(
              (res) => {
                console.log('RESPONSE', res);
                // Gọi API thành công và có data trả về
                this.QueryData();
                if (res && res.status === 200) {
                  this.toastr.showToastr(
                    'Chuyển trạng thái thành công',
                    'Thông báo!',
                    MessageSeverity.success,
                    TOAST_DEFAULT_CONFIG
                  );
                } else {
                  event.source.checked = element.active;
                  this.toastr.showToastr(
                    'Chuyển trạng thái không thành công',
                    'Tắt trạng thái hoạt động thất bại',
                    MessageSeverity.error,
                    TOAST_DEFAULT_CONFIG
                  );
                }
              },
              (error) => {
                event.source.checked = element.active;
                this.QueryData();
                console.log('ERROR-500', error);
                const message =
                  error.error && error?.error?.soaErrorDesc
                    ? error?.error?.soaErrorDesc
                    : 'Có lỗi xảy ra. Vui lòng liên hệ CNTT để được hỗ trợ.';
                this.toastr.showToastr(
                  message,
                  'Chuyển trạng thái thất bại',
                  MessageSeverity.error,
                  TOAST_DEFAULT_CONFIG
                );
              }
            );
        } else {
          event.source.checked = element.active;
        }
      }
    );
  }

  resetFormSearch() {
    this.form.reset();
    this.search();
  }
}
