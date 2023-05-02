import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGaurdGuard } from 'src/app/core/gaurds/auth-gaurd.guard';
import { SearchComponent } from './search/search.component';
import { DetailsPageComponent } from './details-page/details-page.component';

import { HomeComponent } from './home/home.component';
import { HomecomponentComponent } from './homecomponent/homecomponent.component';

const routes: Routes = [  
  {
    path: '',
    component: HomecomponentComponent,   
   
    children:[
 {
    path: '',
    component: HomeComponent,   
   
  },
  {
    path: 'search',
    component: SearchComponent,   
   
  },
  {
    path:'details/:id',
    component:DetailsPageComponent,

  }
    ]
  },
  
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
