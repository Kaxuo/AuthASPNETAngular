export interface Task{
    projectId?:number,
    user?:string,
    taskId? : number,
    createdOn?:Date,
    description?: string,
    status?:string,
    importance?:boolean,
    userId?:number
}