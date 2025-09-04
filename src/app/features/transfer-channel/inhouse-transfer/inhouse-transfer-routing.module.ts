import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InhouseTransferMainComponent } from './inhouse-transfer-main.component';

// Chuyển tiền thường
const routes: Routes = [
  { path: '', component: InhouseTransferMainComponent, data: { title: 'MAIN' } },
  {
    path: 'configs',
    // canActivate: [AuthGuard],
    loadChildren: () => import('./configs/configs.module').then(m => m.ConfigsModule),
  },
  {
    path: 't24-protection',
    // canActivate: [AuthGuard],
    loadChildren: () => import('./t24-protection/t24-protection.module').then(m => m.T24ProtectionModule),
  }
]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class InhouseTransferRoutingModule {
}
