import { Component, Injector } from '@angular/core';
import { ComponentAbstract, MessageSeverity } from '@shared-sm';
import * as moment from 'moment';
import { finalize, takeUntil } from 'rxjs/operators';
import { BUTTON_CANCEL, DFORM_CONFIRM_STATUS, TOAST_DEFAULT_CONFIG, TYPE_BTN_FOOTER, BUTTON_SAVE } from 'src/app/public/constants';
import { ModuleKeys } from 'src/app/public/module-permission.utils';
import ErrorUtils from 'src/app/shared/utils/ErrorUtils';
import { FlagReportService } from '../../services/flag-report.service';
import { CREATE_DATE, FLAG, FLAG_ORS, RECEIVING_ROLE, REPORT_ID, REPORT_NAME, SERVICES, SETTLEMENT_CODE, SETTLEMENT_DATE_UPDATE, URL, VERSION_RECONCILE, TOTAL_PAGE } from '../modal/constant';

import { IRequestUpdateFlagReport } from '../modal/interface';

@Component({
  selector: 'app-edit-flag-report',
  templateUrl: './edit-flag-report.component.html',
  styleUrls: ['./edit-flag-report.component.scss']
})
export class EditFlagReportComponent extends ComponentAbstract {

  $reportName = REPORT_NAME();
  $receivingRole = RECEIVING_ROLE();
  $settlementDate = SETTLEMENT_DATE_UPDATE();
  $settlementCode = SETTLEMENT_CODE();
  $services = SERVICES();
  $flag = FLAG();
  $flagOrs = FLAG_ORS();
  $reportId = REPORT_ID();
  $versionReconcile = VERSION_RECONCILE();
  $totalPage = TOTAL_PAGE();
  $createDate = CREATE_DATE();

  requestFlagReport: IRequestUpdateFlagReport | null = null;
  requestParams: any


  processBatch: any;
  percent = 0;
  selectedFiles: File;
  idDispute: string;

  constructor(
    protected injector: Injector,
    private flagReportService: FlagReportService,
  ) {
    super(injector);
  }

  componentInit(): void {
    this.enableActions(ModuleKeys.napas_ibft_reconcile_flag_report);
    this.form = this.itemControl.toFormGroup([
      this.$reportName,
      this.$receivingRole,
      this.$settlementDate,
      this.$settlementCode,
      this.$services,
      this.$flag,
      this.$flagOrs,
      this.$reportId,
      this.$versionReconcile,
      this.$totalPage,
      this.$createDate,
    ]);
    this.trackRequiredAndReadOnly()
    this.Search()
  }

  trackRequiredAndReadOnly() {
    this.$reportName.required = true;
    this.$receivingRole.required = true;
    this.$settlementDate.required = true;
    this.$settlementCode.required = true;
    this.$services.required = true;
    this.$flag.required = true;
    this.$flagOrs.required = true;
    this.$reportId.required = true;
    this.$versionReconcile.required = true;
    this.$createDate.required = true;

    this.$reportName.readOnly = true;
    this.$settlementDate.readOnly = true;
    this.$receivingRole.readOnly = true;
    this.$settlementDate.readOnly = true;
    this.$settlementCode.readOnly = true;
    this.$services.readOnly = true;
    this.$flag.readOnly = true;
    this.$totalPage.readOnly = true;
    this.$reportId.readOnly = true;
    this.$versionReconcile.readOnly = true;
  }

  Search() {
    this.options = {
      params: {
        id: this.queryParams?.id
      }
    };
    this.requestParams = {
      page: 0,
      size: 10,
    }
    this.indicator.showActivityIndicator();
    this.flagReportService.getFlagReport(this.options.params, this.requestParams).pipe(
      takeUntil(this.ngUnsubscribe),
      finalize(() => {
        this.indicator.hideActivityIndicator();
        this.loadBtn()
      })
    ).subscribe((res) => {
      // Gọi API thành công và có data trả về
      if (res && res.status === 200) {
        this.hasDataSource = true;
        const settlementDateValue = res.data?.flagReportResponses[0]?.settlementDate ? moment(res.data?.flagReportResponses[0]?.settlementDate).startOf('day').format('DD/MM/YYYY') : null;

        const createDateValue = res.data?.flagReportResponses[0]?.createDate ? moment(res.data?.flagReportResponses[0]?.createDate) : null;

        this.form.patchValue({
          reportName: res.data?.flagReportResponses[0]?.reportName,
          receivingRole: res.data?.flagReportResponses[0]?.receivingRole,
          settlementDate: settlementDateValue,
          settlementCode: res.data?.flagReportResponses[0]?.settlementCode,
          services: res.data?.flagReportResponses[0]?.services,
          flag: res.data?.flagReportResponses[0]?.flag,
          flagOrs: res.data?.flagReportResponses[0]?.flagOrs,
          reportId: res.data?.flagReportResponses[0]?.reportId,
          versionReconcile: res.data?.flagReportResponses[0]?.versionReconcile,
          totalPage: res.data?.flagReportResponses[0]?.totalPage,
          createDate: createDateValue,
        })
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

  modalAddAccount() {
    this.dialogService.dformconfirm({
      label: 'Chỉnh sửa phiên đối soát',
      acceptBtn: 'Đồng ý',
      closeBtn: 'Đóng',
      innerHTML: 'Xác nhận chỉnh sửa phiên đối soát?'
    }, (result: any) => {
      if (result && result.status === DFORM_CONFIRM_STATUS.CONFIRMED) {
        this.createTransactionOrigin();
      }
    });
  }

  async createTransactionOrigin() {
    try {
      this.requestFlagReport = await this.createTransactionRefund();
    } catch (e) {
      return;
    }

    this.indicator.showActivityIndicator();
    this.flagReportService.updateFlagReport(this.requestFlagReport).pipe(
      takeUntil(this.ngUnsubscribe),
      finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe((res) => {
      if (res && res.status === 200) {
        this.toastr.showToastr(
          'Chỉnh sửa phiên đối soát thành công',
          'Thông báo!',
          MessageSeverity.success,
          TOAST_DEFAULT_CONFIG
        );
        this.goTo(URL.NAPAS.IBFT_RECONCILE.OUT.FLAG_REPORT.SEARCH);
      } else {
        this.toastr.showToastr(
          res.soaErrorDesc,
          'Thông báo!',
          MessageSeverity.error,
          TOAST_DEFAULT_CONFIG
        );
      }
    }, error => {
      const messageError = ErrorUtils.getErrorMessage(error);
      this.toastr.showToastr(
        messageError.join('\n'),
        'Thông báo!',
        MessageSeverity.error,
        TOAST_DEFAULT_CONFIG
      );
    });
  }

  async createTransactionRefund(): Promise<IRequestUpdateFlagReport> {

    const flagOrsValue = this.form.get('flagOrs')?.value;
    const createDateValue = this.form.get('createDate')?.value;
    const createDateValueCv = moment(createDateValue).startOf('day').format('YYYY-MM-DD');

    return {
      id: this.queryParams?.id,
      flagOrs: flagOrsValue,
      reportId: this.form.get('reportId')?.value,
      createDate: createDateValueCv,
    }
  }


  private validateFormBeforeSubmit(): boolean {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return false;
    }
    return true
  }

  loadBtn() {
    this.listButton = this.enableUpdate && this.hasDataSource ? this.listButtonDynamic('', BUTTON_CANCEL, BUTTON_SAVE) : this.listButtonDynamic('', BUTTON_CANCEL);

  }


  onClickBtn($event?: any): void {
    switch ($event) {
      case TYPE_BTN_FOOTER.TYPE_CANCEL:
        this.goTo(URL.NAPAS.IBFT_RECONCILE.OUT.FLAG_REPORT.SEARCH);
        break;
      case TYPE_BTN_FOOTER.TYPE_SAVE:
        if (!this.validateFormBeforeSubmit()) return;
        this.modalAddAccount();
        break;
    }
  }
}
