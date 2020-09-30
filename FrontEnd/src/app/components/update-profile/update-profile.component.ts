import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { LocalStorageService } from 'ngx-webstorage';
import { UpdateUser } from 'src/app/Models/UpdateUser';
import jwt_decode from 'jwt-decode';
import { UserReceived } from 'src/app/Models/UsersReceived';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.scss'],
})
export class UpdateProfileComponent implements OnInit {
  single: UserReceived;
  registerForm: FormGroup;
  message: string;
  object = this.auth.decryptedAndDecodedToken()

  constructor(
    private auth: AuthService,
    private router: Router,
    private LocalStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    if (!this.LocalStorageService.retrieve('token')) {
      this.router.navigate(['register']);
    }
    this.auth
      .getOne(this.object.unique_name)
      .subscribe((data: UserReceived) => {
        this.single = data;
        this.registerForm = new FormGroup({
          firstName: new FormControl(this.single.firstName, [
            Validators.required,
          ]),
          lastName: new FormControl(this.single.lastName, [
            Validators.required,
          ]),
          username: new FormControl(this.single.username, [
            Validators.required,
          ]),
          number: new FormControl(this.single.number, [Validators.required]),
          city: new FormControl(this.single.city, [Validators.required]),
          country: new FormControl(this.single.country, [
            Validators.required,
          ]),
          hobby: new FormControl(this.single.hobby, [Validators.required]),
        });
      });
  }

  sendData(values: UpdateUser) {
    this.auth
      .editUser(this.object.unique_name, values)
      .pipe(take(1))
      .subscribe(
        (res: HttpResponse<any>) => {
          this.router.navigate(['profile']);
        },
        (err: HttpErrorResponse) => (this.message = err.error.message)
      );
  }

  getDecodedAccessToken(token: string): any {
    try {
      var decoded = jwt_decode(token);
      return decoded;
    } catch (Error) {
      return null;
    }
  }
}
