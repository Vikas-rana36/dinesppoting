import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FormGroup, Validators,FormControl } from '@angular/forms';
import { EmitterService } from 'src/app/core/services/emitter.service';
import { UtilsService } from 'src/app/core/services/utils.service';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { ToastrManager } from 'ng6-toastr-notifications';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  data:{}
  latitude:any
  longitude:any
  currentLat:any
  currentLong:any
  selectedAlias:any
  searchForm:FormGroup
  offset:number=1;
  limit:number=8;
  totalCount:number
  markers:any=[];
  open_now:string='both';
  categories:any='category1';
  sort_by:string='best_match';
  totalRestaurants:any;
  categoryList:any=[];
  restaurantData:any=[];
  selectedPrice:any=[];
  max10Categories:any=[];
  selectedCategory:any=[];
  selectedCategoryLable:any=[];
  selectedRestaurant:any=[];
  formatted_address:string;
  selectedRadius:number=null; 
  categoryFilterLimit:number=2;
  maxCategoriesToShow:number=10;
  radiusTab:string="";
  mapLat:number=51.678418;
  mapLong:number=7.809007;
  zoom: number = 12;
  previousInfoWindow:any;
  toggle:boolean = true;
  googleRatingSearchText:string="";
  tripAdvisorRatingSearchText:string="";
  tripAdvisorRatingPhone:string="";
  tripAdvisorRatingLatLong:any;
  isSearchFormSubmitted:boolean=false;
  customRestaurantsCategory = (term:string) => (term);
  search:any=[];
  trip_advisor_rating=3.8
  averageRating=4.5

  constructor(private emitter:EmitterService,private service:UtilsService,private router:Router,private activatedRoute: ActivatedRoute, private toastr:ToastrManager, private zone:NgZone,private vps: ViewportScroller) {
   this.formatted_address = localStorage.getItem('formatted_address');
   this.latitude          = localStorage.getItem('currlatitude');
   this.longitude         = localStorage.getItem('currlongitude');
  //  this.getSelectedCategory();
   this.getSelectedRestaurant();
  } 

  ngOnInit(): void {
    this.getCategories()
    this.searchForm = new FormGroup({
      category:new FormControl(''),
      location:new FormControl('',Validators.required)
    })
  }

  ngAfterContentInit(){
    this.getRestaurants()
  }

  getCategories(){
    this.service.processGetRequest('yelp/allCategories')
    .subscribe(response=>{
      this.categoryList = response.data
      this.max10Categories = response.data.slice(0, 9)
    })
  }

  getRestaurants(){
    this.service.showPageLoader();
      this.service.processGetRequest(`yelp/searchbylatlng/?term=${this.selectedRestaurant}&category=${this.selectedCategory}&lat=${this.latitude}&long=${this.longitude}&price=${this.selectedPrice}&limit=${this.limit}&offset=${this.offset}&sortBy=${this.sort_by}&open_now=${this.open_now}&radius=${this.selectedRadius}&location=${this.formatted_address}`)
    .subscribe(response=>{
      
      this.service.hidePageLoader()
      if(response.data.length>0){

        this.restaurantData = response.data;
 

        this.mapLat =this.restaurantData[0].coordinates.latitude
        this.mapLong =this.restaurantData[0].coordinates.longitude
        
        this.zone.run(() => {
          this.markers = []
         
          this.restaurantData.forEach((element:any, index:any) => {      
            this.markers.push({               
                    lat: element.coordinates.latitude,
                    long: element.coordinates.longitude,
                    name: element.name,  
                    is_closed:element.is_closed,
                    phone:element.display_phone,
                    id:element.id
            });

            if(element.price == "$"){
              this.restaurantData[index]['priceTitle'] = "Inexpensive";
            }else if(element.price == "$$"){
              this.restaurantData[index]['priceTitle'] = "Moderate";
            }else if(element.price == "$$$"){
              this.restaurantData[index]['priceTitle'] = "Pricey";
            }else if(element.price == "$$$$"){
              this.restaurantData[index]['priceTitle'] = "Ultra High-End";
            }

            this.googleRatingSearchText = `${element.alias} ${element.location.address1}`
            this.getGoogleRatingReviews(index, element, this.googleRatingSearchText);

            this.tripAdvisorRatingSearchText  = `${element.name}`;
            this.tripAdvisorRatingPhone       = `${element.phone}`.replace('+',"")
            this.tripAdvisorRatingLatLong     = `${element.coordinates.latitude},${element.coordinates.longitude}`;
            this.getTripAdvisorRatingReviews(index, element, this.tripAdvisorRatingSearchText, this.tripAdvisorRatingPhone, this.tripAdvisorRatingLatLong);
          });
         });
     }else{
        this.restaurantData = [];
        this.toastr.errorToastr('No result found.')
     } 
     this.totalRestaurants = this.restaurantData.length
     this.totalCount = response.count
    })
  }

  getGoogleRatingReviews(index:any, element:any, googleRatingSearchText:any){
    this.service.processPostRequest(`googleRating/googleReviews`,{searchGoogleRating: googleRatingSearchText}).subscribe(response=>{
      if(response){
        this.restaurantData[index]['google_rating'] = (response && response.data && response.data[0] && response.data[0].rating)?response.data[0].rating:0;
        this.restaurantData[index]['google_review_count'] = (response && response.data && response.data[0] && response.data[0].user_ratings_total)?response.data[0
        ].user_ratings_total:0;  
      }
    });
  }

  getTripAdvisorRatingReviews(index:any, element:any, tripAdvisorRatingSearchText:any, tripAdvisorRatingPhone:any, tripAdvisorRatingLatLong:any){
    this.service.showPageLoader()
      this.service.processPostRequest(`tripAdvisor/reviewRating`,{querySearch: tripAdvisorRatingSearchText, phone: tripAdvisorRatingPhone, latlong: tripAdvisorRatingLatLong}).subscribe(response=>{
      this.service.hidePageLoader()
      if(response){
        this.restaurantData[index]['trip_advisor_rating'] = (response.data.rating)?Number(response.data.rating):0;
        this.restaurantData[index]['trip_advisor_review_count'] = (response.data.num_reviews)?response.data.num_reviews:0;
     
      }
  
      this.restaurantData[index]['averageRating'] = Math.round(((element.rating + this.restaurantData[index]['google_rating'] + this.restaurantData[index]['trip_advisor_rating'])/3) * 10) / 10;
    
    });
  }

  pageChangeEvent(event:any){
    this.offset = event;
    this.getRestaurants()
  } 

  details(data:any){
  this.router.navigate(['/home/details',data])
  }
  
  priceFilter(price:any){
    if(!this.selectedPrice.includes(price)){
      this.selectedPrice.push(price);
    }else{
      var index = this.selectedPrice.indexOf(price)
      this.selectedPrice.splice(index,1)
    }
  }

  radiusFilter(radius:any){
    this.selectedRadius = Math.round( radius * 1609.34 );
    this.radiusTab = "radius"+radius;
    if(this.selectedRadius >  40000){
      this.selectedRadius = 40000;
    }
  }

  onChangCategory(e:any){
    this.selectedAlias = e;
    this.selectedCategory = this.selectedAlias;
    localStorage.setItem('selectedCategory', this.selectedCategory)
  }

  
  onChangeRestaurant(e:any){
    this.selectedAlias = e;
    this.selectedRestaurant = this.selectedAlias;
    localStorage.setItem('selectedRestaurant', this.selectedRestaurant)
  }

  public handleAddressChange(address: Address) {
      this.formatted_address = address.formatted_address;
      this.currentLat = address.geometry.location.lat();
      this.currentLong = address.geometry.location.lng();
      
    localStorage.setItem('formatted_address',this.formatted_address)
    localStorage.setItem('currlatitude',this.currentLat)
    localStorage.setItem('currlongitude',this.currentLong)
  }

  searchRestaurants(){
    this.isSearchFormSubmitted=true
    if(this.searchForm.valid){
    // this.getSelectedCategory();
    this.getSelectedRestaurant();
    
    this.latitude   = localStorage.getItem('currlatitude')
    this.longitude  = localStorage.getItem('currlongitude')

    this.service.showPageLoader()
    this.service.processGetRequest(`yelp/searchbylatlng/?term=${this.selectedRestaurant}&category=${this.selectedCategory}&lat=${this.latitude}&long=${this.longitude}&price=${this.selectedPrice}&limit=${this.limit}&offset=${this.offset}&sortBy=${this.sort_by}&open_now=${this.open_now}&radius=${this.selectedRadius}&location=${this.formatted_address}`)
    .subscribe(response=>{
      this.service.hidePageLoader()
      if(response.data.length>0){
        this.restaurantData = response.data
        this.mapLat =this.restaurantData[0].coordinates.latitude
        this.mapLong =this.restaurantData[0].coordinates.longitude

        this.zone.run(() => {
          this.markers = []
          this.restaurantData.forEach((element:any, index:any) => {  
            this.markers.push({               
              lat: element.coordinates.latitude,
              long: element.coordinates.longitude,
              name: element.name,  
              is_closed:element.is_closed,
              phone:element.display_phone,
              id:element.id
            });

            if(element.price == "$"){
              this.restaurantData[index]['priceTitle'] = "Inexpensive";
            }else if(element.price == "$$"){
              this.restaurantData[index]['priceTitle'] = "Moderate";
            }else if(element.price == "$$$"){
              this.restaurantData[index]['priceTitle'] = "Pricey";
            }else if(element.price == "$$$$"){
              this.restaurantData[index]['priceTitle'] = "Ultra High-End";
            }
            
            this.googleRatingSearchText = `${element.alias} ${element.location.address1}`
            this.getGoogleRatingReviews(index, element, this.googleRatingSearchText);

            this.tripAdvisorRatingSearchText  = `${element.name}`;
            this.tripAdvisorRatingPhone       = `${element.phone}`.replace('+',"")
            this.tripAdvisorRatingLatLong     = `${element.coordinates.latitude},${element.coordinates.longitude}`;
            this.getTripAdvisorRatingReviews(index, element, this.tripAdvisorRatingSearchText, this.tripAdvisorRatingPhone, this.tripAdvisorRatingLatLong);
          });
         });

          this.router.navigate(['/home/search'])
      }else{
          window.location.reload();
          this.toastr.errorToastr('No result found.')
      }
      this.totalRestaurants = this.restaurantData.length
      this.totalCount = response.count
    })
  }
}

  getSelectedRestaurant(){
    this.selectedRestaurant = (localStorage.getItem('selectedRestaurant'))?localStorage.getItem('selectedRestaurant'):[]
    this.selectedRestaurant = (this.selectedRestaurant.length)?this.selectedRestaurant.split(','):[]
  }

  categoryFilter(category:any){
    if(!this.selectedCategory.includes(category.alias)){
      this.selectedCategory.push(category.alias);
      this.selectedCategoryLable.push(category);
    }else{
      var index = this.selectedCategory.indexOf(category.alias)
      this.selectedCategory.splice(index,1)
      this.selectedCategoryLable.splice(index,1)
    }
    localStorage.setItem('selectedCategory', this.selectedCategory)
    this.getSelectedRestaurant()
  }

  sortBy(sort_by:any){
    this.sort_by = sort_by;
    this.getRestaurants()
  }

  suggestedFilter(open_now:any){
    this.open_now = open_now;
  }

  checkIfCategoryExist(alias: any): boolean {
    return this.selectedCategory.includes(alias);
  }

  disableCategoryCheckbox(alias: any): boolean {
    return this.selectedCategory.length >= this.categoryFilterLimit && !this.selectedCategory.includes(alias);
  }

  clearAllFilters(){
    this.offset = 1;
    this.radiusTab = "";
    this.open_now = 'both';
    this.selectedPrice = [];
    this.selectedRadius = null;
    this.selectedCategoryLable = [];
    this.selectedCategory = [];
    this.sort_by = 'best_match';
    this.getRestaurants()
  }
  
  scrollToSpecificLocation(id:any,infoWindow:any){
    this.vps.scrollToAnchor(id);
    if (this.previousInfoWindow) {
      this.previousInfoWindow.close();
    }
    this.previousInfoWindow = infoWindow;
  }

  toggleClassForFilter(){
    this.toggle = !this.toggle;
  }

  searchCategory(e:any){
    this.selectedAlias=e
    let body={
      searchText:this.selectedAlias.term
    }
    this.service.processPostRequest('yelp/autocomplete',body)
    .subscribe(res=>{
        this.search=res.data
      // if(res.data){
      //   this.search=res.data
      // }else{
      //   this.search=this.selectedAlias.term
      // }
    })
  }

}
