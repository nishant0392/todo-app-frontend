import { Injectable } from '@angular/core';
import { TodoItem } from '../todo-list-management/todo-list/todo-item-interface';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie';

@Injectable({
  providedIn: 'root'
})
export class TodoListManagementService {

  constructor(public http: HttpClient,
    public cookie: CookieService) {
    this.userName = this.cookie.get('userName');
    this.friendAccess = this.cookie.get('friendAccess');
    this.friendId = this.cookie.get('originalId');
    this.friendName = this.cookie.get('originalName');
    this.authToken = this.cookie.get('authToken');
  }

  private baseUrl = "http://api.nishant-kumar.com";
  private userName: string;
  private friendAccess: string;
  private friendId: string;
  private friendName: string;
  private authToken: string;

  /* Save TODO List */
  public saveTodo(userId: string, listName: string, data: string): Observable<any> {

    let params;
    this.friendAccess = this.cookie.get('friendAccess'); // get the updated value

    if (this.friendAccess === "true") {
      params = new HttpParams()
        .set('userId', userId)
        .set('listName', listName)
        .set('TodoList', data)
        .set('userName', this.userName)
        .set('friendAccess', this.friendAccess)
        .set('friendId', this.friendId)
        .set('friendName', this.friendName)
        .set('authToken', this.authToken)
    }

    else {
      params = new HttpParams()
        .set('userId', userId)
        .set('listName', listName)
        .set('TodoList', data)
        .set('authToken', this.authToken)
    }

    return this.http.post(`${this.baseUrl}/api/v1/users/todo/lists`, params);
  }

  /* Add a task to TODO List */
  public addTodo(parentList: TodoItem[], task: string, taskId: any): void {
    let todoObj: TodoItem = {
      id: taskId,
      task: task,
      done: false,
      showChildren: true,
      addItem: false,
      editItem: false,
      children: []
    }
    parentList.push(todoObj);
  }

  /* Save User Lists of TODOS */
  public saveList(userId: string, lists: string): Observable<any> {
    let params;
    this.friendAccess = this.cookie.get('friendAccess'); // get the updated value

    if (this.friendAccess === "true") {
      params = new HttpParams()
        .set('userId', userId)
        .set('lists', lists)
        .set('userName', this.userName)
        .set('friendAccess', this.friendAccess)
        .set('friendId', this.friendId)
        .set('friendName', this.friendName)
        .set('authToken', this.authToken)
    }
    else {
      params = new HttpParams()
        .set('userId', userId)
        .set('lists', lists)
        .set('authToken', this.authToken)
    }

    return this.http.post(`${this.baseUrl}/api/v1/users/todo/savelist`, params);
  }

   /* Delete a TODO List */
   public deleteList(userId: string, listName: string): Observable<any> {
    let params;
    this.friendAccess = this.cookie.get('friendAccess'); // get the updated value

    if (this.friendAccess === "true") {
      params = new HttpParams()
        .set('userId', userId)
        .set('listName', listName)
        .set('userName', this.userName)
        .set('friendAccess', this.friendAccess)
        .set('friendId', this.friendId)
        .set('friendName', this.friendName)
        .set('authToken', this.authToken)
    }
    else {
      params = new HttpParams()
        .set('userId', userId)
        .set('listName', listName)
        .set('authToken', this.authToken)
    }

    return this.http.post(`${this.baseUrl}/api/v1/users/todo/deleteList`, params);
  }

  /* Get a particular TODO List */
  public getTodo(userId: string, listName: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/v1/users/todo/lists/?userId=${userId}&listname=${listName}&authToken=${this.authToken}`);
  }

  /* Get names of all TODO Lists */
  public getAllLists(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/v1/users/todo/allLists/?userId=${userId}&authToken=${this.authToken}`);
  }

  /* Check whether the name is available to choose */
  public isKeyAvailable(List: string[], key: string): boolean {
    let _key = key.toLowerCase();
    for (let i = 0; i < List.length; i++) {
      if (List[i].toLowerCase() === _key)
        return false;
    }
    return true;
  }

} // THE END
