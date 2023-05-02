import { ViewportScroller } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { Observable } from 'rxjs';
import { EmitterService } from 'src/app/core/services/emitter.service';
import { UtilsService } from 'src/app/core/services/utils.service';
import { MapsAPILoader } from '@agm/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],

})   
export class HomeComponent implements OnInit {
    @ViewChild("placesRef") placesRef : GooglePlaceDirective;
    @ViewChild('divToScroll') divToScroll: ElementRef;
    proxyUrl = 'https://cors-anywhere.herokuapp.com/'
    
    isLoggedIn : Observable<boolean>;
    restaurantData:any=[]
    totalRestaurants:any
    offset:number=1
    limit=8
    form:FormGroup
    cssRate = 2.6;
    categories:any=[]
    aliasList:any=[]
    selectedCategory:any
    selectedAlias:any
    latitude:any
    longitude:any
    currentLat:any
    currentLong:any
    totalCount:number
    isLocated:Observable<boolean>;
    formatted_address:string;
    searchForm:FormGroup
    selectedAddress:any='San Francisco, CA, USA'
    isSearchFormSubmitted:boolean=false
    myPlaceHolder = "Tacos, Cheap Dinner, Max's"
    search:any=[]
constructor(private emitter:EmitterService,private service:UtilsService,private router:Router,private toastr:ToastrManager,
  private scroller:ViewportScroller,private mapsAPILoader: MapsAPILoader,private meta:Meta,private titleService:Title){

  this.isLocated= this.emitter.isLocated()
  this.titleService.setTitle('Discover Top Rated Restaurants Near You with DineSpotting')
  this.meta.addTags([
    // {name:'keywords',content:'Top Rated Restaurants, restaurants nearby, restaurants reviews, best restaurants near me'},
    {name:'robots',content:'index, follow'},
    {name:'author',content:'Dinespotting'},
    { charset: 'UTF-8' },
    // {name:'description',content:'Dinespotting categorizes the top-rated restaurants and provides DineSpotters with the best reviews & ratings they need before deciding where to eat!'},
  ])
  this.meta.updateTag({name:'keywords',content:'Top Rated Restaurants, restaurants nearby, restaurants reviews, best restaurants near me'})
  this.meta.updateTag({name:'description',content:'Dinespotting categorizes the top-rated restaurants and provides DineSpotters with the best reviews & ratings they need before deciding where to eat!'})
}

      ngOnInit(): void {
        if(localStorage.getItem('currlatitude') && localStorage.getItem('currlongitude') || localStorage.getItem('address')){
          this.currentLat= localStorage.getItem('currlatitude')
          this.currentLong=  localStorage.getItem('currlongitude')
          this.selectedAddress=localStorage.getItem('formatted_address')
         
        }else{
          this.getLocation()
        }
        this.getRestaurants()
        // this.getCategories()
        this.searchForm=new FormGroup({
          category:new FormControl(''),
          location:new FormControl('',Validators.required)
        })
      }
   
    getRestaurants(){
       if(localStorage.getItem('currlatitude') && localStorage.getItem('currlongitude') && localStorage.getItem('formatted_address')){
        this.currentLat= localStorage.getItem('currlatitude')
        this.currentLong=  localStorage.getItem('currlongitude')
        this.formatted_address=localStorage.getItem('formatted_address')
     
       }else{
           this.currentLat= 37.786882
           this.currentLong=  -122.399972
          
        }
        this.service.showPageLoader()
        this.service.processGetRequest(`yelp/searchbylatlng/?lat=${this.currentLat}&long=${this.currentLong}&offset=${this.offset}&limit=${this.limit}&location=${this.formatted_address}`)
        .subscribe(response=>{
          this.service.hidePageLoader()
           this.restaurantData=response.data
           
            this.totalRestaurants=this.restaurantData.length
            this.totalCount=response.count
        })
    }
    
    pageChangeEvent(event:any){
        this.offset = event;
        this.getRestaurants()
    
     
    } 
  
    public handleAddressChange(address: Address) {
        this.formatted_address = address.formatted_address;
        this.currentLat = address.geometry.location.lat();
        this.currentLong = address.geometry.location.lng();
      
        localStorage.setItem('formatted_address',this.formatted_address)
        localStorage.setItem('currlatitude',this.currentLat)
        localStorage.setItem('currlongitude',this.currentLong)
        // Do some stuff
    }
    // getCategories(){
    //     this.service.processGetRequest('/yelp/listCategories')
    //     .subscribe(response=>{
    //      this.categories=response.data
    //      console.log(this.categories)
    //     })
    // }
    customRestaurantsFood = (term:string) => (term);
    searchCategory(e:any){

        this.selectedAlias=e
        // console.log(this.selectedAlias)
        let body={
          searchText:this.selectedAlias.term
        }
        if(body.searchText){

          this.service.processPostRequest('yelp/autocomplete',body)
          .subscribe(res=>{
            this.search=res.data
          })
        }
    }

    onChangCategory(e:any){

   this.selectedCategory=e
   localStorage.setItem('selectedRestaurant',this.selectedCategory)
   }
  
  
    searchRestaurants(){
        // let data={
        // lat:this.latitude,
        // long:this.longitude
        // }
    
        this.isSearchFormSubmitted=true
        if(this.searchForm.valid){

          if(this.selectedCategory){
            this.selectedCategory
          this.selectedCategory= this.selectedCategory.toString()
          
        }
        else{
          this.selectedCategory=''
        }
        this.currentLat=localStorage.getItem('currlatitude')
        this.currentLong=localStorage.getItem('currlongitude')
        

        this.service.processGetRequest(`yelp/searchbylatlng/?term=${this.selectedCategory}&lat=${this.currentLat}&long=${this.currentLong}&location=${this.selectedAddress}`)
        .subscribe(response=>{
          if(response.data.length>0){
            // localStorage.setItem('latitude',data.lat)
            // localStorage.setItem('longitude',data.long)
            this.router.navigate(['/home/search'])
          }else{
             this.toastr.errorToastr('No result found.')
         }
         
        })
      }
    }
    getLocation() {
     
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            if (position) { 
         
          this.currentLat= position.coords.latitude
          this.currentLong=position.coords.longitude
      
          this.emitter.isLocationSelected.next(true)
          // this.isLocated=this.emitter.isLocated()
          // if(this.currentLat && this.currentLong){
          //   this.displayLocation(this.currentLat,this.currentLong)
          // }
          var lat = this.currentLat;
          var lng = this.currentLong;
          this.mapsAPILoader.load().then(()=>{
            let geocoder=new google.maps.Geocoder;
            let latlng={
              lat:Number(this.currentLat),
              lng:Number(this.currentLong)
            }
         const that =this
           geocoder.geocode({
            'location':latlng
           },
           (function (results:any){
            if(results[0]){
            that.selectedAddress=results[3].formatted_address;  
            localStorage.setItem('formatted_address',that.selectedAddress)
            
            }
           
           }))
          })
          if(this.isLocated){
            this.selectedAddress='San Francisco, CA, USA'
            localStorage.setItem('formatted_address','San Francisco, CA, USA')
            localStorage.setItem('currlatitude',JSON.stringify(position.coords.latitude))
            localStorage.setItem('currlongitude',JSON.stringify(position.coords.longitude))
            this.getRestaurants()
           
          }
          
        
          
            }
          },
            (error) =>{
         
               
                this.emitter.isLocationSelected.next(false)
                // this.isLocated=this.emitter.isLocated()
              this.currentLat=37.786882
              this.currentLong=-122.399972
              localStorage.setItem('currlatitude',JSON.stringify(this.currentLat))
              localStorage.setItem('currlongitude',JSON.stringify(this.currentLong))
              localStorage.setItem('formatted_address','San Francisco, CA, USA')
              this.getRestaurants()
           
             
           
            }) 
            
        } else {
          console.log("Geolocation is not supported by this browser.");
        }
      }
      details(data:any){
        this.router.navigate(['/home/details',data.id])
       }
       goToRestaurant(){
        this.scroller.scrollToAnchor('divToScroll')
       }

     
}
