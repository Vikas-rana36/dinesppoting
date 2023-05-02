export const adminLteConf = {
  skin: 'blue',
  // isSidebarLeftCollapsed: false,
  // isSidebarLeftExpandOnOver: false,
  // isSidebarLeftMouseOver: false,
  // isSidebarLeftMini: true,
  // sidebarRightSkin: 'dark',
  // isSidebarRightCollapsed: true,
  // isSidebarRightOverContent: true,
  layout: 'normal',
  sidebarLeftMenu: [
    /*{label: 'Dashboard', route: '/dashboard', iconClasses: 'fa fa-dashboard'},

    {label: 'Main Features', separator: true},
    {label: 'Client Listing', route: 'clients', iconClasses: 'fa fa-user'},
    {label: 'Appointment Listing', route: 'appointments', iconClasses: 'fa fa-user'},
    {label: 'Billing Listing', route: 'category-listing', iconClasses: 'fa fa-user'},

    {label: 'Reports', separator: true},
    {label: 'Generate report', route: 'home/profile', iconClasses: 'fa fa-tasks'},*/

    {label: 'Listing NAVIGATION', separator: true},    
    // {label: 'Category Listing', route: 'category-listing', iconClasses: 'fa fa-user'},
    {label: 'Users Listing', route: '/user-listing', iconClasses: 'fa fa-user'},
    /*{label: 'Treatment Listing', route: 'category-listing', iconClasses: 'fa fa-user'},
    {label: 'Allergy Listing', route: 'category-listing', iconClasses: 'fa fa-user'},   
    {label: 'Role Listing', route: 'category-listing', iconClasses: 'fa fa-user'},  
    {label: 'Staff Listing', route: 'category-listing', iconClasses: 'fa fa-user'}, 
    {label: 'Package Listing', route: 'category-listing', iconClasses: 'fa fa-user'},*/
    

    {label: 'Other Actions', separator: true},
    {label: 'Profile', route: '/profile', iconClasses: 'fa fa-tasks'},
    {label: 'Change Password', route: '/change-password', iconClasses: 'fa fa-key'},
    {label: 'Log Out', route: '/logout', iconClasses: 'fa fa-sign-out'},
   
    /*{label: 'Other Actions', separator: true},
    {label: 'Profile', route: 'home/profile', iconClasses: 'fa fa-tasks'},
    {label: 'Change Password', route: 'home/change-password', iconClasses: 'fa fa-tasks'},*/
  ]
};
