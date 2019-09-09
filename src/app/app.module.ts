/**  ======  Modules  ====== **/

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

import { UserManagementModule } from './user-management/user-management.module';
import { TodoListManagementModule } from './todo-list-management/todo-list-management.module';
// ngx-Toastr Module
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
// Coookie Module
import { CookieModule } from 'ngx-cookie';


/**  ======  Modules  ======  **/

/**  ======  Services  ======  **/
import { UserManagementService } from './services/user-management.service';
import { TodoListManagementService } from './services/todo-list-management.service';
import { SocketService } from './services/socket.service';
/**  ======  Services  ======  **/

/**  ======  Components  ======  **/
import { AppComponent } from './app.component';
/**  ======  Components  ======  **/


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    UserManagementModule,
    TodoListManagementModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added
    CookieModule.forRoot()  // CookieModule added
  ],
  providers: [UserManagementService, TodoListManagementService, SocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
