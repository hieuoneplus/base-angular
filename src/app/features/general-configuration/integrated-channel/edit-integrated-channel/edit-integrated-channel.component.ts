import { Component, Injector } from '@angular/core';
import { finalize, takeUntil } from 'rxjs/operators';
import { ComponentAbstract, MessageSeverity } from '@shared-sm';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  BUTTON_CANCEL,
  BUTTON_ADD,
  TYPE_BTN_FOOTER,
  TOAST_DEFAULT_CONFIG,
  DFORM_CONFIRM_STATUS,
  BUTTON_SAVE,
} from 'src/app/public/constants';
import { SelectionModel } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import ErrorUtils from '../../../../shared/utils/ErrorUtils';
import { ModuleKeys } from '../../../../public/module-permission.utils';
import {
  TRANSACTION_TYPE_INPUT,
  CHANNEL,
  JSON_EX,
  STATUS_EDIT,

} from 'src/app/features/data-form/integrated-channel-form';
import { IntegratedChannelService } from '../../service/IntegratedChannelService';
import { IIntegratedChannelContent, IRequestPostIntegratedChannel, IRequestPutIntegratedChannel } from 'src/app/features/model/integrated-channel';

@Component({
  selector: 'edit-integrated-channel-page',
  templateUrl: './edit-integrated-channel.component.html',
  styleUrls: ['./edit-integrated-channel.component.scss'],
})
export class EditIntegratedChannelComponent extends ComponentAbstract {
  integratedChannelDetail: IIntegratedChannelContent;
  $channel = CHANNEL();
  $transactionType = TRANSACTION_TYPE_INPUT();
  $status = STATUS_EDIT();

  groupList: any = [];
  checked: boolean = false;
  isChecked: boolean = false;
  isChecker: boolean = false;

  isFieldDuplicated = false;

  hasDataSource = false;
  selection = new SelectionModel<any>(true, []);
  selectionObs = new BehaviorSubject<any>('');
  pageEvent: PageEvent = new PageEvent();
  groupListDataSource = new MatTableDataSource<any>([]);

  constructor(
    protected injector: Injector,
    private integratedChannelService: IntegratedChannelService
  ) {
    super(injector);
  }

  protected componentInit(): void {
    this.enableActions(ModuleKeys.routing_integration_channel);
    this.trackIntegratedChannel();
    this.form = this.itemControl.toFormGroup([
      this.$channel,
      this.$transactionType,
      this.$status,
    ]);
    this.listButton = this.enableUpdate ? this.listButtonDynamic('', BUTTON_CANCEL, BUTTON_SAVE) : this.listButtonDynamic('', BUTTON_CANCEL);

    this.getIntegratedDetail();

    this.form.get('transactionType').valueChanges.subscribe((newType) => {
      this.isFieldDuplicated = false;
    });
  }

  trackIntegratedChannel() {
    this.$channel.required = true;
    this.$channel.readOnly = true;
    this.$transactionType.readOnly = true;
    this.$transactionType.required = true;
    this.$status.required = true;
  }
  getIntegratedDetail() {

    this.indicator.showActivityIndicator();

    this.integratedChannelService.getIntegratedChannelDetail(this.queryParams.id).pipe(
      takeUntil(this.ngUnsubscribe),
      finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe((res) => {
      console.log("RESPONSE", res)
      // Gọi API thành công và có data trả về
      if (res && res.status === 200) {
        this.integratedChannelDetail = res.data;
        this.form.patchValue({
          channel: res.data.channel,
          transactionType: res.data.transactionType,
          status: res.data.status,
        })

        this.hasDataSource = true;

      }
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
  }
  modalAddIntegratedChannel() {
    if (this.form.valid) {
      this.dialogService.dformconfirm(
        {
          label: 'Chỉnh sửa cấu hình kênh tích hợp',
          title: 'Lý do',
          description: 'Nhập lý do chỉnh sửa cấu hình kênh tích hợp',
          acceptBtn: 'Xác nhận',
          closeBtn: 'Hủy',
          maxLength: 2000,
        },
        (result: any) => {
          if (result && result.data.length > 2000) {
            this.toastr.showToastr(
              'Lý do đã vượt quá 2000 kí tự!',
              'Thông báo!',
              MessageSeverity.error,
              ''
            );
          } else if (result.status === DFORM_CONFIRM_STATUS.CONFIRMED) {
            const values = this.form.value;
            const body: IRequestPutIntegratedChannel = {
              channel: values.channel,
              transactionType : values.transactionType,
              reason: result.data,
              status: values.status,

            };
            this.indicator.showActivityIndicator();
            this.integratedChannelService
              .putIntegratedChannel(body,this.queryParams.id)
              .pipe(
                takeUntil(this.ngUnsubscribe),
                finalize(() => this.indicator.hideActivityIndicator())
              )
              .subscribe(
                (res) => {
                  console.log('RESPONSE', res);
                  // Gọi API thành công và có data trả về
                  if (res && res.status === 200) {
                    this.toastr.showToastr(
                      'Cập nhật cấu hình kênh tích hợp thành công',
                      'Thông báo!',
                      MessageSeverity.success,
                      TOAST_DEFAULT_CONFIG
                    );
                    this.goTo('/pmp_admin/general-config/integration-channels');
                  }
                },
                (error) => {
                  console.log('ERROR', error);
                  const messageError = ErrorUtils.getErrorMessage(error);
                  if (
                    error?.status === 400 &&
                    error?.error.soaErrorCode == '008006-4144'
                  ) {
                    this.isFieldDuplicated = true;
                  }
                  this.toastr.showToastr(
                    messageError.join('\n'),
                    'Thông báo!',
                    MessageSeverity.error,
                    TOAST_DEFAULT_CONFIG
                  );
                }
              );
          }
        }
      );
    } else {
      this.toastr.showToastr(
        'Vui lòng điền các trường bắt buộc nhập',
        'Thông báo!',
        MessageSeverity.error,
        TOAST_DEFAULT_CONFIG
      );
    }
  }

  onClickBtn($event?: any): void {
    switch ($event) {
      case TYPE_BTN_FOOTER.TYPE_CANCEL:
        this.goTo('/pmp_admin/general-config/integration-channels');
        break;
      case TYPE_BTN_FOOTER.TYPE_SAVE:
        if (this.form.valid) {
          this.modalAddIntegratedChannel();
        } else {
          this.form.markAllAsTouched();
        }
        break;
    }
  }
  onInputChange(event: any): void {
    let inputValue = event.target.value;
    inputValue = inputValue.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    inputValue = inputValue.replace(/[^a-zA-Z0-9-_]/g, '');
    inputValue = inputValue.toUpperCase();
    event.target.value = inputValue;
  }

}
