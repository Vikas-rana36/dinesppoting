import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmitterService {
  isLoginSubject =new BehaviorSubject<boolean>(this.hasToken())
  isLocationSelected=new BehaviorSubject<boolean>(false)
  showBackButton=new BehaviorSubject<boolean>(false)
  constructor() { }

  private hasToken() : boolean {
    return !!localStorage.getItem('token');
  }
  // isLoggedIn() : Observable<boolean> {
  //   return this.isLoginSubject.asObservable();
  //  }
   isLocated():Observable<boolean>{
    return this.isLocationSelected.asObservable();
   }
   isButtonShown(data:any){
     this.showBackButton.next(data)
   }
}
  