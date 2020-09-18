import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserAuth } from 'src/app/Models/UserAuth';
import { take } from 'rxjs/operators';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in-form',
  templateUrl: './sign-in-form.component.html',
  styleUrls: ['./sign-in-form.component.scss'],
})
export class SignInFormComponent implements OnInit {
  signInForm: FormGroup;
  message: string;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (localStorage.getItem('token')) {
      this.router.navigate(['/']);
    }
    this.signInForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  sendData(values: UserAuth) {
    this.auth
      .login(values)
      .pipe(take(1))
      .subscribe(
        (res: HttpResponse<any>) => {
          if (res.status === 200) {
            this.router.navigate(['/']);
          }
        },
        (err: HttpErrorResponse) => this.message = err.error.message
      );
  }
}
