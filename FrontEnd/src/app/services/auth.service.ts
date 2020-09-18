import { HttpResponse, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { WebRequestService } from './web-request.service';
import { UserRegister } from '../Models/UserRegister';
import { map, shareReplay, tap } from 'rxjs/operators';
import { UserAuth } from '../Models/UserAuth';
import { BehaviorSubject, merge, Observable, of, zip } from 'rxjs';
import {LocalStorageService} from 'ngx-webstorage';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // private authenticated: BehaviorSubject<boolean> = new BehaviorSubject(!!localStorage.getItem('token'));

  constructor(
    private webRequest: WebRequestService,
    private router: Router,
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {}

// Always observe token and return that value
// retrieve on refresh and then observe continously
  isAuthenticated(): Observable<boolean> {
    return merge(
      of(this.localStorageService.retrieve('token')), 
      this.localStorageService.observe('token')
    ).pipe(map((result) => !!result));
    
  }

  getAllUsers() {
    return this.webRequest.getAllUsers('api/users');
  }

  register(payload: UserRegister) {
    return this.webRequest.register(payload).pipe(
      shareReplay(),
      tap((res: HttpResponse<any>) => {
        //this.authenticated.next(true);
        this.setSession(res.body.id, res.body.token);
      })
    );
  }

  login(payload: UserAuth) {
    return this.webRequest.authenticate(payload).pipe(
      shareReplay(),
      tap((res: HttpResponse<any>) => {
        //this.authenticated.next(true);
        this.setSession(res.body.id, res.body.token);
      })
    );
  }

  logout() {
    //this.authenticated.next(false);
    this.removeSession();
    this.router.navigate(['/register']);
  }

  private setSession(userId: string, accessToken: string) {
    this.localStorageService.store('user-id', userId)
    this.localStorageService.store('token', accessToken)
  }

  private removeSession() {
    this.localStorageService.clear('user-id')
    this.localStorageService.clear('token')
  }
}
