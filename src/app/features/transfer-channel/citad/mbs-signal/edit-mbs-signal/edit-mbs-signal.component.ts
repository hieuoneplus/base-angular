import { Component, Injector } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ComponentAbstract, MessageSeverity } from '@shared-sm';
import { UUID } from 'angular2-uuid';
import { finalize, takeUntil } from 'rxjs/operators';
import { BUTTON_CANCEL, BUTTON_SAVE, BUTTON_UNDO, DFORM_CONFIRM_STATUS, TOAST_DEFAULT_CONFIG, TYPE_BTN_FOOTER } from 'src/app/public/constants';
import { ModuleKeys } from 'src/app/public/module-permission.utils';
import ErrorUtils from 'src/app/shared/utils/ErrorUtils';
import { MbsSignalService } from '../../services/mbs-signal.service';
import { IRequestUpdateMbsSignal } from '../modal/interface';

@Component({
  selector: 'app-edit-mbs-signal',
  templateUrl: './edit-mbs-signal.component.html',
  styleUrls: ['./edit-mbs-signal.component.scss']
})
export class EditMbsSignalComponent extends ComponentAbstract {

  requestUpdateMbsSignal: IRequestUpdateMbsSignal = {
    key: "partner.transaction.pattern",
    value: {
      $type: "partner_transaction_pattern",
      partnerTransactionPatterns: []
    },
    reason: ""
  }

  initialPartnerTransactionPatterns: string[] = [];

  constructor(
    protected injector: Injector,
    private formBuilder: FormBuilder,
    private mbsSignalService: MbsSignalService
  ) {
    super(injector);
    this.mFormGroup = this.createForm();
  }

  protected componentInit(): void {
    this.handleGetMbsSignal();
    this.enableActions(ModuleKeys.citad_partner_pattern)
    this.listButton = this.enableUpdate ? this.listButtonDynamic('', BUTTON_CANCEL, BUTTON_SAVE) : this.listButtonDynamic('', BUTTON_CANCEL);
    this.compareData();
    this.mFormGroup = this.createForm();
    this.dynamicRows.controls.forEach((control, index) => {
      this.listenToControlChanges(control, index);
    });
  }

  mFormGroup: FormGroup;
  createForm(): FormGroup {
    return this.formBuilder.group({
      rows: this.formBuilder.array([]) // creates a new FormArray
    });
  }

  // more easily access the dynamic form elements from template
  get dynamicRows() {
    return this.mFormGroup.controls["rows"] as FormArray
  }

  listenToControlChanges(control, index: number) {
    control.get('text')?.valueChanges.subscribe(() => {
      this.compareData();
    });
  }

  onInputChange(event: Event) {
    this.compareData();
  }

  addFormRow() {
    if (this.mFormGroup.invalid) return;
    const newRow = this.formBuilder.group({
      text: this.formBuilder.control('', [
        Validators.required,
        // Validators.maxLength(250),
      ]),
      key: this.formBuilder.control(UUID.UUID())
    });

    this.listenToControlChanges(newRow, this.dynamicRows.controls.length);

    this.dynamicRows.insert(0, newRow);
    this.compareData();
  }

  removeFormRow(idx: number) {
    this.dialogService.dformconfirm({
      label: 'Xác nhận',
      title: null,
      message: 'Bạn có muốn xóa thông tin này không?',
      acceptBtn: 'Xác nhận',
      closeBtn: 'Đóng'
    }, (result: any) => {
      if (result.status === DFORM_CONFIRM_STATUS.CONFIRMED) {
        this.dynamicRows.removeAt(idx);
        this.toastr.showToastr(
          `Xóa thành công`,
          'Thông báo!',
          MessageSeverity.success,
          TOAST_DEFAULT_CONFIG
        );
        this.compareData();
      }
    }
    );

  }

  isValidFormControl(controlName: string, error?: string): string | boolean {
    const control = this.dynamicRows.controls[controlName];
    const forbiddenChars = /[`~!@#$%^&*()\-_=+\[\]{}\\|;:'",<>\/?]/;
    const char10orChar13 = /[\x0A\x0D]/;
    const vietnamese = /[àáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữự]/
    const maxLength = 250;

    if (control.value.text) {
      if (vietnamese.test(control.value.text)) {
        return 'Sai định dạng ký tự'
      }
      // if (control.value.text.length > maxLength) {
      //   return `Vui lòng nhập không quá ${maxLength} ký tự`;
      // }
    }

    let isDuplicated = this.dynamicRows.value.findIndex(item => item.text.toUpperCase().trim() === control.value.text.toUpperCase().trim() && item.key !== control.value.key) !== -1;
    if (isDuplicated) {
      this.dynamicRows.markAllAsTouched();
    }
    if (!error) {
      return control?.touched && (control.status === 'INVALID' || isDuplicated);
    }
    if (control?.touched && control.status === 'INVALID') {
      return 'Dấu hiệu bắt buộc nhập'
    } else if (control?.touched && isDuplicated) {
      return 'Dấu hiệu đã tồn tại'
    }
  }

  handleGetMbsSignal() {
    this.indicator.showActivityIndicator()
    this.mbsSignalService.getMbsSignal().pipe(
      finalize(() => {
        this.indicator.hideActivityIndicator()
      }),
      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      next: (res) => {
        if (res && res.status === 200) {
          const holdReceiverNamePatterns = res.data?.value?.partnerTransactionPatterns || [];
          this.initialPartnerTransactionPatterns = [...holdReceiverNamePatterns];
          res.data?.value?.partnerTransactionPatterns.reverse().forEach(item => {
            this.dynamicRows.insert(0, this.formBuilder.group({
              text: this.formBuilder.control(item, [Validators.required]),
              key: this.formBuilder.control(UUID.UUID())
            }))
          })
          this.compareData();
        }
      },
      error: (err) => {
        if (err.status === 403) {
          this.toastr.showToastr(
            `Không có quyền cấu hình dấu hiệu hoàn trả `,
            'Thông báo!',
            MessageSeverity.error,
            TOAST_DEFAULT_CONFIG
          );
        } else {
          const messsageError = ErrorUtils.getErrorMessage(err);
          this.toastr.showToastr(
            messsageError.join('\n'),
            'Thông báo!',
            MessageSeverity.error,
            TOAST_DEFAULT_CONFIG
          );
        }
      }
    })
  }

  onClickHistory() {
    this.goTo('pmp_admin/transfer-channel/citad/mbs-signal/history-config', {keyConfig: "partner.transaction.pattern"})
  }

  modalUpdateMbsSignal() {
    let values = this.dynamicRows.value.map(v => { return v.text });
    let findDuplicates = values.filter((item, index) => values.indexOf(item) !== index)
    const forbiddenChars = /[`~!@#$%^&*()\-_=+\[\]{}\\|;:'",<>\/?]/;
    const char10orChar13 = /[\x0A\x0D]/;
    const vietnamese = /[àáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữự]/
    const maxLength = 250;


    if (this.mFormGroup.invalid || findDuplicates.length > 0 || values.some(value => vietnamese.test(value)) ) {
      this.mFormGroup.markAllAsTouched();
      return;
    }

    this.dialogService.dformconfirm({
      label: 'Chỉnh sửa cấu hình dấu hiệu tài khoản thu hộ định danh',
      title: 'Lý do',
      description: 'Nhập lý do chỉnh sửa cấu hình',
      maxLength: 1024,
      acceptBtn: 'Xác nhận',
      closeBtn: 'Đóng',
    }, (result) => {
      if (result.status === DFORM_CONFIRM_STATUS.CONFIRMED) {
        this.callUpdateConfig(result.data);
      }
    }
    );
  }

  callUpdateConfig(reason: string) {
    this.indicator.showActivityIndicator()

    const valueMbsignal = this.dynamicRows.value.map(item => { return item.text.trim() });
    this.requestUpdateMbsSignal.reason = reason.trim();
    this.requestUpdateMbsSignal.value.partnerTransactionPatterns = valueMbsignal
    this.mbsSignalService.updateMbsSignal(this.requestUpdateMbsSignal).pipe(
      finalize(() => {
        this.indicator.hideActivityIndicator()
      }),
      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      next: (res) => {
        if (res && res.status === 200) {
          this.toastr.showToastr(
            `Lưu bản ghi thành công`,
            'Thông báo!',
            MessageSeverity.success,
            TOAST_DEFAULT_CONFIG
          );
          this.goTo('pmp_admin/transfer-channel/citad/mbs-signal')
        } else {

        }
      },
      error: (error) => {
        const messsageError = ErrorUtils.getErrorMessage(error);
        this.toastr.showToastr(
          messsageError.join('\n'),
          'Thông báo!',
          MessageSeverity.error,
          TOAST_DEFAULT_CONFIG
        );
      }
    })
  }

  compareData() {
    const currentValues = this.dynamicRows.value.map((row: any) => row.text.toUpperCase().trim());
    const areEqual = JSON.stringify(currentValues) === JSON.stringify(this.initialPartnerTransactionPatterns).toUpperCase().trim();
    if (this.enableUpdate) {
      BUTTON_SAVE.disable = areEqual;
    }
  }

  onClickBtn($event?: any): void {
    switch ($event) {
      case TYPE_BTN_FOOTER.TYPE_CANCEL:
        this.goTo('pmp_admin/transfer-channel/citad/mbs-signal');
        break;
      case TYPE_BTN_FOOTER.TYPE_SAVE:
        this.modalUpdateMbsSignal()
        break;
    }
  }

}
