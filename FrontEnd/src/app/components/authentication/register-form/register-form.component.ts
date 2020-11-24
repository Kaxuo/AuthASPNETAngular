import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { UserRegister } from '../../../Models/UserRegister';
import { Router } from '@angular/router';
import { first, take, tap } from 'rxjs/operators';
import { LocalStorageService } from 'ngx-webstorage';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss'],
})
export class RegisterFormComponent implements OnInit {
  registerForm: FormGroup;
  message: string;
  clicked: boolean = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private LocalStorageService: LocalStorageService,
    private chatService: ChatService
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
    this.registerForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      username: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\S*$/),
      ]),
      password: new FormControl('', [Validators.required]),
      number: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      country: new FormControl('', [Validators.required]),
      hobby: new FormControl('', [Validators.required]),
    });
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
