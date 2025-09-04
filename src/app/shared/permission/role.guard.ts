import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router'
import { environment } from '@env/environment'
import { Observable } from 'rxjs';
import * as _ from 'lodash'
import Utils from '../utils/utils';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {


  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Observable<boolean> | Promise<boolean> | boolean  {
    // let scopes = route.data.scopes as Array<Scopes>;
    // let resources = route.data.resources as Array<string>;
    // Utils.logger(resources, 'RoleGuard resources')
    // Utils.logger(scopes, 'RoleGuard scopes')
    return true;
  }

  /**
   * chỉ check quyền view, vào bên trong component sẽ check các quyền chi tiết hơn
   * @param resourceKeys
   * @param prefix
   */
  public getUserPermissions()
  {
    // kiểm tra role và permission -> có được truy cập route không
    // merge permission
    // resourceKeys.forEach( key => {
    //   this.objFunction = _.mergeWith(this.objFunction, this.sessionService.getSessionData(`${prefix}_${key}`), this.customizer);
    // })
    // if (!this.objFunction?.allowScopes)
    // {
    //   this.goAccessDenied()
    // } else {
    //   const found = scopes.every(r=> this.objFunction.allowScopes.includes(r))
    //   if (found)
    //   {
    //     return found
    //   } else
    //   {
    //     this.goAccessDenied()
    //   }
    // }
  }

  goAccessDenied() {
    // this.router.navigate([environment.base_path + '/access-denied']);
  }

  customizer(objValue, srcValue) {
    if (srcValue) {
      return srcValue;
    }
    return objValue
  }

}
