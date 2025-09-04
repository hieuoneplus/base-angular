import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClientService, HttpOptions, HttpResponse } from '@shared-sm';
import { Observable } from 'rxjs';
import { PATH } from 'src/app/public/constants';
import { PaginationBaseDto } from 'src/app/shared/models/pagination.base.dto';
import { IGetRolesParams, IRoleContent } from '../../model/role';
import { IContentPostUser, IGetUsersParams, IProfile, IRequestPostUser, IRequestPutUser, IUserContent, IUserContentByUserName } from '../../model/user';


@Injectable({
  providedIn: 'root',
})
export class UserService {

  constructor(
    private httpClientService: HttpClientService,
  ) { }

  getUsers(params: IGetUsersParams): Observable<HttpResponse<PaginationBaseDto<IUserContent>>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.USER.GET_USERS,
      params
    }
    return this.httpClientService.get(option);
  }

  getRoles(params: IGetRolesParams): Observable<HttpResponse<PaginationBaseDto<IRoleContent>>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.ROLE.ROLES,
      params
    }
    return this.httpClientService.get(option);
  }

  getUserByUserName(userName: string): Observable<HttpResponse<IUserContentByUserName>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.USER.GET_USER_BY_NAME + `${userName}`,
    }
    return this.httpClientService.get(option);
  }

  postUsers(requestPostUser: IRequestPostUser): Observable<HttpResponse<IContentPostUser>> {
    const body = requestPostUser
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.USER.POST_USERS,
      body: body
    }
    return this.httpClientService.post(option);
  }

  putUsers(requestPuttUser: IRequestPutUser, userId: string): Observable<HttpResponse<IContentPostUser>> {
    const body = requestPuttUser
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.USER.PUT_USERS + `${userId}`,
      body: body
    }
    return this.httpClientService.put(option);
  }

  getUserDetail(userId: string): Observable<HttpResponse<IUserContent>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.USER.GET_USERS + `/${userId}/detail`,
    }
    return this.httpClientService.get(option);
  }

  me(): Observable<HttpResponse<IProfile>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.USER.ME,
    }
    return this.httpClientService.get(option);
  }
}