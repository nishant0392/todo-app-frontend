import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TodoListComponent } from './todo-list/todo-list.component';
import { TodoItemComponent } from './todo-item/todo-item.component';
import { InviteFriendsComponent } from './invite-friends/invite-friends.component';
import { MyFriendsComponent } from './my-friends/my-friends.component';


@NgModule({
  declarations: [TodoListComponent, TodoItemComponent, InviteFriendsComponent, MyFriendsComponent],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    TodoListComponent, 
    TodoItemComponent,
    InviteFriendsComponent,
    MyFriendsComponent
  ]
})
export class TodoListManagementModule { }
