import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss']
})
export class RegisterFormComponent implements OnInit {

  registerForm:FormGroup;

  constructor() { }

  ngOnInit(): void {

    this.registerForm = new FormGroup({
      firstName: new FormControl('',[Validators.required]),
      lastName : new FormControl('',[Validators.required]),
      username : new FormControl('',[Validators.required]),
      password : new FormControl('',[Validators.required]),
      number : new FormControl('',[Validators.required]),
      city : new FormControl('',[Validators.required]),
      country : new FormControl('',[Validators.required]),
      hobby : new FormControl('',[Validators.required]),
    })
  }

  sendData(values)
  {
    console.log(values)
  }

}
