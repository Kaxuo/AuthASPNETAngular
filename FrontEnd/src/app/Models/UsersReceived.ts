export interface UserReceived{
    id:number;
    firstName:string,
    lastName:string,
    username:string,
    number:number,
    city:string,
    country:string,
    hobby:string,
    role:string,
    tasks: Tasks[]
}

interface Tasks {
    taskId:number;
    description:string;
    completed:boolean;
    important:boolean;
}