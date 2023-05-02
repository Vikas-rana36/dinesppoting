import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PageLoaderService } from '../../services/page-loader.services'

@Component({
  selector: 'app-page-loader',
  templateUrl: './page-loader.component.html',
  styleUrls: ['./page-loader.component.css']
})
export class PageLoaderComponent implements OnInit {
  showLoader: boolean;
  loaderText: string='Wait...';
  constructor(private ref: ChangeDetectorRef, private PageLoaderService: PageLoaderService) { }

  ngOnInit() {
    this.PageLoaderService.pageLoaderStatus.subscribe((val: boolean) => {
      
      this.showLoader = val;
  
      this.ref.detectChanges();
    })
    this.PageLoaderService.getLoaderText().subscribe((text: string) => {

      this.loaderText = 'Wait...';
      this.ref.detectChanges();
    })
    
  }

}
