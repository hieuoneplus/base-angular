import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MessageErrorManageComponent } from './message-error-manage.component';
import { ModuleKeys, PermissionsActions } from 'src/app/public/module-permission.utils';


const routes: Routes = [
  { path: '', component: MessageErrorManageComponent, data: { title: 'Truy vấn giao dịch đi Citad', role: ModuleKeys.wire_transfer_error_messages, action:  PermissionsActions.view } },
]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MessageErrorManageRoutingModule {
}
