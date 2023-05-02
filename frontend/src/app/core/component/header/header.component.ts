import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EmitterService } from '../../services/emitter.service';
import { UtilsService } from '../../services/utils.service';
import { Location } from '@angular/common'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLoggedIn : any;
  showBackButton:any
  constructor(private emitter:EmitterService,private router:Router,private utilService:UtilsService,private location:Location) { 
    // this.isLoggedIn = this.emitter.isLoggedIn();
    this.emitter.isLoginSubject.subscribe(
      res=>{
        
        this.isLoggedIn=res
      }
    )
    // console.log(this.isLoggedIn,'yesss')
 
    this.emitter.showBackButton
    .subscribe(res=>{
      this.showBackButton=res

    })
 
  }
 
  ngOnInit(): void {

    if(this.router.url === '/home'){
      this.emitter.isButtonShown(false)
        
    }
    else{
      this.emitter.isButtonShown(true)
    }
    
    this.router.events.subscribe(event => {
      if(event instanceof NavigationStart) {
        if(event.url==='/home'){
          this.emitter.isButtonShown(false)
        
        }
        else{
          this.emitter.isButtonShown(true)
        }
      }
    })
  }
  goBack(){
    this.location.back()
  }
  logout(){
    this.router.navigate(['/auth/login'])
    this.utilService.onResponse(environment.MESSAGES['LOGOUT-SUCCESS'], true)
    localStorage.removeItem('login')
    localStorage.removeItem('token')
    localStorage.removeItem('latitude')
    localStorage.removeItem('longitude')
    localStorage.removeItem('token')
    localStorage.removeItem('currlatitude')
    localStorage.removeItem('currlongitude')
    localStorage.removeItem('selectedCategory')
    localStorage.removeItem('formatted_address')
    this.emitter.isLoginSubject.next(false)
  }
}
