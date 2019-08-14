import { Component, OnInit, OnDestroy } from '@angular/core';
import { TodoListManagementService } from 'src/app/services/todo-list-management.service';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie';
import { Router } from '@angular/router'

import { TodoItem } from './todo-item-interface';
import { SocketService } from 'src/app/services/socket.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements TodoItem, OnInit, OnDestroy {

  public id: string;
  public task: string;
  public done: boolean;
  public showChildren: boolean;
  public addItem: boolean;
  public editItem: boolean;
  public children: TodoItem[];

  constructor(
    public appService: TodoListManagementService,
    public socketService: SocketService,
    public toastr: ToastrService,
    public cookie: CookieService,
    public router: Router) {

    if (this.cookie.get('originalId'))
      this.friendId = this.cookie.get('originalId');

    /* RESET */
    this.userId = this.cookie.get('userId');
    this.userName = this.cookie.get('userName');
    this.lists = [];
    this.listName = "";
    this.showLists = false;
    this.deleteMode = false;
    this.Items = [];

  } // END constructor()

  ngOnInit() {
    this.checkStatus();
    /* SET with default TODO List */
    this.getAllLists();

    this.listenToOwnId();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


  public friendId: string;

  /* Placeholder for User's TODO */
  public userId: string;
  public userName: string;
  public lists: string[];
  public listName: string;
  public showLists: boolean;
  public deleteMode: boolean;
  public Items: TodoItem[];

  private subscription: Subscription;

  /* Check whether the User is authorized or not */
  public checkStatus() {
    let authToken = this.cookie.get('authToken');
    if (authToken === null || authToken === undefined || authToken === "") {
      this.toastr.error("Authorization Token Missing");
      this.router.navigate(['/login']);
    }
  }

  /* *** Listen to own ID event *** */
  public listenToOwnId() {

    this.subscription = this.socketService.subscribeToDataService()
      .subscribe((data: any) => {

        console.log("Received data from OwnID event:", data)
        if (!data) return;

        if (this.socketService.isUsed && data.opcode !== 'TODO_MODIFIED' && data.opcode !== 'TODOLISTS_MODIFIED') return;

        if (data.opcode === 'REQUEST') {
          this.toastr.info(data.senderName, 'New Friend Request:')
        }
        else if (data.opcode === 'ACCEPTED') {
          this.toastr.success(data.receiverName, 'You are now a FRIEND to:')
        }
        else if (data.opcode === 'REJECTED') {
          this.toastr.info(data.receiverName, 'Friend Request rejected by:')
        }
        else if (data.opcode === 'REMOVED') {
          this.toastr.info(data.friendName, 'You have been removed by your friend:');
        }
        else if (data.opcode === 'TODO_MODIFIED') {
          if (this.cookie.get('friendAccess') === 'true') return;

          if (this.listName === data.listName) {
            this.appService.getTodo(this.userId, this.listName)
              .subscribe((response) => {
                if (response.status === 200) {
                  this.Items = response.data;
                }
              })
          }
          this.toastr.info(data.friendName, `Your List '${data.listName}' was modified by your friend:`);
        }
        else if (data.opcode === 'TODOLISTS_MODIFIED') {
          if (this.cookie.get('friendAccess') === 'true') return;

          this.appService.getAllLists(this.userId)
            .subscribe((response) => {
              if (response.data)
                this.lists = response.data;
            })
          this.toastr.info(data.friendName, `NEW List added by your friend:`);
        }
        else {
          console.log("Unknown opcode");
          return;
        }
        // set the flag 'isUsed'
        this.socketService.isUsed = true;
      }) // END Subcription

  } // END listenToOwnId()


  deleteUserAccount(password: string) {
    if (!password)
      this.toastr.warning('Please enter password')
    else {
      this.socketService.deleteUserAccount(this.userId, password)
        .subscribe((response) => { 
          if (response.status === 200) {

            this.cookie.remove('userId');
            this.cookie.remove('authToken');
            this.cookie.remove('userName');

            this.toastr.success('Your Account has been successfully deleted !!');
            setTimeout(() => this.router.navigate(["/"]), 1000)
          }
          else {
            this.toastr.error(response.message)
          }
        }, (err) => {
          console.log(err)
          this.toastr.error('Some error occurred')
        })
    }
  } // END deleteAccount()

  /******  ========  TODO Functionalities ======== ******/

  /* Create a TODO List */
  createList(listName: string): void {
    if (this.appService.isKeyAvailable(this.lists, listName)) {
      this.listName = listName;
      this.lists.push(listName);
      this.Items = [];
      this.appService.saveList(this.userId, JSON.stringify(this.lists))
        .subscribe((response) => {
          if (response.status === 200) {
            this.toastr.success(listName, "New List Created:");
          }
          else
            this.toastr.error(response.message);
        })
    }
    else {
      this.toastr.error('List already exists');
    }
  }

  /* Get all Lists */
  getAllLists() {
    this.appService.getAllLists(this.userId).subscribe((response) => {
      console.log(response)
      if (response.data) {
        this.lists = response.data;
        this.listName = this.lists[this.lists.length-1];  // last TODO List created (default)
        this.appService.getTodo(this.userId, this.listName).subscribe((response) => {
          if (response.data)
            this.Items = response.data;
          else
            this.Items = [];  
        })
      }
    })
  }

  /* Load/Delete a TODO List */
  loadOrDeleteList(listName: string): void {
    if(this.deleteMode) {
      this.appService.deleteList(this.userId, listName)
      .subscribe((response) => {
        console.log(response)
        if (response.status === 200 || response.status === 404) {
          this.toastr.success("List deleted", listName);
          this.getAllLists();
        }
        else {
          this.toastr.error(response.message);
        }
      })
    } // END delete List
    else {
      this.appService.getTodo(this.userId, listName)
      .subscribe((response) => {
        console.log(response)
        if (response.status === 200) {
          this.Items = response.data;
          this.listName = listName;
          this.toastr.success(listName, "List Loaded:");
        }
        else if (response.status === 404) {
          this.Items = [];
          this.listName = listName;
          this.toastr.info('List is Empty', listName);
        }
        else {
          this.toastr.error(response.message);
        }
      })
    }  // END load List
  } // END loadOrDeleteList()

  /* ADD to a TODO List */
  addTodo(task: string): void {
    if (!task)
      this.toastr.info("No Task to add !!");
    else if (!this.listName)
      this.toastr.info(" Create List !!", "No List selected");
    else {
      let newId = this.Items.length + 1;
      this.appService.addTodo(this.Items, task, newId);
      console.log(this.Items);
      this.appService.saveTodo(this.userId, this.listName, JSON.stringify(this.Items))
        .subscribe((response) => {
          if (response.status === 200)
            this.toastr.success('New Task added')
          else
            this.toastr.error(response.message);
          console.log("Response received:")
          console.log(response);
        })
    }
  }

  /* Back to Self */
  public backToSelf() {
    this.friendId = "";
    this.cookie.remove('friendAccess');
    this.cookie.put('userId', this.cookie.get('originalId'));
    this.cookie.remove('originalId');
    this.cookie.put('userName', this.cookie.get('originalName'));
    this.cookie.remove('originalName');
    this.router.navigate(['/todo-item'])
    setTimeout(() => { this.router.navigate(['/todo']); }, 100);
  }

}
