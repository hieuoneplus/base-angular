import { Component, Inject, Injector, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MessageSeverity } from '@shared-sm';
import { finalize, takeUntil } from 'rxjs/operators';
import { DFORM_CONFIRM_STATUS, TOAST_DEFAULT_CONFIG } from 'src/app/public/constants';
import { ModuleKeys } from 'src/app/public/module-permission.utils';
import { ComponentDialogAbstract } from 'src/app/shared/abstract/component.dialog.abstract';
import { MessageErrorManageService } from '../../services/message-error-mange';
import { IResponseMessageErrorManage } from '../modal/interface';

@Component({
  selector: 'app-detail-message-error-manage',
  templateUrl: './detail-message-error-manage.component.html',
  styleUrls: ['./detail-message-error-manage.component.scss']
})
export class DetailMessageErrorManageComponent extends ComponentDialogAbstract {
  
  dataMessageErrorDetail: IResponseMessageErrorManage

  listRetry: Array<number> = [];

  constructor(
    protected injector: Injector,
    public dialogRef: MatDialogRef<DetailMessageErrorManageComponent>,
    private messageErrorManageService: MessageErrorManageService,
    @Inject(MAT_DIALOG_DATA) private data: any,

  ) {
    super(injector);
   }

   protected componentInit(): void {
    this.handleGetMessageErrorDetail();
    this.enableActions(ModuleKeys.wire_transfer_error_messages)
  }
  
  saveData() {
    // throw new Error('Method not implemented.');
  }

  handleGetMessageErrorDetail() {
    this.indicator.showActivityIndicator()
    this.messageErrorManageService.getMessageErrorManageDetail(this.data.idMessageError).pipe(
      finalize(() => {
        this.indicator.hideActivityIndicator()
      }),
      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      next: (res) => {
        if (res && res.data) {
          this.dataMessageErrorDetail = res.data
        }
      },
      error: (err) => {

      }
    })
  }

  closeDialog() {
    if (this.dialogRef.close) { this.dialogRef.close(null); }
  }

  checkCreatedAtOver15Days(createdAt?: string): boolean {
    if (!createdAt) return false; 
  
    const currentDate = new Date();
    const createdDate = new Date(createdAt);
  
    const differenceInTime = currentDate.getTime() - createdDate.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
  
    return differenceInDays > 15;
  }

  onClickRetry(idMessageError?: number) {
    this.dialogService.confirm({
      message: 'Bạn có chắc chắn muốn retry message lỗi không?',
      label:"Xác nhận",
      acceptBtn: "Xác nhận",
      closeBtn:"Hủy"
    }, (result: any) => {
      if (result.status === DFORM_CONFIRM_STATUS.CONFIRMED) {
        this.retryTransaction(idMessageError);
      }
    });
  }

  retryTransaction(idMessageError?: number) {
    this.listRetry = []
    if (idMessageError) {
      this.listRetry.push(Number(idMessageError));
    }

    this.indicator.showActivityIndicator()
    this.messageErrorManageService.retryMessageErrorManage(this.listRetry).pipe(
      finalize(() => {
        this.indicator.hideActivityIndicator()
      }),
      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      next: (res) => {
        if (res && res.status === 200) {
          const countMessageRetrySuccess = Array.isArray(res.data) ? res.data.filter(item => item === true).length : 0;
          if (countMessageRetrySuccess > 0) {
            this.toastr.showToastr(
              `Retry ` + countMessageRetrySuccess + '/' + this.listRetry.length + ` bản ghi thành công`,
              'Thông báo!',
              MessageSeverity.success,
              TOAST_DEFAULT_CONFIG
            );
          } else {
            this.toastr.showToastr(
              `Retry ` + this.listRetry.length + ` bản ghi thất bại`,
              'Thông báo!',
              MessageSeverity.error,
              TOAST_DEFAULT_CONFIG
            );
          }
          this.closeDialog()
        }
      },
      error: (err) => {
        this.toastr.showToastr(
          `Retry ` + this.listRetry.length + ` bản ghi thất bại`,
          'Thông báo!',
          MessageSeverity.error,
          TOAST_DEFAULT_CONFIG
        );
        this.listRetry = []
      }
    })
  }

}
