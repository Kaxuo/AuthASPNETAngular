import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  authenticated: Observable<boolean> = this.auth.isAuthenticated();
  isAuth: boolean;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authenticated.subscribe((result) => {
      this.isAuth = result
    });
  } 

  logout() {
    this.auth.logout();
  }
}
