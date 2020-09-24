import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserRegister } from '../Models/UserRegister';
import { UserAuth } from '../Models/UserAuth';
import { SingleUser } from '../Models/SingleUser';
import { UpdateUser } from '../Models/UpdateUser';

@Injectable({
  providedIn: 'root',
})
export class WebRequestService {
  readonly ROOT_URL;

  constructor(private http: HttpClient) {
    this.ROOT_URL = 'http://localhost:5000';
  }

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

  DeleteTask(url: string) {
    return this.http.delete(`${this.ROOT_URL}/${url}`);
  }
}
