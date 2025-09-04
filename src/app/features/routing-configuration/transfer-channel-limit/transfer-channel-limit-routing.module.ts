import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModuleKeys, PermissionsActions } from 'src/app/public/module-permission.utils';
import { TransferChannelLimitComponent } from './transfer-channel-limit.component';
import { AuthGuard } from 'src/app/shared/permission/auth.guard';
import { AddTransferChannelLimitComponent } from './add-transfer-channel-limit/add-transfer-channel-limit.component';
import { DetailTransferChannelLimitComponent } from './detail-transfer-channel-limit/detail-transfer-channel-limit.component';
import { EditTransferChannelLimitComponent } from './edit-transfer-channel-limit/edit-transfer-channel-limit.component';
import { HistoryComponent } from './history/history.component';

const routes: Routes = [
  { path: '', component: TransferChannelLimitComponent, data: { title: 'Cấu hình định mức chuyển tiền', role: ModuleKeys.routing_channel_limit, action: PermissionsActions.view }, canActivate: [AuthGuard] },
  { path: 'add', component: AddTransferChannelLimitComponent, data: { title: 'Thêm mới cấu hình định mức chuyển tiền', role: ModuleKeys.routing_channel_limit, action: PermissionsActions.insert }, canActivate: [AuthGuard] },
  { path: 'detail', component: DetailTransferChannelLimitComponent, data: { title: 'Chi tiết cấu hình định mức chuyển tiền', role: ModuleKeys.routing_channel_limit, action: PermissionsActions.view }, canActivate: [AuthGuard] },
  { path: 'edit', component: EditTransferChannelLimitComponent, data: { title: 'Chỉnh sửa cấu hình định mức chuyển tiền', role: ModuleKeys.routing_channel_limit, action: PermissionsActions.update }, canActivate: [AuthGuard] },
  { path: 'history', component: HistoryComponent, data: { title: 'Lịch sử cấu hình định mức chuyển tiền', role: ModuleKeys.routing_channel_limit, action: PermissionsActions.view }, canActivate: [AuthGuard] },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransferChannelLimitRoutingModule {
}