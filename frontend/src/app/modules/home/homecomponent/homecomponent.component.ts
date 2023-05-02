import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { EmitterService } from 'src/app/core/services/emitter.service';
import { UtilsService } from 'src/app/core/services/utils.service';

@Component({
  selector: 'app-homecomponent',
  templateUrl: './homecomponent.component.html',
  styleUrls: ['./homecomponent.component.css']
})
export class HomecomponentComponent implements OnInit {
  isLoggedIn : any;
  constructor(private emitter:EmitterService,private service:UtilsService) {
    // this.isLoggedIn = this.emitter.isLoggedIn();
    this.emitter.isLoginSubject.subscribe(
      res=>{
      
        this.isLoggedIn=res
      }
    )
   }

  ngOnInit(): void {
  }

}
