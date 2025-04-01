import { Column } from "../types/Column";


export interface Board {
    id: number;
    name: string;
    description: string,
    projectId: number,
    activeSprintId: number,
    columns: Column[]
    //userIds: number[];  // Lista korisnika u projektu
    //sprintIds: number[]; // Lista sprintova u projektu
}