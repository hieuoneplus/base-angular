import { Component, Injector, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ComponentAbstract, MessageSeverity } from '@shared-sm';
import * as moment from 'moment';
import { finalize, takeUntil } from 'rxjs/operators';
import { DFORM_CONFIRM_STATUS, TOAST_DEFAULT_CONFIG } from 'src/app/public/constants';
import { ModuleKeys } from 'src/app/public/module-permission.utils';
import ErrorUtils from 'src/app/shared/utils/ErrorUtils';
import { ChargeCreditService } from '../services/charge-credit.service';
import { COLUMS, URL, DISPUTE_ID, ID, FROM_DATE, TO_DATE, TRANSACTION_REFERENCE_NUMBER, DIRECTION,  TYPE, FROM_AMOUNT, TO_AMOUNT, STATUS, STATUS_LABLE} from './modal/constant';
import { IApproveChargeCredit } from './modal/interface';

@Component({
  selector: 'app-charge-credit',
  templateUrl: './charge-credit.component.html',
  styleUrls: ['./charge-credit.component.scss']
})
export class ChargeCreditComponent extends ComponentAbstract {

  displayedColumns = COLUMS;

  $disputeId = DISPUTE_ID();
  $id = ID();
  $fromDate = FROM_DATE();
  $toDate = TO_DATE();
  $transactionReferencenumber = TRANSACTION_REFERENCE_NUMBER();
  $direction = DIRECTION();
  $type = TYPE();
  $fromAmount = FROM_AMOUNT();
  $toAmount = TO_AMOUNT();
  $status = STATUS();

  bodyApprove: IApproveChargeCredit;


  hasDataSource = false;
  requestParams: any

  constructor(
    protected injector: Injector,
    private chargeCreditService: ChargeCreditService,
  ) {
    super(injector)
  }

  protected componentInit(): void {
    this.enableActions(ModuleKeys.napas_ibft_reconcile_charge_credit);
    this.form = this.itemControl.toFormGroup([
      this.$disputeId,
      this.$id,
      this.$fromDate,
      this.$toDate,
      this.$transactionReferencenumber,
      this.$direction,
      this.$type,
      this.$fromAmount,
      this.$toAmount,
      this.$status,
    ]);
    this.search();
  }

  search() {
    this.pageIndex = 0;
    this.pageSize = 10;
    
    const params = Object.assign(
      {},
      Object.entries(this.form.value).reduce((acc, [key, value]) => {
        if (key === 'fromDate'|| key === 'toDate') {
          const rawDate = this.form.get('fromDate')?.value;
          if (rawDate) {
            const date = moment(rawDate).startOf('day').format('yyyy-MM-DD');
            acc[key] = date;
          } else {
            acc[key] = null;
          }
        } else {
          acc[key] = typeof value === 'string' && value.trim() !== '' ? value.trim() : null;
        }
        return acc;
      }, {})
    );
    
    this.options = {
      params: {
        ...params,
      }
    };
    
    this.requestParams = {
      page: this.pageIndex,
      size: this.pageSize,
    }
    this.dformPagination.goto(this.pageSize, this.pageIndex);
  }

  QueryData() {
    this.indicator.showActivityIndicator();
    this.chargeCreditService.getChargeCredit(this.options.params, this.requestParams).pipe(
      takeUntil(this.ngUnsubscribe),
      finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe((res) => {
      // Gọi API thành công và có data trả về
      if (res && res.status === 200) {
        this.hasDataSource = true;
        const page = this.pageIndex * this.pageSize;
        const data = res.data.chargeCredits.map((obj, index) => {
          obj.stt = page + index + 1;
          return obj;
        });

        this.dataSource = new MatTableDataSource(data);
        this.totalItem = res.data.total;
      } else {
        this.hasDataSource = false;
        this.totalItem = 0;
        this.toastr.showToastr(
          res.soaErrorDesc,
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

  convertToTimeFormat(timeStr: string): string {
    if (!timeStr || timeStr.length !== 6) return '';
    return timeStr.slice(0, 2) + ':' + timeStr.slice(2, 4) + ':' + timeStr.slice(4, 6);
  }

  convertToDateFormat(dateStr: string): string {
    if (!dateStr || dateStr.length !== 4) return '';
    return dateStr.slice(2, 4) + '-' + dateStr.slice(0, 2);
  }

  getLabel($state) {
    const status = STATUS_LABLE.find((item) => item.key === $state);
    return `<label class="wf-status ${status.class}">${status.value}</label>`;
  }
  

  changePageIndex($event) {
    this.pageSize = $event.pageSize;
    this.pageIndex = $event.pageIndex;
    this.options = {
      params: {
        ...this.options.params,
      }
    };
    this.requestParams = {
      page: this.pageIndex,
      size: this.pageSize,
    }
    this.QueryData();
  }

  resetFormSearch() {
    this.form.reset();
    this.search();
  }

  
  onClickCreateReq() {
    this.goTo(URL.NAPAS.IBFT_RECONCILE.OUT.CHARGE_CREDIT.CREATE);
  }

  onClickReject(element) {
    this.dialogService.dformconfirm(
      {
        label: 'Từ chối yêu cầu báo có',
        title: 'Lý do',
        description: 'Nhập lý do từ chối yêu cầu báo có',
        acceptBtn: 'Xác nhận',
        closeBtn: 'Hủy',
      },
      (result: any) => {
        if (result && result.status === DFORM_CONFIRM_STATUS.CONFIRMED) {
          this.bodyApprove = {
            action: 'REJECT',
            id: element.id,
            reason: result.data,
          }
          this.indicator.showActivityIndicator();
          this.chargeCreditService
            .approveChargeCredit(this.bodyApprove)
            .pipe(
              takeUntil(this.ngUnsubscribe),
              finalize(() => this.indicator.hideActivityIndicator())
            )
            .subscribe(
              (res) => {
                console.log('RESPONSE', res);
                this.toastr.showToastr(
                  'Từ chối yêu cầu báo có thành công',
                  'Thông báo!',
                  MessageSeverity.success,
                  TOAST_DEFAULT_CONFIG
                );
                this.search()
              },
              (error) => {
                console.log('ERROR', error);
                const messageError = ErrorUtils.getErrorMessage(error);
                this.toastr.showToastr(
                  messageError.join('\n'),
                  'Thông báo!',
                  MessageSeverity.error,
                  TOAST_DEFAULT_CONFIG
                );
                this.search()
              }
            );
        }
      }
    );
  }

  onClickApprove(element) {
    this.dialogService.confirm(
      {
        label: 'Duyệt yêu cầu báo có',
        acceptBtn: 'Xác nhận',
        closeBtn: 'Hủy',
        message: 'Bạn có chắc chắn muốn duyệt yêu cầu báo có?',
      },
      (result: any) => {
        if (result && result.status === DFORM_CONFIRM_STATUS.CONFIRMED) {
          this.bodyApprove = {
            action: 'APPROVE',
            id: element.id,
            reason: result.data,
          }
          this.indicator.showActivityIndicator();
          this.chargeCreditService
            .approveChargeCredit(this.bodyApprove)
            .pipe(
              takeUntil(this.ngUnsubscribe),
              finalize(() => this.indicator.hideActivityIndicator())
            )
            .subscribe(
              (res) => {
                if (res && res.status === 200) {
                  this.toastr.showToastr(
                    'Phê duyệt yêu cầu báo có thành công',
                    'Thông báo!',
                    MessageSeverity.success,
                    TOAST_DEFAULT_CONFIG
                  );
                  this.search()
                }
              },
              (error) => {
                const messageError = ErrorUtils.getErrorMessage(error);
                this.toastr.showToastr(
                  messageError.join('\n'),
                  'Thông báo!',
                  MessageSeverity.error,
                  TOAST_DEFAULT_CONFIG
                );
                this.search()
              }
            );
        }
      }
    );
  }


  onClickEdit(element) {
    this.goTo(URL.NAPAS.IBFT_RECONCILE.OUT.CHARGE_CREDIT.EDIT, {disputeId: element?.disputeId,id: element?.id})

  }

  viewDetail(element) {
    this.goTo(URL.NAPAS.IBFT_RECONCILE.OUT.CHARGE_CREDIT.DETAIL, { disputeId: element?.disputeId, id: element?.id });
  }
}
