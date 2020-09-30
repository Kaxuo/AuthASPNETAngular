import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { Task } from 'src/app/Models/Tasks';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user-tasks',
  templateUrl: './user-tasks.component.html',
  styleUrls: ['./user-tasks.component.scss'],
})
export class UserTasksComponent implements OnInit {
  Tasks: Task[] = [];
  loading: boolean = false;

  constructor(private auth: AuthService, private router: ActivatedRoute) {}

  ngOnInit(): void {
    this.loading = true;
    let id = this.router.snapshot.params.id;
    this.auth.getAllTasks(id).subscribe((data: Task[]) => 
    {
      this.Tasks = data
      this.loading = false;
    });
  }

  deleteTask(value) {
    this.auth
      .DeleteTask(value.userId, value.taskId)
      .pipe(take(1))
      .subscribe(
        (res) =>
          (this.Tasks = this.Tasks.filter((x) => x.taskId != value.taskId))
      );
  }

  sortByCompleted(table: Task[]) {
    table = [...this.Tasks];
    if (!table[0].completed) {
      table.sort((a, b) => (a.completed > b.completed ? -1 : 1));
    } else {
      table.sort((a, b) => (a.completed > b.completed ? 1 : -1));
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
