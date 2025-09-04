import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import JSONBig from 'json-bigint';

@Injectable()
export class BigIntInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
 
    if (req.responseType === 'json') {
    
      const modifiedReq = req.clone({ responseType: 'text' as 'json' });
      return next.handle(modifiedReq).pipe(
        map(event => {
          if (event instanceof HttpResponse && typeof event.body === 'string') {
      
            const body = JSONBig.parse(event.body);
         
            return event.clone({ body });
          }
          return event;
        })
      );
    }
    return next.handle(req);
  }
}
