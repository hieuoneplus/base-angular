import { Component, Injector } from '@angular/core';
import { ComponentAbstract, LocalStoreEnum } from '@shared-sm';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';

import { SettingsService } from 'src/app/shared/services/settings.service';

@Component({
  selector: 'bilateral-main-page',
  templateUrl: './bilateral-main.component.html',
  styleUrls: ['./bilateral-main.component.scss']
})
export class BilateralMainComponent extends ComponentAbstract {

  menuBatch: any[];
  private layoutChangesSubscription: Subscription;

  constructor(
    protected injector: Injector,
    private settings: SettingsService,
  ) {
    super(injector);
  }

  protected componentInit(): void {

    this.settings.setNavState('collapsed', true);
    this.menuBatch = [
      { id: 3, route: 'pmp_admin/transfer-channel/bilateral/partner-config', parentId: 1, activeService: true, position: 1, name: 'Cấu hình đối tác', icon: 'ic-settings' },
    ];

  }

  destroyData() {
    this.settings.setNavState('collapsed', true);
    if (this.layoutChangesSubscription) {
      this.layoutChangesSubscription.unsubscribe();
    }
  }

  goToPageParcel(route) {
    // this.ultil.setSearchDataHistory(null);
    console.log(route, 'route');

    this.goTo(route);
  }

}
