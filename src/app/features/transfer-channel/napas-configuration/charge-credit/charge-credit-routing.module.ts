import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ModuleKeys, PermissionsActions} from "../../../../public/module-permission.utils";
import {AuthGuard} from "../../../../shared/permission/auth.guard";
import { ChargeCreditComponent } from './charge-credit.component';
import { CreateChargeCreditComponent } from './create-charge-credit/create-charge-credit.component';
import { DetailChargeCreditComponent } from './detail-charge-credit/detail-charge-credit.component';
import { EditChargeCreditComponent } from './edit-charge-credit/edit-charge-credit.component';

const routes: Routes = [
  { path: 'search', component: ChargeCreditComponent, data: { title: 'Quản lý yêu cầu báo có',role: ModuleKeys.napas_ibft_reconcile_charge_credit, action: PermissionsActions.view  }, canActivate: [AuthGuard] },
  { path: 'create', component: CreateChargeCreditComponent, data: { title: 'Quản lý tra soát',role: ModuleKeys.napas_ibft_reconcile_charge_credit, action: PermissionsActions.insert  }, canActivate: [AuthGuard] },
  { path: 'edit', component: EditChargeCreditComponent, data: { title: 'Quản lý tra soát',role: ModuleKeys.napas_ibft_reconcile_charge_credit, action: PermissionsActions.update  }, canActivate: [AuthGuard] },
  { path: 'detail', component: DetailChargeCreditComponent, data: { title: 'Quản lý tra soát',role: ModuleKeys.napas_ibft_reconcile_charge_credit, action: PermissionsActions.view  }, canActivate: [AuthGuard] },

]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChargeCreditRoutingModule {
}
