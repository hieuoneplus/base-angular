import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
const routes: Routes = [
  {
    path: 'special-account',
    // canActivate: [AuthGuard],
    loadChildren: () => import('./special-account/special-account.module').then(m => m.SpecialAccountModule),
  },
  {
    path: 'integration-channels',
    // canActivate: [AuthGuard],
    loadChildren: () => import('./integrated-channel/integrated-channel.module').then(m => m.IntegratedChannelModule),
  },
  {
    path: 'province',
    // canActivate: [AuthGuard],
    loadChildren: () => import('./province/province.module').then(m => m.ProvinceModule),
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GeneralConfigurationRoutingModule {
}
