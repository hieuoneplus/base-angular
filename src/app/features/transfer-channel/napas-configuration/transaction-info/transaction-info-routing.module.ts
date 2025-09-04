import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ModuleKeys, PermissionsActions} from "../../../../public/module-permission.utils";
import {AuthGuard} from "../../../../shared/permission/auth.guard";
import { DetailTransactionInfoComponent } from './detail-transaction-info/detail-transaction-info.component';
import { TransactionInfoComponent } from './transaction-info.component';

const routes: Routes = [
  { path: 'search', component: TransactionInfoComponent, data: { title: 'Tra cứu thông tin giao dịch',role: ModuleKeys.napas_ibft_reconcile_transaction, action: PermissionsActions.view  }, canActivate: [AuthGuard] },
  { path: 'detail', component: DetailTransactionInfoComponent, data: { title: 'Xem chi tiết giao dịch',role: ModuleKeys.napas_ibft_reconcile_transaction, action: PermissionsActions.view  }, canActivate: [AuthGuard] },

]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionInfoRoutingModule {
}
