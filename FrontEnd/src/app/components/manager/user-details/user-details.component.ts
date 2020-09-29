import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { UserReceived } from 'src/app/Models/UsersReceived';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsComponent implements OnInit {
  User: UserReceived;
  tasksComplete: number;

  constructor(private auth: AuthService, private route: ActivatedRoute, private router:Router) {}

  ngOnInit(): void {
    let id = this.route.snapshot.params.id;
    this.auth
      .getOne(id)
      .pipe(take(1))
      .subscribe((user: UserReceived) => {
        if (user == null){
          this.router.navigate(['404'])
        }
        this.User = user;
        let tasks = this.User.tasks.filter(tasks => !tasks.completed)
        this.tasksComplete = tasks.length
      });
  }

  deleteUser(value) {
    this.auth.deleteUser(value.id).subscribe(res => {
      this.router.navigate(['users'])
    })
  }
}
