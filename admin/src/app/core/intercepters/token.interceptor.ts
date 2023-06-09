import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'

@Injectable()

export class TokenInterceptor implements HttpInterceptor {
  constructor() { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {


    let apiReq = request.clone({ url: `${request.url}` });

      if (localStorage.getItem('loggedin-adminId')) {
        request = request.clone({
          setHeaders: {
            'Authorization': 'Bearer '+localStorage.getItem("CP-auth-token"),
            'auth-type': 'admin'
          }
        });
      }
    
    //console.log(request)
    return next.handle(request);

  }
}
