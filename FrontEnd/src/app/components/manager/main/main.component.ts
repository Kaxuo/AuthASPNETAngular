import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { UserReceived } from '../../../Models/UsersReceived';
import { catchError, take, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { LocalStorageService } from 'ngx-webstorage';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  token: Observable<boolean> = this.auth.isAuthenticated();
  id: number = this.auth.getDecodedAccessToken(
    this.LocalStorageService.retrieve('token')
  ).unique_name;
  data: UserReceived[];

  constructor(
    private auth: AuthService,
    private router: Router,
    private LocalStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.token.subscribe((isAuth) => {
      if (isAuth) {
        this.auth
          .getAllUsers()
          .pipe(take(1))
          .subscribe((res: UserReceived[]) => {
            this.data = res;
          });
      } else {
        this.router.navigate(['signin']);
      }
    });
  }

  UserDetail(el) {
    this.router.navigate([`/manage/users/${el.id}`]);
  }
}
