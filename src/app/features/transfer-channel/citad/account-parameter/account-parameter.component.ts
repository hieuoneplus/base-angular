import {Component, Injector} from '@angular/core';
import {ComponentAbstract, MessageSeverity, ToastService} from "@shared-sm";
import {displayedColumns, mockAccPara} from "./model/constant";
import {AccountParameterService} from "../services/account-parameter.service";
import {finalize, takeUntil} from "rxjs/operators";
import {MatTableDataSource} from "@angular/material/table";
import {ModuleKeys} from "../../../../public/module-permission.utils";
import {Observable} from "rxjs";
import {IAccountParameter} from "./model/interface";
import ErrorUtils from "../../../../shared/utils/ErrorUtils";
import { KeyConfigCitad } from '../constant';
import { HttpResponse } from '@angular/common/http';
import { TOAST_DEFAULT_CONFIG } from 'src/app/public/constants';


@Component({
  selector: 'app-account-parameter',
  templateUrl: './account-parameter.component.html',
  styleUrls: ['./account-parameter.component.scss']
})
export class AccountParameterComponent  extends ComponentAbstract {
  readonly displayedColumns = displayedColumns

  constructor(
    protected injector: Injector,

    private accountParameterService: AccountParameterService,
    private toastService: ToastService
  ) {
    super(injector);
  }

  protected componentInit(): void {
    this.enableActions(ModuleKeys.citad_account_parameter)
    if(this.enableView){
      this.search()
    } else {
      this.toastService.showToastr('Bạn không có quyền truy cập hợp lệ', "Thông báo", MessageSeverity.error)
    }
  }

  search() {
    // this.dataSource = new MatTableDataSource(this.mockData.accountParameters)
    this.handleGetAccountParameter().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.data.value.accountParameters)
      },
      error: (err) => {
        const errMessage = ErrorUtils.getErrorMessage(err)
        this.toastService.showToastr(errMessage.join('\n'), "Thông báo", MessageSeverity.error)
      }
    })
  }

  handleGetAccountParameter() {
    this.indicator.showActivityIndicator()
    return this.accountParameterService.getAccountParameter().pipe(
      finalize(() => {
        this.indicator.hideActivityIndicator()
      }),
      takeUntil(this.ngUnsubscribe)
    )
  }

  exportExcel() {
    const key = KeyConfigCitad.account_parameter
    this.indicator.showActivityIndicator()
    this.accountParameterService.exportConfigCitad(key).pipe(
      finalize(() => {
        this.indicator.hideActivityIndicator()
      }),
      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      next: (res) => {
        if (res instanceof HttpResponse) {
          const blob = new Blob([res.body], { type: res.headers.get('Content-Type') });
          let url = window.URL.createObjectURL(blob);
          var a = document.createElement("a");
          a.href = url;
          a.download = 'Cau_hinh_tai_khoan_tham_so_dien_hoan_tra.xlsx'
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

  onClickHistory() {
    this.goTo('pmp_admin/transfer-channel/citad/account.parameter/history-config', {keyConfig: "account.parameter"})
  }

  onClickEdit() {
    this.goTo(`pmp_admin/transfer-channel/citad/account.parameter/edit`)
  }
}
