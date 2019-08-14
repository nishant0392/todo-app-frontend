import { Component, OnInit, Input } from '@angular/core';
import { TodoItem } from '../todo-list/todo-item-interface';
import { TodoListManagementService } from 'src/app/services/todo-list-management.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css']
})
export class TodoItemComponent implements OnInit {

  constructor(
    public appService: TodoListManagementService,
    public toastr: ToastrService) { }

  ngOnInit() {
  }
 
 
  @Input() userId: string;
  @Input() treeData: TodoItem[];
  @Input() originalItems: TodoItem[];
  @Input() listName: string;

  /* ADD to a TODO List */
  addSubTodo(parentItem: TodoItem, subtask: string) {
    if (!subtask)
      this.toastr.info("No Task to add !!");
    else {
      let childObj: TodoItem = {
        id: parentItem.id + "-" + (parentItem.children.length + 1),
        task: subtask,
        done: false,
        showChildren: true,
        addItem: false,
        editItem: false,
        children: []
      };
      parentItem.children.push(childObj);
      parentItem.showChildren = true;  // In case, user accidentally sets it to false 
      this.appService.saveTodo(this.userId, this.listName, JSON.stringify(this.originalItems))
        .subscribe((response) => {
          if (response.status === 200)
            console.log('New Task added')
          else
            this.toastr.error(response.message);
          console.log("Response received:")
          console.log(response);
        })
    }
  }

  /* EDIT a TODO List */
  editTodo(todoItem, task) {
    if (!task)
      this.toastr.info("No Task to update !!");
    else {
      todoItem.task = task;
      this.appService.saveTodo(this.userId, this.listName, JSON.stringify(this.originalItems))
        .subscribe((response) => {
          if (response.status === 200)
            this.toastr.success('Task Updated !!')
          else
            this.toastr.error(response.message);
          console.log("Response received:")
          console.log(response);
        })
    }
  }

  /* Toggle between show/hide children */
  toggleCollapse(todoItem) {
    todoItem.showChildren = !todoItem.showChildren;
  }

  /* Toggle between show/hide Add Item Input */
  toggleAddItem(todoItem) {
    if (todoItem.editItem)
      this.toggleEditItem(todoItem);
    todoItem.addItem = !todoItem.addItem;
  }

  /* Toggle between show/hide Edit Item Input */
  toggleEditItem(todoItem) {
    if (todoItem.addItem)
      this.toggleAddItem(todoItem);
    todoItem.editItem = !todoItem.editItem;
  }

  /* Toggle between checked/unchecked Task */
  toggleChecked(todoItem) {
    let newState = !todoItem.done;
    todoItem.done = newState;
    this.checkRecursive(todoItem.children, newState);
    this.appService.saveTodo(this.userId, this.listName, JSON.stringify(this.originalItems))
      .subscribe((response) => {
        if (response.status !== 200)
          this.toastr.error(response.message);
        console.log("Response received:")
        console.log(response);
      })
  }

  /* Checks/unchecks all its children */
  checkRecursive(todoItem, state) {
    todoItem.forEach(childObj => {
      childObj.done = state;
      this.checkRecursive(childObj.children, state);
    });
  }

  /* DELETE a Task from TODO List */
  deleteTodo(todoItem) {
    console.log(todoItem)
    for (let i = 0; i < this.treeData.length; i++) {
      if (this.treeData[i] === todoItem) {
        this.treeData.splice(i, 1)
        break;
      }
    }
    this.appService.saveTodo(this.userId, this.listName, JSON.stringify(this.originalItems))
      .subscribe((response) => {
        if (response.status === 200)
          this.toastr.success('Deletion successful')
        else
          this.toastr.error(response.message);
        console.log("Response received:")
        console.log(response);
      })
  }
  
} // END Class
