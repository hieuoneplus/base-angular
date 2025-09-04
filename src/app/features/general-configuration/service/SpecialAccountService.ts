import {Injectable} from "@angular/core";
import {HttpClientService, HttpOptions, HttpResponse} from "@shared-sm";
import {Observable} from "rxjs";
import {PaginationBaseDto} from "../../../shared/models/pagination.base.dto";
import {environment} from "@env/environment";
import {PATH} from "../../../public/constants";
import {
  IAliasAccountHistoryContent,
  IGetAliasParams,
  IPutAliasBody, IReasonReject,
  ISpecialAccountContent,IGetAliasHistoriesParams
} from "../special-account/modal/interface";

@Injectable({
  providedIn: 'root',
})
export class SpecialAccountService {

  constructor(
    private httpClientService: HttpClientService,
  ) {
  }

  getAlias(params: IGetAliasParams): Observable<HttpResponse<PaginationBaseDto<ISpecialAccountContent>>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.GENERAL_CONFIGURATION.ALIAS,
      params
    }
    return this.httpClientService.get(option);
  }

  deleteAlias(id: string): Observable<HttpResponse<String>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.GENERAL_CONFIGURATION.ALIAS + `/${id}`,
    }
    return this.httpClientService.delete(option);
  }

  postAlias(requestPostUser: IPutAliasBody): Observable<HttpResponse<ISpecialAccountContent>> {
    const body = requestPostUser
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.GENERAL_CONFIGURATION.ALIAS,
      body: body
    }
    return this.httpClientService.post(option);
  }

  putAlias(requestPostUser: IPutAliasBody, id: string): Observable<HttpResponse<ISpecialAccountContent>> {
    const body = requestPostUser
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.GENERAL_CONFIGURATION.ALIAS + `/${id}`,
      body: body
    }
    return this.httpClientService.put(option);
  }

  getAliasDetail(id: string): Observable<HttpResponse<ISpecialAccountContent>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.GENERAL_CONFIGURATION.ALIAS + `/${id}`,
    }
    return this.httpClientService.get(option);
  }
  getAliasAccountHistory(id: string, params: IGetAliasHistoriesParams): Observable<HttpResponse<PaginationBaseDto<IAliasAccountHistoryContent>>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.GENERAL_CONFIGURATION.ALIAS + `/${id}/history`,
      params
    }
    return this.httpClientService.get(option);
  }
  getAliasAccountHistoryDetail(id: string): Observable<HttpResponse<IAliasAccountHistoryContent>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.GENERAL_CONFIGURATION.ALIAS + `/history/${id}`,
    }
    return this.httpClientService.get(option);
  }

  approveAccount(id: string): Observable<HttpResponse<ISpecialAccountContent>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.GENERAL_CONFIGURATION.ALIAS + `/${id}/approve`,
    }
    return this.httpClientService.post(option);
  }
  rejectAccount(body: IReasonReject, id: string): Observable<HttpResponse<ISpecialAccountContent>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.GENERAL_CONFIGURATION.ALIAS + `/${id}/reject`,
      body: body
    }
    return this.httpClientService.post(option);
  }
}
