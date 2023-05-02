import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { PageLoaderService } from './page-loader.services';


@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  apiBaseUrl =  environment.apiBaseUrl;
  header:any
  constructor(private httpClient: HttpClient, private pageLoaderService: PageLoaderService, private toastrManager: ToastrManager, private authService:AuthService,private router:Router) { }
  // onAccountConfirm(status:any) {  

  //   this.invokeHeaderComponent.emit(status);    
  // }
  /**
  * Show page loder on fetching data
  * @return void
  */
  public showPageLoader(message = ''):void{
    this.pageLoaderService.pageLoader(true);//show page loader
    if(message.length>0){      
      this.pageLoaderService.setLoaderText(message);//setting loader text
    }
    
  }

  /**
  * Hide page loder on fetching data
  * @return void
  */
  public hidePageLoader(): void {
    this.pageLoaderService.pageLoader(false);//hide page loader
    this.pageLoaderService.setLoaderText('');//setting loader text
  }

  /**
  * Show alert on success response & hide page loader
  * @return void
  */
  public onSuccess(message:any): void {
    this.pageLoaderService.pageLoader(false);//hide page loader
    this.pageLoaderService.setLoaderText('');//setting loader text empty
    //this.toastrManager.successToastr(message, 'Success!'); //showing success toaster 
  }

  /**
  * Show alert on error response & hide page loader
  * @return void
  */
  public onError(message:any): void {
    this.pageLoaderService.setLoaderText('');//setting loader text
    this.pageLoaderService.pageLoader(false);//hide page loader
    this.toastrManager.errorToastr(message, 'Oops!',{maxShown:1});//showing error toaster message  
  }

  /**
  * Logout user from the system and erase all info from localstorage
  * @return void
  */
  public logout():void{
    //this.toastrManager.successToastr(this.translateService.instant('ACTION-MESSAGE.LOGOUT-SUCCESS'), 'Success!');//showing 
    
    localStorage.clear();
    //this.authService.isLoggedIn(false);
    this.router.navigate(['/']);    
  }

  /**
  * Check the user is loggedin oterwise redirect to login page
  * @return void
  */

  // public checkAndRedirect(){
  //   if (localStorage.getItem("tucasa-auth-token")) {
  //     this.router.navigate(['/authorized/dashboard']);
  //   }
  // }

  public onResponse(message = '', isSuccess = false): void {
    if (isSuccess){
  
        this.toastrManager.successToastr(message, 'Success!', { maxShown: 1,toastTimeout:3000 }); //showing success toaster 
    }else{
        this.toastrManager.errorToastr(message, 'Oops!', { maxShown: 1 });//showing error toaster message
    }
  }
  /**
  * Post the data and endpoint 
  */
   processPostRequest(apiEndPoint:any, data:any): Observable<any>{
    return this.httpClient
        .post(apiEndPoint, data)
  }
  /**   
  * Get the data using posted endpoint 
  */
  processGetRequest(apiEndPoint:any):Observable<any>{
    return this.httpClient
        .get(apiEndPoint)
  }
}
