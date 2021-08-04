import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserRegister } from '../models/UserRegister';
import { UserAuth } from '../models/UserAuth';
import { UpdateUser } from '../models/UpdateUser';
import { Task } from '../models/Tasks';
import { Project } from '../models/Project';

@Injectable({
  providedIn: 'root',
})
export class WebRequestService {
  readonly ROOT_URL;

  constructor(private http: HttpClient) {
    // this.ROOT_URL = 'https://localhost:5001';
    this.ROOT_URL = 'https://taskmanagerchatapplication.azurewebsites.net';
  }

  // Users //

  getAllUsers(url: string) {
    return this.http.get(`${this.ROOT_URL}/${url}`);
  }

  getOneUser(url: string, id: number) {
    return this.http.get(`${this.ROOT_URL}/api/users/${id}`);
  }

  register(payload: UserRegister) {
    return this.http.post(`${this.ROOT_URL}/api/users/register`, payload, {
      observe: 'response',
    });
  }

  authenticate(payload: UserAuth) {
    return this.http.post(`${this.ROOT_URL}/api/users/authenticate`, payload, {
      observe: 'response',
    });
  }

  editUser(url: string, payload: Partial<UpdateUser>) {
    return this.http.put(`${this.ROOT_URL}/${url}`, payload);
  }

  deleteUser(url: string) {
    return this.http.delete(`${this.ROOT_URL}/${url}`);
  }

  getAllTasks(url: string) {
    return this.http.get(`${this.ROOT_URL}/${url}`);
  }

  // Projects //

  getAllProjects(url: string) {
    return this.http.get(`${this.ROOT_URL}/${url}`);
  }

  getOneProject(url: string, id: number) {
    return this.http.get(`${this.ROOT_URL}/${url}/${id}`);
  }

  AddProject(url: string, payload: Project) {
    return this.http.post(`${this.ROOT_URL}/${url}`, payload);
  }

  EditProject(url: string, payload: Task) {
    return this.http.put(`${this.ROOT_URL}/${url}`, payload);
  }

  DeleteProject(url: string) {
    return this.http.delete(`${this.ROOT_URL}/${url}`);
  }

  // Tasks //

  getOneTask(url: string) {
    return this.http.get(`${this.ROOT_URL}/${url}`);
  }

  AddTask(url: string, payload: Task) {
    return this.http.post(`${this.ROOT_URL}/${url}`, payload);
  }

  EditTasks(url: string, payload: Task) {
    return this.http.put(`${this.ROOT_URL}/${url}`, payload);
  }

  DeleteTask(url: string) {
    return this.http.delete(`${this.ROOT_URL}/${url}`);
  }

}
