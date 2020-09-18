import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { UserReceived } from '../../Models/UsersReceived';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  token: string =localStorage.getItem('token')
  id : any = localStorage.getItem('user-id')
  data: UserReceived[];
  headElements = ['ID', 'First', 'Last', 'Username','Hobby','Country','City','PhoneNumber'];

  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.token) {
      this.auth.getAllUsers().pipe(
        take(1),
      ).subscribe((res: UserReceived[]) => {
        this.data = res;
        console.log(this.data);
      });
    } else
    {
      this.router.navigate(['register'])
    }
  }
}
