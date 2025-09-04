import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailConfigComponent } from './partner-config/detail-partner-config/detail-partner-config.component';
import { PartnerConfigComponent } from './partner-config/partner-config.component';
import { BilateralMainComponent } from './bilateral-main.component';

const routes: Routes = [
  { path: '', component: BilateralMainComponent, data: { title: 'Song phương' } },
  { path: 'partner-config', component: PartnerConfigComponent, data: { title: 'Thông tin cấu hình đối tác' } },
  { path: 'detail-partner-config', component: DetailConfigComponent, data: { title: 'Chi tiết cấu hình đối tác' } },
 
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BilateralRoutingModule {
}
