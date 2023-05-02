import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators,FormControl, Form } from '@angular/forms';
import { CustomValidators } from 'src/app/core/Directives/custom-validators';
import { UtilsService } from 'src/app/core/services/utils.service';
import { MustMatch } from 'src/app/helpers/must-match.validators';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import { ToastrManager } from 'ng6-toastr-notifications';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  maxlength:any=100
  signupForm!:FormGroup
  field:any
  isSignupFormSubmitted:boolean=false
  signupDetails:any
  fieldText:any
  fieldtext:any
   constructor(private fb:FormBuilder,private utilService:UtilsService,private spinner:NgxSpinnerService,private toastr:ToastrManager,private router:Router) { 
  
   }
 
   ngOnInit() {

     this.signupForm=this.fb.group({
       first_name:new FormControl('',[Validators.required,Validators.pattern('^[a-zA-Z \-\']+'), Validators.maxLength(100)]),
       last_name:new FormControl('',[Validators.required,Validators.pattern('^[a-zA-Z \-\']+'), Validators.maxLength(100)]),
       email:new FormControl('',[Validators.required,Validators.email, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$")]),
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
       confirm_password:new FormControl('',[Validators.required, Validators.minLength(8), Validators.maxLength(50)])
     }, {
      validator: MustMatch('password', 'confirm_password')
  })
   }
   get f()
{
    return this.signupForm.controls;
}
 
   onSubmit(){
   this.isSignupFormSubmitted=true
    
   if(this.signupForm.valid){
     let signupRequest={
       "first_name": this.signupForm.get('first_name').value,
       "last_name": this.signupForm.get('last_name').value,
       "email":this.signupForm.get('email').value,
       "password":this.signupForm.get('password').value,
       "confirmPassword":this.signupForm.get('confirm_password').value
      }
   
      // this.utilService.showPageLoader('Loading...')
      this.utilService.processPostRequest('auth/signup',signupRequest)
      .subscribe(response=>{
        // this.utilService.hidePageLoader()
        this.utilService.onResponse(environment.MESSAGES['REGISTERED-SUCCESSFULLY'], true)
    
        this.signupDetails=response
        if(this.signupDetails && this.signupDetails.responseCode == 200){
          this.router.navigate(['auth/login'])
        }
      },(err:any)=>{
   
        if(err && err.error){
         this.toastr.errorToastr(err.error.message)
        }
      })
    }
      
    }
    toggleFieldText(id:any){
  
      let type = document.getElementById(id).getAttribute('type')
      document.getElementById(id).setAttribute("type", (type=='text')?'password':'text')
      this.fieldText=!this.fieldText
    
    }
    toggleField(id:any){
      let type = document.getElementById(id).getAttribute('type')
      document.getElementById(id).setAttribute("type", (type=='text')?'password':'text')
      this.fieldtext=!this.fieldtext
    
    }
 }


