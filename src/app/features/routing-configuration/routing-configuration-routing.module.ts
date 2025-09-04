import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
const routes: Routes = [
  {
    path: 'whitelist',
    // canActivate: [AuthGuard],
    loadChildren: () => import('./whitelist/whitelist.module').then(m => m.WhitelistModule),
  },
  {
    path: 'blacklist',
    // canActivate: [AuthGuard],
    loadChildren: () => import('./blacklist/blacklist.module').then(m => m.BlacklistModule),
  },
  {
    path: 'bankcode-cardbin',
    // canActivate: [AuthGuard],
    loadChildren: () => import('./bankcode-cardbin/bankcode-cardbin.module').then(m => m.BankCodeCardBinModule),
  },
  {
    path: 'transfer-channel-config',
    // canActivate: [AuthGuard],
    loadChildren: () => import('./transfer-channel-config/transfer-channel-config.module').then(m => m.TransferChannelConfigModule),
  },
  {
    path: 'transfer-channel-limit',
    // canActivate: [AuthGuard],
    loadChildren: () => import('./transfer-channel-limit/transfer-channel-limit.module').then(m => m.TransferChannelLimitModule),
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoutingConfigurationRoutingModule {
}
