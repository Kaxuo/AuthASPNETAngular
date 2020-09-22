import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { LocalStorageService } from 'ngx-webstorage';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { UserReceived } from 'src/app/Models/UsersReceived';
import jwt_decode from 'jwt-decode';
import { FormControl, FormGroup, Validators, ValidatorFn } from '@angular/forms';
import { UpdateUser } from 'src/app/Models/UpdateUser';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
})
export class ProfilePageComponent implements OnInit {
  token: Observable<boolean> = this.auth.isAuthenticated();
  data: UserReceived;
  firstName: FormGroup;
  lastName: FormGroup;
  username: FormGroup;
  number: FormGroup;
  country: FormGroup;
  city: FormGroup;
  hobby: FormGroup;
  message: string;
  object = this.getDecodedAccessToken(
    this.LocalStorageService.retrieve('token')
  );
  firstNameedit: boolean = false;
  lastNameEdit: boolean = false;
  usernameEdit: boolean = false;
  numberEdit: boolean = false;
  CountryEdit: boolean = false;
  CityEdit: boolean = false;
  hobbyEdit: boolean = false;

  constructor(
    private auth: AuthService,
    private LocalStorageService: LocalStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.token.subscribe((isAuth) => {
      if (isAuth) {
        this.auth
          .getOne(this.object.unique_name)
          .pipe(take(1))
          .subscribe((res: UserReceived) => {
            this.data = res;
            this.firstName = new FormGroup({
              firstName: new FormControl(this.data.firstName, [
                Validators.required,
              ]),
            });
            this.lastName = new FormGroup({
              lastName: new FormControl(this.data.lastName, [
                Validators.required,
              ]),
            });
            this.username = new FormGroup({
              username: new FormControl(this.data.username, [
                Validators.required, Validators.pattern(/^\S*$/)
              ]),
            });
            this.number = new FormGroup({
              number: new FormControl(this.data.number, [
                Validators.required,
              ]),
            });
            this.country = new FormGroup({
              country: new FormControl(this.data.country, [
                Validators.required,
              ]),
            });
            this.city = new FormGroup({
              city: new FormControl(this.data.city, [Validators.required]),
            });
            this.hobby = new FormGroup({
              hobby: new FormControl(this.data.hobby, [Validators.required]),
            });
          });
      } else {
        this.router.navigate(['register']);
      }
    });
  }
  getDecodedAccessToken(token: string): any {
    try {
      var decoded = jwt_decode(token);
      return decoded;
    } catch (Error) {
      return null;
    }
  }

  

  sendData(values) {
    console.log(values);
    this.auth
      .editUser(this.object.unique_name, values)
      .pipe(take(1))
      .subscribe(
        (res: HttpResponse<any>) => {
          this.router.navigate(['profile']);
          if (values.firstName) {
            this.data.firstName = values.firstName;
            this.firstNameedit = false;
          }
          if (values.lastName) {
            this.data.lastName = values.lastName;
            this.lastNameEdit = false;
          }

          if (values.username) {
            this.data.username = values.username;
            this.usernameEdit = false;
          }

          if (values.country) {
            this.data.country = values.country;
            this.CountryEdit = false;
          }
          if (values.city) {
            this.data.city = values.city;
            this.CityEdit = false;
          }
          if (values.hobby) {
            this.data.hobby = values.hobby;
            this.hobbyEdit = false;
          }
          if (values.number) {
            this.data.number = values.number;
            this.numberEdit = false;
          }
          this.message = ""

        },
        (err: HttpErrorResponse) => (this.message = err.error.message)
      );
  }
}
