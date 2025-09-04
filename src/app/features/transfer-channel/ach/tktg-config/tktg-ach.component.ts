import { Component, Injector } from '@angular/core';
import {ComponentAbstract, HttpResponse, MessageSeverity, ToastService} from '@shared-sm';
import {BehaviorSubject, throwError} from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { PageEvent } from '@angular/material/paginator';
import {catchError, finalize, switchMap, takeUntil} from "rxjs/operators";
import { MatTableDataSource } from "@angular/material/table";
import {
  ACCOUNT_NAME,
  ACCOUNT_NUMBER,
  ACCOUNT_TYPE,
  FUNCTION_CODE,
  IS_ACTIVE, intermediateTransactionWay, FUNCTION_CODE_GET, ACCOUNT_TYPE_GET, ACCOUNT_NAME_GET, ACCOUNT_NUMBER_GET,
} from "./constant";
import {TktgAchService} from "./services/tktg-ach.service";
import {
  IIntermediateAccountConfig,
  IIntermediateAccountConfigDataSource
} from "../../../model/ach";
import {DFORM_CONFIRM_STATUS} from "../../../../public/constants";
import {MatSlideToggleChange} from "@angular/material/slide-toggle";
import ErrorUtils from "../../../../shared/utils/ErrorUtils";
import {ModuleKeys} from "../../../../public/module-permission.utils";

@Component({
  selector: 'search-tktg-ach-page',
  templateUrl: './tktg-ach.component.html',
  styleUrls: ['./tktg-ach.component.scss']
})
// Màn hình danh sách cấu hình tài khoản trung gian ACH
export class TktgACHComponent extends ComponentAbstract {
  // Table view
  displayedColumns: string[] = [
    'stt', 'functionCode', 'accountNumber', 'accountName', 'accountType', 'isActive', 'actions'
  ];

  $functionCode = FUNCTION_CODE_GET();
  $accountNumber = ACCOUNT_NUMBER_GET();
  $accountName = ACCOUNT_NAME_GET();
  $accountType = ACCOUNT_TYPE_GET();
  $isActive = IS_ACTIVE();

  hasDataSource = false;
  selection = new SelectionModel<any>(true, []);
  selectionObs = new BehaviorSubject<any>('');
  pageEvent: PageEvent = new PageEvent();

  constructor(
    protected injector: Injector,

    private tktgAchService: TktgAchService,
    private toastService: ToastService
  ) {
    super(injector);
  }

  protected componentInit(): void {
    this.enableActions(ModuleKeys.ach_tktg_config)

    this.form = this.itemControl.toFormGroup([
      this.$functionCode, this.$accountNumber, this.$accountType, this.$accountName, this.$isActive
    ]);
    this.search()
  }

  handleGetListIntermediateAccount() {
    this.indicator.showActivityIndicator()
    return this.tktgAchService.getIntermediateAccountListConfig().pipe(
      finalize(() => {
        this.indicator.hideActivityIndicator()
      }),
      takeUntil(this.ngUnsubscribe)
    )
  }

  handleViewFunctionCode(functionCode: string){
    if(functionCode === intermediateTransactionWay.MB_TO_NAPAS_MAKE) {
      return 'Thanh toán chiều đi'
    } else {
      return 'Thanh toán chiều về'
    }
  }

  onClickCreateAccount() {
    this.goTo('/pmp_admin/transfer-channel/ach/tktg/add')
  }

  onClickChangeStatus(event: MatSlideToggleChange, element: IIntermediateAccountConfig) {
    if (this.enableView) {
      this.dialogService.dformconfirm({
        title: `${element.isActive == "Y" ? "Tắt " : "Bật "}` + 'trạng thái tài khoản trung gian',
        description: 'Nhập lý do thêm mới',
        acceptBtn: 'Xác nhận',
        closeBtn: 'Đóng',
      }, (result) => {
        if (result.status === DFORM_CONFIRM_STATUS.CANCELED) {
          event.source.checked = element.isActive === "Y"
          return
        }
        else if (result && result.data.length > 2000) {
          event.source.checked = element.isActive === "Y"
          this.toastService.showToastr('Lý do đã vượt quá 2000 kí tự!', 'Thông báo!', MessageSeverity.error, '');
          return
        }
        else if (result && result.status === DFORM_CONFIRM_STATUS.CONFIRMED) {
          this.indicator.showActivityIndicator()
          const body = {
            reason: result.data,
            ...element,
            isActive: element.isActive === "Y" ? "N" : "Y",
          }
          this.tktgAchService.updateIntermediateAccountConfig(body).pipe(
            catchError((err) => {
              this.toastService.showToastr(err.error.soaErrorDesc, 'Thông báo!', MessageSeverity.error, '');
              return throwError(err)
            }),
            switchMap((res) => {
              this.toastService.showToastr('Cập nhật trạng thái thành công', 'Thông báo!', MessageSeverity.success, '');
              return this.handleGetListIntermediateAccount()
            }),
            finalize(() => {
                this.indicator.hideActivityIndicator()
                event.source.checked = element.isActive === "Y"
              }
            ),
            takeUntil(this.ngUnsubscribe)
          ).subscribe({
            next: (res) => {
              this.handleMapData(res)
            },
            error: (err) => {
              const errMessage = ErrorUtils.getErrorMessage(err)
              this.toastService.showToastr(errMessage.join('\n'), "Thông báo", MessageSeverity.error)          },
          })
        }
      })
    } else {
      this.toastService.showToastr('Bạn không có quyền truy cập hợp lệ', "Thông báo", MessageSeverity.error)
    }
  }

  handleMapData(res: HttpResponse<IIntermediateAccountConfig[]>) {
    const searchInput = {
      functionCode: this.form.get("functionCode").value ? this.form.get("functionCode").value.toString().toLowerCase().trim() : "",
      accountNumber: this.form.get("accountNumber").value ? this.form.get("accountNumber").value.toString().toLowerCase().trim() : "",
      accountName: this.form.get("accountName").value ? this.form.get("accountName").value.toString().toLowerCase().trim() : "",
      accountType: this.form.get("accountType").value ? this.form.get("accountType").value.toString().toLowerCase() .trim(): "",
      isActive: this.form.get("isActive").value ? this.form.get("isActive").value.toString().toLowerCase().trim() : "",
    }
    this.hasDataSource = true;
    const page = this.pageIndex * this.pageSize;
    const filteredData = Object.values(searchInput).every(value => value === "" || value === null)
      ? res.data
      : res.data.filter(item =>
        Object.entries(searchInput).every(([key, value]) => !value || (item[key] && item[key].toString().toLowerCase().includes(value)))
      );
    const paginatedData: IIntermediateAccountConfigDataSource[] = filteredData.slice(page, this.pageSize + page ).map((obj, index) => {
      return { stt: index + page + 1, ...obj,};
    });

    this.totalItem = filteredData.length || 0;
    this.dataSource = new MatTableDataSource(paginatedData);
  }

  search() {
    this.handleGetListIntermediateAccount().subscribe({
      next: (res) => {
        this.handleMapData(res)
      },
      error: (err) => {
        const errMessage = ErrorUtils.getErrorMessage(err)
        this.toastService.showToastr(errMessage.join('\n'), "Thông báo", MessageSeverity.error)
      }
    })
  }

  onClickSearch() {
    this.pageIndex = 0
    this.search()
  }

  changePageIndex($event) {
    this.pageSize = $event.pageSize;
    this.pageIndex = $event.pageIndex;
    this.search()
  }

  viewDetail(element) {
    this.goTo('/pmp_admin/transfer-channel/ach/tktg/detail', { acc: element.accountNumber, way: element.functionCode });
  }

  onClickEdit(element) {
    this.goTo('/pmp_admin/transfer-channel/ach/tktg/edit', { acc: element.accountNumber, way: element.functionCode })
  }

  onClickResetFormSearch() {
    this.form.reset()
    this.form.markAsPristine()
  }
}
