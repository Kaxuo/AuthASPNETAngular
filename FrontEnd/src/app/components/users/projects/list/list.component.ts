import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/services/project.service';
import { Project } from 'src/app/Models/Project';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  loading: boolean;
  projects: Project[];
  completedTasks: number;
  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.loading = false;
    this.projectService
      .getAllProjects()
      .pipe(take(1))
      .subscribe((projects: Project[]) => {
        this.projects = projects;
        this.loading = false;
      });
  }
}
