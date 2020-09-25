import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { LocalStorageService } from 'ngx-webstorage';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Task } from 'src/app/Models/Tasks';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit {
  token: Observable<boolean> = this.auth.isAuthenticated();
  EditTask: FormGroup;
  object = this.auth.getDecodedAccessToken(
    this.LocalStorageService.retrieve('token')
  );

  constructor(
    private auth: AuthService,
    private router: Router,
    private LocalStorageService: LocalStorageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.token.subscribe((isAuth) => {
      if (isAuth) {
        this.auth
          .getOneTask(
            this.object.unique_name,
            this.route.snapshot.params.taskId
          )
          .pipe(take(1))
          .subscribe((response: Task) => {
            this.EditTask = new FormGroup({
              description: new FormControl(response.description, [
                Validators.required,
                Validators.maxLength(20),
              ]),
            });
          });
      } else {
        this.router.navigate(['register']);
      }
    });
  }

  sendTask(task) {
    this.auth
      .EditTask(
        this.object.unique_name,
        this.route.snapshot.params.taskId,
        task
      )
      .pipe(take(1))
      .subscribe(res => {
        this.router.navigate(['/tasks'])
      });
  }
}
