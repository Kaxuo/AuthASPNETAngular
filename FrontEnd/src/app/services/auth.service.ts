import { HttpResponse, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { WebRequestService } from './web-request.service';
import { UserRegister } from '../Models/UserRegister';
import { shareReplay, tap } from 'rxjs/operators';
import { UserAuth } from '../Models/UserAuth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private webRequest: WebRequestService,
    private router: Router,
    private http: HttpClient
  ) {}

  getAllUsers() {
    return this.webRequest.getAllUsers('api/users');
  }

  register(payload: UserRegister) {
    return this.webRequest.register(payload).pipe(
      shareReplay(),
      tap((res: HttpResponse<any>) => {
        this.setSession(res.body.id, res.body.token);
      })
    );
  }

  login(payload: UserAuth) {
    return this.webRequest.authenticate(payload).pipe(
      shareReplay(),
      tap((res:HttpResponse<any>) => {
        this.setSession(res.body.id,res.body.token);
      })
    )
  }

  logout() {
    this.removeSession();
    this.router.navigate(['/register']);
  }

  private setSession(userId: string, accessToken: string) {
    localStorage.setItem('user-id', userId);
    localStorage.setItem('token', accessToken);
  }

  private removeSession() {
    localStorage.removeItem('user-id');
    localStorage.removeItem('token');
  }
}
