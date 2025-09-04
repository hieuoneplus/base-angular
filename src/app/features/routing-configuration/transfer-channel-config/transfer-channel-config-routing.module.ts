import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TransferChannelConfigComponent} from "./transfer-channel-config.component";
import {EditTransferChannelConfigComponent} from "./edit-transfer-channel-config/edit-transfer-channel-config.component";

import {AuthGuard} from "../../../shared/permission/auth.guard";
import {ModuleKeys, PermissionsActions} from "../../../public/module-permission.utils";



const routes: Routes = [
  { path: '', component: TransferChannelConfigComponent, data: { title: 'Cấu hình các điều kiện định tuyến', role: ModuleKeys.routing_channel_config, action: PermissionsActions.view }, canActivate: [AuthGuard] },
  { path: 'edit', component: EditTransferChannelConfigComponent, data: { title: 'Chỉnh sửa cấu hình định tuyến kênh', role: ModuleKeys.routing_channel_config, action: PermissionsActions.update }, canActivate: [AuthGuard] },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransferChannelConfigRoutingModule {
}
