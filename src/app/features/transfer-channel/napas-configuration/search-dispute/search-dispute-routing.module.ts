import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ModuleKeys, PermissionsActions} from "../../../../public/module-permission.utils";
import {AuthGuard} from "../../../../shared/permission/auth.guard";
import { CreateDisputeComponent } from './create-dispute/create-dispute.component';
import { DetailDisputeComponent } from './detail-dispute/detail-dispute.component';
import { EditDisputeComponent } from './edit-dispute/edit-dispute.component';
import { ReplyEditDisputeComponent } from './reply-edit-dispute/reply-edit-dispute.component';
import { ReplyDisputeComponent } from './reply-dispute/reply-dispute.component';
import { SearchDisputeComponent } from './search-dispute.component';
import { ReplyDetailDisputeComponent } from './reply-detail-dispute/reply-detail-dispute.component';

const routes: Routes = [
  { path: 'search', component: SearchDisputeComponent, data: { title: 'Quản lý tra soát',role: ModuleKeys.napas_ibft_reconcile_dispute, action: PermissionsActions.view  }, canActivate: [AuthGuard] },
  { path: 'create', component: CreateDisputeComponent, data: { title: 'Thêm mới yêu cầu tra soát',role: ModuleKeys.napas_ibft_reconcile_dispute, action: PermissionsActions.insert  }, canActivate: [AuthGuard] },
  { path: 'edit', component: EditDisputeComponent, data: { title: 'Chỉnh sửa yêu cầu tra soát',role: ModuleKeys.napas_ibft_reconcile_dispute, action: PermissionsActions.update  }, canActivate: [AuthGuard] },
  { path: 'detail', component: DetailDisputeComponent, data: { title: 'Chỉnh sửa yêu cầu tra soát',role: ModuleKeys.napas_ibft_reconcile_dispute, action: PermissionsActions.view  }, canActivate: [AuthGuard] },
  { path: 'reply', component: ReplyDisputeComponent, data: { title: 'Phản hồi tra soát',role: ModuleKeys.napas_ibft_reconcile_dispute, action: PermissionsActions.reply  }, canActivate: [AuthGuard] },
  { path: 'reply-edit', component: ReplyEditDisputeComponent, data: { title: 'Chỉnh sửa phản hổi tra soát',role: ModuleKeys.napas_ibft_reconcile_dispute, action: PermissionsActions.reply  }, canActivate: [AuthGuard] },
  { path: 'reply-detail', component: ReplyDetailDisputeComponent, data: { title: 'Xem chi tiết phản hổi tra soát',role: ModuleKeys.napas_ibft_reconcile_dispute, action: PermissionsActions.view  }, canActivate: [AuthGuard] },

]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchDisputeRoutingModule {
}
