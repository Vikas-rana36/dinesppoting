import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmitterService } from '../services/emitter.service';


@Injectable()
  
export class TokenInterceptor implements HttpInterceptor {
  constructor(private emitter:EmitterService) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

      if(localStorage.getItem('token') && !(request.url).includes('yelp') && !(request.url).includes('maps.googleapis.com')){
        request = request.clone({
          setHeaders: {
            'x-sh-auth-token': localStorage.getItem('token')
          }
        }); 
      }    
      
      if((request.url).includes('yelp')){
        request = request.clone({
          setHeaders: {           
            'Authorization': `Bearer FRsgh_S61Ax_IDYWga9Dgjuo_aQbJthHAzdSOJRXdMlC-myU_484jCiYWzPBg1va9Psuewdtk31FR3-t0T5uNFh7KCvag5unHBiSeXOvOpe27siUlwpmKghNAPjxYnYx`,
          }
        }); 
      
      }  

      return next.handle(request);


    
   


  }
}
