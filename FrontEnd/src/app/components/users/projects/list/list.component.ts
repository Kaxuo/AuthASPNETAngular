import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/services/project.service';
import { Project } from 'src/app/Models/Project';
import { take } from 'rxjs/operators';
import { Task } from 'src/app/Models/Tasks';
<<<<<<< HEAD
import { defineCustomElements } from '@teamhive/lottie-player/loader';
=======
>>>>>>> master

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  loading: boolean;
<<<<<<< HEAD
  projects: Project[] = [];
  completedTasks: Task[][];
  notAssignedTasks: Task[][];

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    defineCustomElements(window);
=======
  projects: Project[];
  completedTasks: Task[][];
  notAssignedTasks : Task[][];
  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
>>>>>>> master
    this.projectService
      .getAllProjects()
      .pipe(take(1))
      .subscribe((projects: Project[]) => {
        this.projects = projects;
<<<<<<< HEAD
        this.completedTasks = projects.map((x) =>
          x.tasks.filter((x: Task) => x.status == 3)
        );
        this.notAssignedTasks = projects.map((x) =>
          x.tasks.filter((x: Task) => x.userId == 0)
        );
=======
        this.completedTasks = projects.map(x => x.tasks.filter((x:Task) => x.status == 3))
        this.notAssignedTasks = projects.map(x => x.tasks.filter((x:Task) => x.userId == 0))
>>>>>>> master
        this.loading = false;
      });
  }
}
