import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserManagementService } from 'src/app/services/user-management.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  constructor(private toastr: ToastrService,
    private appService: UserManagementService,
    private router: Router) { }

  ngOnInit() { }

  public email: any;

  public forgotPassword() {
    if (!this.email)
      this.toastr.warning("Please enter email address!!");
    else {
      let email = this.email;

      console.log(email);

      this.appService.forgotPasswordFunction(email).subscribe(
        (response) => {
          if (response.status === 200) {
            this.toastr.success('Password Reset instructions has been sent to your mail.');

            setTimeout(() => { this.router.navigate(['reset-info']); }, 2000);
          }

          else
            this.toastr.error(response.message);

        }, (err) => {
          this.toastr.error('Some error occurred!!', 'Server did not respond.');
        });
    }
  }

}
