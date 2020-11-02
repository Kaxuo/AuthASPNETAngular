import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  animations: [],
})
export class NavbarComponent implements OnInit {
  Links: string[] = [
    'Manage',
    'Users',
    'Projects',
    'Tasks',
    'Profile',
    'Update',
  ];

  toSearch: string[] = [];

  authenticated: Observable<boolean> = this.auth.isAuthenticated();
  isAdminObs: Observable<boolean> = this.auth.isAdmin();

  constructor(private auth: AuthService) {}

  ngOnInit(): void {}

  logout() {
    this.auth.logout();
  }

  searchValue(el) {
    let valueToSearch = el.toLocaleLowerCase().trim();
    setTimeout(() => {
      let newTable = this.Links.filter((x) =>
        x.toLocaleLowerCase().includes(valueToSearch)
      );
      this.toSearch = newTable;
    }, 500);
    console.log(this.toSearch);
    console.log(valueToSearch);
  }
}
