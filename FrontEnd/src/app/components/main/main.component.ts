import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  token:string;

  constructor(private auth: AuthService) { }

  ngOnInit(): void {

    this.token = localStorage.getItem('token');
    console.log(this.token)
    this.auth.getAllUsers().subscribe(data => console.log(data))
  }

}
