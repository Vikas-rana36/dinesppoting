import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { CustomValidators } from 'src/app/core/Directives/custom-validators';
import { UtilsService } from 'src/app/core/services/utils.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrManager } from 'ng6-toastr-notifications';
import { environment } from 'src/environments/environment';
import { HttpResponse } from '@angular/common/http';
import { EmitterService } from 'src/app/core/services/emitter.service';
// import { SocialAuthService } from "@abacritt/angularx-social-login";
// import { GoogleLoginProvider } from "@abacritt/angularx-social-login";
 
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    
  @ViewChild('loginRef', {static: true }) loginElement!: ElementRef;
  isLoginFormSubmitted:boolean=false
 loginForm:FormGroup
 loginDetails:any
 fieldtext:any
 checkBox:boolean
 socialPlatformProvider:any;
 user:any
 private accessToken = '';
 auth2: any;
 socialLoginData:any
  socialLoginResult:any
  constructor(private utilService:UtilsService,private spinner:NgxSpinnerService,private toastr:ToastrManager,private router:Router,private emitter:EmitterService,   private ngZone:NgZone ) { 
  
  }

  ngOnInit() {
    this.googleAuthSDK();
    // this.authService.authState.subscribe((user) => {
    //   this.user = user;
  
    // });
   
   


   this.loginForm=new FormGroup({
    email:new FormControl('',[Validators.required,Validators.email, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$")]),
    remember:new FormControl('',),
    password:new FormControl('',Validators.compose([
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(50),
      // check whether the entered password has a number
      CustomValidators.patternValidator(/\d/, {
        hasNumber: true
      }),
      // check whether the entered password has upper case letter
      CustomValidators.patternValidator(/[A-Z]/, {
        hasCapitalCase: true
      }),
      // check whether the entered password has a lower case letter
      CustomValidators.patternValidator(/[a-z]/, {
        hasSmallCase: true
      }),
      // check whether the entered password has a special character
      CustomValidators.patternValidator(
        /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
        {
          hasSpecialCharacters: true
        }
      )
    ])),
   })
 
  }
  // rememberStatus(){
  //   console.log(this.loginForm.get('remember').value)
  //   this.loginForm.get('remember').valueChanges
  //   .subscribe(value => {  
  //     // console.log(value)  
  //      if (value == false || this.loginForm.get('remember').value==false) {        
  //         this.loginForm.patchValue({remember:""})
      
  //      }
  //   })
  // }
  get f()
  {
      return this.loginForm.controls;
  }
  onCheckboxChange(e:any){
   this.checkBox=e.target.checked

   if(!this.checkBox){
    this.loginForm.patchValue({remember:""})
   }

    // this.loginForm.get('remember').valueChanges
    // .subscribe(value => {  
    //   // console.log(value)  
    //    if (value == false || this.loginForm.get('remember').value==false) {        
    //       this.loginForm.patchValue({remember:""})
    //    }
    //    })
  }
  submit(){
  
   this.isLoginFormSubmitted=true

   
   if(this.loginForm.valid){
    let loginRequest={
      "email":this.loginForm.get('email').value,
      "password":this.loginForm.get('password').value,
      "device_token":[""]
    }
    this.utilService.showPageLoader()
    this.utilService.processPostRequest('auth/login',loginRequest)
    .subscribe(response=>{
      this.utilService.hidePageLoader()
      this.utilService.onResponse(environment.MESSAGES['LOGIN-SUCCESS'], true)
      this.loginDetails=response
      if(response && response.responseCode == 200){
    
        localStorage.setItem('login',response.data.email)
        localStorage.setItem('token',response.data.token)
        this.emitter.isLoginSubject.next(true)
        this.router.navigate(['/home'])
      
      }
    },err=>{

      if(err && err.error){
        this.toastr.errorToastr(err.error.message)
      }
    })
   }

  }
    
  navigateTo(url:any){

    this.router.navigate([url]);

}
  // signInWithGoogle(): void {
  
  //   this.socialPlatformProvider=GoogleLoginProvider.PROVIDER_ID

  //   this.authService.signIn(this.socialPlatformProvider).then(x=>console.log(x))
  
  // }
 
  // getAccessToken(): void {

  //   this.authService.getAccessToken(GoogleLoginProvider.PROVIDER_ID).then(accessToken => 
  //     console.log(accessToken))
  //     // this.accessToken = accessToken
      
  // }

  handleCredentialResponse(response:any) {

    // decodeJwtResponse() is a custom function defined by you
    // to decode the credential response.
    const responsePayload = response.credential;

    // console.log("ID: " + responsePayload.sub);
    // console.log('Full Name: ' + responsePayload.name);
    // console.log('Given Name: ' + responsePayload.given_name);
    // console.log('Family Name: ' + responsePayload.family_name);
    // console.log("Image URL: " + responsePayload.picture);
    // console.log("Email: " + responsePayload.email);
 }
 
 
  // refreshToken(): void {
  //   // this.socialPlatformProvider=GoogleLoginProvider.PROVIDER_ID
  //   this.authService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID);
  // }
  toggleField(id:any){
    let type = document.getElementById(id).getAttribute('type')
    document.getElementById(id).setAttribute("type", (type=='text')?'password':'text')
    this.fieldtext=!this.fieldtext
  
  }
  
  callLoginButton() {
     
    this.auth2.attachClickHandler(this.loginElement.nativeElement, {},
      (googleAuthUser:any) => {
     
        this.socialLoginData= googleAuthUser.getBasicProfile();
        
        // console.log('Token || ' + googleAuthUser.getAuthResponse().id_token);
        // console.log('ID: ' + this.socialLoginData.getId());
        // console.log('Name: ' + this.socialLoginData.getName());
        // console.log('Image URL: ' + this.socialLoginData.getImageUrl());
        // console.log('Email: ' + this.socialLoginData.getEmail());
        let socialLogin={
          "email":this.socialLoginData.getEmail(),
          "socialToken":googleAuthUser.getAuthResponse().id_token,
          "name":this.socialLoginData.getName()
        }
        this.utilService.showPageLoader();
        this.utilService.processPostRequest('auth/login',socialLogin)
        .subscribe(response=>{
          this.utilService.hidePageLoader();
          this.utilService.onResponse(environment.MESSAGES['LOGIN-SUCCESS'], true)
          this.socialLoginResult=response
          // this.loginDetails=response
          if(response && response.responseCode == 200){
        
            localStorage.setItem('login',response.data.email)
            localStorage.setItem('token',response.data.social_token)
            this.emitter.isLoginSubject.next(true)
            // this.router.navigate(['/home'])
              this.ngZone.run(()=>this.navigateTo('/home'));
          }
        })

    
      }, (error:any) => {
        alert(JSON.stringify(error, undefined, 2));
      });
 
  }
  googleAuthSDK() {
     
    (<any>window)['googleSDKLoaded'] = () => {
      (<any>window)['gapi'].load('auth2', () => {
        this.auth2 = (<any>window)['gapi'].auth2.init({
          client_id: '1083507110310-3vj716lthv3bhbihg4en5o6jtbp8ksui.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
          scope: 'profile email',
          plugin_name: 'streamy'
        });
        this.callLoginButton();
      });
    }
     
    (function(d, s, id){
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {return;}
      js = d.createElement('script'); 
      js.id = id;
      js.src = "https://apis.google.com/js/platform.js?onload=googleSDKLoaded";
      fjs?.parentNode?.insertBefore(js, fjs);
    }(document, 'script', 'google-jssdk'));
   
  }
}
