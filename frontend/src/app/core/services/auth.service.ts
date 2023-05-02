import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient) { }
  login(postedData:any): Observable<any> {
    return this.httpClient
      .post('login', postedData, { observe: 'response' })
  
  }
  
  
  signUp(postedData:any): Observable<any> {
  
    return this.httpClient
        .post('signup', postedData,{ observe: 'response' })     
  
  }
  
  forgotPassword(postedData:any): Observable<any> {      
    return this.httpClient
        .post('forgot-password', postedData)
  
  }

  userProfileData(): Observable<any> {      
    return this.httpClient
        .post('userProfileData', { userID:localStorage.getItem('tucasa-user-data-ID')})
  
  }

  verifyToken(postedData:any): Observable<any> {      
    return this.httpClient
        .post('verifyToken', postedData)  
  }  

  processPostRequest(apiEndPoint:any, data:any){
    return this.httpClient
        .post(apiEndPoint, data)
  }
  
  processGetRequest(apiEndPoint:any){
    return this.httpClient
        .get(apiEndPoint)
  }
}
