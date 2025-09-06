import { Injectable } from '@angular/core';

import { environment } from '@env/environment';
import { HttpClientService, HttpOptions, HttpResponse, Verbs } from '@shared-sm';
import { Observable } from 'rxjs';
import { PATH } from 'src/app/public/constants';
import {IParamsFileSearch, ListFileResponse, PaginationFileBaseDto} from '../file-management/modal/interface';
@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(
    private httpClientService: HttpClientService,
  ) { }

  downLoadFile(idFile: string) {
    const options: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.NAPAS.IBFT_RECONCILE.OUT.FLAG_REPORT.DOWNLOAD_FILE + `/${idFile}`,
      responseType: 'blob',
    };
    return this.httpClientService.download(Verbs.GET, options);
  }

  queryFile(body : IParamsFileSearch, params: any): Observable<HttpResponse<PaginationFileBaseDto<ListFileResponse>>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.USER.FILE,
      body: body,
      params
    }
    return this.httpClientService.get(option);
  }
}
