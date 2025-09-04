import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClientService, HttpOptions, HttpResponse } from '@shared-sm';
import { Observable } from 'rxjs';
import { PATH } from 'src/app/public/constants';
import { PaginationBaseDto } from 'src/app/shared/models/pagination.base.dto';
import { IGetAccountsParams, IRequestPutAccount, IWhitelistContent } from '../whitelist/modal/interface';
import {
    IBankCodeCardBinContent,
    IBankCodeCardBinHistoryContent, IHistorySortParams, IPageable,
    IRequestPostBankCodeCardBin
} from "../bankcode-cardbin/modal/interface";

@Injectable({
    providedIn: 'root',
})
export class RoutingBankCodeCardbinService {

    constructor(
        private httpClientService: HttpClientService,
    ) {
    }

    getListBankCode(params: IGetAccountsParams): Observable<HttpResponse<PaginationBaseDto<IBankCodeCardBinContent>>> {
        const option: HttpOptions = {
            url: environment.urlPmpBe,
            path: PATH.ROUTING.BANKCODE_CARDBIN,
            params
        }
        return this.httpClientService.get(option);
    }

    postBankCode(body: IRequestPostBankCodeCardBin): Observable<HttpResponse<IBankCodeCardBinContent>> {
        const option: HttpOptions = {
            url: environment.urlPmpBe,
            path: PATH.ROUTING.BANKCODE_CARDBIN,
            body: body
        }
        return this.httpClientService.post(option);
    }

    putBankCode(body: IRequestPutAccount, id: string): Observable<HttpResponse<IBankCodeCardBinContent>> {
        const option: HttpOptions = {
            url: environment.urlPmpBe,
            path: PATH.ROUTING.BANKCODE_CARDBIN + `/${id}`,
            body: body,
        }
        return this.httpClientService.put(option);
    }

    getHistory(params: IHistorySortParams, id: string): Observable<HttpResponse<IPageable<IBankCodeCardBinHistoryContent>>> {
        const option: HttpOptions = {
            url: environment.urlPmpBe,
            path: PATH.ROUTING.BANKCODE_CARDBIN + `/${id}/history`,
            params,
        }
        return this.httpClientService.get(option);
    }
    getHistoryDetail(id: string): Observable<HttpResponse<IBankCodeCardBinHistoryContent>> {
        const option: HttpOptions = {
            url: environment.urlPmpBe,
            path: PATH.ROUTING.BANKCODE_CARDBIN + `/history/${id}`,
        }
        return this.httpClientService.get(option);
    }
}
