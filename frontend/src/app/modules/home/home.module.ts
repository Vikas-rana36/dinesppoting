import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';


import { HomeComponent } from './home/home.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BarRatingModule } from 'ngx-bar-rating';
import { HomecomponentComponent } from './homecomponent/homecomponent.component';
import { DetailsPageComponent } from './details-page/details-page.component';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomTimePipe } from 'src/app/core/Directives/custom-time.pipe';
import { GoogleMapsAngularModule } from 'google-maps-angular';
import { StringPipe } from 'src/app/core/Directives/string.pipe';

import { SearchComponent } from './search/search.component';



  
@NgModule({
  declarations: [HomeComponent, HomecomponentComponent, DetailsPageComponent,CustomTimePipe, SearchComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    NgxPaginationModule,
    FormsModule,
    BarRatingModule,
    GooglePlaceModule,
    NgSelectModule ,
    SharedModule,
    NgbModule,
    ReactiveFormsModule
  ],
  exports:[CustomTimePipe]
})
export class HomeModule { }
