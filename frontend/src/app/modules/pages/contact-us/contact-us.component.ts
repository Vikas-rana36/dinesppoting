import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilsService } from 'src/app/core/services/utils.service';
import { environment } from 'src/environments/environment';
import { FormValidatorsErrorsComponent } from 'src/app/core/component/form-validators-errors/form-validators-errors.component';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {
  contactForm:FormGroup
  isFormSubmit:boolean=false
  constructor(private utilService:UtilsService,private toastr:ToastrManager) { }

  ngOnInit(): void {
    this.contactForm=new FormGroup({
      first_name:new FormControl('',[Validators.required,Validators.pattern('^[a-zA-Z \-\']+')]),
      last_name:new FormControl('',[Validators.required,Validators.pattern('^[a-zA-Z \-\']+')]),
      email:new FormControl('',[Validators.required,Validators.email, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$")]),
      message:new FormControl('',Validators.required),
    })
  }
  onSubmit(){
    if(this.contactForm.invalid){
    this.isFormSubmit=true
    return
    }
    this.utilService.showPageLoader()
    this.utilService.processPostRequest('contact/contactus',this.contactForm.value)
    .subscribe(res=>{
    this.utilService.hidePageLoader()
    console.log(res)
    if(res && res.responseCode == 200){

      this.toastr.successToastr('Your request has been submitted to administrator.Our team will get back to you soon.')
      this.contactForm.reset()
      }
    }
   )}
}
