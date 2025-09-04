import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {WhitelistCategoriesComponent} from "./whitelist-categories.component";
import {AddWhitelistCategoriesComponent} from "./add-whitelist-categories/add-whitelist-categories.component";
import {DetailWhitelistCategoriesComponent} from "./detail-whitelist-categories/detail-whitelist-categories.component";
import { EditWhitelistCategoriesComponent } from './edit-whitelist-categories/edit-whitelist-categories.component';
import { WhitelistCategoriesHistoriesComponent } from './whitelist-categories-histories/whitelist-categories-histories.component';
import { ModuleKeys, PermissionsActions } from 'src/app/public/module-permission.utils';
import { AuthGuard } from 'src/app/shared/permission/auth.guard';

const routes: Routes = [
  { path: '', component: WhitelistCategoriesComponent, data: { role: ModuleKeys.citad_whitelist_categories, action: PermissionsActions.view }, canActivate: [AuthGuard] },
  { path: 'add', component: AddWhitelistCategoriesComponent, data: { role: ModuleKeys.citad_whitelist_categories, action: PermissionsActions.update }, canActivate: [AuthGuard] },
  { path: 'detail', component: DetailWhitelistCategoriesComponent, data: { role: ModuleKeys.citad_whitelist_categories, action: PermissionsActions.view }, canActivate: [AuthGuard] },
  { path: 'edit', component: EditWhitelistCategoriesComponent, data: { role: ModuleKeys.citad_whitelist_categories, action: PermissionsActions.update }, canActivate: [AuthGuard] },
  { path: 'history', component: WhitelistCategoriesHistoriesComponent, data: { role: ModuleKeys.citad_whitelist_categories, action: PermissionsActions.view }, canActivate: [AuthGuard] },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WhitelistCategoriesRoutingModule {
}
