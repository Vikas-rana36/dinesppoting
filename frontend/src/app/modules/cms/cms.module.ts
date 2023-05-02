import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CmsRoutingModule } from './cms-routing.module';
import { CmsRootComponent } from './cms-root/cms-root.component';
import { TermsOfServicesComponent } from './terms-of-services/terms-of-services.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AboutComponent } from './about/about.component';
import { TrustSafetyComponent } from './trust-safety/trust-safety.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { ReviewGuidelinesComponent } from './review-guidelines/review-guidelines.component';


@NgModule({
  declarations: [
    CmsRootComponent,
    TermsOfServicesComponent,
    AboutComponent,
    TrustSafetyComponent,
    PrivacyPolicyComponent,
    ReviewGuidelinesComponent,
  ],
  imports: [
    CommonModule,
    CmsRoutingModule,
    SharedModule
  ]
})
export class CmsModule { }
