
import { Component, Injector } from '@angular/core';
import { finalize, takeUntil } from 'rxjs/operators';
import {ComponentAbstract, MessageSeverity, ToastService} from '@shared-sm';
import {BUTTON_EDIT, BUTTON_UNDO, TYPE_BTN_FOOTER} from 'src/app/public/constants';
import { IWhitelistCategoryContent } from 'src/app/features/model/citad';
import { WhitelistCategoriesService } from '../../services/whitelist-categories';
import ErrorUtils from 'src/app/shared/utils/ErrorUtils';
import { ModuleKeys } from 'src/app/public/module-permission.utils';

@Component({
  selector: 'detail-whitelist-categories-page',
  templateUrl: './detail-whitelist-categories.component.html',
  styleUrls: ['./detail-whitelist-categories.component.scss']
})

export class DetailWhitelistCategoriesComponent extends ComponentAbstract {

  whitelistDetail: IWhitelistCategoryContent;

  constructor(
    protected injector: Injector,
    private toastService: ToastService,
    private whitelistCategoriesService : WhitelistCategoriesService
    ) {
    super(injector);
  }

  protected componentInit(): void {
    this.enableActions(ModuleKeys.citad_whitelist_categories);
    this.listButton = this.listButtonDynamic('', BUTTON_UNDO);
    if (this.enableUpdate){
      this.listButton = this.listButtonDynamic('', BUTTON_UNDO,BUTTON_EDIT);
    }
     
    this.getWhitelistCategoryDetail();
  }

  getWhitelistCategoryDetail() {

    this.indicator.showActivityIndicator();

    this.whitelistCategoriesService.getWhitelistCategoryDetail(this.queryParams.id).pipe(
      takeUntil(this.ngUnsubscribe),
      finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe((res) => {
      console.log("RESPONSE", res)
      // Gọi API thành công và có data trả về
      if (res && res.status === 200) {
        this.whitelistDetail = res.data;

        this.hasDataSource = true;

      }
    }, error => {
      const errMessage = ErrorUtils.getErrorMessage(error)
      this.toastService.showToastr(errMessage.join('\n'), "Thông báo", MessageSeverity.error)
    });
  }


  onClickActionBtn(event: any) {
    switch (event) {
      case TYPE_BTN_FOOTER.TYPE_UNDO:
        this.goTo('/pmp_admin/transfer-channel/citad/whitelist-categories');
        break;
      case TYPE_BTN_FOOTER.TYPE_DELETE:
        
        break;
      case TYPE_BTN_FOOTER.TYPE_EDIT :
        this.goTo('/pmp_admin/transfer-channel/citad/whitelist-categories/edit', { id: this.whitelistDetail.id });
        break;
    }
  }
  onClickGetWhitelistCategoriesHistories() {
    this.goTo('/pmp_admin/transfer-channel/citad/whitelist-categories/history')
  }
}
