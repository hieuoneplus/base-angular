import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AchMainComponent } from './ach-main.component';
import { GeneralAchModule } from "./general-config/general-ach.module";


const routes: Routes = [
  { path: '', component: AchMainComponent, data: { title: 'ACH' } },
  {
    path: 'tktg',
    // canActivate: [AuthGuard],
    loadChildren: () => import('./tktg-config/tktg-ach.module').then(m => m.TktgACHModule),
  },
  {
    path: 'general',
    // canActivate: [AuthGuard],
    loadChildren: () => import('./general-config/general-ach.module').then(m => m.GeneralAchModule),
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AchRoutingModule {
}
