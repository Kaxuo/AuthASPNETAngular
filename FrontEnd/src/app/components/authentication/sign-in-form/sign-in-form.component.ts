import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { UserAuth } from 'src/app/Models/UserAuth';
import { catchError, switchMap, take, tap } from 'rxjs/operators';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { LocalStorageService } from 'ngx-webstorage';
import { Router } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-sign-in-form',
  templateUrl: './sign-in-form.component.html',
  styleUrls: ['./sign-in-form.component.scss'],
})
export class SignInFormComponent implements OnInit {
  signInForm: FormGroup;
  message: string;
  loading: boolean = false;
  he: boolean = true;
  // test = new BehaviorSubject<number>(0);

  constructor(
    private auth: AuthService,
    private LocalStorageService: LocalStorageService,
    private router: Router,
    private chatService: ChatService
  ) {}

  ngOnInit(): void {
    if (this.LocalStorageService.retrieve('token')) {
      this.auth
        .isAdmin()
        .pipe(
          tap((isAdmin) => {
            if (isAdmin) {
              this.router.navigate(['projects']);
            } else {
              this.router.navigate(['assignTasks']);
            }
          })
        )
        .subscribe();
    }
    this.signInForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
    // setInterval(() => {
    //   this.test.next(this.testB++)
    // }, 2000);

    // this.test.pipe(tap(console.log)).subscribe()
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
      
    this.chatService
      .GetAllUserMongo()
      .pipe(take(1))
      .subscribe((users: any) => {
        if (users.find((x) => x.username == values.username.toLowerCase())) {
          this.chatService
            .Log(values.username.toLocaleLowerCase())
            .pipe(
              take(1),
              tap((data: any) =>
                this.LocalStorageService.store('mongoID', data.body.id)
              )
            )
            .subscribe((res: HttpResponse<any>) => {
              console.log(res);
            });
        } else {
          this.chatService
            .CreateAccount({
              username: values.username.toLocaleLowerCase(),
              password: '12345',
              firstname: 'Default',
              lastName: 'Default',
            })
            .pipe(
              take(1),
              tap((data: any) => {
                this.LocalStorageService.store('mongoID', data.body.id);
              })
            )
            .subscribe();
        }
      });
  }
}
