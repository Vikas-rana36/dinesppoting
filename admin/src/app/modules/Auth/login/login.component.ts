import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

//services
import { AuthService, UtilsService } from '../../../core/services'
import { environment } from '../../../../environments/environment'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  destroy$: Subject<boolean> = new Subject<boolean>();
  loginForm: FormGroup;
  fieldtext:any
  submitted:boolean = false
  constructor(private formBuilder: FormBuilder, private router: Router, private utilsService:UtilsService, private authService:AuthService) {
    this.utilsService.checkAndRedirect();
  }

  ngOnInit() {
    this._initalizeLoginForm()
  }

  private _initalizeLoginForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
      password: [null, [Validators.required]]     
    });
  }
  
  onSubmit() {
    if (this.loginForm.invalid) {
      this.submitted = true    
      return
    }
    this.utilsService.showPageLoader(environment.MESSAGES["CHECKING-AUTHORIZATION"]);//show page loader
   
    this.authService.login(this.loginForm.value).pipe(takeUntil(this.destroy$)) 
      
      .subscribe(
        (response) => {
       
          localStorage.setItem('loggedinUser', JSON.stringify(response.body.data))
          localStorage.setItem('loggedin-adminId', response.body.data._id)
          //localStorage.setItem('loggedinUser', JSON.stringify(true))
          localStorage.setItem('CP-auth-token', response.headers.get('CP-auth-token'))
          this.authService.isLoggedIn(true, 'admin');//trigger loggedin observable 
          this.utilsService.onSuccess('Logged in successfully');
          this.router.navigate(['/user-listing'])
          

        });
  }

  get formRef(){
    return this.loginForm.controls;
  }

  toggleField(input:any){
    input.type = input.type === 'password' ?  'text' : 'password';
    this.fieldtext=!this.fieldtext
  
  }
  
  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }
}
