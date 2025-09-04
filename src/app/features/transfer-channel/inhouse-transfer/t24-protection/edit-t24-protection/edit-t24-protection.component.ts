import {ChangeDetectionStrategy, Component, Injector, ViewChild} from '@angular/core';
import {ActivityIndicatorSingletonService, ComponentAbstract, MessageSeverity, ToastService} from "@shared-sm";
import {displayedColumnsEdit} from "../model/constant";
import {finalize, takeUntil} from "rxjs/operators";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {
  BUTTON_CANCEL,
  BUTTON_SAVE,
  DFORM_CONFIRM_STATUS,
  TOAST_DEFAULT_CONFIG,
  TYPE_BTN_FOOTER
} from "../../../../../public/constants";
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {ModuleKeys} from "../../../../../public/module-permission.utils";
import ErrorUtils from "../../../../../shared/utils/ErrorUtils";
import {T24ProtectionService} from "../../services/t24-protection.service";
import {PageEvent} from "@angular/material/paginator";
import {IPutT24ProtectionBody, T24ProtectionConfig} from "../model/interface";

@Component({
  selector: 't24-protection-edit',
  templateUrl: './edit-t24-protection.component.html',
  styleUrls: ['./edit-t24-protection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class T24ProtectiontEditComponent extends ComponentAbstract{
  @ViewChild(MatTable) table!: MatTable<any>;

  readonly displayedColumns = displayedColumnsEdit

  originalData = [];

  form: FormGroup
  validForm:boolean[] = [];

  pageSize = 10;
  fullData = [];
  pageSizeList = [10, 20, 50, 100];
  dataSource = new MatTableDataSource([]); // Dữ liệu hiển thị trên table

  constructor(
    protected injector: Injector,
    protected indicator: ActivityIndicatorSingletonService,

    private t24ProtectionService: T24ProtectionService,
    private toastService: ToastService,
    private fb: FormBuilder
  ) {
    super(injector);
    this.form = this.fb.group({
      rows: this.fb.array([]),
    })
  }

  protected componentInit(): void {
    this.enableActions(ModuleKeys.inhouse_config)
    this.listButton = this.enableUpdate ? this.listButtonDynamic('', BUTTON_CANCEL, BUTTON_SAVE) : this.listButtonDynamic('', BUTTON_CANCEL);
    if(this.enableView){
      this.getData()
      this.rows.valueChanges
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(() => {
        this.rows.controls.forEach(row => {
          row.updateValueAndValidity({ emitEvent: false });
        });
      });
      this.compareData()
    } else {
      this.toastService.showToastr('Bạn không có quyền truy cập hợp lệ', "Thông báo", MessageSeverity.error, TOAST_DEFAULT_CONFIG)
    }
  }

  getData() {
    this.indicator.showActivityIndicator()
    this.t24ProtectionService.get().pipe(
      finalize(() => {
        this.indicator.hideActivityIndicator()
      }),
      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      next: (res) => {
        const configs = res.data?.value?.t24ProtectionConfigs || [];

        this.fullData = configs;
        this.totalItem = configs.length;
        this.pageIndex = 0;
        this.pageSize = this.pageSizeList[0];

        this.paginateData();

        this.originalData = JSON.parse(JSON.stringify(configs))
        this.trackRowsChange()

      },
      error: err => {
        const errMessage = ErrorUtils.getErrorMessage(err)
        this.toastService.showToastr(errMessage.join('\n'), "Thông báo", MessageSeverity.error, TOAST_DEFAULT_CONFIG)
      }
    })
  }

  get rows(): FormArray {
    return this.form.get('rows') as FormArray;
  }

  compareData() {
    const areEqual = JSON.stringify(this.rows.value) === JSON.stringify(this.originalData);
    if (this.enableUpdate) {
      BUTTON_SAVE.disable = areEqual;
    }
  }

  trackRowsChange() {
    const areEqual = JSON.stringify(this.fullData) === JSON.stringify(this.originalData);
    if (this.enableUpdate) {
      BUTTON_SAVE.disable = areEqual;
    }
  }

  onClickAddRow() {
    if(this.rows.length > 0 && this.rows.at(0).invalid){
      return
    }

    this.fullData.unshift({
      "channel": "",
      "waitingTimeSecond": null,
      "leaseTimeSecond": null,
      "ccuAccountThreshold": null,
      "keyExpireTimeSecond": null,
      "channelDetail": "",
      "active": true,
      "isNew": true,
    });
    this.totalItem++;
    this.pageIndex = 0;
    this.paginateData();
  }

  onClickDeleteRow(row, index) {
    this.dialogService.confirm({
      label:"Xác nhận",
      acceptBtn: "Xóa",
      closeBtn:"Hủy",
      message: 'Bạn có chắc chắn muốn xóa bản ghi này?',
    }, (result: any) => {
      if (result.status == DFORM_CONFIRM_STATUS.CONFIRMED) {
        const globalIndex = this.pageIndex * this.pageSize + index;
        this.fullData.splice(globalIndex, 1);
        this.totalItem--;
        this.trackRowsChange()
        this.paginateData()
      }
    });
  }

  onSubmit() {
    if (!this.validateFullData()) {
      this.toastService.showToastr("Vui lòng nhập thông tin hợp lệ", "Thông báo", MessageSeverity.error, TOAST_DEFAULT_CONFIG);
      return;
    }

    this.dialogService.dformconfirm({
      title: 'Lý do',
      label: 'Chỉnh sửa cấu hình',
      description: 'Nhập lý do chỉnh sửa cấu hình',
      acceptBtn: 'Xác nhận',
      closeBtn: 'Đóng',
      maxLength: 2000
      },(result: {status: number, data: string}) => {
        if (result && result.data.length > 2000) {
          this.toastService.showToastr('Lý do đã vượt quá 2000 kí tự!', 'Thông báo!', MessageSeverity.error, TOAST_DEFAULT_CONFIG);
        } else if (result && result.status === 1) {
          const data: IPutT24ProtectionBody = {
            value: {
              $type: "t24_protection",
              t24ProtectionConfigs: this.fullData
            },
            reason: result.data
          }
          this.indicator.showActivityIndicator()
          this.t24ProtectionService.update(data).pipe(
            finalize(() => {
              this.indicator.hideActivityIndicator()
            }),
            takeUntil(this.ngUnsubscribe)
          ).subscribe({
            next: (res) => {
              this.toastService.showToastr('Cập nhật thành công', 'Thông báo!', MessageSeverity.success, TOAST_DEFAULT_CONFIG);
              this.goTo('/pmp_admin/transfer-channel/inhouse-transfer/t24-protection')
            },
            error: err => {
              const errMessage = ErrorUtils.getErrorMessage(err)
              this.toastService.showToastr(errMessage.join('\n'), "Thông báo", MessageSeverity.error, TOAST_DEFAULT_CONFIG)
            }
          })
        }
      }
    )
  }

  onClickActionBtn($event: any) {
    switch ($event) {
      case TYPE_BTN_FOOTER.TYPE_CANCEL:
        this.goTo("pmp_admin/transfer-channel/inhouse-transfer/t24-protection")
        break
      case TYPE_BTN_FOOTER.TYPE_SAVE:
        this.onSubmit()
        break;
    }
  }

  paginateData() {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    const paginatedData = this.fullData.slice(startIndex, endIndex);
    this.rows.clear(); // Xóa dữ liệu cũ
    paginatedData.forEach((data) => {
      this.rows.push(this.createRow(data, data.isNew === true));
    });

    this.table.renderRows();
  }

  createRow(data: T24ProtectionConfig, isNew = false): FormGroup {
    const group = this.fb.group({
      channel: [data.channel, [Validators.required, Validators.maxLength(20), Validators.pattern(/^[A-Za-z0-9]+$/)]],
      waitingTimeSecond: [data.waitingTimeSecond, [Validators.required, Validators.pattern(/^[1-9][0-9]*$/), Validators.maxLength(10)]],
      leaseTimeSecond: [data.leaseTimeSecond, [Validators.required, Validators.pattern(/^[1-9][0-9]*$/), Validators.maxLength(10)]],
      ccuAccountThreshold: [data.ccuAccountThreshold, [Validators.required, Validators.pattern(/^[1-9][0-9]*$/), Validators.maxLength(10)]],
      keyExpireTimeSecond: [data.keyExpireTimeSecond, [Validators.required, Validators.pattern(/^[1-9][0-9]*$/), Validators.maxLength(10)]],
      channelDetail: [data.channelDetail, [Validators.maxLength(4000)]],
      active: [data.active, [Validators.required]],
      isNew: [isNew],
    });

    // Disable channel và active nếu là bản ghi mặc định hoặc cũ
    if (!isNew || data.channel === 'DEFAULT') {
      group.get('channel')?.disable();
    }

    // Không cho chỉnh sửa kênh DEFAULT
    if (data.channel === 'DEFAULT') {
      group.get('active')?.disable();
      group.get('channel')?.disable();
    }

    return group;
  }

  validateDuplicateChannels() {
    const valueCountMap = new Map<string, number>();

    // Đếm số lần xuất hiện của mỗi channel
    this.rows.controls.forEach((row: FormGroup) => {
      const channel = row.get('channel')?.value?.trim()?.toUpperCase();
      if (channel) {
        valueCountMap.set(channel, (valueCountMap.get(channel) || 0) + 1);
      }
    });

    // Đặt lỗi hoặc xóa lỗi tùy theo kết quả
    this.rows.controls.forEach((row: FormGroup) => {
      const control = row.get('channel');
      const channel = control?.value?.trim()?.toUpperCase();
      if (!channel) return;

      const count = valueCountMap.get(channel) || 0;
      if (count > 1) {
        control?.setErrors({ ...control.errors, duplicateChannel: 'Mã kênh bị trùng' });
      } else {
        if (control?.hasError('duplicateChannel')) {
          const { duplicateChannel, ...rest } = control.errors || {};
          control.setErrors(Object.keys(rest).length ? rest : null);
        }
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.paginateData();
  }

  onChangeData(event: any, index: number, keyChange: keyof T24ProtectionConfig) {
    const globalIndex = this.pageIndex * this.pageSize + index;

    if (!this.fullData || globalIndex >= this.fullData.length) return;

    let newValue: any = event?.target?.value ?? event?.value ?? event;

    const row = this.rows.at(index);
    const control = row?.get(keyChange);
    if (keyChange === 'channel') {
      newValue = newValue.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
      control?.setValue(newValue, { emitEvent: false });
      control?.updateValueAndValidity();         // để tính lại lỗi trùng
      this.validateDuplicateChannels();          // validate toàn bộ form khác
    } else if (['waitingTimeSecond', 'leaseTimeSecond', 'ccuAccountThreshold', 'keyExpireTimeSecond'].includes(keyChange)) {
      newValue = newValue.replace(/[^0-9]/g, '');
      newValue = newValue ? parseInt(newValue, 10) : '';
      control?.setValue(newValue, { emitEvent: false });
    } else if (keyChange === 'active') {
      newValue = event.checked;
      control?.setValue(newValue, { emitEvent: false });
    } else {
      control?.setValue(newValue, { emitEvent: false });
    }

    // Cập nhật fullData
    this.fullData[globalIndex][keyChange] = newValue;

    this.trackRowsChange()
  }

  private validateFullData(): boolean {
    // Kiểm tra lỗi dữ liệu (trường bắt buộc và định dạng)
    const hasInvalidData = this.fullData.some(item =>
        !item.channel || !item.waitingTimeSecond || !item.leaseTimeSecond || !item.ccuAccountThreshold || !item.keyExpireTimeSecond || !/^[A-Za-z0-9_]+$/.test(item.channel)
    );

    // Kiểm tra trùng lặp trên toàn bộ danh sách
    const hasDuplicate = this.fullData.some((item, index, array) =>
        array.filter(i => i.channel === item.channel).length > 1
    );

    return !(hasInvalidData || hasDuplicate);
  }

  onClickHistory() {
    this.goTo('pmp_admin/transfer-channel/inhouse-transfer/t24-protection/history')
  }
}
