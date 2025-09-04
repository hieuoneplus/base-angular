import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ModuleKeys, PermissionsActions} from "../../../../../public/module-permission.utils";
import {AuthGuard} from "../../../../../shared/permission/auth.guard";
import { DetailRefundBatchComponent } from './detail-refund-batch/detail-refund-batch.component';
import { RefundBatchComponent } from './refund-batch.component';

const routes: Routes = [
  { path: 'search', component: RefundBatchComponent, data: { title: 'Tra cứu thông tin giao dịch hoàn trả',role: ModuleKeys.napas_ibft_reconcile_return, action: PermissionsActions.view  }, canActivate: [AuthGuard] },
  { path: 'detail', component: DetailRefundBatchComponent, data: { title: 'Tra cứu thông tin giao dịch hoàn trả',role: ModuleKeys.napas_ibft_reconcile_return, action: PermissionsActions.view  }, canActivate: [AuthGuard] },

]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RefundBatchRoutingModule {
}
