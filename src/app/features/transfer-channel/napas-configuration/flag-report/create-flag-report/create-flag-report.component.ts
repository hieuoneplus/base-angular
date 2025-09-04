import { Component, Injector } from '@angular/core';
import { ComponentAbstract, MessageSeverity } from '@shared-sm';
import * as moment from 'moment';
import { finalize, takeUntil } from 'rxjs/operators';
import { BUTTON_CANCEL, DFORM_CONFIRM_STATUS, TOAST_DEFAULT_CONFIG, TYPE_BTN_FOOTER, BUTTON_ADD } from 'src/app/public/constants';
import { ModuleKeys } from 'src/app/public/module-permission.utils';
import ErrorUtils from 'src/app/shared/utils/ErrorUtils';
import { FlagReportService } from '../../services/flag-report.service';
import { CREATE_DATE, FLAG, FLAG_ORS, RECEIVING_ROLE, REPORT_ID, REPORT_NAME, SERVICES, SETTLEMENT_CODE, SETTLEMENT_DATE, URL, VERSION_RECONCILE, TOTAL_PAGE } from '../modal/constant';

import { IRequestFlagReport } from '../modal/interface';

@Component({
  selector: 'app-create-flag-report',
  templateUrl: './create-flag-report.component.html',
  styleUrls: ['./create-flag-report.component.scss']
})
export class CreateFlagReportComponent extends ComponentAbstract {

  $reportName = REPORT_NAME();
  $receivingRole = RECEIVING_ROLE();
  $settlementDate = SETTLEMENT_DATE();
  $settlementCode = SETTLEMENT_CODE();
  $service = SERVICES();
  $flag = FLAG();
  $flagOrs = FLAG_ORS();
  $reportId = REPORT_ID();
  $versionReconcile = VERSION_RECONCILE();
  $totalPage = TOTAL_PAGE();
  $createDate = CREATE_DATE();
  
  requestFlagReport: IRequestFlagReport | null = null;

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
      this.$service,
      this.$flag,
      this.$flagOrs,
      this.$reportId,
      this.$versionReconcile,
      this.$totalPage,
      this.$createDate,
    ]);
    this.loadBtn();
    this.trackRequired()
  }

  trackRequired() {
    this.$reportName.required = true;
    this.$receivingRole.required = true;
    this.$settlementDate.required = true;
    this.$settlementCode.required = true;
    this.$service.required = true;
    this.$flag.required = true;
    this.$flagOrs.required = true;
    this.$reportId.required = true;
    this.$versionReconcile.required = true;
    this.$createDate.required = true;
  }


  modalAddAccount() {
    this.dialogService.dformconfirm({
      label: 'Thêm mới phiên đối',
      acceptBtn: 'Đồng ý',
      closeBtn: 'Đóng',
      innerHTML: 'Xác nhận thêm mới phiên đối?'
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
    this.flagReportService.createFlagReport(this.requestFlagReport).pipe(
      takeUntil(this.ngUnsubscribe),
      finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe((res) => {
      if (res && res.status === 200) {
        this.toastr.showToastr(
          'Thêm mới phiên đối soát thành công',
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

  async createTransactionRefund(): Promise<IRequestFlagReport> {

    const reportNameValue = this.form.get('reportName')?.value;
    const receivingRoleValue = this.form.get('receivingRole')?.value;
    const settlementDateValue = this.form.get('settlementDate')?.value;
    const settlementDateValueCv = moment(settlementDateValue).startOf('day').format('YYYY-MM-DD');

    const settlementCodeValue = this.form.get('settlementCode')?.value;
    const servicesValue = this.form.get('service')?.value;
    const flagValue = this.form.get('flag')?.value;
    const flagOrsValue = this.form.get('flagOrs')?.value;
    const reportIdValue = this.form.get('reportId')?.value;
    const versionReconcileValue = this.form.get('totalPage')?.value;
    const totalPageValue = this.form.get('totalPage')?.value;
    const createDateValue = this.form.get('createDate')?.value;
    const createDateValueCv = moment(createDateValue).startOf('day').format('YYYY-MM-DD');


    return {
      reportName: reportNameValue,
      receivingRole: receivingRoleValue,
      settlementDate: settlementDateValueCv,
      settlementCode: settlementCodeValue,
      services: servicesValue,
      flag: flagValue,
      flagOrs: flagOrsValue,
      reportId: reportIdValue,
      versionReconcile: versionReconcileValue,
      totalPage: totalPageValue,
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
    this.listButton = this.enableInsert ? this.listButtonDynamic('', BUTTON_CANCEL, BUTTON_ADD) : this.listButtonDynamic('', BUTTON_CANCEL);

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
