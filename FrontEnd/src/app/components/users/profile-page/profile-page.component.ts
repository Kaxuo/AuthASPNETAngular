import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { UserReceived } from 'src/app/Models/UsersReceived';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
})
export class ProfilePageComponent implements OnInit {
  loading: boolean;
  propertyEditable: any;
  form: FormGroup;
  message: string;
  object = this.auth.decryptedAndDecodedToken();

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.auth
      .getOne(this.object.unique_name)
      .pipe(take(1))
      .subscribe((res: UserReceived) => {
        this.form = new FormGroup({});
        // Instance of this.data
        this.propertyEditable = {};
        Object.keys(res).map((key) => {
          // Create a edit property
          this.propertyEditable[key] = false;
          // Add each controller to the form
          this.form.addControl(
            key,
            new FormControl(res[key], [Validators.required])
          );
          this.loading = false;
        });
      });
  }

  sendData(property: string) {
    let updatedUser = {};
    updatedUser[property] = this.form.get(property).value;
    this.auth
      .editUser(this.object.unique_name, updatedUser)
      .pipe(take(1))
      .subscribe(
        (res: HttpResponse<any>) => {
          this.propertyEditable[property] = false;
          this.message = '';
          this.router.navigate(['profile']);
        },
        (err: HttpErrorResponse) => (this.message = err.error.message)
      );
  }
}
