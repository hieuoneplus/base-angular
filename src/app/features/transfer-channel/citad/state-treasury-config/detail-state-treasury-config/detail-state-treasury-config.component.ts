import {Component, Injector} from '@angular/core';
import {ComponentAbstract, ToastService,MessageSeverity} from "@shared-sm";
import {StateTreasuryConfigService} from "../../services/state-treasury-config-service.service";
import { BUTTON_EDIT, BUTTON_UNDO, TYPE_BTN_FOOTER } from 'src/app/public/constants';
import ErrorUtils from 'src/app/shared/utils/ErrorUtils';
import { finalize, takeUntil } from 'rxjs/operators';
import { IStateTreasuryContent } from 'src/app/features/model/citad';
import { ModuleKeys } from 'src/app/public/module-permission.utils';
import { JSON_EX } from '../constants';

@Component({
  selector: 'detail-state-treasury-config-page',
  templateUrl: './detail-state-treasury-config.component.html',
  styleUrls: ['./detail-state-treasury-config.component.scss']
})
export class DetailStateTreasuryComponent extends ComponentAbstract {

  stateTreasuryDetail: IStateTreasuryContent;

  constructor(
    protected injector: Injector,
    private toastService: ToastService,
    private stateTreasuryConfigService : StateTreasuryConfigService
    ) {
    super(injector);
  }

  protected componentInit(): void {
    this.enableActions(ModuleKeys.citad_state_treasuries);
    this.listButton = this.listButtonDynamic('', BUTTON_UNDO);
    if (this.enableUpdate){
      this.listButton = this.listButtonDynamic('', BUTTON_UNDO,BUTTON_EDIT);
    }
     
    this.getStateTreasuryDetail();
  }

  getStateTreasuryDetail() {

    this.indicator.showActivityIndicator();
  
    this.stateTreasuryConfigService.getStateTreasuryDetail(this.queryParams.code).pipe(
      takeUntil(this.ngUnsubscribe),
      finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe((res) => {
      console.log("RESPONSE", res)
      // Gọi API thành công và có data trả về
      if (res && res.status === 200) {
        this.stateTreasuryDetail = res.data;

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
        this.goTo('/pmp_admin/transfer-channel/citad/state-treasuries');
        break;
      case TYPE_BTN_FOOTER.TYPE_DELETE:
        
        break;
      case TYPE_BTN_FOOTER.TYPE_EDIT :
        this.goTo('/pmp_admin/transfer-channel/citad/state-treasuries/edit', { code: this.stateTreasuryDetail.code });
        break;
    }
  }
 onClickGetStateTreasuriesHistories() {
    this.goTo('/pmp_admin/transfer-channel/citad/state-treasuries/history')
  }
}