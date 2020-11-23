import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Rooms } from 'src/app/Models/ChatModels/Rooms';
import { RoomUsers } from 'src/app/Models/ChatModels/RoomUsers';
import { UserReceived } from 'src/app/Models/UsersReceived';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { LocalStorageService } from 'ngx-webstorage';
import { colors } from 'src/app/components/users/chat/colors';
import { map, take } from 'rxjs/operators';
import { MessageReceived } from 'src/app/Models/Messages';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
})
export class RoomComponent implements OnInit {
  object = this.auth.decryptedAndDecodedToken();
  loading: boolean;
  singleRoom: Rooms;
  roomMessages: MessageReceived[];
  user: UserReceived;
  usersList: RoomUsers[];
  showUsers: RoomUsers[];
  sendMessageRoom: FormGroup;
  rooms: Rooms[] = [];
  showRooms: Rooms[] = [];
  roomId: string;

  @ViewChild('message') messageRef: ElementRef;
  @ViewChild('container') containerRef: ElementRef;
  constructor(
    private chatService: ChatService,
    private route: ActivatedRoute,
    private auth: AuthService,
    private LocalStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.chatService.retrieveRoom().subscribe((room: Rooms) => {
      this.showRooms.push(room);
    });

    this.chatService.retrieveNewMessage().subscribe((message: any) => {
      if (this.roomId == message.id) {
        this.addMessageToBox(message);
      }
      setTimeout(() => {
        this.containerRef.nativeElement.scrollTop = this.containerRef.nativeElement.scrollHeight;
      }, 200);
    });

    this.chatService.removeUser().subscribe((user) => console.log(user));

    this.chatService
      .GetAllRoom()
      .pipe(take(1))
      .subscribe((rooms: Rooms[]) => {
        this.rooms = rooms;
        this.showRooms = [...this.rooms];
      });

    this.route.params.subscribe((params) => {
      this.roomId = params.id;
      this.chatService
        .GetSingleRoom(this.roomId)
        .subscribe((singleRoom: Rooms) => {
          this.singleRoom = singleRoom;
          this.usersList = singleRoom.roomUsers.map((user, index) => {
            return { ...user, colors: colors[index] };
          });
          this.showUsers = [...this.usersList];
          console.log(this.usersList);
          // Nested ! //
          this.chatService
            .retrieveUsersInRoom()
            .subscribe((user: RoomUsers) => {
              this.singleRoom.roomUsers.push({
                id: user.userId,
                username: user.username,
              });
            });
        });
    });

    this.auth
      .getOne(this.object.unique_name)
      .pipe(take(1))
      .subscribe((single: UserReceived) => {
        this.user = single;
        this.loading = false;
      });

    this.sendMessageRoom = new FormGroup({
      message: new FormControl('', [Validators.required]),
    });

    setTimeout(() => {
      this.containerRef.nativeElement.scrollTop = this.containerRef.nativeElement.scrollHeight;
    }, 400);
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

  searchUser(el) {
    let valueToSearch = el.toLocaleLowerCase().trim();
    setTimeout(() => {
      let newRooms = this.usersList.filter((users) =>
        users.username.toLocaleLowerCase().includes(valueToSearch)
      );
      this.showUsers = newRooms;
    }, 500);
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

  addMessageToBox(message) {
    this.singleRoom.roomMessages.push({ ...message, sentDate: new Date() });
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

  myStyles(el): object {
    let colors = this.usersList.find((x) => x.username == el.senderName);
    if (this.user.username == el.senderName) {
      return { 'background-color': '#6666FF' };
    }
    if (this.user.username != el.senderName && colors != undefined) {
      return { 'background-color': colors.colors };
    } else {
      return { 'background-color': 'black' };
    }
  }

  scrollDown() {
    this.containerRef.nativeElement.scrollTop = this.containerRef.nativeElement.scrollHeight;
  }
}
