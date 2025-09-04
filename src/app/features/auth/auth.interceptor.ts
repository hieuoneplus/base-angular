import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DformDialogService, LocalStoreEnum } from '@shared-sm';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private dialog: DformDialogService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 403) {
          this.dialog.error({
            title: ' ',
            message: 'Bạn không có quyền thực hiện thao tác này, vui lòng đăng nhập lại',
          }, resp => {
            window.postMessage({ key: 'sc-navigation', url: 'login' }, '*');
            localStorage.removeItem(LocalStoreEnum.pmp_verified_otp);
            
            return
          });
        }
        return throwError(error);
      })
    );
  }
}

