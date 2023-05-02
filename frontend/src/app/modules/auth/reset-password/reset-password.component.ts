import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CustomValidators } from 'src/app/core/Directives/custom-validators';
import { UtilsService } from 'src/app/core/services/utils.service';
import { MustMatch } from 'src/app/helpers/must-match.validators';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})  
export class ResetPasswordComponent implements OnInit {
id:any
token:any
resetForm:FormGroup
isSubmit:boolean=false
fieldText:any
fieldtext:any
  constructor(private activatedRoute: ActivatedRoute,private fb:FormBuilder,private service:UtilsService,private toastr:ToastrManager,private router:Router) { 
    this.activatedRoute.params.subscribe((params) => {
    this.id=params.id
    this.token=params.token

    })
  }

  ngOnInit(): void {
    this.resetForm=this.fb.group({
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
submit(){
  this.isSubmit=true
  if(this.resetForm.valid){

    let data={
      'password':this.resetForm.get('password').value,
    "userId":this.id,
    "forgotToken":this.token
  }
  this.service.processPostRequest('auth/resetPassword',data)
  .subscribe(response=>{
    
    if(response){
      this.toastr.successToastr('Password updated successfully.')
   this.router.navigate(['/auth/login'])
   this.resetForm.reset()
   this.resetForm.controls.password.clearValidators()
   this.resetForm.controls.password.updateValueAndValidity()
          this.resetForm.controls.confirm_password.clearValidators()
          this.resetForm.controls.confirm_password.updateValueAndValidity()
   }
  },err=>{
    
    if(err && err.error){
      this.toastr.errorToastr(err.error.message)
    }
  });
  
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
