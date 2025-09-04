import {Injectable} from '@angular/core';
import {environment} from '@env/environment';
import {HttpClientService, HttpOptions, HttpResponse, Verbs} from '@shared-sm';
import {Observable} from 'rxjs';
import {PATH} from '../../../public/constants';
import {
  IDetailHistoryConfig, IExportParams,
  IHistory,
  IHistorySortParams,
  IPageable,
  IPostProvinceBody,
  IProvinceContent,
  IPutProvinceBody,
  ISearchParams
} from '../province/modal/interface';


@Injectable({
  providedIn: 'root',
})
export class ProvinceService {

  constructor(
    private httpClientService: HttpClientService,
  ) { }

  search(params: ISearchParams): Observable<HttpResponse<IPageable<IProvinceContent>>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.GENERAL_CONFIGURATION.PROVINCE,
      params
    }
    return this.httpClientService.get(option);
  }

  getDetail(id: string): Observable<HttpResponse<IProvinceContent>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.GENERAL_CONFIGURATION.PROVINCE + `/${id}`,
    }
    return this.httpClientService.get(option);
  }

  create(requestPostUser: IPostProvinceBody): Observable<HttpResponse<IProvinceContent>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.GENERAL_CONFIGURATION.PROVINCE,
      body: requestPostUser
    }
    return this.httpClientService.post(option);
  }

  update(id: number, requestPostUser: IPutProvinceBody): Observable<HttpResponse<IProvinceContent>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.GENERAL_CONFIGURATION.PROVINCE + `/${id}`,
      body: requestPostUser
    }
    return this.httpClientService.put(option);
  }

  getHistoryConfigList(transferChannelId: number, params?: IHistorySortParams): Observable<HttpResponse<IPageable<IHistory>>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.GENERAL_CONFIGURATION.PROVINCE + `/${transferChannelId}/history`,
      params: {
        ...params,
        sort: params.sort ? params.sort : 'updatedAt:DESC',
      }
    }
    return this.httpClientService.get(option);
  }

  getDetailHistory(historyId: string): Observable<HttpResponse<IDetailHistoryConfig>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.GENERAL_CONFIGURATION.PROVINCE + `/history/${historyId}`,
    }
    return this.httpClientService.get(option);
  }

  exportCities(params: IExportParams) {
    const options: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.GENERAL_CONFIGURATION.PROVINCE + `/export`,
      responseType: 'blob',
      params
    };
    return this.httpClientService.download(Verbs.GET, options);
  }
}
