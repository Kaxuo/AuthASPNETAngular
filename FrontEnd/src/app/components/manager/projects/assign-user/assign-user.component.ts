import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  users: SingleUser[];
  filteredList: SingleUser[];
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
    this.auth.getAllUsers().subscribe((data: SingleUser[]) => {
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
          .map((user: SingleUser) => ({
            ...user,
            username: user.username.toLocaleUpperCase().trim(),
            firstName: user.firstName.toLocaleUpperCase().trim(),
          }))
          .filter(
            (user: SingleUser) =>
              user.username.includes(valueToSearch) ||
              user.firstName.includes(valueToSearch)
          )
          .concat(
            this.users.filter(
              (user: SingleUser) => user.id.toString() == valueToSearch
            )
          );
      }, 500);
    } else {
      this.filteredList = [];
    }
    this.error = false;
  }

  capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  select(user) {
    console.log(user);
    this.assignUser
      .get('user')
      .setValue(this.capitalizeFirstLetter(user.username.toLowerCase()));
    this.filteredList = [];
  
  }
}
