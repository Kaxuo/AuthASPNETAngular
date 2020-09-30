import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-add-tasks',
  templateUrl: './add-tasks.component.html',
  styleUrls: ['./add-tasks.component.scss'],
})
export class AddTasksComponent implements OnInit {
  AddTask: FormGroup;
  id : number;
  clicked:boolean = false;
  constructor(private auth:AuthService, private router:Router, private route:ActivatedRoute) {}

  ngOnInit(): void {
    this.AddTask = new FormGroup({
      description: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      importance: new FormControl(false),
    })
  }

  sendTask(task) {
    this.clicked = true;
    let id = this.route.snapshot.params.id
    this.auth.AddTask(id,task).subscribe((res) => {
      this.router.navigate(['..'], { relativeTo:this.route });
    });
  }
}
