import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { UserAuth } from 'src/app/Models/UserAuth';
import { catchError, switchMap, take, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { LocalStorageService } from 'ngx-webstorage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in-form',
  templateUrl: './sign-in-form.component.html',
  styleUrls: ['./sign-in-form.component.scss'],
})
export class SignInFormComponent implements OnInit {
  signInForm: FormGroup;
  message: string;
  loading:boolean= false;

  constructor(
    private auth: AuthService,
    private LocalStorageService: LocalStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.LocalStorageService.retrieve('token')) {
      this.auth.isAdmin().pipe(
        tap((isAdmin) => {
          if (isAdmin) {
            this.router.navigate(['projects']);
          } else {
            this.router.navigate(['tasks']);
          }
        })
      ).subscribe();
    }
    this.signInForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  sendData(values: UserAuth) {
    values.username = values.username.trim();
    this.auth
      .login(values)
      .pipe(
        take(1),
        switchMap(() => {
          return this.auth.isAdmin().pipe(
            tap((isAdmin) => {
              if (isAdmin) {
                this.router.navigate(['users']);
              } else {
                this.router.navigate(['tasks']);
              }
            })
          );
        }),
        catchError(
          (err: HttpErrorResponse) => (this.message = err.error.message)
        )
      )
      .subscribe();
  }
}
