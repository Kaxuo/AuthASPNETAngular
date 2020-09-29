import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'; 

@Component({
  selector: 'app-users-not-found',
  templateUrl: './users-not-found.component.html',
  styleUrls: ['./users-not-found.component.scss'],
})
export class UsersNotFoundComponent implements OnInit {
  constructor(private _location: Location) {}

  ngOnInit(): void {}
  goBack() {
    this._location.back()
  }
}
