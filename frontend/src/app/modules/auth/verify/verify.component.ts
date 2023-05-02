import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UtilsService } from 'src/app/core/services/utils.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})
export class VerifyComponent implements OnInit {
  id:any
  token:any  
  constructor(private activatedRoute: ActivatedRoute,private service:UtilsService) { 
    this.activatedRoute.params.subscribe((params) => {
      this.id=params.id
      this.token=params.token
  
      })
  }

  ngOnInit(): void {
    this.service.processGetRequest(`auth/verify/${this.id}/${this.token}`)
  .subscribe(response=>{
  })

}
}
