import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClientsComponent } from './clients/clients.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ClientRoutingModule } from './client-routing.module';
import { CoreModule } from '../../core/core.module';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

@NgModule({
  declarations: [ClientsComponent],
  imports: [
    CommonModule,
    NgxDatatableModule,
    CoreModule,
    ClientRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    OwlDateTimeModule, 
    OwlNativeDateTimeModule
  ]
})
export class ClientModule { }
