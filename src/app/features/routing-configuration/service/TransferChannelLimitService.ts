import {Injectable} from '@angular/core';
import {environment} from '@env/environment';
import {HttpClientService, HttpOptions, HttpResponse, HttpResponseArray} from '@shared-sm';
import {Observable} from 'rxjs';
import {PATH} from 'src/app/public/constants';
import { IDetailHistoryConfig, IHistory, IHistorySortParams, IPageable, IPostTransferChannelLimitBody, IPutTransferChannelLimitBody, ISearchParams, ITransferChannelLimitContent } from '../transfer-channel-limit/modal/interface';


@Injectable({
  providedIn: 'root',
})
export class TransferChannelLimitService {

  constructor(
    private httpClientService: HttpClientService,
  ) { }

  search(params: ISearchParams): Observable<HttpResponseArray<ITransferChannelLimitContent>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.ROUTING.TRANSFER_CHANNEL_LIMIT,
      params
    }
    return this.httpClientService.get(option);
  }

  getDetail(id: string): Observable<HttpResponse<ITransferChannelLimitContent>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.ROUTING.TRANSFER_CHANNEL_LIMIT + `/${id}`,
    }
    return this.httpClientService.get(option);
  }

  create(requestPostUser: IPostTransferChannelLimitBody): Observable<HttpResponse<ITransferChannelLimitContent>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.ROUTING.TRANSFER_CHANNEL_LIMIT,
      body: requestPostUser
    }
    return this.httpClientService.post(option);
  }

  update(id: number, requestPostUser: IPutTransferChannelLimitBody): Observable<HttpResponse<ITransferChannelLimitContent>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.ROUTING.TRANSFER_CHANNEL_LIMIT + `/${id}`,
      body: requestPostUser
    }
    return this.httpClientService.put(option);
  }

  getHistoryConfigList(transferChannelId: number, params?: IHistorySortParams): Observable<HttpResponse<IPageable<IHistory>>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.ROUTING.TRANSFER_CHANNEL_LIMIT + `/${transferChannelId}/history`,
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
      path: PATH.ROUTING.TRANSFER_CHANNEL_LIMIT + `/history/${historyId}`,
    }
    return this.httpClientService.get(option);
  }
}