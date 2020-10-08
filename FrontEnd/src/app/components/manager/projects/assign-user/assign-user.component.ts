import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { SingleUser } from 'src/app/Models/SingleUser';
import { AuthService } from 'src/app/services/auth.service';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-assign-user',
  templateUrl: './assign-user.component.html',
  styleUrls: ['./assign-user.component.scss'],
})
export class AssignUserComponent implements OnInit {
  assignUser: FormGroup;
  projectId: number;
  taskId: number;
  clicked: boolean = false;
  searchText='';
  users: SingleUser[];

  characters = [
    'Ant-Man',
    'Aquaman',
    'Asterix',
    'The Atom',
    'The Avengers',
    'Batgirl',
    'Batman',
    'Batwoman',
  ]

  constructor(
    private projectService: ProjectService,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.projectId = this.route.snapshot.params.id;
    this.taskId = this.route.snapshot.params.taskId;
    this.assignUser = new FormGroup({
      user: new FormControl('', [Validators.required]),
    });
  }

  assign(user) {
    console.log(user);
  }
}
