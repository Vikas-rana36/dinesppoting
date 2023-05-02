import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

//services
import { AuthService, UtilsService } from '../../../core/services'
import { environment } from '../../../../environments/environment'
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  destroy$: Subject<boolean> = new Subject<boolean>();
  forgotPasswordForm: FormGroup;
  submitted:boolean = false
  constructor(private formBuilder: FormBuilder, private router: Router, private utilsService:UtilsService, private authService:AuthService) {
    this.utilsService.checkAndRedirect();
  }

  ngOnInit() {
    this._initalizeLoginForm()
  }

  private _initalizeLoginForm() {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]]
    });
  }
  
  onSubmit() {
    if (this.forgotPasswordForm.invalid) {
      this.submitted = true    
      return
    }
    this.utilsService.showPageLoader(environment.MESSAGES["CHECKING-AUTHORIZATION"]);//show page loader
   
    this.authService.forgotPassword(this.forgotPasswordForm.value).pipe(takeUntil(this.destroy$)) 
      
      .subscribe(
        (response) => {        
          this.utilsService.onSuccess(environment.MESSAGES["EMAIL-SENT"]);         
          this.forgotPasswordForm.reset();
        });
  }

  get formRef(){
    return this.forgotPasswordForm.controls;
  }
  
  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }
}
