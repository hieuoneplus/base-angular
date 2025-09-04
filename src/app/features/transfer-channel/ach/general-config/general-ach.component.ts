import { Component, Injector } from '@angular/core';
import { ComponentAbstract, getDataLocalStorageByKey, MessageSeverity, ToastService } from '@shared-sm';
import { BehaviorSubject } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { PageEvent } from '@angular/material/paginator';

import { FUNCTION_CODE_GET, KEY_GET, VALUE_GET } from "./constant";
import { IS_ACTIVE } from "../tktg-config/constant";
import { GeneralConfigService } from "./services/general-config.service";
import { finalize, switchMap, takeUntil } from "rxjs/operators";
import { ICommonConfig, ICommonConfigDatasource } from "../../../model/ach";
import { MatTableDataSource } from "@angular/material/table";
import { DFORM_CONFIRM_STATUS } from "../../../../public/constants";
import { MatSlideToggleChange } from "@angular/material/slide-toggle";
import { ModuleKeys } from "../../../../public/module-permission.utils";
import ErrorUtils from "../../../../shared/utils/ErrorUtils";

@Component({
  selector: 'search-tktg-ach-page',
  templateUrl: './general-ach.component.html',
  styleUrls: ['./general-ach.component.scss']
})
// Màn hình danh sách cấu hình tài khoản trung gian ACH
export class GeneralAchComponent extends ComponentAbstract {
  // Table view
  displayedColumns: string[] = [
    'stt', 'functionCode', 'key', 'value', 'description', 'isActive', 'actions'
  ];

  $functionCode = FUNCTION_CODE_GET();
  $key = KEY_GET();
  $value = VALUE_GET();
  $isActive = IS_ACTIVE();

  hasDataSource = false;
  selection = new SelectionModel<any>(true, []);
  selectionObs = new BehaviorSubject<any>('');
  pageEvent: PageEvent = new PageEvent();

  constructor(
    protected injector: Injector,

    private generalConfigService: GeneralConfigService,
    private toastService: ToastService
  ) {
    super(injector);
  }

  protected componentInit(): void {
    this.enableActions(ModuleKeys.ach_common_config)
    this.form = this.itemControl.toFormGroup([
      this.$functionCode, this.$key, this.$value, this.$isActive
    ]);
    // this.handleKeyBasedOnFunctionCode()
    this.search()
  }

  handleGetListCommonConfig() {
    this.indicator.showActivityIndicator()
    return this.generalConfigService.getCommonConfig().pipe(
      finalize(() => {
        this.indicator.hideActivityIndicator()
      }),
      takeUntil(this.ngUnsubscribe)
    )
  }

  // handleKeyBasedOnFunctionCode() {
  //   this.form.get('functionCode')?.valueChanges.subscribe({next: (res) => {
  //     const key = keyBasedOnGeneralTransactionWay[res]
  //     if(key) {
  //       this.$key.options = Object.entries(key).map(([key, value]) => ({
  //         key,
  //         value: value as string
  //       }))
  //     } else {
  //       this.$key.options = Object.entries(keyBasedOnGeneralTransactionWay)
  //         .map(([_, keys]) =>
  //           Object.entries(keys).map(([key, value]) => ({
  //             key,
  //             value: value as string,
  //           }))
  //         )
  //         .reduce((acc, curr) => acc.concat(curr), []);
  //     }
  //       this.form.patchValue({key: null})
  //       this.form.get("key").markAsUntouched()
  //   }})
  // }

  onClickSearch() {
    this.pageIndex = 0
    this.search()
  }

  search() {
    if (this.enableView) {
      this.handleGetListCommonConfig().subscribe({
        next: (res) => {
          this.handleMapData(res.data)
        },
        error: (err) => {
          const errMessage = ErrorUtils.getErrorMessage(err)
          this.toastService.showToastr(errMessage.join('\n'), "Thông báo", MessageSeverity.error)
        }
      })
    } else {
      this.toastService.showToastr('Bạn không có quyền truy cập hợp lệ', "Thông báo", MessageSeverity.error)
    }
  }

  onClickCreateAccount() {
    this.goTo('/pmp_admin/transfer-channel/ach/general/add');
  }

  onClickChangeStatus(event: MatSlideToggleChange, element: ICommonConfigDatasource) {
    this.dialogService.dformconfirm({
      label: `${element.isActive == "Y" ? "Tắt " : "Bật "}` + 'trạng thái cấu hình',
      title: 'Lý do',
      description: 'Nhập lý do ' + `${element.isActive == "Y" ? "tắt " : "bật "}` + 'trạng thái cấu hình',
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
        this.generalConfigService.updateCommonConfig(body).pipe(
          switchMap(() => {
            this.toastService.showToastr('Cập nhật trạng thái thành công', 'Thông báo!', MessageSeverity.success, '');
            return this.handleGetListCommonConfig()
          }),
          finalize(() => {
            this.indicator.hideActivityIndicator()
            event.source.checked = element.isActive === "Y"
          }
          ),
          takeUntil(this.ngUnsubscribe)
        ).subscribe({
          next: (res) => {
            this.handleMapData(res.data)
          },
          error: (err) => {
            const errMessage = ErrorUtils.getErrorMessage(err)
            this.toastService.showToastr(errMessage.join('\n'), "Thông báo", MessageSeverity.error)
          },
        })
      }
    })
  }

  handleMapData(res: ICommonConfig[]) {
    const searchInput = {
      functionCode: this.form.get("functionCode").value ? this.form.get("functionCode").value.toString().toLowerCase().trim() : "",
      value: this.form.get("value").value ? this.form.get("value").value.toString().toLowerCase().trim() : "",
      key: this.form.get("key").value ? this.form.get("key").value.toString().toLowerCase().trim() : "",
      isActive: this.form.get("isActive").value ? this.form.get("isActive").value.toString().toLowerCase().trim() : "",
    }

    this.hasDataSource = true;
    const page = this.pageIndex * this.pageSize;
    const data: ICommonConfig[] = res
    const filteredData = Object.values(searchInput).every(value => value === "" || value === null)
      ? data
      : data.filter(item =>
        Object.entries(searchInput).every(([key, value]) => !value || (item[key] && item[key].toString().toLowerCase().includes(value)))
      );
    const paginatedData: ICommonConfigDatasource[] = filteredData.slice(page, this.pageSize + page).map((obj, index) => {
      return { stt: index + 1 + page, ...obj, };
    });
    this.totalItem = filteredData.length || 0;
    this.dataSource = new MatTableDataSource(paginatedData);
  }

  changePageIndex($event) {
    this.pageSize = $event.pageSize;
    this.pageIndex = $event.pageIndex;
    // this.options = {
    //   params: {
    //     ...this.options.params,
    //     size: this.pageSize,
    //     page: this.pageIndex
    //   }
    // };
    this.search()
  }

  viewDetail(element) {
    this.goTo('/pmp_admin/transfer-channel/ach/general/detail', { fc: element.functionCode, k: element.key });
  }

  onClickEdit(element) {
    this.goTo('/pmp_admin/transfer-channel/ach/general/edit', { fc: element.functionCode, k: element.key });
  }

  onClickResetFormSearch() {
    this.form.reset()
    this.form.markAsPristine()
  }
}
