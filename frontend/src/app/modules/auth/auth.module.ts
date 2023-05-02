import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormValidatorsErrorsComponent } from 'src/app/core/component/form-validators-errors/form-validators-errors.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from 'src/app/core/interceptors/token.interceptor';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { UtilsService } from 'src/app/core/services/utils.service';
import { VerifyComponent } from './verify/verify.component';



@NgModule({
  declarations: [
    AuthComponent,
 
    LoginComponent,
    SignupComponent,
    ForgotPasswordComponent,
    FormValidatorsErrorsComponent,
    ResetPasswordComponent,
    VerifyComponent
  ], 
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
		ReactiveFormsModule,
	
  ]
}) 
export class AuthModule { }
