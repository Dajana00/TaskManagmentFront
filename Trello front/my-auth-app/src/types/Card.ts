
export enum Status {
    Backlog = "Backlog",
    ToDo = "ToDo",
    InProgress = "InProgress",
    QA = "QA",
    Done = "Done",
    Archived = "Archived",
  }
  
export interface Card{

    id: number,
    title:string,
    description: string,
    dueDate: Date,
    status: Status,
    userStoryId: number
} 