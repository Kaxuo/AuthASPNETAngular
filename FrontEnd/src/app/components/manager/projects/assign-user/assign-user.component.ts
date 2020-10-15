import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserReceived } from 'src/app/Models/UsersReceived';
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
  users: UserReceived[];
  filteredList: UserReceived[];
  error: boolean = false;
  loading: boolean;

  constructor(
    private projectService: ProjectService,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.projectId = this.route.snapshot.params.id;
    this.taskId = this.route.snapshot.params.taskId;
    this.auth.getAllUsers().subscribe((data: UserReceived[]) => {
      this.loading = false
      this.users = data;
    });
    this.assignUser = new FormGroup({
      user: new FormControl('', [Validators.required]),
    });
  }

  assign(user) {
    let selectedUser = this.users.find(
      (element) =>
        element.username.toLocaleLowerCase() == user.user.toLowerCase()
    );
    if (selectedUser) {
      let updatedTask = { userId: selectedUser.id };
      this.projectService
        .editTask(this.projectId, this.taskId, updatedTask)
        .subscribe((data) =>
          this.router.navigate(['projects', this.projectId])
        );
    } else {
      this.error = true;
    }
  }

  searchUser() {
    let valueToSearch = this.assignUser.get('user').value;
    valueToSearch = valueToSearch.toLocaleUpperCase().trim();
    if (valueToSearch != '') {
      setTimeout(() => {
        this.filteredList = this.users
          .map((user: UserReceived) => ({
            ...user,
            username: user.username.toLocaleUpperCase().trim(),
            firstName: user.firstName.toLocaleUpperCase().trim(),
          }))
          .filter(
            (user: UserReceived) =>
              user.username.includes(valueToSearch) ||
              user.firstName.includes(valueToSearch)
          )
          .concat(
            this.users.filter(
              (user: UserReceived) => user.id.toString() == valueToSearch
            )
          );
      }, 500);
    } else {
      this.filteredList = [];
    }
    this.error = false;
  }

  select(user) {
    this.assignUser
      .get('user')
      .setValue(this.auth.capitalizeFirstLetter(user.username.toLowerCase()));
    this.filteredList = [];
  
  }
}
