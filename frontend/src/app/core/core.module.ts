import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreRoutingModule } from './core-routing.module';

import { FormValidatorsErrorsComponent } from './component/form-validators-errors/form-validators-errors.component';
import { HeaderComponent } from './component/header/header.component';
import { FooterComponent } from './component/footer/footer.component';
import { CustomTimePipe } from './Directives/custom-time.pipe';
  

@NgModule({
  declarations: [

    FormValidatorsErrorsComponent,
     HeaderComponent,
     FooterComponent,
     CustomTimePipe
  ],
  imports: [
    CommonModule,
    CoreRoutingModule
  ],
  exports:[
    FormValidatorsErrorsComponent,
    HeaderComponent,FooterComponent
  ]
})
export class CoreModule { }
