import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { UtilsService } from '../services/utils.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGaurdGuard implements CanActivate {
  constructor(private router:Router, private utilsService:UtilsService) { 
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(localStorage.getItem('login')){
        return true;

      }
      this.utilsService.onResponse('Your are not loggedin.', false)
         // not logged in so redirect to login page with the return url     
        
         //this.authService.isLoggedIn(false);
         this.router.navigate(['auth/login'],{queryParams: {returnUrl: state.url}});
         return false;
  }
  
}
