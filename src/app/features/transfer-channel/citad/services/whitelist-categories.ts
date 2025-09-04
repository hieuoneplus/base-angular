import { Injectable } from '@angular/core';
import {HttpClientService, HttpOptions, HttpResponse, Verbs} from "@shared-sm";
import {Observable} from "rxjs";
import {environment} from "@env/environment";
import {PATH} from "../../../../public/constants";
import { PaginationBaseDto } from 'src/app/shared/models/pagination.base.dto';
import {IGetWhitelistCategoriesHistoriesParams, IGetWhitelistCategoriesParams, IParamQueryTransactionCitad, IPostWhitelistCategoryContent, IRequestPostWhitelistCategory, IRequestPutWhitelistCategory, IResponseQueryTransactionCitad, IWhitelistCategoryContent, IWhitelistCategoryHistoryContent, PaginationQueryTransactionCitadDto} from "../../../model/citad";

@Injectable({
  providedIn: 'root'
})
export class WhitelistCategoriesService {

  constructor(
    private httpClientService: HttpClientService,
  ) { }

  getWhitelistCategories(params: IGetWhitelistCategoriesParams): Observable<HttpResponse<PaginationQueryTransactionCitadDto<IWhitelistCategoryContent>>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.TRANSFER_CHANNEL.CITAD.WHITELIST_CATEGORIES,
      params
    }
    return this.httpClientService.get(option);
  }

  postWhitelistCategories(requestPostWhitelistCategory: IRequestPostWhitelistCategory): Observable<HttpResponse<IPostWhitelistCategoryContent>> {
    const body = requestPostWhitelistCategory
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.TRANSFER_CHANNEL.CITAD.WHITELIST_CATEGORIES,
      body: body
    }
    return this.httpClientService.post(option);
  }

  putWhitelistCategories(requestPutWhitelistCategory: IRequestPutWhitelistCategory, id: string): Observable<HttpResponse<IPostWhitelistCategoryContent>> {
    const body = requestPutWhitelistCategory
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.TRANSFER_CHANNEL.CITAD.WHITELIST_CATEGORIES + `/${id}`,
      body: body
    }
    return this.httpClientService.put(option);
  }

  getWhitelistCategoryDetail(id: string): Observable<HttpResponse<IWhitelistCategoryContent>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.TRANSFER_CHANNEL.CITAD.WHITELIST_CATEGORIES + `/${id}`,
    }
    return this.httpClientService.get(option);
  }
  deleteWhitelistCategory(id: string): Observable<HttpResponse<IWhitelistCategoryContent>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.TRANSFER_CHANNEL.CITAD.WHITELIST_CATEGORIES + `/${id}`,
    }
    return this.httpClientService.delete(option);
  }
  getWhitelistCategoriesHistory(params: IGetWhitelistCategoriesHistoriesParams): Observable<HttpResponse<PaginationQueryTransactionCitadDto<IWhitelistCategoryContent>>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.TRANSFER_CHANNEL.CITAD.WHITELIST_CATEGORIES_HISTORY,
      params
    }
    return this.httpClientService.get(option);
  }
  getWhitelistCategoriesHistoryDetail(id: string): Observable<HttpResponse<IWhitelistCategoryHistoryContent>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.TRANSFER_CHANNEL.CITAD.WHITELIST_CATEGORIES_HISTORY + `/${id}`,
    }
    return this.httpClientService.get(option);
  }

  exportWhitelistCategoriesCitad() {
    const options: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.TRANSFER_CHANNEL.CITAD.WHITELIST_CATEGORIES + `/export`,
      responseType: 'blob',  // Ensure the response type is 'blob' to handle binary data
    };
    return this.httpClientService.download(Verbs.GET, options);
  }
}
