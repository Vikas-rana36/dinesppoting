import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminAuthGuardService } from './core/guards/admin-auth-guard.service';

const routes: Routes = [  
  {
    path: '',
    loadChildren: () => import('./modules/Auth/auth.module').then(m => m.LoginModule),
    data: {
      customLayout: true,
      title: 'Login'  
    }
  },
  {
    path: 'auth',
    loadChildren: () => import('./modules/Auth/auth.module').then(m => m.LoginModule),
    data: {
      customLayout: true,
      title: 'Login'  
    }
  },
  {
    path: 'user-listing',
    canActivate: [AdminAuthGuardService], 
    loadChildren: () => import('./modules/users/users.module').then(m => m.UsersModule),
    data: { 
      title: 'User Listing',
      customLayout: false 
    }       
  },
  {
    path: 'profile',
    canActivate: [AdminAuthGuardService], 
    loadChildren: () => import('./modules/profile/profile.module').then(m => m.ProfileModule),
    data: { 
      title: 'Profile',
      customLayout: false 
    }       
  },
  {
    path: 'change-password',
    canActivate: [AdminAuthGuardService], 
    loadChildren: () => import('./modules/change-password/change-password.module').then(m => m.ChangePasswordModule),
    data: { 
      title: 'Change Password',
      customLayout: false 
    }       
  },
  {
    path: 'logout',
    canActivate: [AdminAuthGuardService], 
    loadChildren: () => import('./modules/logout/logout.module').then(m => m.LogoutModule),
    data: { 
      title: 'Sign Out',
      customLayout: false 
    }       
  },
  /*{
    path: 'clients',
    canActivate: [AdminAuthGuardService], 
    loadChildren: () => import('./modules/client/client.module').then(m => m.ClientModule),
    data: { 
      title: 'Client Listing',
      customLayout: false 
    }       
  },
  {
    path: 'appointments',
    canActivate: [AdminAuthGuardService], 
    loadChildren: () => import('./modules/appointment/appointment.module').then(m => m.AppointmentModule),
    data: { 
      title: 'Appointment Listing',
      customLayout: false 
    }       
  },*/
  {
    path: '**',
    canActivate: [AdminAuthGuardService], 
    loadChildren: () => import('./modules/page-not-found/page-not-found.module').then(m => m.PageNotFoundModule),  
    data: { 
      title: 'Sorry!! Page Not Found.' ,
      customLayout: false 
    }
  }

  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
