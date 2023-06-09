import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class ApiIntercepter implements HttpInterceptor {
  constructor() { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
   
    let apiReq = request.clone({ url: `${request.url}` });  
       apiReq = request.clone({ url: `${request.url}` });   
       if (!(request.url).includes('maps.googleapis.com')) {  
        apiReq = request.clone({ url: environment.apiBaseUrl + 'api/' + `${request.url}` });
      }
    return next.handle(apiReq);
  }
}
