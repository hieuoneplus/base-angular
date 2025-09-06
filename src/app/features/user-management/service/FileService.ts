import { Injectable } from '@angular/core';

import { environment } from '@env/environment';
import { HttpClientService, HttpOptions, HttpResponse, Verbs } from '@shared-sm';
import { Observable } from 'rxjs';
import { PATH } from 'src/app/public/constants';
import {IParamsFileSearch, ListFileResponse, PaginationFileBaseDto, IShareFileRequest} from '../file-management/modal/interface';
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
      path: PATH.USER.DOWNLOAD_FILE + `/${idFile}`,
      responseType: 'blob',
    };
    return this.httpClientService.download(Verbs.GET, options);
  }

  queryFile(params : IParamsFileSearch): Observable<HttpResponse<PaginationFileBaseDto<ListFileResponse>>> {
    // Determine which API to use based on fileView
    const apiPath = params.fileView === 'Seener' ? PATH.USER.SHARE_FILE : PATH.USER.FILE;

    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: apiPath,
      params
    }
    return this.httpClientService.get(option);
  }

  uploadFile(file: File): Observable<HttpResponse<any>> {
    const formData = new FormData();
    formData.append('file', file);

    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.USER.UPLOAD_FILE,
      body: formData
    }
    return this.httpClientService.post(option);
  }

  shareFile(shareRequest: IShareFileRequest): Observable<HttpResponse<any>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.USER.SHARE_FILE_TO_USER,
      body: shareRequest
    }
    return this.httpClientService.post(option);
  }
}
