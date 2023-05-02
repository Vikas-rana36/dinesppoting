// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiBaseUrl:'https://api.dinespotting.com/',
  yelpApi:'https://api.yelp.com',
  currentLat:37.786882,
  currentLong:-122.399972,
  MESSAGES:{
    "LOGIN-SUCCESS":"You are logged in successfully.",
    "LOGOUT-SUCCESS":"Your account has been logged out successfully.",
    "REGISTERED-SUCCESSFULLY":"We have sent you verification email. Please check your email.",    "PASSWORD-UPDATED":"Password has been updated successfully.",
    "EMAIL-SENT":"We have sent the password reset instructions to your email ID.",
    "PROFILE-IMAGE-NOT-UPLOADED":"Please upload your profile image.",
    "PROFILE-IMAGE-SIZE-ERROR":"Please upload image under 200KB",
    "INVALID-PROFILE-IMAGE":"Invalid image format. Please try again.",
    "PROFILE-UPDATE-SUCCESS":"Great! Profile has been updated successfully.",
    "SAVED-SUCCESSFULLY":"Your information has been saved successfully." 
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
