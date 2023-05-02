import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

//services
import { AuthService, UtilsService } from '../../../core/services'
import { environment } from '../../../../environments/environment'
//import custom validators
import { ConfirmedValidator } from '../../../core/custom-validators';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  destroy$: Subject<boolean> = new Subject<boolean>();
  resetPasswordForm: FormGroup;
  isFormSubmitted:boolean = false;
  fieldtext: any;
  fieldtext1: any;
  token:any=''

  constructor(private activatedRoute:ActivatedRoute, private utilsService:UtilsService, private authService:AuthService, private formBuilder: FormBuilder, private router: Router) {
 

    //checking & authorizing the token
    this.activatedRoute.params.subscribe((params) => {
      this.token = params['token'];     
     })
  }

  ngOnInit() {  
    this.initForgotPasswordForm();
  }

   //forgot password form
   private initForgotPasswordForm(){
    this.resetPasswordForm = this.formBuilder.group({
      password: [null, [Validators.required]],
      repassword: [null, [Validators.required]],
      token:[]
    },{
      // check whether our password and confirm password match
      validator: ConfirmedValidator('password', 'repassword')
    }
  );

}



  //onsubmit login form
  onSubmit() {
    if (this.resetPasswordForm.invalid) {
      //console.log(this.resetPasswordForm);
      this.isFormSubmitted= true
      return false;      
    } 
    let resetPasswordFormData = this.resetPasswordForm.value;
    resetPasswordFormData['token'] = this.token;
    this.utilsService.showPageLoader(environment.MESSAGES['SAVING-INFO']);//show page loader
    this.utilsService.processPostRequest('/auth/resetPassword',resetPasswordFormData).pipe(takeUntil(this.destroy$)).subscribe((response) => {

      this.utilsService.onSuccess(environment.MESSAGES['SUCCESSFULLY-SAVED']);
      this.router.navigate(['/']);
    })
  }
  get formRef(){
    return this.resetPasswordForm.controls;
  }

  toggleField(input:any){
    input.type = input.type === 'password' ?  'text' : 'password';
    this.fieldtext=!this.fieldtext  
  }
  reToggleField(input:any){
    input.type = input.type === 'password' ?  'text' : 'password';
    this.fieldtext1=!this.fieldtext1
  
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }

}
