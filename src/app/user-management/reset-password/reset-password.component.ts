import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserManagementService } from 'src/app/services/user-management.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  private userId;
  private authToken;

  constructor(private toastr: ToastrService,
    private appService: UserManagementService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((param) => {
      this.userId = param.id;
      this.authToken = param.token;
      console.log('Inside ngOnInit -> Token from URL = ' + this.authToken);
    })
  }

  public newPassword: string;
  public confirmPassword: string;

  public resetPassword() {
    console.log('Inside resetPassword() -> Token from URL = ' + this.authToken);
    if (!this.newPassword)
      this.toastr.warning("Please enter new password!!");
    else if (this.newPassword.length < 8)
      this.toastr.warning('Password must be at least 8 characters long');
    else if (!this.confirmPassword)
      this.toastr.warning("Please confirm the new password!!");
    else if (this.newPassword !== this.confirmPassword)
      this.toastr.error('Passwords you entered do not match.');
    else {
      let resetData = {
        userId: this.userId,
        password: this.newPassword,
        authToken: this.authToken
      }

      this.appService.resetPasswordFunction(resetData).subscribe(
        (response) => {
          if (response.status === 200) {
            this.toastr.success('Password Reset Successful!!');

            setTimeout(() => { this.router.navigate(['/login']); }, 2000);
          }

          else
            this.toastr.error(response.message);

        }, (err) => {
          this.toastr.error('Some error occurred!!', 'Server did not respond.');
        });
    }
  }


}
