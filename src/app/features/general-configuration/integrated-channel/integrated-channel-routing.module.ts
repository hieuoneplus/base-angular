import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IntegratedChannelComponent } from './integrated-channel.component';
import {
  ModuleKeys,
  PermissionsActions,
} from '../../../public/module-permission.utils';
import { AuthGuard } from '../../../shared/permission/auth.guard';
import { AddIntegratedChannelComponent } from './add-integrated-channel/add-integrated-channel.component';
import { EditIntegratedChannelComponent } from './edit-integrated-channel/edit-integrated-channel.component';

const routes: Routes = [
  {
    path: '',
    component: IntegratedChannelComponent,
    data: { role: ModuleKeys.routing_integration_channel, action: PermissionsActions.view },
    canActivate: [AuthGuard],
  },
  {
    path: 'add',
    component: AddIntegratedChannelComponent,
    data: { role: ModuleKeys.routing_integration_channel, action: PermissionsActions.insert },
    canActivate: [AuthGuard],
  },
  {
    path: 'edit',
    component: EditIntegratedChannelComponent,
    data: {
      role: ModuleKeys.routing_integration_channel,
      action: PermissionsActions.update,
    },
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IntegratedChannelRoutingModule {}
