import { Component, Injector } from '@angular/core';
import { ComponentAbstract, MessageSeverity } from '@shared-sm';
import { BehaviorSubject } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { PageEvent } from '@angular/material/paginator';
import { finalize, takeUntil } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { TOAST_DEFAULT_CONFIG } from 'src/app/public/constants';
import { IntegratedChannelService } from '../service/IntegratedChannelService';
import ErrorUtils from '../../../shared/utils/ErrorUtils';
import { ModuleKeys } from '../../../public/module-permission.utils';
import {
  TRANSACTION_TYPE,
  CHANNEL,
  STATUS,
} from '../../data-form/integrated-channel-form';
import { STATUS_FORM } from './constant';
@Component({
  selector: 'integrated-channel-page',
  templateUrl: './integrated-channel.component.html',
  styleUrls: ['./integrated-channel.component.scss'],
})
export class IntegratedChannelComponent extends ComponentAbstract {
  // Table view
  displayedColumns: string[] = [
    'stt',
    'channel',
    'transactionType',
    'status',
    'actions',
  ];

  $channel = CHANNEL();
  $transactionType = TRANSACTION_TYPE();
  $status = STATUS();

  hasDataSource = false;
  selection = new SelectionModel<any>(true, []);
  selectionObs = new BehaviorSubject<any>('');
  pageEvent: PageEvent = new PageEvent();

  constructor(
    protected injector: Injector,
    private integratedChannelService: IntegratedChannelService
  ) {
    super(injector);
  }

  protected componentInit(): void {
    this.enableActions(ModuleKeys.routing_integration_channel);
    this.form = this.itemControl.toFormGroup([
      this.$channel,
      this.$transactionType,
      this.$status,
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
      this.toastr.showToastr(
        'Bạn không có quyền truy cập hợp lệ',
        'Thông báo',
        MessageSeverity.error
      );
    }
  }

  QueryData() {
    this.indicator.showActivityIndicator();
    this.hasDataSource = true;
    this.integratedChannelService.getIntegratedChannel(this.options.params).pipe(
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
        this.totalItem = res.data.total;
      } else {
        console.log("ERROR", res)
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
    }, error => {
      console.log("ERROR", error)
      const messageError = ErrorUtils.getErrorMessage(error);
      this.toastr.showToastr(
        messageError.join('\n'),
        'Thông báo!',
        MessageSeverity.error,
        TOAST_DEFAULT_CONFIG
      )
    });
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
        sort: 'updatedAt:DESC',
      },
    };
    this.QueryData();
  }
  onClickCreateIntegratedChannel() {
    this.goTo('/pmp_admin/general-config/integration-channels/add');
  }

  onClickEdit(element) {
    this.goTo('/pmp_admin/general-config/integration-channels/edit', {
      id: element.id,
    });
  }
  resetFormSearch() {
    this.form.reset();
    this.form.patchValue({
      channel: ''
    })
    this.search();
  }
  getLabel($state) {
    const status = STATUS_FORM.find((item) => item.key === $state);
    return `<label class="wf-status ${status.class}">${status.value}</label>`;
  }
}
