import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { LocalStorageService } from 'ngx-webstorage';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { UserReceived } from 'src/app/Models/UsersReceived';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
})
export class ProfilePageComponent implements OnInit {
  token: Observable<boolean> = this.auth.isAuthenticated();
  data: UserReceived;
  constructor(
    private auth: AuthService,
    private LocalStorageService: LocalStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    let object = this.getDecodedAccessToken(this.LocalStorageService.retrieve('token'))
    this.token.subscribe((isAuth) => {
      if (isAuth) {
        this.auth
          .getOne(object.unique_name)
          .pipe(take(1))
          .subscribe((res: UserReceived) => {
            this.data = res;
          });
      } else {
        this.router.navigate(['register']);
      }
    });
  }
  getDecodedAccessToken(token: string): any {
    try {
      var decoded = jwt_decode(token)
      return decoded
    } catch (Error) {
      return null;
    }
  }
}
