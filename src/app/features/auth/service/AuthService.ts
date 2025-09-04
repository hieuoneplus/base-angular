import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClientService, HttpOptions, HttpResponse } from '@shared-sm';
import { Observable } from 'rxjs';
import { PATH, PATH_BILATERAL } from 'src/app/public/constants';
import { IUserPermissions, ISendOtp, IVerifyOtpInput, IVerifyOtpOutput, IUserBilateral } from '../../model/auth';


@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(
    private httpClientService: HttpClientService,
  ) { }

  sendOtp(): Observable<HttpResponse<ISendOtp>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.OTP.SEND,
    }
    return this.httpClientService.post(option);
  }


  verifyOtp(otpKey: string, otpValue: string): Observable<HttpResponse<IVerifyOtpOutput>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.OTP.VERIFY,
      body: {
        otpKey,
        otpValue,
      }
    }
    return this.httpClientService.post(option);
  }

  getUserPermissions(): Observable<HttpResponse<IUserPermissions[]>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.USER.PERMISSIONS,
    }
    return this.httpClientService.get(option);
  }

  getBilateralUser(): Observable<HttpResponse<IUserBilateral>> {
    const option: HttpOptions = {
      url: environment.urlBilateralBE,
      path: PATH_BILATERAL.USER.GET,
    }
    return this.httpClientService.get(option);
  }
}