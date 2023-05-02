import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor(private meta:Meta,private title:Title) {
  //   this.meta.addTags([{name:'keywords',content:'Focus Keyword restaurant reviews website, Best rated restaurants, best restaurants nearby'},
  // {name:'description',content:'Discover the most popular food places at Dinespotting! A restaurant review website to browse trusted ratings and explore the best–rated restaurants near you. '}])
  this.title.setTitle('Best Restaurants Reviews and Ratings | DineSpotting')
  this.meta.updateTag({name:'keywords',content:'Restaurant reviews website, Best rated restaurants, best restaurants nearby'})
  this.meta.updateTag({name:'description',content:'Discover the most popular food places at Dinespotting! A restaurant review website to browse trusted ratings and explore the best–rated restaurants near you.'})
 }

  ngOnInit(): void {
  }

}
