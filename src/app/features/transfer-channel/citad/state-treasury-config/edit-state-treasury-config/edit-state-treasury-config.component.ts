import {Component, Injector} from '@angular/core';
import {ComponentAbstract, MessageSeverity, ToastService} from "@shared-sm";
import {StateTreasuryConfigService} from "../../services/state-treasury-config-service.service";
import { BRANCHCODE_GET, CODE_GET, CREDIT_ACC_NO_GET, NAME_GET } from '../constants';
import { SelectionModel } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BUTTON_CANCEL, BUTTON_SAVE, DFORM_CONFIRM_STATUS, TOAST_DEFAULT_CONFIG, TYPE_BTN_FOOTER } from 'src/app/public/constants';
import { finalize, takeUntil } from 'rxjs/operators';
import { IRequestPutStateTreasury, IStateTreasuryContent } from 'src/app/features/model/citad';
import ErrorUtils from 'src/app/shared/utils/ErrorUtils';

@Component({
  selector: 'edit-state-treasury-config-page',
  templateUrl: './edit-state-treasury-config.component.html',
  styleUrls: ['./edit-state-treasury-config.component.scss']
})
export class EditStateTreasuryConfigComponent extends ComponentAbstract{
  stateTreasuryDetail: IStateTreasuryContent;
  $code = CODE_GET();
  $branchCode = BRANCHCODE_GET();
  $name = NAME_GET();
  $creditAccountNo = CREDIT_ACC_NO_GET();

  groupList: any = [];
  checked: boolean = false;
  isChecked: boolean = false;
  isChecker: boolean = false;
  isValid: boolean = true;
  validInputMap: Map<string, boolean> = new Map();

  hasDataSource = false;
  selection = new SelectionModel<any>(true, []);
  selectionObs = new BehaviorSubject<any>('');
  pageEvent: PageEvent = new PageEvent();
  groupListDataSource = new MatTableDataSource<any>([]);
  constructor(
    protected injector: Injector,
    protected toastService: ToastService,
    private stateTreasuryConfigService: StateTreasuryConfigService
  ) {
    super(injector);
  }

  protected componentInit(): void {
    this.trackInputAddStateTreasury();
    this.getStateTreasuryDetail();
  
    this.form = this.itemControl.toFormGroup([
      this.$code,
      this.$branchCode,
      this.$name,
      this.$creditAccountNo,
    ]);
    this.listButton = this.listButtonDynamic('', BUTTON_CANCEL, BUTTON_SAVE);
  }

  trackInputAddStateTreasury() {
    this.$code.readOnly = true;
  }
  handleRestrictSpecialChars(content: string): boolean {
    const field = this.form.get(content).value;
    var isInvalidContent: boolean =
      /[`~!@#$%^&*()\-_=+\[\]{}\\|;:'",<.>\/?]/.test(field) ||
      /[\x0A\x0D]/.test(field);
    this.validInputMap[content] = !isInvalidContent;
    return isInvalidContent;
  }
  checkInputMap(mapInput: Map<string, boolean>): boolean {
    return mapInput['name'] 
    && mapInput['creditAccountNo']
    && mapInput['branchCode'];
  }

  getStateTreasuryDetail() {
    this.indicator.showActivityIndicator();

    this.stateTreasuryConfigService
      .getStateTreasuryDetail(this.queryParams.code)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        finalize(() => this.indicator.hideActivityIndicator())
      )
      .subscribe(
        (res) => {
          console.log('RESPONSE', res);
          // Gọi API thành công và có data trả về
          if (res && res.status === 200) {
            this.stateTreasuryDetail = res.data;
            this.form.patchValue({
              branchCode: res.data.branchCode,
              codes: res.data.code,
              name: res.data.name,
              creditAccountNo: res.data.creditAccountNo,
            });

            this.hasDataSource = true;
          }
        },
        (error) => {
          const errMessage = ErrorUtils.getErrorMessage(error);
          this.toastService.showToastr(
            errMessage.join('\n'),
            'Thông báo',
            MessageSeverity.error
          );
        }
      );
  }

  saveStateTreasury() {
    if (this.form.valid && this.checkInputMap(this.validInputMap)) {
      this.dialogService.dformconfirm(
        {
          label: 'Chỉnh sửa Cấu hình ',
          title: 'Lý do',
          description: 'Nhập lý do chỉnh sửa Cấu hình ',
          acceptBtn: 'Xác nhận',
          closeBtn: 'Hủy',
          maxLength: 1024
        },
        (result: any) => {
          if (result && result.data.length > 1024) {
            this.toastService.showToastr('Lý do đã vượt quá 1024 kí tự!', 'Thông báo!', MessageSeverity.error, '');
          } else
          if (result.status === DFORM_CONFIRM_STATUS.CONFIRMED) {
            const values = this.form.value;
            const body: IRequestPutStateTreasury = {
              branchCode: values.branchCode?.trim() || '', 
              creditAccountNo: values.creditAccountNo?.trim() || '',
              name: values.name?.trim() || '',
              reason: result.data,
              code : values.codes
            };
            this.indicator.showActivityIndicator();
            this.stateTreasuryConfigService
              .putStateTreasuries(body, this.queryParams.code)
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
                      'Chỉnh sửa cấu hình thành công',
                      'Thông báo!',
                      MessageSeverity.success,
                      TOAST_DEFAULT_CONFIG
                    );
                    this.goTo(
                      '/pmp_admin/transfer-channel/citad/state-treasuries'
                    );
                  }
                },
                (error) => {
                  const errMessage = ErrorUtils.getErrorMessage(error);
                  this.toastService.showToastr(
                    errMessage.join('\n'),
                    'Thông báo',
                    MessageSeverity.error,
                    TOAST_DEFAULT_CONFIG
                  );
                }
              );
          }
        }
      );
    } else if  (!this.form.valid) {
      this.toastr.showToastr(
        'Mã kho bạc bắt buộc nhập',
        'Thông báo!',
        MessageSeverity.error,
        TOAST_DEFAULT_CONFIG
      );
    }
  }

  onClickBtn($event?: any): void {
    switch ($event) {
      case TYPE_BTN_FOOTER.TYPE_CANCEL:
        this.goTo('/pmp_admin/transfer-channel/citad/state-treasuries');
        break;
      case TYPE_BTN_FOOTER.TYPE_SAVE:
        this.saveStateTreasury();
        break;
    }
  }
}
