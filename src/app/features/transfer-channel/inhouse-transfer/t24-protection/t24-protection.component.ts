import {Component, Injector} from '@angular/core';
import {ComponentAbstract, MessageSeverity, TextboxItem, ToastService} from "@shared-sm";
import {displayedColumns} from "./model/constant";
import {finalize, takeUntil} from "rxjs/operators";
import {MatTableDataSource} from "@angular/material/table";
import {ModuleKeys} from "../../../../public/module-permission.utils";
import ErrorUtils from "../../../../shared/utils/ErrorUtils";
import {T24ProtectionService} from "../services/t24-protection.service";
import {PageEvent} from "@angular/material/paginator";
import {MatSlideToggleChange} from "@angular/material/slide-toggle";
import {DFORM_CONFIRM_STATUS, TOAST_DEFAULT_CONFIG} from "../../../../public/constants";
import {IPutT24ProtectionBody, T24ProtectionConfig} from "./model/interface";

@Component({
  selector: 'app-transaction-replacement',
  templateUrl: './t24-protection.component.html',
  styleUrls: ['./t24-protection.component.scss']
})
export class T24ProtectionComponent extends ComponentAbstract {
  readonly displayedColumns = displayedColumns

  pageSize = 10;
  fullData = [];
  pageSizeList = [10, 20, 50, 100];

  constructor(
    protected injector: Injector,

    private t24ProtectionService: T24ProtectionService,
    private toastService: ToastService
  ) {
    super(injector);
    this.form = this.itemControl.toFormGroup([
    ]);
  }

  protected componentInit(): void {
    this.enableActions(ModuleKeys.inhouse_config)
    if(this.enableView){
      this.search()
    } else {
      this.toastService.showToastr('Bạn không có quyền truy cập hợp lệ', "Thông báo", MessageSeverity.error)
    }
  }

  search() {
    this.indicator.showActivityIndicator()
    this.t24ProtectionService.get().pipe(
      finalize(() => {
        this.indicator.hideActivityIndicator()
      }),
      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      next: (res) => {
        const configs = res.data?.value?.t24ProtectionConfigs || [];

        const result = configs.map((item, index) => ({
          channel: new TextboxItem({ key: `channel_${index}`, value: item.channel?.toString(), readOnly: true }),
          waitingTimeSecond: new TextboxItem({ key: `waitingTimeSecond_${index}`, value: item.waitingTimeSecond?.toString(), readOnly: true }),
          leaseTimeSecond: new TextboxItem({ key: `leaseTimeSecond_${index}`, value: item.leaseTimeSecond?.toString(), readOnly: true }),
          ccuAccountThreshold: new TextboxItem({ key: `ccuAccountThreshold_${index}`, value: item.ccuAccountThreshold?.toString(), readOnly: true }),
          keyExpireTimeSecond: new TextboxItem({ key: `keyExpireTimeSecond_${index}`, value: item.keyExpireTimeSecond?.toString(), readOnly: true }),
          channelDetail: new TextboxItem({ key: `channelDetail_${index}`, value: item.channelDetail?.toString(), readOnly: true }),
          active: !!item.active
        }));

        this.fullData = result;
        this.totalItem = result.length;
        this.pageIndex = 0;
        this.pageSize = this.pageSizeList[0];
        this.paginateData();

        const controls = [];
        result.forEach(row => {
          controls.push(row.channel, row.waitingTimeSecond, row.leaseTimeSecond, row.ccuAccountThreshold, row.keyExpireTimeSecond, row.channelDetail, row.active);
        });
        this.itemControl.toAddFormGroup(controls, this.form);
      },
      error: (err) => {
        const errMessage = ErrorUtils.getErrorMessage(err)
        this.toastService.showToastr(errMessage.join('\n'), "Thông báo", MessageSeverity.error)
      }
    })
  }

  onClickHistory() {
    this.goTo('pmp_admin/transfer-channel/inhouse-transfer/t24-protection/history')
  }

  onClickEdit() {
    this.goTo(`pmp_admin/transfer-channel/inhouse-transfer/t24-protection/edit`)
  }

  paginateData() {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    const paginatedData = this.fullData.slice(startIndex, endIndex);

    this.dataSource = new MatTableDataSource(paginatedData);
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.paginateData();
  }

  onClickChangeStatus(event: MatSlideToggleChange, element: T24ProtectionConfig) {
    const previousActive = element.active;  // Lưu trạng thái cũ trước khi thay đổi
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
          element.active = event.checked;
          const newValue = event.checked;
          const index = this.fullData.findIndex(e => e.channel === element.channel);
          if (index !== -1) {
            this.fullData[index].active = newValue;
          }
          const data: IPutT24ProtectionBody = {
            value: {
              $type: "t24_protection",
              t24ProtectionConfigs: this.convertFinalDataToConfigs(this.fullData)
            },
            reason: result.data
          }

          this.indicator.showActivityIndicator();
          this.t24ProtectionService
            .update(data)
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
                  event.source.checked = previousActive
                  this.toastr.showToastr(
                    'Chuyển trạng thái cấu hình không thành công',
                    'Tắt trạng thái hoạt động thất bại',
                    MessageSeverity.error,
                    TOAST_DEFAULT_CONFIG
                  );
                }
              },
              (error) => {
                event.source.checked = previousActive
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
        } else {
          event.source.checked = previousActive
        }
      }
    );
  }

  convertFinalDataToConfigs(finalData: any[]): T24ProtectionConfig[] {
    return finalData.map(item => ({
      channel: item.channel?.value,
      waitingTimeSecond: Number(item.waitingTimeSecond?.value),
      leaseTimeSecond: Number(item.leaseTimeSecond?.value),
      ccuAccountThreshold: Number(item.ccuAccountThreshold?.value),
      keyExpireTimeSecond: Number(item.keyExpireTimeSecond?.value),
      channelDetail: item.channelDetail?.value,
      active: item.active,
    }));
  }
}
