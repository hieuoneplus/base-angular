import { Component, Injector } from '@angular/core';
import {ComponentAbstract, DialogManagementService, MessageSeverity} from '@shared-sm';
import { BehaviorSubject } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { PageEvent } from '@angular/material/paginator';

import {finalize, takeUntil} from "rxjs/operators";
import {MatTableDataSource} from "@angular/material/table";
import {MatSlideToggleChange} from "@angular/material/slide-toggle";
import {ModuleKeys} from "../../../../public/module-permission.utils";
import {TOAST_DEFAULT_CONFIG} from "../../../../public/constants";
import ErrorUtils from "../../../../shared/utils/ErrorUtils";
import {InhouseConfigsService} from "../services/inhouse-configs";
import {IConfig, IConfigList, IRequestPutConfig} from "../../../model/inhouse-transfer";
import {MatDialogRef} from "@angular/material/dialog";
import {EditConfigsComponent} from "./edit-configs/edit-configs.component";
import {IConfirmTimeModel} from "../../../../shared/dform-dialogs";

@Component({
  selector: 'search-transfer-async-page',
  templateUrl: './search-configs.component.html',
  styleUrls: ['./search-configs.component.scss']
})
export class SearchConfigsComponent extends ComponentAbstract {

  // Table view
  displayedColumns: string[] = [
    'stt', 'channel', 'status', 'timeConfig', 'actions'
  ];

  key = 'transfer.channels.state';
  type= 'transfer_channels_state';

  hasDataSource = false;
  selection = new SelectionModel<any>(true, []);
  selectionObs = new BehaviorSubject<any>('');
  pageEvent: PageEvent = new PageEvent();
  configList = [];

  private dialogRef!: MatDialogRef<EditConfigsComponent> | null;

  constructor(
    protected injector: Injector,
    protected configAudit: InhouseConfigsService,
    private dialogManagementService: DialogManagementService
  ) {
    super(injector);
  }

  protected componentInit(): void {
    this.enableActions(ModuleKeys.inhouse_transfer_channel_state);
    this.QueryData();
  }


  QueryData() {
    console.log("QUERY", this.key)
    this.configAudit.getConfigs(this.key).pipe(
      takeUntil(this.ngUnsubscribe),
      finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe((res) => {
      console.log("RESPONSE", res)
      // Gọi API thành công và có data trả về
      if (res && res.status === 200) {
        this.hasDataSource = true;
        this.configList = res.data.value.transferChannelsState;
        const data = res.data.value.transferChannelsState;
        this.dataSource = new MatTableDataSource(data);
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
      const messageError = ErrorUtils.getErrorMessage(error);
      this.toastr.showToastr(
        messageError.join('\n'),
        'Thông báo!',
        MessageSeverity.error,
        TOAST_DEFAULT_CONFIG
      )
    });
  }


  onClickChangeStatus(event: MatSlideToggleChange, element: IConfig) {

    const config = {
      positionClass: 'toast-top-right',
      timeOut: 3000,
      extendedTimeOut: 3000
    };
    const onOff = element.active ? 'tắt' : 'bật';
    const ON_OFF = onOff.charAt(0).toUpperCase() + onOff.slice(1);
    const description = `Lý do ${onOff} trạng thái hạch toán`;


    this.dformSetTime({
      label: `${ON_OFF} trạng thái hạch toán`,
      title: 'Lý do',
      description: description,
      acceptBtn: 'Xác nhận',
      closeBtn: 'Hủy',
      active: element.active,
    }, (result: any) => {
      if (result && result.status === 1) {

        let arr = this.configList.map((obj, index) => {
          if(obj.transferChannel === element.transferChannel) {
            obj.transferChannel = element.transferChannel;
            obj.reopenTime = result.dateTime;
            obj.closeDurationSecond = result.durationSecond;
            obj.active = !element.active;
          }
          return obj;
        });

        let configList: IConfigList = {
          $type: this.type,
          transferChannelsState: arr,
        }

        const body: IRequestPutConfig = {
          key: this.key,
          description: result.data,
          value: configList
        }
        this.indicator.showActivityIndicator();
        this.configAudit.putConfig(body, this.key).pipe(
          takeUntil(this.ngUnsubscribe),
          finalize(() => this.indicator.hideActivityIndicator())
        ).subscribe((res) => {
          console.log("RESPONSE", res)
          // Gọi API thành công và có data trả về
          this.QueryData();
          if (res && res.status === 200) {
            this.toastr.showToastr(
              `${ON_OFF} trạng thái hạch toán thành công`,
              'Thông báo!',
              MessageSeverity.success,
              config
            );
          } else {
            event.source.checked = element.active
            this.toastr.showToastr(
              `${ON_OFF} trạng thái hạch toán không thành công`,
              `${ON_OFF} trạng thái hoạt động thất bại`,
              MessageSeverity.error,
              config
            );
          }
        }, error => {
          event.source.checked = element.active
          this.QueryData();
          console.log("ERROR-500", error);
          const message = ErrorUtils.getErrorMessage(error);
          this.toastr.showToastr(
            message.join('\n'),
            `${ON_OFF} trạng thái hạch toán thất bại`,
            MessageSeverity.error,
            config
          );
        });
      } else {
        event.source.checked = element.active
      }
    })
  }


  onClickEdit(element) {
    console.log("EDIT ", element);
    const config = {
      positionClass: 'toast-top-right',
      timeOut: 3000,
      extendedTimeOut: 3000
    };

    this.dformSetTime({
      label: 'Chỉnh sửa thời điểm bật lại trạng thái hạch toán',
      title: 'Lý do',
      description: 'Nhập lí do chỉnh sửa thời điểm bật lại trạng thái hạch toán',
      acceptBtn: 'Xác nhận',
      closeBtn: 'Hủy',
      active: true,
      dateTime: element.reopenTime
    }, (result: any) => {
      if (result && result.status === 1) {

        let arr = this.configList.map((obj, index) => {
          if(obj.transferChannel === element.transferChannel) {
            obj.transferChannel = element.transferChannel;
            obj.reopenTime = result.dateTime;
            obj.closeDurationSecond = result.durationSecond;
            obj.active = element.active;
          }
          return obj;
        });

        let configList: IConfigList = {
          $type: this.type,
          transferChannelsState: arr,
        }

        const body: IRequestPutConfig = {
          key: this.key,
          description: result.data,
          value: configList
        }
        this.indicator.showActivityIndicator();
        this.configAudit.putConfig(body, this.key).pipe(
          takeUntil(this.ngUnsubscribe),
          finalize(() => this.indicator.hideActivityIndicator())
        ).subscribe((res) => {
          console.log("RESPONSE", res)
          // Gọi API thành công và có data trả về
          this.QueryData();
          if (res && res.status === 200) {

            this.toastr.showToastr(
              'Chỉnh sửa thời điểm bật lại trạng thái hạch toán thành công',
              'Thông báo!',
              MessageSeverity.success,
              config
            );
          } else {
            this.toastr.showToastr(
              'Chỉnh sửa thời điểm bật lại trạng thái hạch toán không thành công',
              'Chỉnh sửa thời điểm bật lại trạng thái hạch toán thất bại',
              MessageSeverity.error,
              config
            );
          }
        }, error => {
          this.QueryData();
          console.log("ERROR-500", error);
          const message = ErrorUtils.getErrorMessage(error);
          this.toastr.showToastr(
            message.join('\n'),
            'Chỉnh sửa thời điểm bật lại trạng thái hạch toán thất bại',
            MessageSeverity.error,
            config
          );
        });
      }
    })
  }

  dformSetTime(data: IConfirmTimeModel, callback: (result: { status: number, data: any }) => void) {
    const dialogRef = this.dialog.open(EditConfigsComponent, { data, panelClass: 'dialog-dform' });
    dialogRef.afterClosed().subscribe(callback);
    this.dialogManagementService.addDialogRef(dialogRef);
  }

  convertTime(dateStr: string) {
    let [date, time] = dateStr.split(' ');

    let [year, month, day] = date.split('-');

    let formattedDate = `${day}/${month}/${year} ${time}`;

    return formattedDate;
  }

}
