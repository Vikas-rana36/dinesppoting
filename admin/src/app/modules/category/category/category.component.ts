import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UtilsService } from '../../../core/services'
import { FormBuilder, FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2'
import { environment } from '../../../../environments/environment'

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  destroy$: Subject<boolean> = new Subject<boolean>();
  @ViewChild('myTable') table: any;
  filteredItems: any = [];
  loadingIndicator = false;
  noRecords = false;
  dataList:any = [];
  columns: Array<any>;
  itemsPerPage = 10;
  itemsPerBatch = 200;
  offset = 0;
  isLoadMore: boolean;
  noMoreRecords: boolean;
  filterObj: any = {};
  searchArray: any;
  totalCount: number;
  tableData:any = [];
  rows:any = []
  categoryForm: FormGroup;
  formStatus:string = 'Add'
  isFormSubmitted:boolean = false;
  isCollapsed:boolean = true;
  constructor(private utilsService: UtilsService, private formBuilder:FormBuilder) { 
    
  }

  ngOnInit(): void {
    this._fetchListing()
    this._initColumns()
    this._initalizeForm()
  }

  _initalizeForm(){
    this.categoryForm=this.formBuilder.group({     
      id:[null], 
      name: [null, [Validators.required]],
      is_active: [true],
    })
  }
  _initColumns() {    
    this.columns = [           
      { name: 'Name', prop: 'name', width: 250, visible: true, sortable: true },
      { name: 'Is Active', prop: 'active', width: 250, visible: true, sortable: false },   
      { name: 'Created On', prop: 'created', width: 250, visible: true, sortable: true, type: 'date' },
      { name: 'Updated On', prop: 'created', width: 250, visible: true, sortable: true, type: 'date' },
      { name: 'Action', prop: 'Action', width: 100, visible: true, sortable: false},
    ];  
  }

  _fetchListing(){
    this.utilsService.showPageLoader('Fetching Records');//show page loader
   
    this.utilsService.processPostRequest('/category/listing',{}).pipe(takeUntil(this.destroy$)).subscribe((results:any) => {   
      results = results.data || []
      results = this._prepareJobData(results)
      this.totalCount = results.length
      this.noRecords = (results.length < this.itemsPerBatch) ? true : false;
      if (this.isLoadMore) {
          this.dataList = this.dataList.concat(results);
      } else {
          this.dataList = results;
      }
      this.dataList = [...this.dataList];            
      this.filteredItems = this.dataList.slice();
      if (Object.keys(this.filterObj).length > 0 && this.filterObj.constructor === Object) {
        this.tableData = this.filteredItems.filter((item:any) => {
            const notMatchingField = Object.keys(this.filterObj).find(key =>
                this.utilsService.dataTableSearch(item, this.filterObj, key));
            return !notMatchingField;
        });
      } else {
          this.tableData = this.dataList;
      } 
      this.tableData = this.dataList;
      console.log('tableData',this.tableData);
      this.loadingIndicator = false;
      this.setEmptyMessage();    
      this.utilsService.hidePageLoader();//hide page loader
    })
  }
  _prepareJobData(data:any) {
    const preparedData:any = [];
    if (data) {
        let obj;
        data.forEach((item:any) => {  
            obj = item
            obj['deleted'] = (item.is_deleted)?'Yes':'No'
            obj['active'] = (item.is_active)?'Yes':'No'                   
            obj['created'] = item.createdAt ? this._changeTimeZone(item.createdAt, '','') : '',            
            preparedData.push(obj);
        });
    }
    return preparedData;
  }

  _changeTimeZone(value:any, timeZone:any, timeZoneAbbr:any) {
    const timeFormat = 'MM/DD/YYYY'   
    const dateFormated = timeZoneAbbr ? this.utilsService.dateFormate(value, timeZone, timeFormat) :this.utilsService.dateFormate(value, timeZone, timeFormat);
    return dateFormated
  }

  get formRef(){
    return this.categoryForm.controls;
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
        this.tableData = this.filteredItems.filter((item:any) => {
            const notMatchingField = Object.keys(this.filterObj).find(key =>
                this.utilsService.dataTableSearch(item, this.filterObj, key));
            return !notMatchingField;
        });
    } else {
        if (event.target.value === '') {
            delete this.filterObj[event.currentTarget.id];
        } else {
            this.filterObj[event.currentTarget.id] = event.target.value;
        }
        this.tableData = this.filteredItems.filter((item:any) => {
            const notMatchingField = Object.keys(this.filterObj).find(key =>
                this.utilsService.dataTableSearch(item, this.filterObj, key));
            return !notMatchingField;
        });
    }
    if (this.table) {
        this.table['offset'] = 0
    }
    this.setEmptyMessage();
  }

  clearSearch(col:any) {
    this.filterObj[col] = ''
    delete this.filterObj[col];
    this.tableData = this.filteredItems.filter((item:any) => {
        const notMatchingField = Object.keys(this.filterObj).find(key =>
            this.utilsService.dataTableSearch(item, this.filterObj, key));
        return !notMatchingField;
    });
    this.table.offset = 0;
    this.setEmptyMessage();
  }

  cancelEdit(){
    this.categoryForm.reset();
    this.isCollapsed = true;
    this.formStatus = 'Add'
    this.categoryForm.patchValue({is_active:true});
    console.log('value',this.categoryForm.value);
  }

  onSubmit(){
    if (this.categoryForm.invalid) {     
      this.isFormSubmitted= true
      return false;      
    }
    this.utilsService.showPageLoader(environment['MESSAGES']['SAVING-INFO']);//show page loader
    this.utilsService.processPostRequest('/category/add',this.categoryForm.value).pipe(takeUntil(this.destroy$)).subscribe((response) => {
      this.utilsService.onSuccess(environment.MESSAGES['SUCCESSFULLY-SAVED']); 
      this.cancelEdit()
      this._fetchListing()
    })
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

  /**
   * To filter out result based on user input in one of the coloumn of listing.
   * @param event | To determine if method is called from control or from another method.
   * @param type | To determine which type of input is recieved.
   */
   /*filter(event?, type?) {    
    this.tableData = this.data.filter((item) => {
      const notMatchingField = Object.keys(this.filterObj).find((key) =>
        this._utilityService.dataTableSearch(item, this.filterObj, key)
      );
      return !notMatchingField;
    });    
    this.setEmptyMessage();
  }*/

  

  /*Data Table funcation start here*/
  loadMoreRecords() {
    /*this.isLoadMore = true;
    if (this.dataList.length <= this.itemsPerBatch) {
        this.getListing(this.searchArray, this.itemsPerBatch);
    } else {
        this.getListing(this.searchArray, this.dataList.length);
    }*/
  }

  isAllNotesSelected(event:any) {   
    /*if(event.target.checked){
      //this.selectedNotes = this.tableData.map(i => i.id);  
      this.selectedNotes = this.tableData.map(item =>{
        item['isActive'] = 1
        return item;
      });
    }else{
      this.selectedNotes = this.tableData.map(item =>{
        item['isActive'] = 0
        return item;
      });      
    }   */  
  }

  delete(record:any){

    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this record!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',      
    }).then((result) => {
      if (result.value) {
        this.utilsService.showPageLoader(environment['MESSAGES']['SAVING-INFO']);//show page loader
        this.utilsService.processPostRequest('/amenity/deleteAmenity',{id:record._id}).pipe(takeUntil(this.destroy$)).subscribe((response) => {
          if(response){
            this.utilsService.onSuccess(environment.MESSAGES['SUCCESSFULLY-DELETED']); 
            this._deleteResetList(record)
          }else{
            Swal.fire('Sorry...', environment.MESSAGES['CAN-NOT-DELETE'], 'error')
            return false;
          }
          
        })
      } 
    })    
  }

  private _deleteResetList(record:any) {
    const indexOfRecord = this.tableData.findIndex((item:any) => item._id === record._id);
    this.tableData.splice(indexOfRecord, 1);
    this.tableData.unshift(record);    
  }

  edit(record:any){
    // console.log(record)
     this.categoryForm.patchValue({ id: record._id})
     this.categoryForm.patchValue({ name: record.name})
     this.formStatus = 'Update'
     this.isCollapsed = false;
   }

   cancel(){
    this.categoryForm.reset();
    this.categoryForm.patchValue({ id: null, is_active:true})
    this.isCollapsed = false;
    this.formStatus = 'Add'
  }

}
