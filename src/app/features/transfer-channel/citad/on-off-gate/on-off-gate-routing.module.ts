import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OnOffGateComponent } from './on-off-gate.component';
import { HistoryComponent } from '../history/history.component';
import { ModuleKeys, PermissionsActions } from 'src/app/public/module-permission.utils';
import { AuthGuard } from 'src/app/shared/permission/auth.guard';


const routes: Routes = [
  { path: '', component: OnOffGateComponent, data: { role: ModuleKeys.citad_gateway, action: PermissionsActions.view }, canActivate: [AuthGuard] },
  { path: 'history-config', component: HistoryComponent, data: { role: ModuleKeys.citad_gateway, action: PermissionsActions.view }, canActivate: [AuthGuard] },
]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OnOffGateRoutingModule {
}
