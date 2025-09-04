import { Component, Injector } from '@angular/core';
import { ComponentAbstract, MessageSeverity, ToastService } from '@shared-sm';
import { finalize, takeUntil } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import ErrorUtils from '../../../shared/utils/ErrorUtils';
import { ModuleKeys } from 'src/app/public/module-permission.utils';
import {
  DFORM_CONFIRM_STATUS,
  TOAST_DEFAULT_CONFIG,
} from 'src/app/public/constants';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import {CITY_CODE, CITY_NAME, STATUS} from './modal/constant';
import { ProvinceService } from '../service/ProvinceService';
import {
  IPutProvinceBody,
  IProvinceContent,
} from './modal/interface';
import {HttpResponse} from "@angular/common/http";
import * as moment from "moment/moment";
import {trimFormValues} from "./modal/utils";

@Component({
  selector: 'async-page',
  templateUrl: './province.component.html',
  styleUrls: ['./province.component.scss'],
})
export class ProvinceComponent extends ComponentAbstract {
  // Table view
  displayedColumns: string[] = [
    'stt',
    'cityCode',
    'cityName',
    'description',
    'active',
    'actions',
  ];
  $cityCode = CITY_CODE();
  $cityName = CITY_NAME();
  $status = STATUS();

  hasDataSource = false;

  constructor(
    protected injector: Injector,
    private provinceService: ProvinceService,
    private toastService: ToastService
  ) {
    super(injector);
  }

  protected componentInit(): void {
    this.enableActions(ModuleKeys.city);
    this.search();
    this.form = this.itemControl.toFormGroup([this.$cityCode, this.$cityName, this.$status]);
  }

  search() {
    this.indicator.showActivityIndicator();
    const trimmedFormValue = trimFormValues(this.form.value);
    this.options = {
      params: Object.assign(
        { ...trimmedFormValue },
        {
          cityCode: trimmedFormValue.cityCode ?? null,
          cityName: trimmedFormValue.cityName ?? null,
          active: this.form.value.active ?? null,
          page: this.pageIndex,
          size: this.pageSize,
        }
      ),
    };
    this.hasDataSource = true;
    this.provinceService
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
            const data = res.data.content.map((obj, index) => {
              obj.stt = page + index + 1;
              return obj;
            });
            this.dataSource = new MatTableDataSource(data);
            this.totalItem = res.data.total;
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

  onClickCreateProvince() {
    this.goTo('/pmp_admin/general-config/province/add');
  }

  viewDetail(element: IProvinceContent) {
    this.goTo('/pmp_admin/general-config/province/detail', {
      id: element.id,
    });
  }

  onClickEdit(element: IProvinceContent) {
    this.goTo('/pmp_admin/general-config/province/edit', {
      id: element.id,
    });
  }

  resetFormSearch() {
    this.form.reset();
  }

  onClickChangeStatus(
    event: MatSlideToggleChange,
    element: IProvinceContent
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
          const body: IPutProvinceBody = {
            cityName: element.cityName,
            description: element.description,
            reason: result.data,
            active: !element.active,
          };
          this.indicator.showActivityIndicator();
          this.provinceService
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

  exportExcel() {
    const trimmedFormValue = trimFormValues(this.form.value);
    this.options = {
      params: Object.assign(
          { ...trimmedFormValue },
          {
            cityCode: trimmedFormValue.cityCode ?? null,
            cityName: trimmedFormValue.cityName ?? null,
            active: this.form.value.active ?? null,
          }
      ),
    };
    this.indicator.showActivityIndicator()
    this.provinceService.exportCities(this.options.params).pipe(
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
          a.download = 'CITY_' + moment().format('YYYYMMDDHHmmss') + '.xlsx'
          a.click();
          window.URL.revokeObjectURL(url);
        }
      }
    })
  }

  viewHistory(element: IProvinceContent) {
    this.goTo('/pmp_admin/general-config/province/history', {
      provinceId: element.id,
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
