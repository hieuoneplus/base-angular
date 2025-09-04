import { Injectable } from '@angular/core';
import {HttpClientService, HttpOptions, HttpResponse, Verbs} from "@shared-sm";
import {Observable} from "rxjs";
import {environment} from "@env/environment";
import {PATH} from "../../../../public/constants";
import {IParamQueryTransactionCitad, IResponseQueryTransactionCitad, PaginationQueryTransactionCitadDto} from "../../../model/citad";

@Injectable({
  providedIn: 'root'
})
export class TransactionManagerService {

  constructor(
    private httpClientService: HttpClientService,
  ) { }

  getTransactionCitad(params: IParamQueryTransactionCitad, type: string): Observable<HttpResponse<PaginationQueryTransactionCitadDto<IResponseQueryTransactionCitad[]>>> {
    params.type = type
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.TRANSFER_CHANNEL.CITAD.QUERY_TRANSACTION_CITAD,
      params
    }
    return this.httpClientService.get(option);
  }

  getTransactionCitadDetail(transactionId: string): Observable<HttpResponse<IResponseQueryTransactionCitad>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.TRANSFER_CHANNEL.CITAD.QUERY_TRANSACTION_CITAD + `/${transactionId}`,
    }
    return this.httpClientService.get(option);
  }

  retryTransactionCitad(body: Array<number>, type: string): Observable<HttpResponse<PaginationQueryTransactionCitadDto<IResponseQueryTransactionCitad[]>>> {
    const ids = { ids: body }
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.TRANSFER_CHANNEL.CITAD.QUERY_TRANSACTION_CITAD + `/${type}` + '/retry',
      body: ids
    }
    return this.httpClientService.post(option);
  }

  exportTransactionCitad(params: IParamQueryTransactionCitad, type: string) {
    // Assign type to the parameters
    params.type = type;
  
    // Define HTTP options for the export API request
    const options: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.TRANSFER_CHANNEL.CITAD.EXPORT_TRANSACTION_CITAD,
      params,
      responseType: 'blob',  // Ensure the response type is 'blob' to handle binary data
    };
  
    return this.httpClientService.download(Verbs.GET, options);
  }


}
