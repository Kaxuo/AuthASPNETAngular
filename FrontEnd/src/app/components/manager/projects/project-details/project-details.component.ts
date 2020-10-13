import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of, throwError } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { Project } from 'src/app/Models/Project';
import { AuthService } from 'src/app/services/auth.service';
import { ProjectService } from 'src/app/services/project.service';
import { SingleUser } from 'src/app/Models/SingleUser';
import { Task } from 'src/app/Models/Tasks';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss'],
})
export class ProjectDetailsComponent implements OnInit {
  project: Project;
  loading: boolean;
  id: number;

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
                      map((user: SingleUser) => {
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

  deleteTask(element) {
    this.projectService.deleteTask(this.id, element.taskId).subscribe();
    this.project.tasks = this.project.tasks.filter(
      (x) => x.taskId != element.taskId
    );
  }

  importanceFlag(element) {
    element.importance = !element.importance;
    this.projectService
      .editTask(this.id, element.taskId, element)
      .pipe(take(1))
      .subscribe();
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

  sortByStatus(table: Task[]) {
    table = [...this.project.tasks];
    if (!table[0].status) {
      table.sort((a, b) => (a.status > b.status ? -1 : 1));
    } else {
      table.sort((a, b) => (a.status > b.status ? 1 : -1));
    }
    this.project.tasks = table;
  }
}
