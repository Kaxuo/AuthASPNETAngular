import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'; 

@Component({
  selector: 'app-server-down',
  templateUrl: './server-down.component.html',
  styleUrls: ['./server-down.component.scss'],
})
export class ServerDownComponent implements OnInit {
  constructor(private _location: Location) {}

  ngOnInit(): void {}
  goBack() {
    this._location.back()
  }
}
