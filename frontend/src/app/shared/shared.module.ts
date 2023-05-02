import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { TimeagoModule } from 'ngx-timeago';
import { PageLoaderComponent } from '../core/component/page-loader/page-loader.component';
import { AgmCoreModule } from '@agm/core';
import { HeaderComponent } from '../core/component/header/header.component';
import { FooterComponent } from '../core/component/footer/footer.component';

@NgModule({
  declarations: [PageLoaderComponent,HeaderComponent,FooterComponent],
  imports: [
    CommonModule,
    SharedRoutingModule,
    SlickCarouselModule,
    TimeagoModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDPyxuva--g-q5CF8ds5P5yzCyRnZ6p08o',
      libraries: ['places']
    })
     
  ],
  exports: [ 
  SlickCarouselModule,
  TimeagoModule,
  PageLoaderComponent,
  AgmCoreModule ,
  HeaderComponent,
  FooterComponent
  ]
})
export class SharedModule { }
