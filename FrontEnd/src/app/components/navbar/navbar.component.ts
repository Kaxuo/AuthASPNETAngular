import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LocalStorageService } from 'ngx-webstorage';
import { map, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  authenticated: Observable<boolean> = this.auth.isAuthenticated();
  isAdminObs: Observable<boolean> = this.auth.isAdmin();

  constructor(
    private auth: AuthService,
  ) {}

  ngOnInit(): void {}

  logout() {
    this.auth.logout();
  }
}
