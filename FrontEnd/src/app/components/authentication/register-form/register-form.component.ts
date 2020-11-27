import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { UserRegister } from '../../../Models/UserRegister';
import { Router } from '@angular/router';
import { first, take, tap } from 'rxjs/operators';
import { LocalStorageService } from 'ngx-webstorage';
import { ChatService } from 'src/app/services/chat.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss'],
})
export class RegisterFormComponent implements OnInit {
  registerForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    username: ['', [Validators.required, Validators.pattern(/^\S*$/)]],
    password: ['', Validators.required],
    number: ['', Validators.required],
    city: ['', Validators.required],
    country: ['', Validators.required],
    hobby: ['', Validators.required],
  });
  message: string;
  clicked: boolean = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private LocalStorageService: LocalStorageService,
    private chatService: ChatService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    if (this.LocalStorageService.retrieve('token')) {
      this.auth
        .isAdmin()
        .pipe(
          tap((isAdmin) => {
            if (!isAdmin) {
              this.router.navigate(['tasks']);
            } else {
              this.router.navigate(['projects']);
            }
          })
        )
        .subscribe();
    }
  }

  sendData(values: UserRegister) {
    this.auth
      .register(values)
      .pipe(first())
      .subscribe(
        (res: HttpResponse<any>) => {
          this.chatService
            .CreateAccount({
              username: values.username.toLocaleLowerCase(),
              password: '12345',
              firstname: values.firstName,
              lastName: values.lastName,
            })
            .pipe(
              take(1),
              tap((data: any) => {
                this.LocalStorageService.store('mongoID', data.body.id);
              })
            )
            .subscribe();
          this.router.navigate(['profile']);
        },
        (err: HttpErrorResponse) => (this.message = err.error.message)
      );
  }
}
