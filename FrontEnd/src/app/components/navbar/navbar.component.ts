import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  token: string = localStorage.getItem('token');
  id: any;
  authenticated: boolean;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {

  }

  logout() {
    this.auth.logout();
  }
}
