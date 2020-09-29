import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { LocalStorageService } from 'ngx-webstorage';

@Injectable({
  providedIn: 'root',
})
export class AdminPrivileges implements CanActivate {
  isAdminObs: Observable<boolean> = this.auth.isAdmin();

  constructor(private auth: AuthService, private router: Router,private LocalStorageService:LocalStorageService) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.auth.getDecodedAccessToken(this.LocalStorageService.retrieve('token'))?.role != "Admin") {
      this.router.navigate(['NoPrivileges']);
      return false;
    }
    if (this.auth.getDecodedAccessToken(this.LocalStorageService.retrieve('token'))?.role == "Admin") {
      return true;
    }
  }
}
