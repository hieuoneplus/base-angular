import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CitadMainComponent } from './citad-main.component';


const routes: Routes = [
  { path: '', component: CitadMainComponent, data: { title: 'citad' } },
  {
    path: 'transaction-manager-out',
    // canActivate: [AuthGuard],
    loadChildren: () => import('./transaction-manager-out/transaction-manager-out.module').then(m => m.TransactionManagerOutModule),
  },
  {
    path: 'transaction-manager-in',
    // canActivate: [AuthGuard],
    loadChildren: () => import('./transaction-manager-in/transaction-manager-in.module').then(m => m.TransactionManagerInModule),
  },
  {
    path: 'message-error-manage',
    // canActivate: [AuthGuard],
    loadChildren: () => import('./message-error-manage/message-error-manage.module').then(m => m.MessageErrorManageModule),
  },
  {
    path: 'abbreviation-config',
    // canActivate: [AuthGuard],
    loadChildren: () => import('./abbreviation-config/abbreviation-config.module').then(m => m.AbbreviationConfigModule),
  },
  {
    path: 'whitelist-categories',
    // canActivate: [AuthGuard],
    loadChildren: () => import('./whitelist-categories/whitelist-categories.module').then(m => m.WhitelistCategoriesModule),
  },
  {
    path: 'whitelist-account',
    // canActivate: [AuthGuard],
    loadChildren: () => import('./whitelist/whitelist.module').then(m => m.WhitelistModule),
  },
  {
    path: 'blacklist-account',
    // canActivate: [AuthGuard],
    loadChildren: () => import('./blacklist/blacklist.module').then(m => m.BlacklistModule),
  },
  {
    path: 'refunds-signal',
    // canActivate: [AuthGuard],
    loadChildren: () => import('./refunds-signal/refunds-signal.module').then(m => m.RefundsSignalModule),
  },
  {
    path: 'mbs-signal',
    // canActivate: [AuthGuard],
    loadChildren: () => import('./mbs-signal/mbs-signal.module').then(m => m.MbsSignalModule),
  },
  {
    path: 'hold-receiver-account',
    // canActivate: [AuthGuard],
    loadChildren: () => import('./hold-receiver-account/hold-receiver-account.module').then(m => m.HoldReceiverAccountModule),
  },
  {
    path: 'hold-receiver-name',
    // canActivate: [AuthGuard],
    loadChildren: () => import('./hold-receiver-name/hold-receiver-name.module').then(m => m.HoldReceiverNameModule),
  },
  {
    path: 'account.parameter',
    // canActivate: [AuthGuard],
    loadChildren: () => import('./account-parameter/account-parameter.module').then(m => m.AccountParameterModule),
  },
  {
    path: 'history-config',
    // canActivate: [AuthGuard],
    loadChildren: () => import('./history/history.module').then(m => m.HistoryModule),
  },
  {
    path: 'state-treasuries',
    // canActivate: [AuthGuard],
    loadChildren: () => import('./state-treasury-config/state-treasury-config.module').then(m => m.StateTreasuryConfigModule),
  },
  {
    path: 'gateway',
    // canActivate: [AuthGuard],
    loadChildren: () => import('./on-off-gate/on-off-gate.module').then(m => m.OnOffGateModule),
  },
  {
    path: 'transaction-replacement',
    // canActivate: [AuthGuard],
    loadChildren: () => import('./transaction-replacement/transaction-replacement.module').then(m => m.TransactionReplacementModule),
  },

]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CitadRoutingModule {
}
