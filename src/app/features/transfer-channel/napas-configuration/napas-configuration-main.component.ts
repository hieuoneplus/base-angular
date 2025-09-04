import { Component, Injector } from '@angular/core';
import {ComponentAbstract, getDataLocalStorageByKey, LocalStoreEnum} from '@shared-sm';
import { Subscription } from 'rxjs';
import {
  NAPAS_MODULE_KEYS, PermissionsActions,
} from 'src/app/public/module-permission.utils';
import { SettingsService } from 'src/app/shared/services/settings.service';
import { menuNapas } from './constant';
@Component({
  selector: 'napas-configuration-main-page',
  templateUrl: './napas-configuration-main.component.html',
  styleUrls: ['./napas-configuration-main.component.scss']
})
export class NapasConfigurationMainComponent extends ComponentAbstract {

  menuBatch: any[];

  private layoutChangesSubscription: Subscription;

  constructor(
    protected injector: Injector,
    private settings: SettingsService,
  ) {
    super(injector);
  }

  protected componentInit(): void {
    this.initNapasMenu()

  }

  private initNapasMenu(): void {
    this.menuBatch = menuNapas.filter(config =>
      this.hasPermission(config.permission_module, PermissionsActions.view) && NAPAS_MODULE_KEYS.includes(config.permission_module)
    );
  }

  destroyData() {
    this.settings.setNavState('collapsed', true);
    if (this.layoutChangesSubscription) {
      this.layoutChangesSubscription.unsubscribe();
    }
  }

  goToPageParcel(route) {
    this.goTo(route);
  }
}
