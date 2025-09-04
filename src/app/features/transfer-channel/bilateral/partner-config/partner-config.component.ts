import { SelectionModel } from '@angular/cdk/collections';
import { Component, Injector } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from '@env/environment';
import { BehaviorSubject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { ComponentAbstract, MessageSeverity } from '@shared-sm';
import { PATH_BILATERAL, TOAST_DEFAULT_CONFIG } from 'src/app/public/constants';
import { ROLE, CONFIG_KEYS } from '../constants';
import { SWIFTCODE_LIST_SEARCH, KEY_ID, VALUE_ID } from '../data-form';


@Component({
  selector: 'app-partner-config',
  templateUrl: './partner-config.component.html',
  styleUrls: ['./partner-config.component.scss']
})

export class PartnerConfigComponent extends ComponentAbstract {
  // Table view
  displayedColumns: string[] = [
    'stt', 'swiftCode', 'key', 'value',
    'actions'
  ];

  // For search

  $swiftCode = SWIFTCODE_LIST_SEARCH();
  $key = KEY_ID();
  // $value = VALUE_ID();

  hasDataSource = false;
  selection = new SelectionModel<any>(true, []);
  selectionObs = new BehaviorSubject<any>('');
  pageEvent: PageEvent = new PageEvent();

  constructor(protected injector: Injector) {
    super(injector);
    this.initRole(ROLE.BILATERAL_MAKER, ROLE.BILATERAL_APPROVER);
  }

  protected componentInit(): void {
    this.form = this.itemControl.toFormGroup([
      this.$swiftCode, this.$key
    ]);
    this.search();
  }

  search() {
    this.pageIndex = 0;
    this.pageSize = 1000;
    this.options = {
      url: environment.urlBilateralBE,
      path: PATH_BILATERAL.PARTNER_CONFIG.SEARCH,
      body: Object.assign({ ...this.form.value }, {
        pageSize: 1000,
        pageNumber: 0,
      })
    };
    this.dformPagination.goto(this.pageSize, this.pageIndex);
  }

  QueryData() {
    this.indicator.showActivityIndicator();
    console.log("QUERY", this.options)
    this.httpClient.post(this.options).pipe(
      takeUntil(this.ngUnsubscribe),
      finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe((res: any) => {
      console.log("RESPONSE", res)
      // Gọi API thành công và có data trả về
      if (res && res.status === 0) {
        this.hasDataSource = true;
        const page = this.pageIndex * this.pageSize;
        const data = res.data.data[0].listConfigOutput.map((obj, index) => {
          obj.stt = page + index + 1;
          obj.canEdit = this.canEdit(obj.key);
          return obj;
        });
        this.dataSource = new MatTableDataSource(data);
        this.totalItem = res.data.total;
      } else {
        console.log("ERROR", res)
        this.hasDataSource = false;
        this.totalItem = 0;
        this.toastr.showToastr(
          res.soaErrorDesc ? res.soaErrorDesc : 'Lỗi hệ thống.',
          'Thông báo!',
          MessageSeverity.error,
          TOAST_DEFAULT_CONFIG
        );
      }
      this.dataSource.sort = this.sort;
    }, error => {
      console.log("ERROR", error)
      this.toastr.showToastr(
        error.error?.soaErrorDesc ? error.error.soaErrorDesc : 'Lỗi hệ thống.',
        'Thông báo!',
        MessageSeverity.error,
        TOAST_DEFAULT_CONFIG
      );
    });
  }

  changePageIndex($event) {
    this.pageSize = $event.pageSize;
    this.pageIndex = $event.pageIndex;
    this.options = {
      url: environment.urlBilateralBE,
      path: PATH_BILATERAL.PARTNER_CONFIG.SEARCH,
      body: {
        ...this.options.body,
        pageSize: 1000,
        pageNumber: 0
      }
    };
    this.QueryData();
  }

  viewDetail(element) {
    this.goTo(environment.key + '/transfer-channel/bilateral/detail-partner-config', {
      id: element.id,
      swiftCode: element.swiftCode,
      key: element.key,
      value: element.value
    });
  }

  canEdit(keyConfig: String): boolean {
    console.log(keyConfig)
    if (CONFIG_KEYS.filter(item => item === keyConfig).length > 0)
      return true;
    return false;
  }

}
