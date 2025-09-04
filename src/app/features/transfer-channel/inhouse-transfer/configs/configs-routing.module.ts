import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchConfigsComponent } from './search-configs.component';
import {ModuleKeys, PermissionsActions} from "../../../../public/module-permission.utils";
import {AuthGuard} from "../../../../shared/permission/auth.guard";


const routes: Routes = [
  { path: '', component: SearchConfigsComponent, data: { title: 'Cấu hình bật/tắt luồng hạch toán GD BĐB vào T24', role: ModuleKeys.inhouse_transfer_channel_state, action: PermissionsActions.view }, canActivate: [AuthGuard] },

]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigsRoutingModule {
}
