import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StateTreasuryConfigComponent } from './state-treasury-config.component';
import { EditStateTreasuryConfigComponent } from './edit-state-treasury-config/edit-state-treasury-config.component';
import {
  ModuleKeys,
  PermissionsActions,
} from '../../../../public/module-permission.utils';
import { AuthGuard } from '../../../../shared/permission/auth.guard';
import { DetailStateTreasuryComponent } from './detail-state-treasury-config/detail-state-treasury-config.component';
import { AddStateTreasuryComponent } from './add-state-treasury/add-state-treasury.component';
import { StateTreasuriesHistoriesComponent } from './state-treasuries-histories/state-treasuries-histories.component';

const routes: Routes = [
  {
    path: '',
    component: StateTreasuryConfigComponent,
    data: {
      role: ModuleKeys.citad_state_treasuries,
      action: PermissionsActions.view,
    },
    canActivate: [AuthGuard],
  },
  {
    path: 'detail',
    component: DetailStateTreasuryComponent,
    data: {
      role: ModuleKeys.citad_state_treasuries,
      action: PermissionsActions.view,
    },
    canActivate: [AuthGuard],
  },
  {
    path: 'add',
    component: AddStateTreasuryComponent,
    data: {
      role: ModuleKeys.citad_state_treasuries,
      action: PermissionsActions.insert,
    },
    canActivate: [AuthGuard],
  },
  {
    path: 'edit',
    component: EditStateTreasuryConfigComponent,
    data: {
      role: ModuleKeys.citad_state_treasuries,
      action: PermissionsActions.update,
    },
    canActivate: [AuthGuard],
  },
  {
    path: 'history',
    component: StateTreasuriesHistoriesComponent,
    data: {
      role: ModuleKeys.citad_state_treasuries,
      action: PermissionsActions.view,
    },
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StateTreasuryConfigRoutingModule {}
