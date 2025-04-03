export interface Project {
    id: number;
    name: string;
    ownerId: number; 
    boardId:number;
    backlogId:number;
    //userIds: number[];  // Lista korisnika u projektu
    //sprintIds: number[]; // Lista sprintova u projektu
    //boardId: number; // ID table povezan sa projektom
}
