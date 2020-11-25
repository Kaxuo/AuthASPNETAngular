import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Rooms } from 'src/app/Models/ChatModels/Rooms';
import { UserReceived } from 'src/app/Models/UsersReceived';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { LocalStorageService } from 'ngx-webstorage';
import { catchError, switchMap, take } from 'rxjs/operators';
import { MessageReceived } from 'src/app/Models/Messages';
import { ConnectedUsers } from 'src/app/Models/ChatModels/ConnectedUsers';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { combineLatest, forkJoin, of, throwError, EMPTY } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MongoUsers } from 'src/app/Models/ChatModels/MongoUsers';

@Component({
  selector: 'app-oneonone',
  templateUrl: './oneonone.component.html',
  styleUrls: ['./oneonone.component.scss'],
})
@UntilDestroy()
export class OneononeComponent implements OnInit {
  token = this.auth.decryptedAndDecodedToken();
  messages: MessageReceived[] = [
    {
      sentDate: new Date(),
      content: 'lmao',
      senderName: 'Freya',
    },
    {
      sentDate: new Date(),
      content: 'lmao',
      senderName: 'Jin',
    },
  ];
  loading: boolean;
  user: UserReceived;
  usersList: UserReceived[];
  showUsers: UserReceived[];
  sendMessageRoom: FormGroup;
  rooms: Rooms[] = [];
  showRooms: Rooms[] = [];
  roomId: string;
  onlineUsers: ConnectedUsers[] = [];
  mongoSingleUser: MongoUsers;

  @ViewChild('message') messageRef: ElementRef;
  @ViewChild('container') containerRef: ElementRef;
  constructor(
    private chatService: ChatService,
    private route: ActivatedRoute,
    private auth: AuthService,
    private LocalStorageService: LocalStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    let getOwnerSession = this.auth.getOne(this.token.unique_name);
    let allConnectedUserMongo = this.chatService.GetAllConnectedUserMongo();
    let allUserMongo = this.chatService.GetAllUserMongo();
    let allRooms = this.chatService.GetAllRoom();

    forkJoin([getOwnerSession, allUserMongo, allConnectedUserMongo, allRooms])
      .pipe(
        take(1),
        catchError((error) => {
          return throwError(error);
        })
      )
      .subscribe(
        (result: [UserReceived, UserReceived[], ConnectedUsers[], Rooms[]]) => {
          this.user = result[0];
          this.usersList = result[1];
          this.onlineUsers = result[2];
          this.showUsers = [...this.usersList];
          this.rooms = result[3];
          this.showRooms = [...this.rooms];
          this.loading = false;
        }
      );

    this.chatService
      .removeUser()
      .pipe(untilDestroyed(this))
      .subscribe((user) => {
        this.switchOffline(user.id);
      });

    this.chatService
      .retrieveSingleUser()
      .pipe(untilDestroyed(this))
      .subscribe((user: ConnectedUsers) => {
        this.switchOnline(user);
      });

    this.sendMessageRoom = new FormGroup({
      message: new FormControl('', [Validators.required]),
    });

    this.chatService
      .GetSingleMongoUser(this.LocalStorageService.retrieve('mongoID'))
      .pipe(take(1))
      .subscribe((user: MongoUsers) => {
        console.log(user.contacts);
        this.mongoSingleUser = user;
      });

    setTimeout(() => {
      this.containerRef.nativeElement.scrollTop = this.containerRef.nativeElement.scrollHeight;
    }, 400);
  }

  searchUser(el) {
    let valueToSearch = el.toLocaleLowerCase().trim();
    setTimeout(() => {
      let newRooms = this.usersList.filter((users) =>
        users.username.toLocaleLowerCase().includes(valueToSearch)
      );
      this.showUsers = newRooms;
    }, 500);
  }

  searchRoom(el) {
    let valueToSearch = el.toLocaleLowerCase().trim();
    setTimeout(() => {
      let newRooms = this.rooms.filter((rooms) =>
        rooms.roomName.toLocaleLowerCase().includes(valueToSearch)
      );
      this.showRooms = newRooms;
    }, 500);
  }

  breakLineForTextBox(event, el) {
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

  send(el) {
    let message = {
      senderId: this.LocalStorageService.retrieve('mongoID'),
      senderName: this.user.username,
      content: el.message,
    };
    if (el != null) {
      this.chatService
        .sendMessageRoom(this.route.snapshot.params.id, message)
        .subscribe(); // Send the message via a service
      this.sendMessageRoom.reset();
      this.messageRef.nativeElement.focus();
    }
    setTimeout(() => {
      this.containerRef.nativeElement.scrollTop = this.containerRef.nativeElement.scrollHeight;
    }, 200);
  }

  joinRoom(element: Rooms) {
    this.chatService.GetSingleRoom(element.id).subscribe((data: Rooms) => {
      if (
        data.roomUsers.find(
          (users) =>
            this.LocalStorageService.retrieve('mongoId') == users.userId
        ) == undefined
      ) {
        this.chatService
          .joinRoom(element.id, {
            roomName: element.roomName,
            userId: this.LocalStorageService.retrieve('mongoID'),
            username: this.user.username,
          })
          .subscribe();
      }
    });
  }

  addContact(el) {
    let newContact = {
      username: this.user.username,
      contactId: el.id,
      contactName: el.username,
    };
    if (
      this.mongoSingleUser.contacts.find(
        (contacts) => contacts.contactId == el.id
      )
    ) {
      this.router.navigate(['/chat/user', el.id]);
    } else {
      this.chatService
        .addContact(this.LocalStorageService.retrieve('mongoID'), newContact)
        .pipe(
          take(1),
          catchError((error) => {
            if (error.status == 400) {
              return of(false);
            }
          })
        )
        .subscribe(() => {
          this.router.navigate(['/chat/user', el.id]);
        });
    }
  }

  scrollDown() {
    this.containerRef.nativeElement.scrollTop = this.containerRef.nativeElement.scrollHeight;
  }

  // Helper Methods //

  switchOnline(el) {
    this.onlineUsers.push(el);
  }

  switchOffline(el) {
    this.onlineUsers = this.onlineUsers.filter((users) => users.userId !== el);
  }

  getUniqueListBy(arr, key) {
    return [...new Map(arr.map((item) => [item[key], item])).values()];
  }

  onlineCheck(el) {
    return this.onlineUsers?.find((y) => el.id === y.userId) !== undefined;
  }

  myStyles(el): object {
    if (this.user.username == el.senderName) {
      return { 'background-color': '#6666FF' };
    } else {
      return { 'background-color': '#20B2AA' };
    }
  }
}
