import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  animations:[]
})
export class NavbarComponent implements OnInit {
  authenticated: Observable<boolean> = this.auth.isAuthenticated();
  isAdminObs: Observable<boolean> = this.auth.isAdmin();

  constructor(private auth: AuthService) {}

  ngOnInit(): void {}

  logout() {
    this.auth.logout();
  }
}
