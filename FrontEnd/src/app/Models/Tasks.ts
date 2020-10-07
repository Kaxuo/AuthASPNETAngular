export interface Task{
    projectId:number,
    taskId : number,
    createdOn:Date,
    description: string,
    status:string,
    importance:boolean,
    userId:number
}