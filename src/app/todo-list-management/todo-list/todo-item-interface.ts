export interface TodoItem {
      id?: string,
      task: string,
      done: boolean,
      showChildren: boolean,
      addItem: boolean,
      editItem: boolean,
      children: TodoItem[]
}