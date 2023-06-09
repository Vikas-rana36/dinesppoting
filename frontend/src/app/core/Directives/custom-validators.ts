import { ValidationErrors, ValidatorFn, AbstractControl } from '@angular/forms';

export class CustomValidators {


  static passwordMatchValidator(control: AbstractControl) {
   
    const password: string = control.get('password').value; // get password from our password form control
    const confirmPassword: string = control.get('confirm_password').value; // get password from our confirmPassword form control
    // compare is the password math
    if (password !== confirmPassword) {
      // if they don't match, set an error in our confirmPassword form control
      control.get('confirm_password').setErrors({ NoPassswordMatch: true });
    } else {
      control.get('confirm_password').setErrors(null);
    }
  }

  static patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        // if control is empty return no error
        return null;
      }

      // test the value of the control against the regexp supplied
      const valid = regex.test(control.value);

      // if true, return no error (no error), else return error passed in the second parameter
      return valid ? null : error;
    };
  }

  static passwordEmailOrNameValidator(control: AbstractControl) {
    const password: string = control.get('password').value; // get password from our password form control
    const email: string = control.get('email').value; // get password from our confirmPassword form control
    const first_name: string = control.get('first_name').value; // get password from our confirmPassword form control
    // compare is the password math
    if (password === email) {
      // if they don't match, set an error in our confirmPassword form control
      control.get('password').setErrors({ NoPassswordMatchWithEmailOrName: true });
    }else{
      control.get('password').setErrors({ NoPassswordMatchWithEmailOrName: false });
    }
  }

//   static creditCardExpiryValidator(control: AbstractControl) {
//     let today, someday;
//     const expiryMonth: string = control.get('expiry_month').value;
//     const expiryYear: string = control.get('expiry_year').value;
//     if(expiryMonth && expiryYear){
//       today = new Date();
//       someday = new Date();
//       someday.setFullYear(expiryYear, expiryMonth, 1);
//       if (someday < today) {
//         control.get('expiry_month').setErrors({ creditCardExpired: true });      
//       }else{
//         control.get('expiry_month').setErrors(null);   
//       }
//     }  
//   }

}