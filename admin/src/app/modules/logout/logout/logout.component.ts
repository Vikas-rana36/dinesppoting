import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { ToastrManager } from 'ng6-toastr-notifications';//toaster class
import Swal from 'sweetalert2'

//import services
import { AuthService } from '../../../core/services'
import { environment } from '../../../../environments/environment'

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(private router: Router, private authService:AuthService, private toastrManager:ToastrManager) { }

  ngOnInit(): void {    
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to logout now',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',      
    }).then((result) => {
      if (result.value) {
        this.toastrManager.successToastr(environment.MESSAGES['SUCCESSFULLY-LOGOUT'], 'Success!');//showing success toaster
        localStorage.removeItem('loggedin-adminId');
        localStorage.clear();
        this.authService.isLoggedIn(false, '');
        this.router.navigate(['/auth']);
      }else{
        this.router.navigate(['/user-listing']);
      }
    })
  }

}
