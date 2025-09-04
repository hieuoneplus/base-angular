import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot, CanActivate,
  CanActivateChild,
  Router, RouterStateSnapshot
} from '@angular/router';
import { environment } from '@env/environment';
import { LocalStoreManagerService } from '@shared-sm';
import { IUserPermissions } from 'src/app/features/model/auth';
import { LocalStoreEnum } from '../enum/local-store.enum';
import { tokenValid } from '../utils/utils.function';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private localStore: LocalStoreManagerService, private router: Router) { }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log("canActivate", route);
    
    const data = route?.data;
    return this.hasPermission(data['role'], data['action']);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }

  hasPermission(module, action) {
    const permissions: IUserPermissions[] = this.localStore.getData(LocalStoreEnum.pmp_permissions);
    const has = permissions.findIndex(p => p.module === module && p.actions.includes(action)) !== -1;
    return has;
  }
}
