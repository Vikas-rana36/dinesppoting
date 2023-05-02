import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'string'
})
export class StringPipe implements PipeTransform {

  transform(value:any): any {
 
    if(value.length>21){
     return value.slice(0,21).concat('...')
    //  return value.splice(22,0,'...')
    }else{
     return value
    }

    
  }

}
