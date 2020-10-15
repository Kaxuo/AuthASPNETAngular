import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of, throwError } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { Project } from 'src/app/Models/Project';
import { AuthService } from 'src/app/services/auth.service';
import { ProjectService } from 'src/app/services/project.service';
import { UserReceived } from 'src/app/Models/UsersReceived';
import { Task } from 'src/app/Models/Tasks';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.scss'],
})
export class TasksListComponent implements OnInit {
  project: Project;
  loading: boolean;
  id: number;
  object = this.auth.decryptedAndDecodedToken();

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
    this.projectService
      .getOneProject(this.id)
      .pipe(
        switchMap((project: Project) => {
          if (project.tasks.length > 0) {
            return forkJoin([
              ...project.tasks.map((item) =>
                item.userId
                  ? this.auth.getOne(item.userId).pipe(
                      map((user: UserReceived) => {
                        return { ...item, user: user?.username };
                      })
                    )
                  : of({ ...item })
              ),
            ]).pipe(
              map((singleProject) => {
                return { ...project, tasks: singleProject };
              })
            );
          } else {
            return of(project);
          }
        }),
        take(1),
        catchError((err) => {
          this.router.navigate(['/projects']);
          return throwError(err);
        })
      )
      .subscribe((singleProject: Project) => {
        this.project = singleProject;
        this.loading = false;
      });
  }

  assignTask(el) {
    let updatedTask = {
      importance: el.importance,
      userId: this.object.unique_name,
    };
    this.projectService
      .editTask(el.projectId, el.taskId, updatedTask)
      .pipe(take(1))
      .subscribe((data) => {
        el.userId = this.object.unique_name;
        this.auth
          .getOne(this.object.unique_name)
          .pipe(take(1))
          .subscribe((user: UserReceived) => {
            el.user = user.username;
          });
      });
  }

  sortByImportance(table: Task[]) {
    table = [...this.project.tasks];
    if (!table[0].importance) {
      table.sort((a, b) => (a.importance > b.importance ? -1 : 1));
    } else {
      table.sort((a, b) => (a.importance > b.importance ? 1 : -1));
    }
    this.project.tasks = table;
  }
}
