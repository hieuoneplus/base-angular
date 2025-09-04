import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModuleKeys, PermissionsActions } from 'src/app/public/module-permission.utils';
import { AuthGuard } from 'src/app/shared/permission/auth.guard';
import { HistoryComponent } from '../history/history.component';
import { EditHoldReceiverNameComponent } from './edit-hold-receiver-name/edit-hold-receiver-name.component';
import { HoldReceiverNameComponent } from './hold-receiver-name.component';


const routes: Routes = [
  { path: '', component: HoldReceiverNameComponent, data: { role: ModuleKeys.citad_hold_receiver_name_pattern, action: PermissionsActions.view }, canActivate: [AuthGuard] },
  { path: 'edit', component: EditHoldReceiverNameComponent, data: { role: ModuleKeys.citad_hold_receiver_name_pattern, action: PermissionsActions.update }, canActivate: [AuthGuard] },
  { path: 'history-config', component: HistoryComponent, data: { role: ModuleKeys.citad_hold_receiver_name_pattern, action: PermissionsActions.view }, canActivate: [AuthGuard] },
]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HoldReceiverNameRoutingModule {
}
