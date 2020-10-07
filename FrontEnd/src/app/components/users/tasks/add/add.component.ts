import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent implements OnInit {
  AddTask: FormGroup;
  object = this.auth.decryptedAndDecodedToken();
  clicked: boolean = false;
  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.AddTask = new FormGroup({
      description: new FormControl('', [
        Validators.required,
        Validators.maxLength(20),
      ]),
      importance: new FormControl(false),
    });
  }

  sendTask(task) {
    this.clicked = true
    this.auth.AddTask(this.object.unique_name, task).subscribe((res) => {
      this.router.navigate(['/tasks']);
    });
  }
}
