import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AboutComponent } from './modules/pages/about/about.component';
import { PrivacyPolicyComponent } from './modules/pages/privacy-policy/privacy-policy.component';
import { ReviewGuidelinesComponent } from './modules/pages/review-guidelines/review-guidelines.component';
import { TermsOfServicesComponent } from './modules/pages/terms-of-services/terms-of-services.component';
import { TrustSafetyComponent } from './modules/pages/trust-safety/trust-safety.component';
import { ContactUsComponent } from './modules/pages/contact-us/contact-us.component';
const routes: Routes = [
  {
    path: '',
    redirectTo: '/',
    pathMatch: 'full'
  },  
  { 
    path: '', 
    loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule) 
  },
  { 
    path: 'home', 
    loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule) 
  },
  { 
    path: 'auth', 
    loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule) 
  },
  { 
    path: 'cms', 

    loadChildren: () => import('./modules/cms/cms.module').then(m => m.CmsModule) 
  },
  {
    path:'terms-of-services',component:TermsOfServicesComponent
  },
  {
    path:'about',component:AboutComponent
  },
  {
    path:'trust-and-safety',component:TrustSafetyComponent
  },
  {
    path:'privacy-policy',component:PrivacyPolicyComponent
  },
  {
    path:'review-guidelines',component:ReviewGuidelinesComponent
  },
  {
    path:'contact-us',component:ContactUsComponent
  },
  {
    path: '**',
    component: PageNotFoundComponent,   
    data: { title: 'Sorry!! Page Not Found.' }
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
