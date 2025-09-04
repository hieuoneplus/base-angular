import { SelectionModel } from '@angular/cdk/collections';
import { Component, Injector } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatSlideToggleChange } from "@angular/material/slide-toggle";
import { MatTableDataSource } from "@angular/material/table";
import { ComponentAbstract, MessageSeverity } from '@shared-sm';
import { BehaviorSubject } from 'rxjs';
import { finalize, takeUntil } from "rxjs/operators";
import { DFORM_CONFIRM_STATUS, TOAST_DEFAULT_CONFIG } from "../../../public/constants";
import { ModuleKeys } from "../../../public/module-permission.utils";
import ErrorUtils from "../../../shared/utils/ErrorUtils";
import { WhitelistService } from "../service/WhitelistService";
import { ACCOUNT_NUMBER_SEARCH, APPROVE_STATUS, BANK_SEARCH, CHANNEL_ALL, STATUS, STATUS_LABEL_TRANSACTION, STATUS_TRANSACTION } from "./modal/constant";
import { IRequestPutAccount, IWhitelistContent } from './modal/interface';
@Component({
  selector: 'search-whilelist-page',
  templateUrl: './search-whitelist.component.html',
  styleUrls: ['./search-whitelist.component.scss']
})
export class SearchWhitelistComponent extends ComponentAbstract {

  // Table view
  displayedColumns: string[] = [
    'stt', 'accountNumber', 'bank', 'channel', 'status', 'approvalStatus', 'actions'
  ];

  $accountNumber = ACCOUNT_NUMBER_SEARCH();
  $bank = BANK_SEARCH();
  $channel = CHANNEL_ALL();
  $status = STATUS();
  $approvalStatus = APPROVE_STATUS();

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
    private whitelistService: WhitelistService
  ) {
    super(injector);
  }

  protected componentInit(): void {
    this.enableActions(ModuleKeys.routing_whitelist);
    // if (this.enableApprove) {
    //   this.displayedColumns.unshift('check');
    // }
    this.form = this.itemControl.toFormGroup([
      this.$accountNumber, this.$bank, this.$channel, this.$status, this.$approvalStatus
    ]);
    this.search();

    this.$status.options.unshift({
      key: '',
      value: 'Tất cả',
    });
  }


  search() {
    this.pageIndex = 0;
    this.pageSize = 10;
    const params = Object.assign(
      {},
      Object.entries(this.form.value).reduce((acc, [key, value]) => {
        acc[key] = typeof value === 'string' ? value.trim() : value;
        return acc;
      }, {}),
    )
    this.options = {
      params: {
        ...params,
        page: this.pageIndex,
        size: this.pageSize,
        sort: 'updatedAt:DESC'
      }
    };
    this.dformPagination.goto(this.pageSize, this.pageIndex);
  }

  QueryData() {
    this.indicator.showActivityIndicator();
    this.whitelistService.getAccounts(this.options.params).pipe(
      takeUntil(this.ngUnsubscribe),
      finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe((res) => {
      // Gọi API thành công và có data trả về
      if (res && res.status === 200) {
        this.hasDataSource = true;
        const page = this.pageIndex * this.pageSize;
        const data = res.data.content.map((obj, index) => {
          obj.stt = page + index + 1;
          obj.approvalStatusLabel = this.getLabelApprovalStatus(obj.approvalStatus);
          return obj;
        });
        res.data.content.forEach((e: any) => {
          if (e.approvalStatus === STATUS_TRANSACTION.WAITING_APPROVAL) {
            const dataSelected = this.listDataSelect.some(item => item.id === e.id);
            e.isChecked = dataSelected;
          }
        });
        this.dataSource = new MatTableDataSource(data);
        this.totalItem = res.data.total;
        this.checked = this.dataSource.data.filter((element: any) => element.approvalStatus === STATUS_TRANSACTION.WAITING_APPROVAL).every((element: any) => element.isChecked);

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
    }, error => {
      const messageError = ErrorUtils.getErrorMessage(error);
      this.toastr.showToastr(
        messageError.join('\n'),
        'Thông báo!',
        MessageSeverity.error,
        TOAST_DEFAULT_CONFIG
      )
    });
    this.indicator.hideActivityIndicator()
  }

  changePageIndex($event) {
    this.pageSize = $event.pageSize;
    this.pageIndex = $event.pageIndex;
    this.options = {
      params: {
        ...this.options.params,
        size: this.pageSize,
        page: this.pageIndex
      }
    };
    this.QueryData();
  }

  onChange() {
    if (this.checked) {
      if (this.dataSource && this.dataSource.data) {
        this.dataSource.data.forEach((element: any) => {
          if (element.approvalStatus === STATUS_TRANSACTION.WAITING_APPROVAL) {
            element.isChecked = true;
            if (!this.listDataSelect.some(item => item.id === element.id)) {
              this.listDataSelect.push(element);
            }
          }
        });
      }
    } else {
      if (this.dataSource && this.dataSource.data) {
        this.dataSource.data.forEach((element: any) => {
          if (element.approvalStatus === STATUS_TRANSACTION.WAITING_APPROVAL) {
            element.isChecked = false;
            const index = this.listDataSelect.findIndex(item => item.id === element.id);
            if (index > -1) {
              this.listDataSelect.splice(index, 1);
            }
          }
        });
      }
    }
  }

  onChangeRegister(element: any) {
    if (element.isChecked) {
      if (!this.listDataSelect.some(item => item.id === element.id)) {
        this.listDataSelect.push({ ...element });
      }
    } else {
      const index = this.listDataSelect.findIndex(item => item.id === element.id);
      if (index > -1) {
        this.listDataSelect.splice(index, 1);
      }
    }
    this.checked = this.dataSource.data.every((element: any) => element.isChecked);
  }

  onClickChangeStatus(event: MatSlideToggleChange, element: IWhitelistContent) {
    const onOff = element.active ? 'tắt' : 'bật';
    const ON_OFF = onOff.charAt(0).toUpperCase() + onOff.slice(1);
    const description = `Lý do ${onOff} trạng thái tài khoản`;
    this.dialogService.dformconfirm({
      label: `${ON_OFF} trạng thái tài khoản`,
      title: 'Lý do',
      description: description,
      acceptBtn: 'Xác nhận',
      closeBtn: 'Hủy',
    }, (result: any) => {
      if (result && result.status === DFORM_CONFIRM_STATUS.CONFIRMED) {
        const body: IRequestPutAccount = {
          reason: result.data,
          active: !element.active,
          accountNo: element.accountNo,
          bankCode: element.bankCode,
          transferChannel: element.transferChannel,
        }
        this.indicator.showActivityIndicator();
        this.whitelistService.putAccounts(body, element.id).pipe(
          takeUntil(this.ngUnsubscribe),
          finalize(() => this.indicator.hideActivityIndicator())
        ).subscribe((res) => {
          // Gọi API thành công và có data trả về
          this.QueryData();
          if (res && res.status === 200) {

            this.toastr.showToastr(
              'Chuyển trạng thái tài khoản thành công',
              'Thông báo!',
              MessageSeverity.success,
              TOAST_DEFAULT_CONFIG
            );
          } else {
            event.source.checked = element.active
            this.toastr.showToastr(
              'Chuyển trạng thái tài khoản không thành công',
              'Tắt trạng thái hoạt động thất bại',
              MessageSeverity.error,
              TOAST_DEFAULT_CONFIG
            );
          }
        }, error => {
          event.source.checked = element.active
          this.QueryData();
          const message = error.error && error?.error?.soaErrorDesc ? error?.error?.soaErrorDesc : 'Có lỗi xảy ra. Vui lòng liên hệ CNTT để được hỗ trợ.';
          this.toastr.showToastr(
            message,
            'Chuyển trạng thái tài khoản thất bại',
            MessageSeverity.error,
            TOAST_DEFAULT_CONFIG
          );
        });
      } else {
        event.source.checked = element.active
      }
    })
  }

  onClickReject(element) {
  this.dialogService.dformconfirm({
      label: 'Từ chối tài khoản Whilelist',
      title: 'Lý do',
      description: 'Nhập lý do từ chối tài khoản Whilelist',
      acceptBtn: 'Xác nhận',
      closeBtn: 'Hủy',
    }, (result: any) => {
      if (result && result.status === 1) {
        this.indicator.showActivityIndicator();
        this.whitelistService.rejectAccount(element.id, result.data).pipe(
          takeUntil(this.ngUnsubscribe),
          finalize(() => this.indicator.hideActivityIndicator())
        ).subscribe((res) => {
          if (res && res.status === 200) {
            this.toastr.showToastr(
              'Từ chối tài khoản Whitelist thành công',
              'Thông báo!',
              MessageSeverity.success,
              TOAST_DEFAULT_CONFIG
            );

            this.resetFormSearch();
          }
        }, error => {
          const messageError = ErrorUtils.getErrorMessage(error);
          this.toastr.showToastr(
            messageError.join('\n'),
            'Thông báo!',
            MessageSeverity.error,
            TOAST_DEFAULT_CONFIG
          )
        });
      }
    })
  }

  onClickApprove(id?: number) {
    this.dialogService.confirm({
      label: 'Duyệt tài khoản Whitelist',
      acceptBtn: 'Xác nhận',
      closeBtn: 'Hủy',
      message: 'Bạn có chắc chắn muốn duyệt tài khoản đã chọn?',
    }, (result: any) => {
      if (result && result.status === DFORM_CONFIRM_STATUS.CONFIRMED) {
        this.indicator.showActivityIndicator();
        this.whitelistService.approveAccount(id).pipe(
          takeUntil(this.ngUnsubscribe),
          finalize(() => this.indicator.hideActivityIndicator())
        ).subscribe((res) => {
          if (res && res.status === 200) {
            this.toastr.showToastr(
              'Phê duyệt tài khoản Whitelist thành công',
              'Thông báo!',
              MessageSeverity.success,
              TOAST_DEFAULT_CONFIG
            );
            this.search();
          }
        }, error => {
          const messageError = ErrorUtils.getErrorMessage(error);
          this.toastr.showToastr(
            messageError.join('\n'),
            'Thông báo!',
            MessageSeverity.error,
            TOAST_DEFAULT_CONFIG
          )
          this.search();
        });
      }
    })
  }

  onClickCreateAccount() {
    this.goTo('/pmp_admin/routing/whitelist/add')
  }

  onClickEdit(element) {
    this.router.navigate(['/pmp_admin/routing/whitelist/edit'], { state: { status: element.approvalStatus }, queryParams: { id: element.id } });
  }

  viewDetail(element) {
    this.goTo('/pmp_admin/routing/whitelist/detail', { id: element.id });
  }

  viewHistory(element) {
    this.goTo('/pmp_admin/routing/whitelist/history', { id: element.id });
  }

  resetFormSearch() {
    this.form.reset();
    this.search();
  }

  getLabelApprovalStatus(approvalStatus: string) {
    const status = (STATUS_LABEL_TRANSACTION || []).find(item => item.key === approvalStatus);
    if (status) {
      return `<label class="wf-status ${status.class}">${status.value}</label>`;
    } else {
      return '';
    }
  }
}
