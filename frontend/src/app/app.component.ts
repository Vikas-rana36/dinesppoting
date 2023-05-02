import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { NavigationStart, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { EmitterService } from './core/services/emitter.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'dine-spotting';
  showHeaderFooter:boolean=false
  schema ={
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "DineSpotting",
    "slogan": "Find the best restaurant easily",
    "description": "Dinespotting categorizes the top-rated   restaurants and provides DineSpotters with the best reviews &   ratings they need before deciding where to eat.",
    "url": "https://dinespotting.com/",
    "logo": "https://dinespotting.com/assets/img/logo.svg",
    "foundingDate": "2022",
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "contact@dinespotting.com",
      "areaServed": "US",
      "availableLanguage": "en"
    },
    "sameAs": [
      "https://www.facebook.com/Dinespotting/",
      "https://twitter.com/DineSpotting",
      "https://www.instagram.com/dinespotting/",
      "https://www.linkedin.com/in/DineSpotting/",
      "https://www.youtube.com/@dinespotting",
      "https://www.pinterest.com/dinespotting/"
    ]
  }
    
  constructor(private router:Router,public emitter:EmitterService,private meta:Meta,private titleService:Title){ 
  

  // this.titleService.setTitle('Discover Top Rated Restaurants Near You with DineSpotting')
  // this.meta.addTags([
  //   {name:'keywords',content:'Top Rated Restaurants, restaurants nearby, restaurants reviews, best restaurants near me'},
  //   {name:'description',content:'Dinespotting categorizes the top-rated restaurants and provides DineSpotters with the best reviews & ratings they need before deciding where to eat!'},
  //   {name:'robots',content:'index, follow'},
  //   {name:'author',content:'Dinespotting'},
  //   { charset: 'UTF-8' },

  // ])

  // this.meta.addTag({name:'keywords',content:'Angular 14'})
    this.router.events.subscribe(event => {
      if(event instanceof NavigationStart) {
        console.log(event.url)
       if(event.url.includes('/login') || event.url.includes('signup') || event.url.includes('/forgot-password') || event.url.includes('/reset-password') || event.url.includes('/verify')){
    
        this.showHeaderFooter=false
       }else{
        this.showHeaderFooter=true
      
       }
      }
    })
}
}