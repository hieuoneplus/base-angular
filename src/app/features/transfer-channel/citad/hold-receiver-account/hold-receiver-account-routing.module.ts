import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModuleKeys, PermissionsActions } from 'src/app/public/module-permission.utils';
import { AuthGuard } from 'src/app/shared/permission/auth.guard';
import { HistoryComponent } from '../history/history.component';
import { EditHoldReceiverAccountComponent } from './edit-hold-receiver-account/edit-hold-receiver-account.component';
import { HoldReceiverAccountComponent } from './hold-receiver-account.component';


const routes: Routes = [
  { path: '', component: HoldReceiverAccountComponent, data: { role: ModuleKeys.citad_hold_receiver_account, action: PermissionsActions.view }, canActivate: [AuthGuard] },
  { path: 'edit', component: EditHoldReceiverAccountComponent, data: { role: ModuleKeys.citad_hold_receiver_account, action: PermissionsActions.update }, canActivate: [AuthGuard] },
  { path: 'history-config', component: HistoryComponent, data: { role: ModuleKeys.citad_hold_receiver_account, action: PermissionsActions.view }, canActivate: [AuthGuard] },
]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HoldReceiverAccountRoutingModule {
}
