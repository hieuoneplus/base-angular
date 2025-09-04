import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { finalize, takeUntil } from 'rxjs/operators';
import { ComponentAbstract, MessageSeverity, ToastService } from '@shared-sm';
import {
  BUTTON_CANCEL,
  BUTTON_ADD,
  TYPE_BTN_FOOTER,
  TOAST_DEFAULT_CONFIG,
  DFORM_CONFIRM_STATUS,
} from 'src/app/public/constants';
import { SelectionModel } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { IRequestPostStateTreasury } from 'src/app/features/model/citad';
import ErrorUtils from 'src/app/shared/utils/ErrorUtils';
import {
  BRANCHCODE_GET,
  CODE_GET,
  CREDIT_ACC_NO_GET,
  NAME_GET,
} from '../constants';
import { StateTreasuryConfigService } from '../../services/state-treasury-config-service.service';

@Component({
  selector: 'add-state-treasury-page',
  templateUrl: './add-state-treasury.component.html',
  styleUrls: ['./add-state-treasury.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddStateTreasuryComponent extends ComponentAbstract {
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
    private stateTreasuryConfigService: StateTreasuryConfigService,
    private toastService: ToastService
  ) {
    super(injector);
  }

  protected componentInit(): void {
    this.trackInputAddStateTreasury();
    this.form = this.itemControl.toFormGroup([
      this.$code,
      this.$branchCode,
      this.$name,
      this.$creditAccountNo,
    ]);
    this.listButton = this.listButtonDynamic('', BUTTON_CANCEL, BUTTON_ADD);
  }

  trackInputAddStateTreasury() {
    this.$code.required = true;
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
    && mapInput['codes'] 
    && mapInput['creditAccountNo']
    && mapInput['branchCode'];
  }

  modalAddStateTreasury() {
    if (this.form.valid && this.checkInputMap(this.validInputMap)) {
      this.dialogService.dformconfirm(
        {
          label: 'Thêm mới cấu hình ',
          title: 'Lý do',
          description: 'Nhập lý do thêm mới cấu hình',
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
            const body: IRequestPostStateTreasury = {
              name: values.name?.trim()|| '',
              code: values.codes?.trim(),
              creditAccountNo: values.creditAccountNo?.trim()|| '',
              branchCode: values.branchCode?.trim()|| '',
              reason: result.data,
            };
            this.indicator.showActivityIndicator();
            this.stateTreasuryConfigService
              .postStateTreasuries(body)
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
                      'Thêm mới cấu hình thành công',
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
                  const messsageError = ErrorUtils.getErrorMessage(error);
                  this.toastService.showToastr(
                    messsageError.join('\n'),
                    'Thông báo!',
                    MessageSeverity.error,
                    TOAST_DEFAULT_CONFIG
                  );
                }
              );
          }
        }
      );
    } else if (!this.form.valid) {
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
        this.modalAddStateTreasury();
        break;
    }
  }
}
