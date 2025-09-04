import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AddBankCodeCardBinComponent, } from "./add-bankcode-cardbin/add-bankcode-cardbin.component";
import {AuthGuard} from "../../../shared/permission/auth.guard";
import {ModuleKeys, PermissionsActions} from "../../../public/module-permission.utils";
import { SearchBankCodeCardBinComponent } from './search-bankcode-cardbin.component';
import { HistoryComponent } from './history/history.component';




const routes: Routes = [
  { path: '', component: SearchBankCodeCardBinComponent, data: { title: 'Định tuyến theo mã ngân hàng và cardbin', role: ModuleKeys.routing_transfer_channel_bank_config, action: PermissionsActions.view }, canActivate: [AuthGuard] },
  { path: 'add', component: AddBankCodeCardBinComponent, data: { title: 'Thêm mới cấu hình', role: ModuleKeys.routing_transfer_channel_bank_config, action: PermissionsActions.insert }, canActivate: [AuthGuard] },
  { path: 'history', component: HistoryComponent, data: { title: 'Lịch sử chỉnh sửa', role: ModuleKeys.routing_transfer_channel_bank_config, action: PermissionsActions.view }, canActivate: [AuthGuard] },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BankCodeCardBinRoutingModule {
}
