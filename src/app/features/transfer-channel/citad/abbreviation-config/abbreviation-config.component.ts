import { Component, Injector } from '@angular/core';
import { MatTableDataSource } from "@angular/material/table";
import { ComponentAbstract, MessageSeverity, ToastService } from "@shared-sm";

import { finalize, takeUntil } from "rxjs/operators";
import { ModuleKeys } from "../../../../public/module-permission.utils";
import ErrorUtils from "../../../../shared/utils/ErrorUtils";
import { displayedColumns } from "./constant";
import { AbbreviationConfigService } from "./services/abbreviation-config.service";

@Component({
  selector: 'app-abbreviation-config',
  templateUrl: './abbreviation-config.component.html',
  styleUrls: ['./abbreviation-config.component.scss']
})
export class AbbreviationConfigComponent extends ComponentAbstract {
  readonly displayedColumns = displayedColumns

  constructor(
    protected injector: Injector,

    private abbreviationConfigService: AbbreviationConfigService,
    private toastService: ToastService
  ) {
    super(injector);
  }

  protected componentInit(): void {
    this.enableActions(ModuleKeys.citad_transaction_abbreviation)
    if(this.enableView){
      this.search({page: this.pageIndex, size: this.pageSize})
    } else {
      this.toastService.showToastr('Bạn không có quyền truy cập hợp lệ', "Thông báo", MessageSeverity.error)
    }
  }

  search(options: {page: number, size: number}){
    this.indicator.showActivityIndicator()
    this.abbreviationConfigService.getAbbreviationHConfigList(options).pipe(
      finalize(() =>
        this.indicator.hideActivityIndicator())
      ,
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
    const newData = Object.keys(data).map((e) => ({
      abbreviation: e,
      content: data[e].map((item) => ({ nContent: item }))
    }))
    this.dataSource = new MatTableDataSource(newData)
  }

  changePageIndex($event){
    this.pageSize = $event.pageSize;
    this.pageIndex = $event.pageIndex;
    this.search({
      size: this.pageSize,
      page: this.pageIndex
    })
  }

  onClickHistory() {
    this.goTo('pmp_admin/transfer-channel/citad/abbreviation-config/history-config', {keyConfig: "transaction.abbreviation"})
  }

  onClickEdit() {
    this.goTo('pmp_admin/transfer-channel/citad/abbreviation-config/edit')
  }

  // handleExportFile(res: HttpResponse<IAbbreviationConfig>) {
  handleExportFile(res: any) {
    const blob = new Blob([res.body], { type: res.headers.get('Content-Type') });
    const blobURL = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = blobURL;
    anchor.download = 'cau_hinh_he_thong_transaction_abbreviation.xlsx';
    anchor.click();
    window.URL.revokeObjectURL(blobURL);
  }

  onClickExportFile() {
    this.indicator.showActivityIndicator()
    this.abbreviationConfigService.exportFile().pipe(
      finalize(() => {
        this.indicator.hideActivityIndicator()
      }),
      takeUntil(this.ngUnsubscribe)
    )
      .subscribe({
      next: (res) => {
        this.handleExportFile(res)
      },
      error: (err) => {
        const errMessage = ErrorUtils.getErrorMessage(err)
        this.toastService.showToastr(errMessage.join('\n'), "Thông báo", MessageSeverity.error)
      }
    })
  }
}
