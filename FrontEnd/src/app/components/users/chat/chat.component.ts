import { MessageReceived } from 'src/app/Models/Messages';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserReceived } from 'src/app/Models/UsersReceived';
import { AuthService } from 'src/app/services/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { map, take } from 'rxjs/operators';
import { colors } from './colors';
import { ChatService } from 'src/app/services/chat.service';
import { LocalStorageService } from 'ngx-webstorage';

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
  onlineUsers: any[];
  token: string = this.LocalStorageService.retrieve('mongoID');
  @ViewChild('message') messageRef: ElementRef;
  @ViewChild('container') containerRef: ElementRef;

  constructor(
    private auth: AuthService,
    private chatService: ChatService,
    private LocalStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    // Messages //
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
        setTimeout(() => {
          this.containerRef.nativeElement.scrollTop = this.containerRef.nativeElement.scrollHeight;
        }, 200);
        this.addToInbox(receivedObj);
      }); // calls the service method to get the new messages sent

    // Users //
    this.chatService
      .GetAllUserMongo()
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
      });

    this.chatService
      .GetAllConnectedUserMongo()
      .pipe(
        map((connectedUsers: any) => {
          return connectedUsers;
        })
      )
      .subscribe((connectedUsers: any) => {
        this.onlineUsers = connectedUsers;

        // SingleUser //
        this.chatService.retrieveSingleUser().subscribe((user: any) => {
          this.switchOnline(user);
        });
      });

    // Dynamically track online/offline online users
    this.chatService.retrieveUsers().subscribe();
    this.chatService
      .removeUser()
      .pipe()
      .subscribe((user) => {
        this.switchOffline(user.id);
      });

    // Owner Session //
    this.auth
      .getOne(this.object.unique_name)
      .subscribe((single: UserReceived) => {
        this.username = single.username;
      });
    this.textbox = new FormGroup({
      message: new FormControl('', [Validators.required]),
    });
  }

  // Changed
  send(el) {
    if (el != null) {
      this.chatService.broadcastMessage({
        senderId: this.LocalStorageService.retrieve('mongoID'),
        senderName: this.username,
        content: el,
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

  // Changed
  addToInbox(obj: MessageReceived) {
    this.msgInboxArray.push({
      senderName: obj.senderName,
      content: obj.content,
      sentDate: new Date(),
    });
  }

  switchOnline(el) {
    this.onlineUsers.push(el);
  }

  switchOffline(el) {
    this.onlineUsers = this.onlineUsers.filter((users) => users.userId !== el);
  }

  // changed
  myStyles(el): object {
    let colors = this.users.find((x) => x.username == el.senderName);
    if (this.username == el.senderName) {
      return { 'background-color': '#6666FF' };
    }
    if (this.username != el.senderName && colors != undefined) {
      return { 'background-color': colors.colors };
    } else {
      return { 'background-color': 'black' };
    }
  }

  scrollDown() {
    this.containerRef.nativeElement.scrollTop = this.containerRef.nativeElement.scrollHeight;
  }

  onlineCheck(el) {
    return this.onlineUsers?.find((y) => el.id === y.userId) !== undefined;
  }
}
