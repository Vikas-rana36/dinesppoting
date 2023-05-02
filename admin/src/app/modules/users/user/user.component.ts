import { Component, OnInit, ViewChild } from '@angular/core';
import { UtilsService } from '../../../core/services';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2'
import { environment } from '../../../../environments/environment';
import { ExportService } from '../../../core/services/export.service';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  destroy$: Subject<boolean> = new Subject<boolean>();
  @ViewChild('myTable') table: any;
  columns: Array<any>;
  // totalCount: number;
  noRecords = false;
  isActivated = false;
  // itemsPerBatch = 200;
  offset = 0;
  filteredItems: any = [];
  dataList:any = [];
  isLoadMore: boolean;
  filterObj: any = {};
  tableData:any = [];
  loadingIndicator = false;
  currentPage: number = 1;
  totalRecords: number = 0;
  itemsPerPage : number = 10;
  start : number;
  last : number;

  constructor(private utilsService: UtilsService, private exportService: ExportService) { }

  ngOnInit(): void {
    this._fetchListing()
    this._initColumns()
  }

  _initColumns() {    
    this.columns = [ 
      { name: 'First Name', prop: 'first_name', pipe: { transform: this.titleCaseWord }, width: 220, visible: true, sortable: true },
      { name: 'Last Name', prop: 'last_name', pipe: { transform: this.titleCaseWord }, width: 200, visible: true, sortable: true },
      { name: 'Email', prop: 'email', width: 250, visible: true, sortable: true },   
      { name: 'Status', prop: 'is_active', width: 100, visible: true, sortable: true },
      { name: 'Created On', prop: 'createdAt', width: 200, visible: true, sortable: true, type: 'date' },
      { name: 'Updated On', prop: 'updatedAt', width: 200, visible: true, sortable: true, type: 'date' },
      
    ];  
  }

  /**
   * download data into csv file
   * @param filter 
   */
   downloadCSV(){
    console.log("csv download")
    this.utilsService.showPageLoader('Download file');//show page loader
    this.utilsService.processPostRequest('/user/allUsers',{}).pipe(takeUntil(this.destroy$)).subscribe((userResults:any) => {   
      userResults = userResults.data || []
      userResults = this._prepareCSVData(userResults)
      this.exportService.exportToCsv(userResults, 'user-data', Object.keys(userResults[0]));
      // console.log("userResults>>>>>>>>>>>>>>",Object.keys(userResults[0]))
      this.utilsService.hidePageLoader();//hide page loader
    });
   }

  _fetchListing(filter:any=""){
    let apiURL:any="";
    this.utilsService.showPageLoader('Fetching Records');//show page loader
    if(filter){
      apiURL = '/user/listing?search="search"&page='+this.currentPage;
    }else{
      apiURL = '/user/listing?page='+this.currentPage;
    }
    this.utilsService.processPostRequest(apiURL,filter).pipe(takeUntil(this.destroy$)).subscribe((results:any) => {   
      this.totalRecords = results.count;
      this.last         = this.currentPage * this.itemsPerPage;
      if (this.last > this.totalRecords) {
        this.last = this.totalRecords;
      }
      results = results.data || []
      results = this._prepareJobData(results)

      // this.totalCount = results.length
      // this.noRecords = (results.length < this.itemsPerBatch) ? true : false;
      if (this.isLoadMore) {
          this.dataList = this.dataList.concat(results);
      } else {
          this.dataList = results;
      }
      this.dataList = [...this.dataList];            
      this.tableData = this.dataList;
      console.log('tableData',this.tableData);
      this.loadingIndicator = false;
      this.setEmptyMessage();    
      this.utilsService.hidePageLoader();//hide page loader
    })
  }

  pageChangeEvent(count: number){
    this.currentPage  = count;
    this.start        = count * this.itemsPerPage - (this.itemsPerPage-1);
    this.last         = count * this.itemsPerPage;
    if (this.last > this.totalRecords) {
      this.last = this.totalRecords;
    }
    this._fetchListing(this.filterObj);
  }

  _prepareJobData(data:any) {
    const preparedData:any = [];
    if (data) {
        let obj;
        data.forEach((item:any) => {  
            obj = item
            obj['deleted'] = (item.is_deleted)?'Yes':'No'
            //obj['active'] = (item.is_active)?'Yes':'No'                   
            obj['createdAt'] = item.createdAt ? this._changeTimeZone(item.createdAt, '','') : '', 
            obj['updatedAt'] = item.updatedAt ? this._changeTimeZone(item.updatedAt, '','') : '', 
            //obj['dob'] =  item.dob ? this._changeTimeZone(item.dob, '','') : '', 
            preparedData.push(obj);
        });
    }
    return preparedData;
  }

  _prepareCSVData(data:any) {
    const preparedCSVData:any = [];
    if (data) {
        data.forEach((item:any) => {  
          let obj : any = {};
            obj['First Name'] = item.first_name
            obj['Last Name'] = item.last_name
            obj['Email'] = item.email
            obj['Status'] = item.is_active ? 'Active' : 'Inactive'
           
            preparedCSVData.push(obj);
        });
    }
    return preparedCSVData;
  }

  /**
   * To set error message on table if there is no data avaible to show.
   */
   // To set data table Empty message
   setEmptyMessage() {
    const msg = 'No data to display.';
    if (!this.tableData.length) {
      this.tableData = [{
        'message': msg
      }];
      this.tableData[0][this.columns[0]['prop']] = msg;
    } else {
      if (this.tableData[0].hasOwnProperty('message')) {
        this.tableData.shift();
      }
    }
  }

  _changeTimeZone(value:any, timeZone:any, timeZoneAbbr:any) {
    const timeFormat = 'MM/DD/YYYY'   
    const dateFormated = timeZoneAbbr ? this.utilsService.dateFormate(value, timeZone, timeFormat) :this.utilsService.dateFormate(value, timeZone, timeFormat);
    return dateFormated
  }

  filterData(event:any, type:any) {
    if (type === 'date') {
        if (event.value === '') {
            if (this.filterObj[event.input.id + '_temp']) {
                delete this.filterObj[event.input.id];
            }
        } else {
          this.filterObj[event.input.id] = this.utilsService.dateFormate(event.value, '', 'MM/DD/YYYY')
        }      
    } else {
        if (event.target.value === '') {
            delete this.filterObj[event.currentTarget.id];
        } else {
            this.filterObj[event.currentTarget.id] = event.target.value;
        }
    }

    this._fetchListing(this.filterObj);

    if (this.table) {
        this.table['offset'] = 0
    }
    this.setEmptyMessage();
  }

  clearSearch(col:any) {
    this.filterObj[col] = ''
    delete this.filterObj[col];
    this._fetchListing(this.filterObj);
    this.table.offset = 0;
    this.setEmptyMessage();
  }

  onChaneStatus(event:any, row:any) {
    
    console.log("chk event><>>>>>>>>",event)

    this.utilsService.showPageLoader(environment['MESSAGES']['SAVING-INFO']);//show page loader
        this.utilsService.processPostRequest('/user/changeStatus',{id:row._id, status:row.is_active?false:true}).pipe(takeUntil(this.destroy$)).subscribe((response) => {
          if(response){
            this.utilsService.onSuccess(environment.MESSAGES['STATUS-UPDATED']);  
             this._fetchListing();        
          }else{
            Swal.fire('Sorry...', environment.MESSAGES['SYSTEM-ERROR'], 'error')
            return false;
          }
          
        })
  }

  titleCaseWord(word: string) {
    if (!word) return word;
    return word[0].toUpperCase() + word.substr(1).toLowerCase();
  }

}

