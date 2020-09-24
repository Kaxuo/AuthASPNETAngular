import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { Task } from '../../Models/Tasks';
import { LocalStorageService } from 'ngx-webstorage';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent implements OnInit {
  Tasks: Task[];
  headElements = [
    'ID',
    'Description',
    'Status',
    'Importance',
    'Edit',
    'Remove',
  ];
  object = this.getDecodedAccessToken(
    this.LocalStorageService.retrieve('token')
  );
  constructor(
    private auth: AuthService,
    private LocalStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.auth
      .getAllTasks(this.object.unique_name)
      .pipe(take(1))
      .subscribe((res: Task[]) => (this.Tasks = res));
  }

  getDecodedAccessToken(token: string): any {
    try {
      var decoded = jwt_decode(token);
      return decoded;
    } catch (Error) {
      return null;
    }
  }

  deleteTask(value) {
    this.auth
      .DeleteTask(this.object.unique_name, value.taskId)
      .pipe(take(1))
      .subscribe(
        (res) =>
          (this.Tasks = this.Tasks.filter((x) => x.taskId != value.taskId))
      );
  }
}
