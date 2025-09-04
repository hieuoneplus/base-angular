import { Component, Injector } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ComponentAbstract, MessageSeverity, ToastService } from '@shared-sm';
import { finalize, takeUntil } from 'rxjs/operators';
import { DFORM_CONFIRM_STATUS, TOAST_DEFAULT_CONFIG } from 'src/app/public/constants';
import { ModuleKeys } from 'src/app/public/module-permission.utils';
import ErrorUtils from 'src/app/shared/utils/ErrorUtils';
import { OnOffGateWayService } from '../services/on-off-gate.service';
import {KEY_ON_OFF_GATEWAY} from './modal/constant'
import { IRequestUpdateOnOffGateWay, UpdateOnOffGatewayContent } from './modal/interface';
import { SelectionModel } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-on-off-gate',
  templateUrl: './on-off-gate.component.html',
  styleUrls: ['./on-off-gate.component.scss']
})
export class OnOffGateComponent extends ComponentAbstract {

  displayedColumns: string[] = [
    'stt',
    'gateway',
    'active',
  ];
  listGatewayEnabled: boolean[] = [];
  hasDataSource = false;
  selection = new SelectionModel<any>(true, []);
  selectionObs = new BehaviorSubject<any>('');
  showTooltip: boolean = false;

  requestUpdateOnOffGateWay: IRequestUpdateOnOffGateWay = {
    key: "citad.gateway.enabled",
    value: {
      $type: "booleans_value",
      values: []
    },
    reason: ""
  }

  constructor(
    protected injector: Injector,
    private onOffGateWaylService: OnOffGateWayService,
    private toastService: ToastService
  ) {
    super(injector);
    this.form = this.itemControl.toFormGroup([
    ]);
  }

  protected componentInit(): void {
    this.getOnOffGateWay()
    this.enableActions(ModuleKeys.citad_gateway)
  }

  getOnOffGateWay() {
    this.indicator.showActivityIndicator()
    this.onOffGateWaylService.getOnOffGateWay().pipe(
      finalize(() => {
        this.indicator.hideActivityIndicator()
      }),
      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      next: (res) => {
        if (res && res.status === 200) {
          this.listGatewayEnabled = res.data?.value?.values?.map(val => val ?? false) || [false];
          const contentArray: UpdateOnOffGatewayContent[] = KEY_ON_OFF_GATEWAY.map((gateway, index) => ({
            stt: index + 1,
            gateway: gateway.value,
            active: this.listGatewayEnabled[index],
          }));
          this.dataSource = new MatTableDataSource(contentArray);
        } else {
          this.hasDataSource = false;
          this.dialogService.error({
            title: 'dialog.notification',
            message: res.soaErrorDesc ? res.soaErrorDesc : 'Lỗi hệ thống.'
          }, resp => {
            if (res) {
            }
          });
        }
      },
      error: (err) => {
        const errMessage = ErrorUtils.getErrorMessage(err)
          this.toastService.showToastr(errMessage.join('\n'), "Thông báo", MessageSeverity.error,TOAST_DEFAULT_CONFIG)
      }
    })
  }

  modalUpdateOnOffGateWay(index: number, event: MatSlideToggleChange) {
    const newStatus = event.checked;
    const onOff = !newStatus ? 'tắt' : 'bật';
    const ON_OFF = onOff.charAt(0).toUpperCase() + onOff.slice(1);
    const description = `Lý do ${onOff} trạng thái cấu hình`;
    this.dialogService.dformconfirm({
      label: `${ON_OFF} trạng thái cấu hình`,
      title: 'Lý do',
      description: description,
      acceptBtn: 'Xác nhận',
      closeBtn: 'Hủy',
      maxLength: 2000,
    }, (result) => {
      if (result.status === DFORM_CONFIRM_STATUS.CONFIRMED) {
        this.callUpdateConfig(result.data, index-1, newStatus,event);
      } else {
        event.source.checked = !newStatus;
      }
    }
    );
  }

  callUpdateConfig(reason: string, index: number, newStatus: boolean,event: MatSlideToggleChange) {
    this.requestUpdateOnOffGateWay.reason = reason.trim();
    const onOff = !newStatus ? 'Tắt' : 'Bật';
    const updatedGateways = [...this.listGatewayEnabled];
    updatedGateways[index] = newStatus;
    this.requestUpdateOnOffGateWay.value.values = updatedGateways

    this.indicator.showActivityIndicator()
    this.onOffGateWaylService.updateOnOfffGateWay(this.requestUpdateOnOffGateWay).pipe(
      finalize(() => {
        this.indicator.hideActivityIndicator()
      }),
      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      next: (res) => {
        if (res && res.status === 200) {
          this.toastr.showToastr(
            `${onOff} trạng thái cấu hình thành công`,
            'Thông báo!',
            MessageSeverity.success,
            TOAST_DEFAULT_CONFIG
          );
          this.getOnOffGateWay();
        }
        else {
          updatedGateways[index] = !newStatus;
          this.listGatewayEnabled = [...updatedGateways]
        }
      },
      error: (error) => {
        event.source.checked = !newStatus;
        const messsageError = ErrorUtils.getErrorMessage(error);
        this.toastr.showToastr(
          messsageError.join('\n'),
          'Thông báo!',
          MessageSeverity.error,
          TOAST_DEFAULT_CONFIG
        );
        updatedGateways[index] = !newStatus;
        this.listGatewayEnabled = [...updatedGateways]
      },
      complete: () => {
      }
    })
  }

  onClickHistory() {
    this.goTo('pmp_admin/transfer-channel/citad/gateway/history-config', {keyConfig: "citad.gateway.enabled"})
  }
}
