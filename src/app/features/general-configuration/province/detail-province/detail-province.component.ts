import {Component, Injector} from '@angular/core';
import {ComponentAbstract, MessageSeverity, ToastService} from '@shared-sm';

import {finalize, takeUntil} from 'rxjs/operators';
import {BUTTON_EDIT, BUTTON_UNDO, TOAST_DEFAULT_CONFIG, TYPE_BTN_FOOTER,} from 'src/app/public/constants';
import {ModuleKeys} from 'src/app/public/module-permission.utils';
import ErrorUtils from '../../../../shared/utils/ErrorUtils';
import {IProvinceContent} from '../modal/interface';
import {ProvinceService} from "../../service/ProvinceService";

@Component({
  selector: 'detail-async-page',
  templateUrl: './detail-province.component.html',
  styleUrls: ['./detail-province.component.scss'],
})
export class DetailProvinceComponent extends ComponentAbstract {
  provinceContent: IProvinceContent;

  constructor(
    protected injector: Injector,
    private provinceService: ProvinceService,
    private toastService: ToastService
  ) {
    super(injector);
  }

  protected componentInit(): void {
    this.enableActions(ModuleKeys.city);
    this.listButton = this.listButtonDynamic('', BUTTON_UNDO);
    if (this.enableUpdate) {
      this.listButton = this.listButtonDynamic('', BUTTON_UNDO, BUTTON_EDIT);
    }
    this.getDetailProvince();
  }

  getDetailProvince() {
    this.indicator.showActivityIndicator();

    this.provinceService
      .getDetail(this.queryParams.id)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        finalize(() => this.indicator.hideActivityIndicator())
      )
      .subscribe(
        (res) => {
          console.log('RESPONSE', res);
          // Gọi API thành công và có data trả về
          if (res && res.status === 200) {
            this.provinceContent = res.data;
            this.hasDataSource = true;
          }
        },
        (error) => {
          console.log('ERROR', error);
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
  onClickActionBtn(event: any) {
    switch (event) {
      case TYPE_BTN_FOOTER.TYPE_UNDO:
        this.goTo('/pmp_admin/general-config/province');
        break;
      case TYPE_BTN_FOOTER.TYPE_EDIT:
        this.goTo('/pmp_admin/general-config/province/edit', {
          id: this.provinceContent.id,
        });
        break;
    }
  }

  onClickHistory() {
    this.goTo('/pmp_admin/general-config/province/history', {
      provinceId: this.queryParams.id,
    });
  }
}
