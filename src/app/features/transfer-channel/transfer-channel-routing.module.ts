  import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
const routes: Routes = [
  {
    path: 'ach',
    // canActivate: [AuthGuard],
    loadChildren: () => import('./ach/ach.module').then(m => m.AchModule),
  },
  {
    path: 'citad',
    // canActivate: [AuthGuard],
    loadChildren: () => import('./citad/citad.module').then(m => m.CitadModule),
  },
  {
    path: 'bilateral',
    // canActivate: [AuthGuard],
    loadChildren: () => import('./bilateral/bilateral.module').then(m => m.BilateralModule),
  },
  {
    path: 'inhouse-transfer',
    loadChildren: () => import('./inhouse-transfer/inhouse-transfer.module').then(m => m.InhouseTransferModule),
  },
  {
    path: 'napas',
    loadChildren: () => import('./napas-configuration/napas-configuration.module').then(m => m.NapasConfigurationModule),
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransferChannelRoutingModule {
}
