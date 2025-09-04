import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailTransactionManagerInComponent } from './detail-transaction-manager-in/detail-transaction-manager-in.component';
import { TransactionManagerInComponent } from './transaction-manager-in.component';
import { ModuleKeys, PermissionsActions } from 'src/app/public/module-permission.utils';


const routes: Routes = [
  { path: '', component: TransactionManagerInComponent, data: { title: 'Truy vấn giao dịch đi Citad', role: ModuleKeys.citad_transactions_inward, action:  PermissionsActions.view } },
  { path: 'detail', component: DetailTransactionManagerInComponent, data: { title: 'Chi tiết truy vấn giao dịch đi Citad', role: ModuleKeys.citad_transactions_inward, action:  PermissionsActions.view } },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionManagerInRoutingModule {
}
