import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent implements OnInit {
  AddTask: FormGroup;
  object = this.auth.getDecodedAccessToken(
    this.LocalStorageService.retrieve('token')
  );

  constructor(
    private auth: AuthService,
    private router: Router,
    private LocalStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.AddTask = new FormGroup({
      description: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      importance: new FormControl(false),
    });
  }

  sendTask(task) {
    this.auth.AddTask(this.object.unique_name, task).subscribe(
      res => {
        this.router.navigate(['/tasks'])
      }
    );
  }
}
