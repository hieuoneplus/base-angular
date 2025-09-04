import {ChangeDetectionStrategy, Component, Injector, ViewChild} from '@angular/core';
import {
  ActivityIndicatorSingletonService,
  ComponentAbstract,
  HttpResponse,
  MessageSeverity,
  ToastService
} from "@shared-sm";
import {displayedColumnsEdit, mockAccPara} from "../model/constant";
import {AccountParameterService} from "../../services/account-parameter.service";
import {finalize, takeUntil} from "rxjs/operators";
import {IAccountParameter, IAccountParameterDetail} from "../model/interface";
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {BUTTON_CANCEL, BUTTON_SAVE, TYPE_BTN_FOOTER} from "../../../../../public/constants";
import {MatTable} from "@angular/material/table";
import {ModuleKeys} from "../../../../../public/module-permission.utils";
import {Observable} from "rxjs";
import ErrorUtils from "../../../../../shared/utils/ErrorUtils";
import {UUID} from "angular2-uuid";

@Component({
  selector: 'app-account-parameter-edit',
  templateUrl: './account-parameter-edit.component.html',
  styleUrls: ['./account-parameter-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountParameterEditComponent extends ComponentAbstract{
  @ViewChild(MatTable) table!: MatTable<any>;

  readonly displayedColumns = displayedColumnsEdit
  readonly mockData = mockAccPara

  originalData = [];

  form: FormGroup

  constructor(
    protected injector: Injector,
    protected indicator: ActivityIndicatorSingletonService,

    private accountParameterService: AccountParameterService,
    private toastService: ToastService,
    private fb: FormBuilder
  ) {
    super(injector);
    this.form = this.fb.group({
      rows: this.fb.array([]),
    })
  }

  protected componentInit(): void {
    this.enableActions(ModuleKeys.citad_account_parameter)
    this.listButton = this.enableUpdate ? this.listButtonDynamic('', BUTTON_CANCEL, BUTTON_SAVE) : this.listButtonDynamic('', BUTTON_CANCEL);
    if(this.enableView){
      this.search()
      this.rows.valueChanges
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(() => {
        this.rows.controls.forEach(row => {
          row.updateValueAndValidity({ emitEvent: false });
        });
      });
      this.compareData()
    } else {
      this.toastService.showToastr('Bạn không có quyền truy cập hợp lệ', "Thông báo", MessageSeverity.error)
    }
  }

  search() {
    this.handleGetAccountParameter().subscribe({
      next: (res) => {
        res.data.value.accountParameters.forEach(data => {
          this.rows.push(this.createRow(data))
        })
        this.table.renderRows();
        this.originalData = [...this.rows.value]
        this.trackRowsChange()
      },
      error: err => {
        const errMessage = ErrorUtils.getErrorMessage(err)
        this.toastService.showToastr(errMessage.join('\n'), "Thông báo", MessageSeverity.error)
      }
    })
  }

  handleGetAccountParameter(): Observable<HttpResponse<IAccountParameter>> {
    this.indicator.showActivityIndicator()
    return this.accountParameterService.getAccountParameter().pipe(
      finalize(() => {
        this.indicator.hideActivityIndicator()
      }),
      takeUntil(this.ngUnsubscribe)
    )
  }

  get rows(): FormArray {
    return this.form.get('rows') as FormArray;
  }

  compareData() {
      const areEqual = JSON.stringify(this.rows.value) === JSON.stringify(this.originalData);
      if (this.enableUpdate) {
        BUTTON_SAVE.disable = areEqual;
      }
  }

  trackRowsChange() {
    this.rows.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: value => {
        // const valueWithoutKey =  value.map((e) => {
        //   return {...e, key: null}
        // })
        // const OGDataWithoutKey =  this.originalData.map((e) => {
        //   return {...e, key: null}
        // })
        // const areEqual = JSON.stringify(valueWithoutKey) === JSON.stringify(OGDataWithoutKey);
        // if (this.enableUpdate) {
        //   BUTTON_SAVE.disable = areEqual;
        // }
      // }

        const areEqual = JSON.stringify(value) === JSON.stringify(this.originalData);
        if (this.enableUpdate) {
          BUTTON_SAVE.disable = areEqual;
        }
      }
    })
  }

  createRow(data: IAccountParameterDetail): FormGroup {
    const row = this.fb.group({
      key: UUID.UUID(),
      auto: [data.auto],
      creditAccountNo: [
        data.creditAccountNo,
        [this.noSpecialCharacters()],
      ],
      parameter: [
        data.parameter,
        [Validators.required, this.noSpecialCharacters()],
      ],
      priority: [
        data.priority,
        [Validators.required, this.noSpecialCharacters()],
      ],
      processingUnit: [data.processingUnit],
      type: [
        data.type,
        [Validators.required]
      ],
  },
      // {updateOn: "blur"}
    );
    row.setValidators(this.uniqueFieldsValidator(this.rows.controls));
    return row
  }

  uniqueFieldsValidator(rows: AbstractControl[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const currentCreditAccountNo = control.get('creditAccountNo')?.value ? control.get('creditAccountNo')?.value.toUpperCase() : null;
      const currentParameter = control.get('parameter')?.value;
      const currentType = control.get('type')?.value;
      const currentKey = control.get('key')?.value;

      const duplicate = rows.some(row => {
        const rowCreditAccountNo = row.get('creditAccountNo')?.value ? row.get('creditAccountNo')?.value.toUpperCase() : null;
        const rowParameter = row.get('parameter')?.value;
        const rowType = row.get('type')?.value;
        const rowKey = row.get('key')?.value;

        return rowKey !== currentKey &&
          rowType === currentType &&
          rowCreditAccountNo === currentCreditAccountNo &&
          rowParameter === currentParameter;
      });
      return duplicate ? { isDuplicated: true } : null;
    };
  }

  noSpecialCharacters(): Validators {
    return (control) => {
      const forbiddenChars = /[`~!@#$%^&*()\-_=+\[\]{}\\|;:'",<>\/?]/;
      const char10orChar13 = /[\x0A\x0D]/;
      const vietnameseChar = /[àáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữự]/

      const hasSpecialChars = vietnameseChar.test(control.value) || forbiddenChars.test(control.value) || char10orChar13.test(control.value);
      return hasSpecialChars ? { specialCharacters: true } : null;
    };
  }

  validateRow(index: number): boolean {
    return this.rows.at(index).valid;
  }

  onClickHistory() {
    this.goTo('pmp_admin/transfer-channel/citad/history-config', {keyConfig: "account.parameter"})
  }

  onClickAddRow() {
    if(this.rows.controls.length !== 0 && this.rows.at(0).invalid){
      this.rows.markAllAsTouched()
      return
    }
    this.rows.insert(0, this.createRow(
      {
        "auto": false,
        "creditAccountNo": "",
        "parameter": "",
        "priority": 0,
        "processingUnit": "",
        "type": ""
      },
    ))
    this.table.renderRows()
  }

  onClickDeleteRow(row, index) {
    this.rows.removeAt(index)
    this.table.renderRows()
  }

  onSubmit() {
    if(this.form.valid) {
      this.dialogService.dformconfirm({
        title: 'Lý do',
        label: 'Chỉnh sửa cấu hình',
        description: 'Nhập lý do chỉnh sửa cấu hình',
        acceptBtn: 'Xác nhận',
        closeBtn: 'Đóng',
        maxLength: 1024
        },(result: {status: number, data: string}) => {
          if (result && result.data.length > 1024) {
            this.toastService.showToastr('Lý do đã vượt quá 1024 kí tự!', 'Thông báo!', MessageSeverity.error, '');
          } else if (result && result.status === 1) {
            const data = {
              key: "account.parameter",
              value: {
                $type: "account_parameter",
                accountParameters: this.rows.value.map(item => {
                  return {
                    ...item,
                    type: item.type.trim(),
                    creditAccountNo: item.creditAccountNo ? item.creditAccountNo.trim() : null,
                    parameter: item.parameter.trim(),
                    processingUnit: item.processingUnit ? item.processingUnit.trim() : null,
                  }
                }),
              },
              reason: result.data
            }
            this.indicator.showActivityIndicator()
            this.accountParameterService.updateAccountParameter(data).pipe(
              finalize(() => {
                this.indicator.hideActivityIndicator()
              }),
              takeUntil(this.ngUnsubscribe)
            ).subscribe({
              next: (res) => {
                this.toastService.showToastr('Cập nhật thành công', 'Thông báo!', MessageSeverity.success, '');
                this.goTo('/pmp_admin/transfer-channel/citad/account.parameter')
              },
              error: err => {
                const errMessage = ErrorUtils.getErrorMessage(err)
                this.toastService.showToastr(errMessage.join('\n'), "Thông báo", MessageSeverity.error)
              }
            })
          }
        }
      )
    } else {
      this.rows.markAllAsTouched()
      this.toastService.showToastr("Vui lòng nhập thông tin hợp lệ", "Thông báo", MessageSeverity.error)
    }
  }

  onClickActionBtn($event: any) {
    switch ($event) {
      case TYPE_BTN_FOOTER.TYPE_CANCEL:
        this.goTo("pmp_admin/transfer-channel/citad/account.parameter")
        break
      case TYPE_BTN_FOOTER.TYPE_SAVE:
        this.onSubmit()
        break;
    }
  }
}
