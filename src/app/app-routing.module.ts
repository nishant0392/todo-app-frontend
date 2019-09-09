import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './user-management/home/home.component';
import { SignupComponent } from './user-management/signup/signup.component';
import { LoginComponent } from './user-management/login/login.component';
import { SignOutComponent } from './user-management/sign-out/sign-out.component';
import { ForgotPasswordComponent } from './user-management/forgot-password/forgot-password.component';
import { ResetInfoComponent } from './user-management/reset-info/reset-info.component';
import { ResetPasswordComponent } from './user-management/reset-password/reset-password.component';
import { NotFoundComponent } from './user-management/not-found/not-found.component';
import { TodoListComponent } from './todo-list-management/todo-list/todo-list.component';
import { TodoItemComponent } from './todo-list-management/todo-item/todo-item.component';
import { InviteFriendsComponent } from './todo-list-management/invite-friends/invite-friends.component';
import { MyFriendsComponent } from './todo-list-management/my-friends/my-friends.component';
import { UploadAvatarComponent } from './user-management/upload-avatar/upload-avatar.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent, pathMatch: 'full' },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'signup', component: SignupComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'sign-out', component: SignOutComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-info', component: ResetInfoComponent },
  { path: 'reset-password/:id/:token', component: ResetPasswordComponent },
  { path: 'uploadAvatar', component: UploadAvatarComponent },
  { path: 'todo', component: TodoListComponent },
  { path: 'todo-item', component: TodoItemComponent },
  { path: 'invite-friend', component: InviteFriendsComponent },
  { path: 'my-friends', component: MyFriendsComponent },
  { path: '*', component: NotFoundComponent },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
