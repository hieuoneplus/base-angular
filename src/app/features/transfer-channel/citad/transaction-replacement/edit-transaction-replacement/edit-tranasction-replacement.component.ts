import {ChangeDetectionStrategy, Component, Injector, ViewChild} from '@angular/core';
import {
  ActivityIndicatorSingletonService,
  ComponentAbstract,
  HttpResponse,
  MessageSeverity,
  ToastService
} from "@shared-sm";
import {displayedColumnsEdit} from "../model/constant";
import {finalize, takeUntil} from "rxjs/operators";
import {IReplaceSpecialCharDetail, ITransactionReplacement,} from "../model/interface";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {
  BUTTON_CANCEL,
  BUTTON_SAVE,
  DFORM_CONFIRM_STATUS,
  TOAST_DEFAULT_CONFIG,
  TYPE_BTN_FOOTER
} from "../../../../../public/constants";
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {ModuleKeys} from "../../../../../public/module-permission.utils";
import {Observable} from "rxjs";
import ErrorUtils from "../../../../../shared/utils/ErrorUtils";
import {TransactionReplacementService} from "../../services/transaction-replacement.service";
import {PageEvent} from "@angular/material/paginator";
import {fieldOptions} from "../constant";

@Component({
  selector: 'citad-transanction-replacement-edit',
  templateUrl: './edit-transaction-replacement.component.html',
  styleUrls: ['./edit-transaction-replacement.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransactionReplacementEditComponent extends ComponentAbstract{
  @ViewChild(MatTable) table!: MatTable<any>;

  readonly displayedColumns = displayedColumnsEdit

  originalData = [];

  form: FormGroup
  validForm:boolean[] = [];

  pageSize = 10;
  fullData = [];
  pageSizeList = [10, 20, 50, 100];
  dataSource = new MatTableDataSource([]); // Dữ liệu hiển thị trên table
  $fieldOptions = fieldOptions;

  constructor(
    protected injector: Injector,
    protected indicator: ActivityIndicatorSingletonService,

    private transactionReplacementService: TransactionReplacementService,
    private toastService: ToastService,
    private fb: FormBuilder
  ) {
    super(injector);
    this.form = this.fb.group({
      rows: this.fb.array([]),
    })
  }

  protected componentInit(): void {
    this.enableActions(ModuleKeys.citad_transaction_replacement)
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
      this.toastService.showToastr('Bạn không có quyền truy cập hợp lệ', "Thông báo", MessageSeverity.error, TOAST_DEFAULT_CONFIG)
    }
  }

  search() {
    this.handleGetTransactionReplacement().subscribe({
      next: (res) => {
        let allRows = [];
        Object.entries(res.data.value.replacements).forEach(([key, value]) => {
          Object.entries(value).forEach(([k, v]) => {
            const result = {
              field: key,
              target: k,
              replacement: v.toString(),
            }
            allRows.push(result);
          });
        });
        this.fullData = allRows;
        this.totalItem = allRows.length;
        this.pageIndex = 0;
        this.pageSize = this.pageSizeList[0];

        this.paginateData();

        this.originalData = JSON.parse(JSON.stringify(allRows))
        this.trackRowsChange()
      },
      error: err => {
        const errMessage = ErrorUtils.getErrorMessage(err)
        this.toastService.showToastr(errMessage.join('\n'), "Thông báo", MessageSeverity.error, TOAST_DEFAULT_CONFIG)
      }
    })
  }

  handleGetTransactionReplacement(): Observable<HttpResponse<ITransactionReplacement>> {
    this.indicator.showActivityIndicator()
    return this.transactionReplacementService.getTransactionReplacement().pipe(
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
    const areEqual = JSON.stringify(this.fullData) === JSON.stringify(this.originalData);
    if (this.enableUpdate) {
      BUTTON_SAVE.disable = areEqual;
    }
  }

  createRow(data: IReplaceSpecialCharDetail): FormGroup {
    const row = this.fb.group({
      field: [data.field, [Validators.required, this.validateField()]],
      target: [data.target, [Validators.required]],
      replacement: [data.replacement, [Validators.required]],
    },);

    row.get('field')?.valueChanges.subscribe(() => {
      row.get('target')?.updateValueAndValidity();
    });
    return row
  }

  validateField(): Validators {
    return (control) => {
      const validPattern = /^[A-Za-z0-9_]+$/;
      if (control.value && !validPattern.test(control.value)) {
        return {invalidField: true};
      }
      return null;
    }
  }

  isDuplicate(row, index:number): boolean {
    const field = row.get('field').value;
    const target = row.get('target').value;
    const occurrences = this.fullData.filter(item => item.field === field && item.target === target).length;
    this.validForm[index] = occurrences <= 1
    return occurrences > 1 ;
  };

  onClickHistory() {
    this.goTo('pmp_admin/transfer-channel/citad/transaction-replacement/history-config', {keyConfig: "transaction.replacement"})
  }

  onClickAddRow() {
    if(this.rows.length > 0 && this.rows.at(0).invalid){
      return
    }

    this.fullData.unshift({
      "field": "",
      "target": "",
      "replacement": "",
    });
    this.totalItem++;
    this.pageIndex = 0;
    this.paginateData();
  }

  onClickDeleteRow(row, index) {
    this.dialogService.confirm({
      label:"Xác nhận",
      acceptBtn: "Xóa",
      closeBtn:"Hủy",
      message: 'Bạn có chắc chắn muốn xóa bản ghi này?',
    }, (result: any) => {
      if (result.status == DFORM_CONFIRM_STATUS.CONFIRMED) {
        const globalIndex = this.pageIndex * this.pageSize + index;
        this.fullData.splice(globalIndex, 1);
        this.totalItem--;
        this.trackRowsChange()
        this.paginateData()
      }
    });
  }

  onSubmit() {
    if (!this.validateFullData()) {
      this.toastService.showToastr("Vui lòng nhập thông tin hợp lệ", "Thông báo", MessageSeverity.error, TOAST_DEFAULT_CONFIG);
      return;
    }

    this.dialogService.dformconfirm({
      title: 'Lý do',
      label: 'Chỉnh sửa cấu hình',
      description: 'Nhập lý do chỉnh sửa cấu hình',
      acceptBtn: 'Xác nhận',
      closeBtn: 'Đóng',
      maxLength: 2000
      },(result: {status: number, data: string}) => {
        if (result && result.data.length > 2000) {
          this.toastService.showToastr('Lý do đã vượt quá 2000 kí tự!', 'Thông báo!', MessageSeverity.error, TOAST_DEFAULT_CONFIG);
        } else if (result && result.status === 1) {
          const data = {
            key: "transaction.replacement",
            value: {
              $type: "replacement",
              replacements: this.convertArrayToObject(this.fullData)
            },
            reason: result.data
          }
          this.indicator.showActivityIndicator()
          this.transactionReplacementService.updateTransactionReplacement(data).pipe(
            finalize(() => {
              this.indicator.hideActivityIndicator()
            }),
            takeUntil(this.ngUnsubscribe)
          ).subscribe({
            next: (res) => {
              this.toastService.showToastr('Cập nhật thành công', 'Thông báo!', MessageSeverity.success, TOAST_DEFAULT_CONFIG);
              this.goTo('/pmp_admin/transfer-channel/citad/transaction-replacement')
            },
            error: err => {
              const errMessage = ErrorUtils.getErrorMessage(err)
              this.toastService.showToastr(errMessage.join('\n'), "Thông báo", MessageSeverity.error, TOAST_DEFAULT_CONFIG)
            }
          })
        }
      }
    )
  }

  onClickActionBtn($event: any) {
    switch ($event) {
      case TYPE_BTN_FOOTER.TYPE_CANCEL:
        this.goTo("pmp_admin/transfer-channel/citad/transaction-replacement")
        break
      case TYPE_BTN_FOOTER.TYPE_SAVE:
        this.onSubmit()
        break;
    }
  }

  convertArrayToObject(inputArray: Array<{ field: string, target: string, replacement: string }>): { [key: string]: { [key: string]: string } } {
    const result = {};

    inputArray.forEach(item => {
      const { field, target, replacement } = item;
      if (!result[field]) {
        result[field] = {};
      }
      result[field][target] = replacement;
    });

    return result;
  }

  paginateData() {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    const paginatedData = this.fullData.slice(startIndex, endIndex);

    this.rows.clear(); // Xóa dữ liệu cũ
    paginatedData.forEach((data) => {
      this.rows.push(this.createRow(data));
    });

    this.table.renderRows();
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.paginateData();
  }

  onChangeData(event, index: number, keyChange:string) {
    const globalIndex = this.pageIndex * this.pageSize + index;
    if (this.fullData && this.fullData.length > index) {
      if (keyChange == 'field') {
        this.fullData[globalIndex].field = event.value;
      } else if (keyChange == 'target')  {
        this.fullData[globalIndex].target = event.target.value;
      } else if (keyChange == 'replacement') {
        this.fullData[globalIndex].replacement = event.target.value;
      }
    }

    this.trackRowsChange()
  }

  private validateFullData(): boolean {
    // Kiểm tra lỗi dữ liệu (trường bắt buộc và định dạng)
    const hasInvalidData = this.fullData.some(item =>
        !item.field || !item.target || !item.replacement || !/^[A-Za-z0-9_]+$/.test(item.field)
    );

    // Kiểm tra trùng lặp trên toàn bộ danh sách
    const hasDuplicate = this.fullData.some((item, index, array) =>
        array.filter(i => i.field === item.field && i.target === item.target).length > 1
    );

    return !(hasInvalidData || hasDuplicate);
  }
}
