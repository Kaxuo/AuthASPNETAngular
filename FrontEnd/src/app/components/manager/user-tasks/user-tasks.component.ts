import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Task } from 'src/app/Models/Tasks';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user-tasks',
  templateUrl: './user-tasks.component.html',
  styleUrls: ['./user-tasks.component.scss'],
})
export class UserTasksComponent implements OnInit {
  Tasks: Task[];
  constructor(private auth: AuthService, private router: ActivatedRoute) {}

  ngOnInit(): void {
    let id = this.router.snapshot.params.id;
    this.auth.getAllTasks(id).subscribe((data: Task[]) => (this.Tasks = data));
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
