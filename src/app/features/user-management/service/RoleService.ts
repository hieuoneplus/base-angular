import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClientService, HttpOptions, HttpResponse } from '@shared-sm';
import { Observable } from 'rxjs';
import { PATH } from 'src/app/public/constants';
import { PaginationBaseDto } from 'src/app/shared/models/pagination.base.dto';
import { ICreateRoleBody, IGetRolesParams, IPermission, IPutRoleBody, IRoleContent, IRoleDetail } from '../../model/role';
import { ROLE_TYPE_NAME } from '../role/constant';


@Injectable({
  providedIn: 'root',
})
export class RoleService {

  constructor(
    private httpClientService: HttpClientService,
  ) { }

  getRoles(params: IGetRolesParams): Observable<HttpResponse<PaginationBaseDto<IRoleContent>>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.ROLE.ROLES,
      params
    }
    return this.httpClientService.get(option);
  }

  inquiry(roleId: string): Observable<HttpResponse<IRoleDetail>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.ROLE.INQUIRY_ROLES + `/${roleId}`,
    }
    return this.httpClientService.get(option);
  }

  updateRole(requestPostUser: IPutRoleBody, roleId: string): Observable<HttpResponse<IRoleContent>> {
    const body = requestPostUser
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.ROLE.PUT_ROLES + `${roleId}`,
      body: body
    }
    return this.httpClientService.put(option);
  }

  getPermissions(): Observable<HttpResponse<IPermission[]>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.PERMISSION.PERMISSIONS,
    }
    return this.httpClientService.get(option);
  }

  createRole(body: ICreateRoleBody): Observable<HttpResponse<IRoleDetail>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.ROLE.ROLES,
      body
    }
    return this.httpClientService.post(option);
  }

  getRoleTypeName(type: string) {
    return ROLE_TYPE_NAME[type]
  }
}