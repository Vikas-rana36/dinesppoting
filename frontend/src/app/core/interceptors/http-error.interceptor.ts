import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
//modules core services
import { UtilsService } from '../services/utils.service';


@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
    constructor(private injector:Injector) { 
          
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const utilsService = this.injector.get(UtilsService);        
    
        return next.handle(request)
            .pipe(
                retry(1),
                catchError((error: HttpErrorResponse) => {
                    let errorMessage = '';
                    if (error.error instanceof ErrorEvent) {
                        // client-side error
                        console.log('ErrorEvent',error)
                         errorMessage = `Error: ${error.error.message}`;
                    } else {
                        console.log('error',error)
                        // server-side error
                        errorMessage = `Error: ${error.error.message}`;
                    }
              
                    // window.alert(errorMessage);
                    if(errorMessage!=undefined)
                        utilsService.onError(errorMessage);
                   
                    return throwError(errorMessage);
                })
            )
    }
}