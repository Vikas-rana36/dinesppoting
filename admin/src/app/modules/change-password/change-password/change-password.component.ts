import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../../../core/services';
import { FormBuilder, FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ConfirmedValidator } from '../../../core/custom-validators';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  destroy$: Subject<boolean> = new Subject<boolean>();
  noRecords = false;
  isActivated = false;
  isPasswordFormSubmitted:boolean = false;
  changePasswordForm: FormGroup;
  dataList:any = [];
  adminId:any;
  fieldtext:any;
  fieldtext1:any;
  fieldtext2:any;

  constructor(private utilsService: UtilsService, private formBuilder:FormBuilder) { }

  ngOnInit(): void {    
    this.adminId = localStorage.getItem("loggedin-adminId")
    this. _initalizePasswordForm()
  }

  _initalizePasswordForm(){
    this.changePasswordForm = this.formBuilder.group({     
      id:[null], 
      oldPassword: [null, [Validators.required]],
      Password: [null, [Validators.required]],
      confirmPassword: [null, Validators.required]
    },{
      // check whether our password and confirm password match
      validator: ConfirmedValidator('Password', 'confirmPassword')});
  }
  
  // convenience getter for easy access to form fields
  get formRef() {
    return this.changePasswordForm.controls;
  }

  onChangePassword(){
    if (this.changePasswordForm.invalid) {        
      this.isPasswordFormSubmitted= true
      return false;      
    }
    const changePassData = this.changePasswordForm.value;
    changePassData['id'] = this.adminId

    this.utilsService.showPageLoader(environment['MESSAGES']['SAVING-INFO']);//show page loader
    this.utilsService.processPostRequest('/auth/passwordChange',changePassData).pipe(takeUntil(this.destroy$)).subscribe((response:any) => {
      this.utilsService.onSuccess(environment.MESSAGES['SUCCESSFULLY-SAVED']); 
      this.cancelEdit()
    })
  }

  cancelEdit(){
    this.changePasswordForm.reset();
    // console.log('value',this.changePasswordForm.value);
  }

  toggleField(input:any){
    input.type = input.type === 'password' ?  'text' : 'password';
    this.fieldtext=!this.fieldtext  
  }
  reToggleField(input:any){
    input.type = input.type === 'password' ?  'text' : 'password';
    this.fieldtext1=!this.fieldtext1
  
  }

  oldToggleField(input:any){
    input.type = input.type === 'password' ?  'text' : 'password';
    this.fieldtext2=!this.fieldtext2
  
  }

}
