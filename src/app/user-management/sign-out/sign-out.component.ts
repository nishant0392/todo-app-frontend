import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserManagementService } from 'src/app/services/user-management.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-sign-out',
  templateUrl: './sign-out.component.html',
  styleUrls: ['./sign-out.component.css']
})
export class SignOutComponent implements OnInit {

  constructor(private toastr: ToastrService,
    private appService: UserManagementService,
    private cookie: CookieService,
    private router: Router) { }

  ngOnInit() {
    this.signout();
  }

  public signout() {
    let authToken = this.cookie.get('authToken');
    this.appService.signoutFunction(authToken).subscribe((response) => {
      if (response.status === 200) {
        this.cookie.remove('userId');
        this.cookie.remove('authToken');
        this.cookie.remove('userName');

        /* For Friend Access Management */
        this.cookie.remove('originalId');
        this.cookie.remove('originalName');
        this.cookie.remove('friendAccess');
        
        this.toastr.success('Logged Out successfully!!');
        setTimeout(() => this.router.navigate(["/"]), 1000)
      }
      else {
        this.toastr.error(response.message)
        setTimeout(() => this.router.navigate(["/"]), 1000)
      }
    }, (err) => {
      console.log(err)
      this.toastr.error('Some error occurred')
    });
  }
}
