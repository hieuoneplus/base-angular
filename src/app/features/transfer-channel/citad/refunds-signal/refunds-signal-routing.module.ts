import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModuleKeys, PermissionsActions } from 'src/app/public/module-permission.utils';
import { AuthGuard } from 'src/app/shared/permission/auth.guard';
import { HistoryComponent } from '../history/history.component';
import { EditRefundsSignalComponent } from './edit-refunds-signal/edit-refunds-signal.component';
import { RefundsSignalComponent } from './refunds-signal.component';


const routes: Routes = [
  { path: '', component: RefundsSignalComponent, data: { role: ModuleKeys.citad_refund_pattern, action: PermissionsActions.view }, canActivate: [AuthGuard] },
  { path: 'edit', component: EditRefundsSignalComponent, data: { role: ModuleKeys.citad_refund_pattern, action: PermissionsActions.update }, canActivate: [AuthGuard] },
  { path: 'history-config', component: HistoryComponent, data: { role: ModuleKeys.citad_refund_pattern, action: PermissionsActions.view }, canActivate: [AuthGuard] },
]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RefundsSignalRoutingModule {
}
