import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  animations: [],
})
export class NavbarComponent implements OnInit {
  Links: any[] = [
    { name: 'Manage', link: '/projects' },
    { name: 'Users', link: '/users' },
    { name: 'Projects', link: '/assignTasks' },
    { name: 'Tasks', link: '/tasks' },
    { name: 'Profile', link: '/profile' },
    { name: 'Update', link: '/update' },
  ];

  toSearch: any[] = [
    { name: 'Manage', link: '/projects' },
    { name: 'Users', link: '/users' },
    { name: 'Projects', link: '/assignTasks' },
    { name: 'Tasks', link: '/tasks' },
    { name: 'Profile', link: '/profile' },
    { name: 'Update', link: '/update' },
  ];

  display: boolean = false;

  authenticated: Observable<boolean> = this.auth.isAuthenticated();
  isAdminObs: Observable<boolean> = this.auth.isAdmin();

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {}

  logout() {
    this.auth.logout();
  }

  searchValue(el) {
    let valueToSearch = el.toLocaleLowerCase().trim();
    setTimeout(() => {
      let newTable = this.Links.filter((x) =>
        x.name.toLocaleLowerCase().includes(valueToSearch)
      );
      this.toSearch = newTable;
    }, 500);
  }

  select(el) {
    this.router.navigate([el.link]);
  }
}
