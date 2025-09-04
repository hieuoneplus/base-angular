import { SelectionModel } from '@angular/cdk/collections';
import { Component, Injector } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatTableDataSource } from '@angular/material/table';
import { ComponentAbstract, MessageSeverity } from '@shared-sm';
import { BehaviorSubject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import {
  DFORM_CONFIRM_STATUS,
  TOAST_DEFAULT_CONFIG,
} from '../../../public/constants';
import { ModuleKeys } from '../../../public/module-permission.utils';
import ErrorUtils from '../../../shared/utils/ErrorUtils';
import { BankService } from '../../general-configuration/service/BankService';
import { RoutingBankCodeCardbinService } from '../service/RoutingBankCodeCardbinService';
import { IWhitelistContent } from '../whitelist/modal/interface';
import {
  BANK_CODE_SEARCH,
  CARD_BIN_SEARCH,
  displayedColumnsBC,
  STATUS,
  TRANSFER_CHANNEL,
} from './modal/constant';
import { IBankCodeCardBinContent, IRequestPutBankCodeCardBin } from './modal/interface';
@Component({
  selector: 'search-bankcode-cardbin-page',
  templateUrl: './search-bankcode-cardbin.component.html',
  styleUrls: ['./search-bankcode-cardbin.component.scss'],
})
export class SearchBankCodeCardBinComponent extends ComponentAbstract {
  // Table view
  displayedColumns = displayedColumnsBC;

  $bankCode = BANK_CODE_SEARCH();
  $transferChannel = TRANSFER_CHANNEL();
  $status = STATUS();
  $cardBin = CARD_BIN_SEARCH();

  status: string = '';
  approvalStatus: string = '';
  listApprove: Array<number> = [];

  hasDataSource = false;
  selection = new SelectionModel<any>(true, []);
  selectionObs = new BehaviorSubject<any>('');
  pageEvent: PageEvent = new PageEvent();

  checked: boolean = false;
  listDataSelect: Array<IWhitelistContent> = [];

  constructor(
    protected injector: Injector,

    private service: RoutingBankCodeCardbinService,
    private bankService: BankService

  ) {
    super(injector);
  }

  protected componentInit(): void {
    this.enableActions(ModuleKeys.routing_transfer_channel_bank_config);
    this.form = this.itemControl.toFormGroup([
      this.$bankCode,
      this.$cardBin,
      this.$transferChannel,
      this.$status,
    ]);
    this.getBankName();
    this.search();

    this.$status.options.unshift({
      key: '',
      value: 'Tất cả',
    });
  }

  getBankName() {
    const params = {
      showBranch: false,
      page: 0,
      size: 1000,
    };
    this.indicator.showActivityIndicator();
    this.bankService
      .getBankWhitelist(params)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        finalize(() => this.indicator.hideActivityIndicator())
      )
      .subscribe(
        (res) => {
          console.log('RESPONSE', res);
          if (res && res.status === 200) {
            if (res.data.content.length > 0) {
              this.$bankCode.options = res.data.content.map((bank) => {
                return {
                  key: bank.bankCode,
                  value: bank.bankCode + ' - ' + bank.fullName,
                };
              });
            }
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

  search() {
    this.pageIndex = 0;
    this.pageSize = 10;
    this.options = {
      params: Object.assign(
        { ...this.form.value },
        {
          page: this.pageIndex,
          size: this.pageSize,
          sort: 'updatedAt:DESC',
        }
      ),
    };
    this.dformPagination.goto(this.pageSize, this.pageIndex);
  }

  QueryData() {
    this.indicator.showActivityIndicator();
    this.service
      .getListBankCode(this.options.params)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        finalize(() => this.indicator.hideActivityIndicator())
      )
      .subscribe(
        (res) => {
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
          const messageError = ErrorUtils.getErrorMessage(error);
          this.toastr.showToastr(
            messageError.join('\n'),
            'Thông báo!',
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
    this.QueryData();
  }

  onChange() {
    if (this.checked) {
      if (this.dataSource && this.dataSource.data) {
      }
    } else {
      if (this.dataSource && this.dataSource.data) {
      }
    }
  }

  onClickChangeStatus(event: MatSlideToggleChange, element: IBankCodeCardBinContent) {
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
          const body: IRequestPutBankCodeCardBin = {
            reason: result.data,
            active: !element.active,
          };
          this.indicator.showActivityIndicator();
          this.service
            .putBankCode(body, element.id)
            .pipe(
              takeUntil(this.ngUnsubscribe),
              finalize(() => this.indicator.hideActivityIndicator())
            )
            .subscribe(
              (res) => {
                // Gọi API thành công và có data trả về
                this.QueryData();
                if (res && res.status === 200) {
                  this.toastr.showToastr(
                    'Chuyển trạng thái cấu hình thành công',
                    'Thông báo!',
                    MessageSeverity.success,
                    TOAST_DEFAULT_CONFIG
                  );
                } else {
                  event.source.checked = element.active;
                  this.toastr.showToastr(
                    'Chuyển trạng thái cấu hình không thành công',
                    'Tắt trạng thái hoạt động thất bại',
                    MessageSeverity.error,
                    TOAST_DEFAULT_CONFIG
                  );
                }
              },
              (error) => {
                event.source.checked = element.active;
                this.QueryData();
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
          event.source.checked = element.active;
        }
      }
    );
  }

  onClickCreateAccount() {
    this.goTo('/pmp_admin/routing/bankcode-cardbin/add');
  }

  viewHistory(element) {
    this.goTo('/pmp_admin/routing/bankcode-cardbin/history', {
      id: element.id,
    });
  }

  resetFormSearch() {
    this.form.reset();
    this.search();
  }
}
