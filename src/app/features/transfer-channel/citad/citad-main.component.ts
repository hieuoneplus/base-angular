import { Component, Injector } from '@angular/core';
import { ComponentAbstract, getDataLocalStorageByKey } from '@shared-sm';
import { Subscription } from 'rxjs';
import { TRANSFER_CHANNEL_CITAD_KEYS } from 'src/app/public/module-permission.utils';

import { SettingsService } from 'src/app/shared/services/settings.service';
import { CITAD_MENUS } from './constant';

@Component({
  selector: 'citad-main-page',
  templateUrl: './citad-main.component.html',
  styleUrls: ['./citad-main.component.scss']
})
export class CitadMainComponent extends ComponentAbstract {

  menuBatch: any[];
  private layoutChangesSubscription: Subscription;

  constructor(
    protected injector: Injector,
    private settings: SettingsService,
  ) {
    super(injector);
  }

  protected componentInit(): void {
    this.initCitadMenu()
  }

  initCitadMenu() {
    const permission: { module: string; actions: string[] }[] = getDataLocalStorageByKey('pmp_permissions').filter(
      (module: { module: string; actions: string[] }) =>
        TRANSFER_CHANNEL_CITAD_KEYS.includes(module.module)
    );
    this.menuBatch = CITAD_MENUS.filter((config) => permission.some(permission => permission.module === config.module && permission.actions.includes("view")))
  }

  destroyData() {
    this.settings.setNavState('collapsed', true);
    if (this.layoutChangesSubscription) {
      this.layoutChangesSubscription.unsubscribe();
    }
  }

  goToPageParcel(route) {
    // this.ultil.setSearchDataHistory(null);

    this.goTo(route);
  }

}
