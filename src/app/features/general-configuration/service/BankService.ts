import {Injectable} from "@angular/core";
import {HttpClientService, HttpOptions, HttpResponse} from "@shared-sm";
import {Observable} from "rxjs";
import {PaginationBaseDto} from "../../../shared/models/pagination.base.dto";
import {environment} from "@env/environment";
import {PATH} from "../../../public/constants";
import { IBanksContent, IGetBankParams, IRequestParamsBank, IBankContent } from "../../model/bank";

@Injectable({
  providedIn: 'root',
})
export class BankService {

  constructor(
    private httpClientService: HttpClientService,
  ) {
  }

  getBanks(params: IGetBankParams): Observable<HttpResponse<PaginationBaseDto<IBankContent>>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.BANK.CM,
      params
    }
    return this.httpClientService.get(option);
  }

  getBankWhitelist(params: IRequestParamsBank): Observable<HttpResponse<PaginationBaseDto<IBanksContent>>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.BANK.CM,
      params
    }
    return this.httpClientService.get(option);
  }
  addBank(code: string): Observable<HttpResponse<IBankContent>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.BANK.CM + `/${code}`,
    }
    return this.httpClientService.post(option);
  }
}
