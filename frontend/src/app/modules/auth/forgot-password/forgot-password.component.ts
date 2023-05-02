import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { UtilsService } from 'src/app/core/services/utils.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrManager } from 'ng6-toastr-notifications';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  @Input('show-modal') showModal: boolean;
  
  email:any
  forgetPasswordForm:FormGroup
  isFormSubmitted:boolean=false
  result:any

  constructor(private utilService:UtilsService,private spinner:NgxSpinnerService,private toastr:ToastrManager,private router:Router ) {  
   
  }

  ngOnInit() {
    this.forgetPasswordForm=new FormGroup({
      email:new FormControl('',[Validators.required,Validators.email, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$")])
    })
   
   
    
    
  }
 

  onSubmit(){
      this.isFormSubmitted=true
      if(this.forgetPasswordForm.valid){
        let data={
          "email":this.forgetPasswordForm.get('email').value
        }
       this.utilService.processPostRequest('auth/forgotPassword',data)
       .subscribe(response=>{
     
        this.result=response

        if(this.result && this.result.responseCode){
          this.email=this.result.data[0].email
          this.forgetPasswordForm.reset()
          this.forgetPasswordForm.controls.email.clearValidators()
          this.forgetPasswordForm.controls.email.updateValueAndValidity()
         this.show()
        }

       })
      }
  }
  

show(){
  this.showModal=true
}
 

}
