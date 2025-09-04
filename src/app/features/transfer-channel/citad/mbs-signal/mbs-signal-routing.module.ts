import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModuleKeys, PermissionsActions } from 'src/app/public/module-permission.utils';
import { AuthGuard } from 'src/app/shared/permission/auth.guard';
import { HistoryComponent } from '../history/history.component';
import { EditMbsSignalComponent } from './edit-mbs-signal/edit-mbs-signal.component';
import { MbsSignalComponent } from './mbs-signal.component';


const routes: Routes = [
  { path: '', component: MbsSignalComponent, data: { role: ModuleKeys.citad_partner_pattern, action: PermissionsActions.view }, canActivate: [AuthGuard] },
  { path: 'edit', component: EditMbsSignalComponent, data: { role: ModuleKeys.citad_partner_pattern, action: PermissionsActions.update }, canActivate: [AuthGuard] },
  { path: 'history-config', component: HistoryComponent, data: { role: ModuleKeys.citad_partner_pattern, action: PermissionsActions.view }, canActivate: [AuthGuard] },
]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MbsSignalRoutingModule {
}
