import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { Task } from '../../../Models/Tasks';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent implements OnInit {
  token: Observable<boolean> = this.auth.isAuthenticated();
  loading: boolean;
  Tasks: Task[] = [];
  object = this.auth.decryptedAndDecodedToken();
  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.token.subscribe((isAuth) => {
      if (isAuth) {
        this.auth
          .getAllTasks(this.object.unique_name)
          .pipe(take(1))
          .subscribe((res: Task[]) => {
            this.Tasks = res;
            this.loading = false;
          });
      } else {
        this.router.navigate(['signin']);
      }
    });
  }

  deleteTask(value: Task) {
    this.auth
      .DeleteTask(this.object.unique_name, value.taskId)
      .pipe(take(1))
      .subscribe(
        (res) =>
          (this.Tasks = this.Tasks.filter((x) => x.taskId != value.taskId))
      );
  }

  importanceFlag(task: Task) {
    task.importance = !task.importance;
    this.auth
      .EditTask(this.object.unique_name, task.taskId, task)
      .pipe(take(1))
      .subscribe();
  }

  sortByStatus(table: Task[]) {
    table = [...this.Tasks];
    if (!table[0].status) {
      table.sort((a, b) => (a.status > b.status ? -1 : 1));
    } else {
      table.sort((a, b) => (a.status > b.status ? 1 : -1));
    }
    this.Tasks = table;
  }

  sortByImportance(table: Task[]) {
    table = [...this.Tasks];
    if (!table[0].importance) {
      table.sort((a, b) => (a.importance > b.importance ? -1 : 1));
    } else {
      table.sort((a, b) => (a.importance > b.importance ? 1 : -1));
    }
    this.Tasks = table;
  }
}
