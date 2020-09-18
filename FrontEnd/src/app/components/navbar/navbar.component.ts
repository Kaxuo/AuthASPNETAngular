import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  token: string;
  id: any;
  authenticated:boolean = false ;

  constructor(private auth : AuthService, private router:Router) {}

  ngOnInit(): void {
    if (this.token)
    {
      this.authenticated = true;
    }
  }

  logout()
  {
    this.auth.logout()
  }
}
