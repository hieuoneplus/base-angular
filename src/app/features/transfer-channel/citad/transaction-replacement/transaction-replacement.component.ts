import {Component, Injector} from '@angular/core';
import {ComponentAbstract, HttpResponse, MessageSeverity, TextboxItem, ToastService} from "@shared-sm";
import {displayedColumns} from "./model/constant";
import {finalize, takeUntil} from "rxjs/operators";
import {MatTableDataSource} from "@angular/material/table";
import {ModuleKeys} from "../../../../public/module-permission.utils";
import {Observable} from "rxjs";
import ErrorUtils from "../../../../shared/utils/ErrorUtils";
import {TransactionReplacementService} from "../services/transaction-replacement.service";
import {ITransactionReplacement,} from "./model/interface";
import {PageEvent} from "@angular/material/paginator";
import {TOAST_DEFAULT_CONFIG} from "../../../../public/constants";
import {HttpResponse as HttpResponse2} from '@angular/common/http';
import * as moment from "moment";

@Component({
  selector: 'app-transaction-replacement',
  templateUrl: './transaction-replacement.component.html',
  styleUrls: ['./transaction-replacement.component.scss']
})
export class TransactionReplacementComponent extends ComponentAbstract {
  readonly displayedColumns = displayedColumns

  listTransactionReplacement: TextboxItem[] = []

  pageSize = 10;
  fullData = [];
  pageSizeList = [10, 20, 50, 100];

  constructor(
    protected injector: Injector,

    private transactionReplacementService: TransactionReplacementService,
    private toastService: ToastService
  ) {
    super(injector);
    this.form = this.itemControl.toFormGroup([
    ]);
  }

  protected componentInit(): void {
    this.enableActions(ModuleKeys.citad_transaction_replacement)
    if(this.enableView){
      this.search()
    } else {
      this.toastService.showToastr('Bạn không có quyền truy cập hợp lệ', "Thông báo", MessageSeverity.error)
    }
  }

  search() {
    this.handleGetReplaceSpecialChar().subscribe({
      next: (res) => {
        const result = [];
        Object.entries(res.data.value.replacements).forEach(([key, value]) => {
          Object.entries(value).forEach(([k, v]) => {
            const fieldControl = new TextboxItem({key: key, value: key, readOnly: true,});
            const targetControl = new TextboxItem({key: k, value: k, readOnly: true,})
            const replacementControl = new TextboxItem({key: v.toString(), value: v.toString(), readOnly: true,})
            const entry = {
              field: fieldControl,
              target: targetControl,
              replacement: replacementControl,
            }
            result.push(entry)
            this.listTransactionReplacement.push(fieldControl, targetControl, replacementControl)
          });
        });

        this.fullData = result;
        this.totalItem = result.length;
        this.pageIndex = 0;
        this.pageSize = this.pageSizeList[0];
        this.paginateData();

        this.itemControl.toAddFormGroup(this.listTransactionReplacement, this.form);
      },
      error: (err) => {
        const errMessage = ErrorUtils.getErrorMessage(err)
        this.toastService.showToastr(errMessage.join('\n'), "Thông báo", MessageSeverity.error)
      }
    })
  }

  handleGetReplaceSpecialChar(): Observable<HttpResponse<ITransactionReplacement>> {
    this.indicator.showActivityIndicator()
    return this.transactionReplacementService.getTransactionReplacement().pipe(
      finalize(() => {
        this.indicator.hideActivityIndicator()
      }),
      takeUntil(this.ngUnsubscribe)
    )
  }

  onClickHistory() {
    this.goTo('pmp_admin/transfer-channel/citad/transaction-replacement/history-config', {keyConfig: "transaction.replacement"})
  }

  onClickEdit() {
    this.goTo(`pmp_admin/transfer-channel/citad/transaction-replacement/edit`)
  }

  paginateData() {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    const paginatedData = this.fullData.slice(startIndex, endIndex);

    this.dataSource = new MatTableDataSource(paginatedData);
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.paginateData();
  }

  exportExcel() {
    this.indicator.showActivityIndicator()
    this.transactionReplacementService.export().pipe(
      finalize(() => {
        this.indicator.hideActivityIndicator()
      }),
      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      next: (res) => {
        if (res instanceof HttpResponse2) {
          const blob = new Blob([res.body], { type: res.headers.get('Content-Type') });
          let url = window.URL.createObjectURL(blob);
          var a = document.createElement("a");
          a.href = url;
          a.download = 'Transaction_Replacement_' + moment().format('YYYYMMDDHHmmss') + '.xlsx'
          a.click();
          window.URL.revokeObjectURL(url);
        }
      },
      error: (err) => {
        const messsageError = ErrorUtils.getErrorMessage(err);
        this.toastr.showToastr(
          messsageError.join('\n'),
          'Thông báo!',
          MessageSeverity.error,
          TOAST_DEFAULT_CONFIG
        );
      }
    })
  }
}
