import { Injectable } from '@angular/core';

import { environment } from '@env/environment';
import { HttpClientService, HttpOptions, HttpResponse } from '@shared-sm';
import { Observable } from 'rxjs';
import { PATH } from 'src/app/public/constants';
import { IParamsSearch, IRequestFlagReport, IRequestUpdateFlagReport, IResponseFlagReport, PaginationBaseDto } from '../flag-report/modal/interface';

@Injectable({
  providedIn: 'root'
})
export class FlagReportService {

  constructor(
    private httpClientService: HttpClientService,
  ) { }

  getFlagReport(body: IParamsSearch, params: any): Observable<HttpResponse<PaginationBaseDto<IResponseFlagReport>>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.NAPAS.IBFT_RECONCILE.OUT.FLAG_REPORT.SEARCH,
      body,
      params
    }
    return this.httpClientService.post(option);
  }

  createFlagReport(body: IRequestFlagReport): Observable<HttpResponse<PaginationBaseDto<any>>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.NAPAS.IBFT_RECONCILE.OUT.FLAG_REPORT.CREATE,
      body,
    }
    return this.httpClientService.post(option);
  }

  updateFlagReport(body: IRequestUpdateFlagReport): Observable<HttpResponse<PaginationBaseDto<any>>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.NAPAS.IBFT_RECONCILE.OUT.FLAG_REPORT.UPDATE,
      body,
    }
    return this.httpClientService.post(option);
  }

}