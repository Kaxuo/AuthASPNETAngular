import { Messages } from 'src/app/Models/Messages';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserReceived } from 'src/app/Models/UsersReceived';
import { AuthService } from 'src/app/services/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { map, take } from 'rxjs/operators';
import { colors } from './colors';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  users: UserReceived[] = [];
  textbox: FormGroup;
  messages: Messages[] = [
    {
      user: 'Vincent',
      dateCreated: new Date(),
      message:
        'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.',
      color: '#FF6633',
    },
    {
      user: 'Bob',
      dateCreated: new Date(),
      message: 'ok',
      color: '#FFB399',
    },
    {
      user: 'Jin',
      dateCreated: new Date(),
      message:
        'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.',
      color: '#00B3E6',
    },
    {
      user: 'Freya',
      dateCreated: new Date(),
      message:
        'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.',
      color: '#3366E6',
    },
  ];
  @ViewChild('message') messageRef: ElementRef;
  @ViewChild('container') containerRef: ElementRef;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService
      .getAllUsers()
      .pipe(
        take(1),
        map((users: UserReceived[]) => {
          return users.map((users, index) => {
            return { ...users, colors: colors[index] };
          });
        })
      )
      .subscribe((users: UserReceived[]) => {
        this.users = users;
        console.log(this.users);
      });
    this.textbox = new FormGroup({
      message: new FormControl('', [Validators.required]),
    });
  }

  ngAfterViewInit() {
    this.containerRef.nativeElement.scrollTop = this.containerRef.nativeElement.scrollHeight;
  }

  send(el) {
    if (el != null) {
      let message = {
        user: 'Bob',
        dateCreated: new Date(),
        message: el,
        color: '#991AFF',
      };
      this.textbox.reset();
      this.messages.push(message);
      this.messageRef.nativeElement.focus();
      setTimeout(() => {
        this.containerRef.nativeElement.scrollTop = this.containerRef.nativeElement.scrollHeight;
      }, 10);
    }
  }

  triggerFunction(event, el) {
    if (event.ctrlKey && event.key === 'Enter') {
      /*
        cannot make textarea produce a next line.
      */
      var text = <HTMLInputElement>document.getElementById('textarea1');
      text.value += '\n';
      //  text = text.
    } else if (event.key === 'Enter') {
      // allow the form to reset on the 1st line //
      event.preventDefault();
      this.send(el);
    }
  }
}
