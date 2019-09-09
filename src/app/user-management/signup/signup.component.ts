import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// ngx-toastr 
import { ToastrService } from 'ngx-toastr';
import { UserManagementService } from 'src/app/services/user-management.service';
// importing JSON files for country names and codes
import countryNames from '../../../assets/json/countryNames.json';
import countryCodes from '../../../assets/json/countryCodes.json';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  public countryNames = countryNames; 
  public countryCodes = countryCodes;  

  public firstName: any;
  public lastName: any;
  public countryCode: any;
  public mobileNumber: any;
  public email: string;
  public password: string;

  constructor(private toastr: ToastrService,
    private appService: UserManagementService,
    private router: Router,
    private cookie: CookieService) { }

  ngOnInit() {
    this.countryCode = "91";
   }

  public signupFunc(country_code) {
    this.countryCode = country_code;

    if (!this.firstName)
      this.toastr.warning("Please enter first name!!");
    else if (!this.lastName)
      this.toastr.warning("Please enter last name!!");
    else if (!this.mobileNumber)
      this.toastr.warning("Please enter mobile number!!");
    else if (!this.email)
      this.toastr.warning("Please enter email address!!");
    else if (!this.password) 
      this.toastr.warning("Please enter password!!"); 
    else if(this.password.length < 8) {
      this.toastr.warning('Password must be at least 8 characters long');
    } 
    else if (!this.countryCode)  
      this.toastr.warning("Please fill in country code!!");
    else {
      let signupData = {
        firstName: this.firstName,
        lastName: this.lastName,
        mobileNumber: this.mobileNumber,
        countryCode: this.countryCode,
        email: this.email,
        password: this.password
      };

      this.appService.signupFunction(signupData).subscribe(
        (response) => {
          console.log(response);
          if (response.status === 200) {
            this.toastr.success('Signup successful');
            this.cookie.put('userId', response.data.userId);
            setTimeout(() => { this.router.navigate(['/uploadAvatar']); }, 1000);
          }

          else
            this.toastr.error(response.message);

        },
        (err) => {
          this.toastr.error('Some error occurred !! Server did not respond.');
        })

        signupData.password = '****';
        console.log(signupData);
    } // end else condition
  } // end signupFunction()
}
