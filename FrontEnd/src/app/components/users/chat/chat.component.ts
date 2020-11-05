import { MessageReceived } from 'src/app/Models/Messages';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserReceived } from 'src/app/Models/UsersReceived';
import { AuthService } from 'src/app/services/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { map, take } from 'rxjs/operators';
import { colors } from './colors';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  object = this.auth.decryptedAndDecodedToken();
  username: string;
  users: UserReceived[] = [];
  msgDto: MessageReceived;
  msgInboxArray: MessageReceived[] = [];
  textbox: FormGroup;
  loading: boolean;
  @ViewChild('message') messageRef: ElementRef;
  @ViewChild('container') containerRef: ElementRef;

  constructor(private auth: AuthService, private chatService: ChatService) {}

  ngOnInit(): void {
    this.chatService.GetMessage().subscribe((mess: MessageReceived[]) => {
      this.msgInboxArray = mess;
      this.loading = false;
      setTimeout(() => {
        this.containerRef.nativeElement.scrollTop = this.containerRef.nativeElement.scrollHeight;
      }, 400);
    });
    this.chatService
      .retrieveMappedObject()
      .subscribe((receivedObj: MessageReceived) => {
        this.addToInbox(receivedObj);
      }); // calls the service method to get the new messages sent
    this.auth
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
    this.auth
      .getOne(this.object.unique_name)
      .pipe(take(1))
      .subscribe((single: UserReceived) => (this.username = single.username));
    this.textbox = new FormGroup({
      message: new FormControl('', [Validators.required]),
    });
  }

  send(el) {
    if (el != null) {
      this.chatService.broadcastMessage({
        user: this.username,
        message: el,
      }); // Send the message via a service
      this.textbox.reset();
      this.messageRef.nativeElement.focus();
    }
    setTimeout(() => {
      this.containerRef.nativeElement.scrollTop = this.containerRef.nativeElement.scrollHeight;
    }, 200);
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

  addToInbox(obj: MessageReceived) {
    this.msgInboxArray.push({
      user: obj.user,
      message: obj.message,
    });
  }

  myStyles(el): object {
    let colors = this.users.find((x) => x.username == el.user);
    if (this.username == el.user) {
      return { 'background-color': '#6666FF' };
    }
    if (this.username != el.user && colors != undefined) {
      return { 'background-color': colors.colors };
    } else {
      return { 'background-color': 'black' };
    }
  }

  scrollDown() {
    this.containerRef.nativeElement.scrollTop = this.containerRef.nativeElement.scrollHeight;
  }
}
