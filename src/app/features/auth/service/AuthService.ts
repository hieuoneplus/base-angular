import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClientService, HttpOptions, HttpResponse } from '@shared-sm';
import { Observable } from 'rxjs';
import { PATH, PATH_BILATERAL } from 'src/app/public/constants';
import { IUserPermissions, ISendOtp, IVerifyOtpInput, IVerifyOtpOutput, IUserBilateral } from '../../model/auth';
import {ILoginRequest, ILoginResponse} from "../welcome/model/interface";


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
      isAuthentication: true
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

  login(request: ILoginRequest): Observable<HttpResponse<ILoginResponse>> {
    const option: HttpOptions = {
      url: environment.urlPmpBe,
      path: PATH.AUTH.LOGIN,
      body: request,
      isAuthentication: false  // Don't add auth headers for login
    }
    return this.httpClientService.post(option);
  }
}
