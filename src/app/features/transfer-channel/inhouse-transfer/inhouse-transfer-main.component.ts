import { Component, Injector } from '@angular/core';
import { environment } from '@env/environment';
import { ComponentAbstract, getDataLocalStorageByKey, LocalStoreEnum, MessageSeverity, ToastService } from '@shared-sm';
import {
  PermissionsActions,
  ROUTING_CONFIG_REGULAR_MODULE_KEYS,
  TRANSFER_CHANNEL_INHOUSE
} from 'src/app/public/module-permission.utils';
import { availableConfigs } from "./constant";
import {IUserPermissions} from "../../model/auth";
@Component({
  selector: 'inhouse-transfer-main-page',
  templateUrl: './inhouse-transfer-main.component.html',
  styleUrls: ['./inhouse-transfer-main.component.scss']
})
export class InhouseTransferMainComponent extends ComponentAbstract {

  readonly availableConfigs = availableConfigs.filter(c =>
    this.hasPermission(c.permission_module, PermissionsActions.view)
  );

  constructor(
    protected injector: Injector,
  ) {
    super(injector);
  }

  protected componentInit(): void {
  }

  handleNavigate(path: string) {
    this.goTo(path)
  }

  hasPermission(module: string, action: string): boolean {
    const permissions: IUserPermissions[] = this.localStore.getData(LocalStoreEnum.pmp_permissions);
    return permissions.findIndex(p => p.module === module && p.actions.includes(action)) !== -1;
  }
}
