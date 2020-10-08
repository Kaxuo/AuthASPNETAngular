import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { Project } from 'src/app/Models/Project';
import { AuthService } from 'src/app/services/auth.service';
import { ProjectService } from 'src/app/services/project.service';
import { SingleUser } from 'src/app/Models/SingleUser';

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
          if (project == null) {
            this.router.navigate(['projects']);
          }
          return forkJoin(
            ...project.tasks.map((item) =>
              this.auth.getOne(item.userId).pipe(
                map((user: SingleUser) => {
                  return { ...item, user: user?.username };
                })
              )
            )
          ).pipe(
            map((singleProject) => {
              return { ...project, tasks: singleProject };
            })
          );
        }),
        take(1)
      )
      .subscribe((singleProject: Project) => {
        this.project = singleProject;
        console.log(this.project);
        this.loading = false;
      });
  }

  deleteTask(element) {
    this.projectService.deleteTask(this.id, element.taskId).subscribe();
    this.project.tasks = this.project.tasks.filter(
      (x) => x.taskId != element.taskId
    );
  }
}
