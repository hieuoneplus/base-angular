import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ModuleKeys, PermissionsActions} from "../../../../public/module-permission.utils";
import {AuthGuard} from "../../../../shared/permission/auth.guard";
import { HistoryComponent } from './history/history.component';
import { TransactionFlagComponent } from './transaction-flag.component';

const routes: Routes = [
  { path: 'search', component: TransactionFlagComponent, data: { title: 'Cấu hình dựng cờ giao dịch',role: ModuleKeys.napas_ibft_reconcile_transaction_flag, action: PermissionsActions.view  }, canActivate: [AuthGuard] },
  { path: 'history', component: HistoryComponent, data: { title: 'Cấu hình dựng cờ giao dịch',role: ModuleKeys.napas_ibft_reconcile_transaction_flag, action: PermissionsActions.view  }, canActivate: [AuthGuard] },

]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionFlagRoutingModule {
}
