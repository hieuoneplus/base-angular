import { Component, Injector, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatTableDataSource } from '@angular/material/table';
import { ComponentAbstract, MessageSeverity } from '@shared-sm';
import * as moment from 'moment';
import { finalize, takeUntil } from 'rxjs/operators';
import { DFORM_CONFIRM_STATUS, TOAST_DEFAULT_CONFIG } from 'src/app/public/constants';
import { ModuleKeys } from 'src/app/public/module-permission.utils';
import ErrorUtils from 'src/app/shared/utils/ErrorUtils';
import { TransactionFlagService } from '../services/transaction-flag.service';
import { IRequestTransactionLag } from './modal/interface';
import { COLUMS, URL,} from './modal/constant';

@Component({
  selector: 'app-transaction-flag',
  templateUrl: './transaction-flag.component.html',
  styleUrls: ['./transaction-flag.component.scss']
})
export class TransactionFlagComponent extends ComponentAbstract {

  displayedColumns = COLUMS

  hasDataSource = false;
  requestPut: IRequestTransactionLag = {
    reason: '',
    value:'',
  }

  constructor(
    protected injector: Injector,
    private transactionFlagService: TransactionFlagService,
  ) {
    super(injector)
  }

  protected componentInit(): void {
    this.enableActions(ModuleKeys.napas_ibft_reconcile_transaction_flag);
    this.search()

  }

  search() {
    this.indicator.showActivityIndicator();
    this.transactionFlagService.getTransactionFlag().pipe(
      takeUntil(this.ngUnsubscribe),
      finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe((res) => {
      // Gọi API thành công và có data trả về
      if (res && res.status === 200) {
        this.hasDataSource = true;
        const data = res.data
        this.dataSource = new MatTableDataSource([data]);
        
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
      console.log('error');
      this.hasDataSource = false;
      const messageError = ErrorUtils.getErrorMessage(error);
      this.toastr.showToastr(
        messageError.join('\n'),
        'Thông báo!',
        MessageSeverity.error,
        TOAST_DEFAULT_CONFIG
      )
    });
  }

  modalUpdateFlag(event: MatSlideToggleChange) {
    console.log(event, 'event');
    
    const newStatus = !event.checked;
    const onOff = newStatus ? 'tắt' : 'bật';
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
        this.callUpdateConfig(result.data, newStatus,event);
      } else {
        event.source.checked = newStatus;
      }
    }
    );
  }

  callUpdateConfig(reason: string, newStatus: boolean, event: MatSlideToggleChange) {
    this.requestPut.reason = reason.trim();
    this.requestPut.value = !newStatus ? 'OFF' : 'ON';
    const onOff = newStatus ? 'Tắt' : 'Bật';

    this.indicator.showActivityIndicator()
    this.transactionFlagService.putTransactionFlag(this.requestPut).pipe(
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
          this.search()
        }
        else {
        event.source.checked = newStatus
        }
      },
      error: (error) => {
        event.source.checked = newStatus;
        const messsageError = ErrorUtils.getErrorMessage(error);
        this.toastr.showToastr(
          messsageError.join('\n'),
          'Thông báo!',
          MessageSeverity.error,
          TOAST_DEFAULT_CONFIG
        );
      },
      complete: () => {
      }
    })
  }

  onClickHistory() {
    this.goTo(URL.NAPAS.IBFT_RECONCILE.OUT.TRANSACTION_FLAG.HISTORY)
  }

}
