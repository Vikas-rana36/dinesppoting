import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customTime'
})
export class CustomTimePipe implements PipeTransform {
  daylist = ["Sunday","Monday","Tuesday","Wednesday ","Thursday","Friday","Saturday"];
  today:any = new Date();
  day = this.today.getDay();

  transform(value?:any,prepand?:any){
   value = value.split('')
   var date = value.splice(2,0,':')
   value = value.join('')
   prepand = value.substring(0,2)
   var minutes = value.substring(3,5)
   var startPrepand = (prepand >= 12)? " PM ":" AM ";
   prepand = (prepand >= 12)? prepand - 12: prepand;

    if (prepand==='00' && startPrepand===' AM ') { 
        if (minutes===0){ 
          prepand=12;
          startPrepand=' Midnight';
        } else { 
          prepand=12;
          startPrepand=' AM';
        } 
    } 
   if (prepand===0 && startPrepand===' PM ') { 
      if (minutes===0){ 
        prepand=12;
        startPrepand=' Noon';
      } else  { 
        prepand=12;
        startPrepand=' PM';
      } 
   } 
   
   var timeToDisplay = `${prepand}:${minutes}`
   return timeToDisplay+startPrepand
  
  }

}
