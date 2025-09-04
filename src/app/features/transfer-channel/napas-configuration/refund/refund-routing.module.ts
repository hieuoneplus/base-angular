import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ModuleKeys, PermissionsActions} from "../../../../public/module-permission.utils";
import {AuthGuard} from "../../../../shared/permission/auth.guard";
import { CreateRefundComponent } from './create-refund/create-refund.component';
import { DetailRefundComponent } from './detail-refund/detail-refund.component';
import { EditRefundComponent } from './edit-refund/edit-refund.component';
import { RefundComponent } from './refund.component';

const routes: Routes = [
  { path: 'search', component: RefundComponent, data: { title: 'Tra cứu thông tin giao dịch hoàn trả',role: ModuleKeys.napas_ibft_reconcile_return, action: PermissionsActions.view  }, canActivate: [AuthGuard] },
  { path: 'create-single', component: CreateRefundComponent, data: { title: 'Thêm mới yêu cầu hoàn trả',role: ModuleKeys.napas_ibft_reconcile_return, action: PermissionsActions.insert  }, canActivate: [AuthGuard] },
  { path: 'edit-single', component: EditRefundComponent, data: { title: 'Thêm mới yêu cầu hoàn trả',role: ModuleKeys.napas_ibft_reconcile_return, action: PermissionsActions.update}, canActivate: [AuthGuard] },
  { path: 'detail-single', component: DetailRefundComponent, data: { title: 'Thêm mới yêu cầu hoàn trả',role: ModuleKeys.napas_ibft_reconcile_return, action: PermissionsActions.view  }, canActivate: [AuthGuard] },
  {
    path: 'batch',
    // canActivate: [AuthGuard],
    loadChildren: () => import('./refund-batch/refund-batch.module').then(m => m.RefundBatchModule),
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RefundRoutingModule {
}
