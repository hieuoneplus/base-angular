import {AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";

import {BUTTON_SAVE, displayedColumnsEdit} from "../constant"
import {ComponentAbstract, MessageSeverity, ToastService} from "@shared-sm";
import {finalize, takeUntil} from "rxjs/operators";
import ErrorUtils from "../../../../../shared/utils/ErrorUtils";
import {AbbreviationConfigService} from "../services/abbreviation-config.service";
import {v4 as uuid} from 'uuid';
import {BUTTON_CANCEL, DFORM_CONFIRM_STATUS, TYPE_BTN_FOOTER} from "../../../../../public/constants";
import {ModuleKeys} from "../../../../../public/module-permission.utils";

interface IElement {
  abbreviation: string,
  content: IElementContent[]
}

interface IElementContent {
  nContent: string,
  nKey: string
}

@Component({
  selector: 'app-abbreviation-config-edit',
  templateUrl: './abbreviation-config-edit.component.html',
  styleUrls: ['./abbreviation-config-edit.component.scss'],
})
export class AbbreviationConfigEditComponent extends ComponentAbstract {
  readonly displayedColumns = displayedColumnsEdit

  newData = []
  beforeUpdateData = []

  constructor(
    protected injector: Injector,

    private abbreviationConfigService: AbbreviationConfigService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) {
    super(injector);
  }

  protected componentInit(): void {
    this.enableActions(ModuleKeys.citad_transaction_abbreviation)
    this.listButton = this.enableUpdate ? this.listButtonDynamic('', BUTTON_CANCEL, BUTTON_SAVE) : this.listButtonDynamic('', BUTTON_CANCEL);
    this.compareData()
    this.search({page: this.pageIndex, size: this.pageSize})
  }

  onClickHistory() {
    this.goTo('pmp_admin/transfer-channel/citad/history-config', {keyConfig: "transaction.abbreviation"})
  }

  extractRelevantFields(data: any[]) {
    return data.map((entry) => ({
      abbreviation: entry.abbreviation,
      content: entry.content.map((contentEntry: any) => contentEntry.nContent),
    }));
  }

  compareData() {
    const areEqual = JSON.stringify(this.extractRelevantFields(this.beforeUpdateData)) === JSON.stringify(this.extractRelevantFields(this.newData));
    if(this.enableUpdate) {
      BUTTON_SAVE.disable = areEqual
    }
  }

  search(options: {page: number, size: number}){
    this.indicator.showActivityIndicator()
    this.abbreviationConfigService.getAbbreviationHConfigList(options).pipe(
      finalize(() => this.indicator.hideActivityIndicator()),
      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      next: (res) => {
        this.handleTransformRawToDataSource(res.data.value.abbreviations)
      },
      error: (err) => {
        const errMessage = ErrorUtils.getErrorMessage(err)
        this.toastService.showToastr(errMessage.join('\n'), "Thông báo", MessageSeverity.error)
      }
    })
  }

  handleTransformRawToDataSource(data: { [key: string]: string[] }) {
    this.cdr.detectChanges();

    this.newData = Object.keys(data).map((e) => ({
      abbreviation: e,
      content: data[e].map((item) => ({
        nContent: item,
        nKey: uuid()
      }))
    }))

    this.beforeUpdateData = Object.keys(data).map((e) => ({
      abbreviation: e,
      content: data[e].map((item) => ({
        nContent: item,
      }))
    }))

    this.dataSource = new MatTableDataSource(this.newData)
  }

  handleRestrictSpecialChars(content: string): boolean {
    const forbiddenChars = /[`~!@#$%^&*()\_=+\[\]{}\\|;:'",<>\/?]/;
    const char10orChar13 = /[\x0A\x0D]/;
    const vietnameseChar = /[àáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữự]/
    return (forbiddenChars.test(content) || char10orChar13.test(content) || vietnameseChar.test(content)) && content.length !== 0;
  }

  handleReverseTransformData(newData: IElement[], reason: string) {
    const originalData: { [key: string]: string[] } = {};

    newData.forEach((item) => {
      originalData[item.abbreviation.toString().trim()] = item.content.map((c) => c.nContent.trim());
    });
    return {
      key: "transaction.abbreviation",
      value: {
        $type: "abbreviation",
        abbreviations: originalData
      },
      reason: reason
    };
  }

  handleValidateRequireFirstRow() {
    this.newData[0].required = this.newData[0].abbreviation == ''

    this.newData[0].content.map((e) => {
      e.nRequired = e.nContent.length === 0
    })
  }

  onClickAddFields() {
    if(!this.newData[0].abbreviation) {
      this.newData[0].required = true
    } else {
      this.newData.unshift({
        abbreviation: "",
        required: false,
        valid: false,
        duplicated: false,
        content: [{
          nContent: "",
          nKey: uuid(),
          nRequired: false,
          nValid: false
        }]
      })
      this.dataSource = new MatTableDataSource(this.newData)
    }
  }

  onClickDeleteRow(element: IElement) {
    this.dialogService.confirm({
      label:"Xác nhận",
      acceptBtn: "Xóa",
      closeBtn:"Hủy",
      message: 'Bạn có chắc chắn muốn xóa?',
    }, (result: any) => {
      if (result.status == DFORM_CONFIRM_STATUS.CONFIRMED) {
        this.newData.splice(this.newData.findIndex((e) => element.abbreviation === e.abbreviation), 1)
        this.dataSource = new MatTableDataSource(this.newData)
        this.compareData()
      }
    });
  }

  onClickDeleteContent(content: IElementContent, element: IElement) {
    const elementInData = this.newData.find((e) => element.abbreviation === e.abbreviation)
    elementInData.content.splice(elementInData.content.indexOf(elementInData.content.find(e => e.nKey === content.nKey)), 1)
    this.dataSource = new MatTableDataSource(this.newData)
    this.compareData()
  }

  onClickAddContent(element) {
    if(element.content[0].nContent === '') {
      element.content[0].nRequired = true
    } else {
      this.newData = this.newData.map((e) => {
        if (element.abbreviation === e.abbreviation) {
          return {
            ...e,
            content: [
              { nContent: "", nKey: uuid(), nRequired: false, nValid: false },
              ...e.content,
            ],
          };
        }
        return e;
      });
      this.dataSource = new MatTableDataSource(this.newData)
    }
  }

  onClickUpdate() {
    this.handleValidateRequireFirstRow()

    this.onChangeAbbreviation()
    this.newData.forEach((v) =>{
      v.content.map((e) => {
        e.nRequired = e.nContent === "";
        e.nValid = this.handleRestrictSpecialChars(e.nContent);
      })
    })

    const hasInvalidItem = this.newData.some(
      (item) =>
        item.required ||
        item.duplicated ||
        item.valid ||
        item.content.some((contentItem) => contentItem.nRequired || contentItem.nValid)
    );

    if(hasInvalidItem) {
      return
    } else {
      this.dialogService.dformconfirm({
        title: 'Xác nhận cập nhật',
        description: 'Nhập lý do sửa',
        acceptBtn: 'Xác nhận',
        closeBtn: 'Đóng',
        maxLength: 1024
      },
      (result: {status: number, data: string}) => {
        console.log(result, 'result');
        
        if (result && result.data && result.data.length > 1024) {
          this.toastService.showToastr('Lý do đã vượt quá 1024 kí tự!', 'Thông báo!', MessageSeverity.error, '');
        }
        else if (result && result.status === DFORM_CONFIRM_STATUS.CONFIRMED) {
          this.indicator.showActivityIndicator()
          this.abbreviationConfigService.updateAbbreviationHConfigList(this.handleReverseTransformData(this.newData, result.data)).pipe(
            finalize(() => {
              this.indicator.hideActivityIndicator()
            }),
            takeUntil(this.ngUnsubscribe)
          ).subscribe({
            next: (res) => {
              this.toastService.showToastr("Lưu thành công", "Thông báo", MessageSeverity.success)
              this.goTo("pmp_admin/transfer-channel/citad/abbreviation-config")
            },
            error: (err) => {
              const errMessage = ErrorUtils.getErrorMessage(err)
              this.toastService.showToastr(errMessage.join('\n'), "Thông báo", MessageSeverity.error)}
          })
        }
      })
    }
  }

  onClickActionBtn($event?: any): void {
    switch ($event) {
      case TYPE_BTN_FOOTER.TYPE_CANCEL:
        this.goTo('pmp_admin/transfer-channel/citad/abbreviation-config')
        break;
      case TYPE_BTN_FOOTER.TYPE_SAVE:
        this.onClickUpdate()
        break;
    }
  }

  onChangeAbbreviation() {
    this.cdr.detectChanges();
    setTimeout(() => {
      const abbreviationMap = this.newData.reduce((acc, item) => {
        acc[item.abbreviation.toLowerCase()] = (acc[item.abbreviation.toLowerCase()] || 0) + 1;
        return acc;
      }, {});
      const duplicates = Object.keys(abbreviationMap).filter(key => abbreviationMap[key] > 1);
      this.newData.forEach((e) => {
        e.required = e.abbreviation === ''
        e.duplicated = duplicates.includes(e.abbreviation.toLowerCase());
        e.valid = this.handleRestrictSpecialChars(e.abbreviation);
      })
      this.compareData()
    });
  }

  onChangeContent(content, element) {
    element.content.forEach(e => {
      e.nRequired = e.nContent === "";
      e.nValid = this.handleRestrictSpecialChars(e.nContent);
    })
    this.compareData()
  }
}
