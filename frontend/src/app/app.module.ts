import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeModule } from './modules/home/home.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { ToastrModule } from 'ng6-toastr-notifications';
import { TokenInterceptor } from './core/interceptors/token.interceptor';
import { UtilsService } from './core/services/utils.service';
import { ApiIntercepter, HttpErrorInterceptor } from './core/interceptors';
// import { GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule } from '@abacritt/angularx-social-login';
import { AuthModule } from './modules/auth/auth.module';
import { NgxPaginationModule } from 'ngx-pagination';

import { BarRatingModule } from 'ngx-bar-rating';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from './shared/shared.module';
import { AboutComponent } from './modules/pages/about/about.component';
import { PrivacyPolicyComponent } from './modules/pages/privacy-policy/privacy-policy.component';
import { ReviewGuidelinesComponent } from './modules/pages/review-guidelines/review-guidelines.component';
import { TermsOfServicesComponent } from './modules/pages/terms-of-services/terms-of-services.component';
import { TrustSafetyComponent } from './modules/pages/trust-safety/trust-safety.component';
import { ContactUsComponent } from './modules/pages/contact-us/contact-us.component';
import { NgxJsonLdModule } from '@ngx-lite/json-ld';

// import { AgmCoreModule } from '@agm/core';





@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    PrivacyPolicyComponent,
    ReviewGuidelinesComponent,
    TermsOfServicesComponent,
    TrustSafetyComponent,
    PageNotFoundComponent,
    ContactUsComponent
  
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule ,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    ToastrModule.forRoot(),
    // SocialLoginModule,
    AuthModule,
    NgxPaginationModule,
    BarRatingModule,
    GooglePlaceModule,
    NgSelectModule,
    NgbModule,
    SharedModule,
    NgxJsonLdModule
    // AgmCoreModule.forRoot({
    //   apiKey: 'AIzaSyDvee52MIcc4JzkBl9HQgPCbc5yjT6ODqc'
    // })
  ],
  providers: [
    UtilsService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiIntercepter,
      multi: true
    }
    ,{
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    },
    // {
    //   provide: 'SocialAuthServiceConfig',
    //   useValue: {
    //     autoLogin: false,
    //     providers: [
    //       {
    //         id: GoogleLoginProvider.PROVIDER_ID,
    //         provider: new GoogleLoginProvider(
    //           '233010221296-9id35igdt97s14ointkfai21mgbt0ni6.apps.googleusercontent.com'
    //         )
    //       }
    //     ],
    //     onError: (err:any) => {
     
    //     }
    //   } as SocialAuthServiceConfig,
    // }
   
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
