import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetInfoComponent } from './reset-info/reset-info.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SignOutComponent } from './sign-out/sign-out.component';
import { NotFoundComponent } from './not-found/not-found.component';


@NgModule({
  declarations: [
    HomeComponent,
    SignupComponent,
    LoginComponent,
    ForgotPasswordComponent,
    ResetInfoComponent,
    ResetPasswordComponent,
    SignOutComponent,
    NotFoundComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  exports: [
    HomeComponent,
    SignupComponent,
    LoginComponent,
    ForgotPasswordComponent,
    ResetInfoComponent,
    ResetPasswordComponent,
    SignOutComponent,
    NotFoundComponent
  ]
})
export class UserManagementModule { }
