import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie';
import { UserManagementService } from 'src/app/services/user-management.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(private toastr: ToastrService,
    private cookie: CookieService,
    private appService: UserManagementService,
    private router: Router) { }

  ngOnInit() { }

  public email: any;
  public password: any;

  public loginFunc() {
    if (!this.email)
      this.toastr.warning("Please enter email address!!");
    else if (!this.password)
      this.toastr.warning("Please enter password!!");
    else {
      let loginData = {
        email: this.email,
        password: this.password
      };

      console.log(loginData.email);

      this.appService.loginFunction(loginData).subscribe(
        (apiResponse) => {
          if (apiResponse.status === 200) {
            console.log(apiResponse)

            /* Set Cookies */ 
            this.cookie.put('authToken', apiResponse.data.authToken);

            this.cookie.put('userId', apiResponse.data.userDetails.userId);

            this.cookie.put('userName', apiResponse.data.userDetails.firstName + ' ' + apiResponse.data.userDetails.lastName);

            this.toastr.success('Login successful');

            setTimeout(() => { this.router.navigate(['/todo']); }, 2000);
          }

          else
            this.toastr.error(apiResponse.message);

        }, (err) => {
          this.toastr.error('Some error occurred!!', 'Server did not respond.');
        });
    }
  }
}
