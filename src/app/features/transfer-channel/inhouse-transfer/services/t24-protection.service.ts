import {Injectable} from '@angular/core';
import {environment} from '@env/environment';
import {HttpClientService, HttpOptions, HttpResponse} from '@shared-sm';
import {Observable} from 'rxjs';
import {PATH} from 'src/app/public/constants';
import {
  IDetailHistoryConfig,
  IHistory,
  IHistorySortParams,
  IPageable,
  IPutT24ProtectionBody,
  IT24ProtectionContent,
} from '../t24-protection/model/interface';

@Injectable({
  providedIn: 'root',
})
export class T24ProtectionService {

  constructor(
    private httpClientService: HttpClientService,
  ) { }

  get(): Observable<HttpResponse<IT24ProtectionContent>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.TRANSFER_CHANNEL.INHOUSE_TRANSFER.CONFIGS + '/t24.protection',
    }
    return this.httpClientService.get(option);
  }

  update(requestPostUser: IPutT24ProtectionBody): Observable<HttpResponse<IT24ProtectionContent>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.TRANSFER_CHANNEL.INHOUSE_TRANSFER.CONFIGS + '/t24.protection',
      body: requestPostUser
    }
    return this.httpClientService.put(option);
  }

  getHistoryConfigList(params?: IHistorySortParams): Observable<HttpResponse<IPageable<IHistory>>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.TRANSFER_CHANNEL.INHOUSE_TRANSFER.CONFIGS + `/t24.protection/history`,
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
      path: PATH.TRANSFER_CHANNEL.INHOUSE_TRANSFER.CONFIGS + `/history/${historyId}`,
    }
    return this.httpClientService.get(option);
  }
}
