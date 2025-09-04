import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TransactionReplacementComponent} from "./transaction-replacement.component";
import {
  TransactionReplacementEditComponent
} from "./edit-transaction-replacement/edit-tranasction-replacement.component";
import {ModuleKeys, PermissionsActions} from "../../../../public/module-permission.utils";
import {AuthGuard} from "../../../../shared/permission/auth.guard";
import {HistoryComponent} from "../history/history.component";

const routes: Routes = [
  { path: '', component: TransactionReplacementComponent, data: { title: 'Cấu hình replace kí tự đặc biệt', role: ModuleKeys.citad_transaction_replacement, action: PermissionsActions.view }, canActivate: [AuthGuard] },
  { path: 'history-config', component: HistoryComponent, data: { title: 'Lịch sử cấu hình replace kí tự đặc biệt', role: ModuleKeys.citad_transaction_replacement, action: PermissionsActions.view }, canActivate: [AuthGuard] },
  { path: 'edit', component: TransactionReplacementEditComponent, data: { title: 'Cập nhật cấu hình replace kí tự đặc biệt', role: ModuleKeys.citad_transaction_replacement, action: PermissionsActions.update }, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionReplacementRoutingModule { }
