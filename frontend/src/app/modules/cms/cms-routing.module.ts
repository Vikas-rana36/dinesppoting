import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { CmsRootComponent } from './cms-root/cms-root.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { ReviewGuidelinesComponent } from './review-guidelines/review-guidelines.component';
import { TermsOfServicesComponent } from './terms-of-services/terms-of-services.component';
import { TrustSafetyComponent } from './trust-safety/trust-safety.component';

const routes: Routes = [
  {path:'',component:CmsRootComponent,children:[
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
    }
  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CmsRoutingModule { }
