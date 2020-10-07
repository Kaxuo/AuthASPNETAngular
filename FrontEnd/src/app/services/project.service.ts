import { Injectable } from '@angular/core';
import { Project } from '../Models/Project';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  constructor(private webRequest: WebRequestService) {}

  // Projects //
  getAllProjects() {
    return this.webRequest.getAllProjects('api/projects');
  }

  addProject(payload: Project){
    return this.webRequest.AddProject('api/projects/add', payload)
  }

  deleteProject(id){
    return this.webRequest.DeleteProject(`api/projects/${id}`)
  }
}
