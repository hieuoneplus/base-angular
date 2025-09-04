import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailTransactionManagerOutComponent } from './detail-transaction-manager-out/detail-transaction-manager-out.component';
import { TransactionManagerOutComponent } from './transaction-manager-out.component';


const routes: Routes = [
  { path: '', component: TransactionManagerOutComponent, data: { title: 'Truy vấn giao dịch đi Citad' } },
  { path: 'detail', component: DetailTransactionManagerOutComponent, data: { title: 'Chi tiết truy vấn giao dịch đi Citad' } },
]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionManagerOutRoutingModule {
}
