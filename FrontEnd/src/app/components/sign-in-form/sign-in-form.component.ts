import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-in-form',
  templateUrl: './sign-in-form.component.html',
  styleUrls: ['./sign-in-form.component.scss']
})
export class SignInFormComponent implements OnInit {
  signInForm:FormGroup;

  constructor() { }

  ngOnInit(): void {

    this.signInForm = new FormGroup({
      username:new FormControl('',[Validators.required]),
      password: new FormControl('',[Validators.required])
    })
  }

  sendData(values){
    console.log(values)
  }

}
