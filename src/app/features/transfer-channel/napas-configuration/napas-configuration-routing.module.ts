import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { NapasConfigurationMainComponent } from './napas-configuration-main.component';
const routes: Routes = [
  { path: '', component: NapasConfigurationMainComponent, data: { title: 'napas' } },
  {
    path: 'dispute',
    // canActivate: [AuthGuard],
    loadChildren: () => import('./search-dispute/search-dispute.module').then(m => m.SearchDisputeModule),
  },
  {
    path: 'transaction-info',
    // canActivate: [AuthGuard],
    loadChildren: () => import('./transaction-info/transaction-info.module').then(m => m.TransactionInfoModule),
  },
  // {
  //   path: 'charge-credit',
  //   // canActivate: [AuthGuard],
  //   loadChildren: () => import('./charge-credit/charge-credit.module').then(m => m.ChargeCreditModule),
  // },
  {
    path: 'transaction-flag',
    // canActivate: [AuthGuard],
    loadChildren: () => import('./transaction-flag/transaction-flag.module').then(m => m.TransactionFlagModule),
  },
  // {
  //   path: 'refund',
  //   // canActivate: [AuthGuard],
  //   loadChildren: () => import('./refund/refund.module').then(m => m.RefundModule),
  // },
  // {
  //   path: 'flag-report',
  //   // canActivate: [AuthGuard],
  //   loadChildren: () => import('./flag-report/flag-report.module').then(m => m.FlagReportModule),
  // },
  // {
  //   path: 'additional-accounting',
  //   // canActivate: [AuthGuard],
  //   loadChildren: () => import('./additional-accounting/additional-accounting.module').then(m => m.AdditionalAccountingModule),
  // },

]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NapasConfigurationRoutingModule {
}
