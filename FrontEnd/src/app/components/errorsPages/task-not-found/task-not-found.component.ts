import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'; 

@Component({
  selector: 'app-task-not-found',
  templateUrl: './task-not-found.component.html',
  styleUrls: ['./task-not-found.component.scss'],
})
export class TaskNotFoundComponent implements OnInit {
  constructor(private _location: Location) {}

  ngOnInit(): void {}
  goBack() {
    this._location.back()
  }
}
