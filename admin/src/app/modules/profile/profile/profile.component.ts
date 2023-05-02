import { Component, OnInit, ViewChild } from '@angular/core';
import { UtilsService } from '../../../core/services';
import { FormBuilder, FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  
  destroy$: Subject<boolean> = new Subject<boolean>();
  noRecords = false;
  isActivated = false;
  isProfileFormSubmitted:boolean = false;
  profileForm: FormGroup;
  dataList:any = [];
  adminId:any;

  constructor(private utilsService: UtilsService, private formBuilder:FormBuilder) { }

  ngOnInit(): void {
    this.adminId = localStorage.getItem("loggedin-adminId")
    this._fetchListing(this.adminId)
    this. _initalizeProfileForm()
  }

  _initalizeProfileForm(){
    this.profileForm = this.formBuilder.group({     
      id:[null], 
      first_name: [null, [Validators.required]],
      last_name: [null, [Validators.required]],
      phone_number: [null, [Validators.required]],
      email: [null, [Validators.required]],
      is_active: [true],
    })
  }

  _fetchListing(id:any){
    this.utilsService.showPageLoader('Fetching Records');//show page loader
    
    this.utilsService.processPostRequest('/auth/adminInfo',{userID:id}).pipe(takeUntil(this.destroy$)).subscribe((results:any) => {   
      results = results.data || []
      this.profileForm.patchValue({ id: results._id})
      this.profileForm.patchValue({ first_name: results.first_name})
      this.profileForm.patchValue({ last_name: results.last_name})
      this.profileForm.patchValue({ phone_number: results.phone_number})
      this.profileForm.patchValue({ email: results.email})      
      this.utilsService.hidePageLoader();//hide page loader
    })
  }


  get formRef(){
    return this.profileForm.controls;
  }

  onEditSubmit(){
    if (this.profileForm.invalid) {     
      this.isProfileFormSubmitted= true
      return false;      
    }

    let profileFormData = this.profileForm.value;
    // console.log("profile formdata>>>>>>>>>>",this.profileForm.value)
    this.utilsService.showPageLoader(environment['MESSAGES']['SAVING-INFO']);//show page loader
      this.utilsService.processPostRequest('/auth/adminedit',this.profileForm.value).pipe(takeUntil(this.destroy$)).subscribe((response:any) => {
        // console.log("response edit profile>>>>>>>>",response)
        this._fetchListing(this.profileForm.value.id)
        //this.utilsService.onSuccess(environment.MESSAGES['SUCCESSFULLY-SAVED']); 
      })

  }

  _changeTimeZone(value:any, timeZone:any, timeZoneAbbr:any) {
    const timeFormat = 'MM/DD/YYYY'   
    const dateFormated = timeZoneAbbr ? this.utilsService.dateFormate(value, timeZone, timeFormat) :this.utilsService.dateFormate(value, timeZone, timeFormat);
    return dateFormated
  }

  titleCaseWord(word: string) {
    if (!word) return word;
    return word[0].toUpperCase() + word.substr(1).toLowerCase();
  }
}
