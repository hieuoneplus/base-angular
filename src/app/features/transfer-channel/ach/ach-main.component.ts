import { Component, Injector } from '@angular/core';
import {ComponentAbstract, getDataLocalStorageByKey, MessageSeverity, ToastService} from '@shared-sm';
import { availableConfigs } from "./constant";
import {TRANSFER_CHANNEL_ACH_KEYS} from "../../../public/module-permission.utils";
import {environment} from "@env/environment";

@Component({
  selector: 'ach-main-page',
  templateUrl: './ach-main.component.html',
  styleUrls: ['./ach-main.component.scss']
})
export class AchMainComponent extends ComponentAbstract {

  readonly availableConfigs = availableConfigs

  permittedConfig = []

  constructor(
    protected injector: Injector,

    private toastService: ToastService
  ) {
    super(injector);
  }

  protected componentInit(): void {
    if(!getDataLocalStorageByKey('pmp_permissions')){
      this.goTo(environment.base_url)
      this.toastService.showToastr('Bạn không có quyền truy cập hợp lệ', "Thông báo", MessageSeverity.error)
    } else {
      const permission: { module: string; actions: string[] }[] = getDataLocalStorageByKey('pmp_permissions').filter(
        (module: { module: string; actions: string[] }) =>
          TRANSFER_CHANNEL_ACH_KEYS.includes(module.module)
      );
      this.permittedConfig = availableConfigs.filter((config) => permission.some(permission => permission.module === config.moduleName && permission.actions.includes("view")))
    }
  }


  handleNavigate(path: string) {
    this.goTo(path)
  }
}
