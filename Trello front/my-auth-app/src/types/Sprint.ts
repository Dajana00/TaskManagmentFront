export enum SprintStatus{
    Backlog = "Backlog", 
    Active = "Active",
    Completed = "Completed",
    Archived = "Archived"
}
export interface Sprint{
    id: number,
    name: string,
    status: SprintStatus,
    startDate: Date,
    endDate: Date,
    projectId: number
}