import { Component, EventEmitter, Input, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from 'src/app/core/services/utils.service';
import { forkJoin } from 'rxjs'
@Component({
  selector: 'app-details-page',
  templateUrl: './details-page.component.html',
  styleUrls: ['./details-page.component.css']
})
export class DetailsPageComponent implements OnInit {

  @Input('show-modal') showModal: boolean;
  @ViewChild('slickModal') slickModal: any;
  @Output() init: EventEmitter<{ event: any, slick: any }> = new EventEmitter();
  public $instance: any;
data:any
lat = 51.678418;
lng = 7.809007;
zoom:number=15
detail:any
photo:any=[]
photosLength:any
startDate:any
endDate:any
daylist = ["Sunday","Monday","Tuesday","Wednesday ","Thursday","Friday","Saturday"];
days:any=[]
isOpen:boolean
isClosed:boolean
today:any
hours:any
getHours:any
getEndHours:any
startTime:any=[]
endTime:any=[]
startPrepand:any
endPrepand:any
userReviews:any=[]
totalReviews:any
offset=1
limit=4
slideConfig:any
openedImage:any=[]
slideConfigration:any
multipleHours:any=[]
mulitpleResponse:boolean=false
markers:any=[]
listedDays:any = []
updatedHours:any=[]
googleRatingSearchText:string="";
restaurantData:any=[];
googleRating:number = 0
googleReviewCount:any=0
rating:number= 0
overAllRating:number = 4.5
tripAdvisorRating:number = 4
tripAdvisorReview:number=3420
priceTitle:string="";
  constructor(private activatedRoute: ActivatedRoute,private route:Router,private utilService:UtilsService, private zone: NgZone) {
    this.activatedRoute.params.subscribe((params) => {
     
       this.data=params.id
    
    })
  }

  ngOnInit(): void {
    this.getDetails()
    this.getYelpReviews()   
  }

 
  getDetails(){
    this.utilService.showPageLoader()
    this.utilService.processGetRequest(`yelp/businessDetails/${this.data}`).subscribe(response =>{
  
      this.utilService.hidePageLoader()
      this.detail=response.data
    
      if(this.detail.price == "$"){
        this.priceTitle = "Inexpensive";
      }else if(this.detail.price == "$$"){
        this.priceTitle = "Moderate";
      }else if(this.detail.price == "$$$"){
        this.priceTitle = "Pricey";
      }else if(this.detail.price == "$$$$"){
        this.priceTitle = "Ultra High-End";
      }
      
      this.rating=this.detail.rating
      this.googleRatingSearchText = `${this.detail.alias} ${this.detail.location.address1}`
      this.photosLength=this.detail.photos.length
      this.hours=this.detail.hours[0].open   
      this.hours=this.combinedItems(this.hours) 
      this.isClosed=this.detail.is_closed
      this.lat=this.detail.coordinates.latitude,
      this.lng=this.detail.coordinates.longitude
      this.slideConfig={
        slidesToShow: this.photosLength,
        autoplay: true, 
        arrows: true,
        dots:true
      }
      this.fetchOverallRating()
    })
  }

  getYelpReviews(){
    this.utilService.processGetRequest(`yelp/reviewBusiness/${this.data}`)
    .subscribe(res=>{
 
      this.userReviews=res.data     
      this.totalReviews=this.userReviews.length    
   
    })
  }

  pageChangeEvent(event:any){
    this.offset = event;
    this.getYelpReviews()
 
  } 

  public slickGoTo(index: number) { 
    this.slickModal.slickGoTo(index)

  }
  openImage(detail:any){

    this.openedImage=detail
    if(this.openedImage.photos){
      this.slideConfigration={
        "slidesToShow": 1, 
        "slidesToScroll": 1,
        "arrows": true,
        "dots":true,
        "variableWidth": true,
        "infinite":false,
      
    }
      }
      this.show()
  }
  show(){
    this.showModal=true
  }
  openMap(){
    window.open(`http://www.google.com/maps/place/${this.detail.location.display_address}`,'_blank')

  }
  combinedItems = (arr:any = []) => {
    const res = arr.reduce((acc:any, obj:any) => {
        
      let found = false;
      for (let i = 0; i < acc.length; i++) {
          if (acc[i].day === obj.day) {
            found = true;
          
            acc[i]['hours']=obj;
            
          };
      }
      if (!found) {
      
          acc.push(obj);
      }
      return acc;
    }, []);
    return res;
  }



  fetchOverallRating(){
    let body={
      "querySearch":this.detail.name,
      "phone": this.detail?.phone,
      "latlong":this.lat+','+this.lng
    }
    forkJoin({
      tripAdvisorRating: this.utilService.processPostRequest('/tripAdvisor/reviewRating',body),
      googleRating: this.utilService.processPostRequest(`googleRating/googleReviews`,{searchGoogleRating: this.googleRatingSearchText}),
      yelpRating:this.utilService.processGetRequest(`yelp/businessDetails/${this.data}`)
    }).subscribe(res=>{   
      
       this.tripAdvisorRating=(res?.tripAdvisorRating?.data?.rating)?Number(res?.tripAdvisorRating?.data.rating):0;
       this.tripAdvisorReview=(res?.tripAdvisorRating?.data?.num_reviews)?res?.tripAdvisorRating?.data.num_reviews:0;
       this.googleRating=(res?.googleRating?.data[0]?.rating)?res?.googleRating?.data[0]?.rating:0;
       this.googleReviewCount=(res?.googleRating?.data[0]?.user_ratings_total)?res?.googleRating?.data[0]?.user_ratings_total:0;
     
       this.overAllRating=Math.round((this.googleRating+this.rating + this.tripAdvisorRating)/3* 10)/10
       
       this.utilService.hidePageLoader()   
      // this.overAllRating=4.5
    });
  }
}
