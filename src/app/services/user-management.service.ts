import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {

  constructor(public http: HttpClient) { }

  private baseUrl = "http://api.nishant-kumar.com";

  /* Sign Up */
  public signupFunction(signupData): Observable<any> {

    const params = new HttpParams()
      .set('firstName', signupData.firstName)
      .set('lastName', signupData.lastName)
      .set('countryCode', signupData.countryCode)
      .set('mobile', signupData.mobileNumber)
      .set('email', signupData.email)
      .set('password', signupData.password)

    return this.http.post(`${this.baseUrl}/api/v1/users/signup`, params);

  } // end of signupFunction()

  /* Sign In */
  public loginFunction(loginData): Observable<any> {

    const params = new HttpParams()
      .set('email', loginData.email)
      .set('password', loginData.password)

    return this.http.post(`${this.baseUrl}/api/v1/users/login`, params);

  } // end of loginFunction()

  /* Sign Out */
  public signoutFunction(authToken): Observable<any> {

    const params = new HttpParams()
      .set('authToken', authToken)

    return this.http.post(`${this.baseUrl}/api/v1/users/logout`, params);

  } // end of signoutFunction()

  /* Forgot Password */
  public forgotPasswordFunction(email): Observable<any> {

    const params = new HttpParams()
      .set('email', email)

    return this.http.post(`${this.baseUrl}/api/v1/users/forgot-password`, params);

  } // end of forgotPasswordFunction()

  /* Reset Password */
  public resetPasswordFunction(resetData): Observable<any> {

    const params = new HttpParams()
      .set('password', resetData.password)

    return this.http.post(`${this.baseUrl}/api/v1/users/reset-password/${resetData.userId}/${resetData.authToken}`, params);

  } // END resetPasswordFunction()

}
