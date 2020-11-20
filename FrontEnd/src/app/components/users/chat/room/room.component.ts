import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Rooms } from 'src/app/Models/ChatModels/Rooms';
import { RoomUsers } from 'src/app/Models/ChatModels/RoomUsers';
import { UserReceived } from 'src/app/Models/UsersReceived';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
})
export class RoomComponent implements OnInit {
  object = this.auth.decryptedAndDecodedToken();
  loading: boolean;
  singleRoom: Rooms;
  user: UserReceived;
  rooms: Rooms[] = [];
  showRooms: Rooms[] = [];

  @ViewChild('message') messageRef: ElementRef;
  @ViewChild('container') containerRef: ElementRef;
  constructor(
    private chatService: ChatService,
    private route: ActivatedRoute,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.chatService.GetAllRoom().subscribe((rooms: Rooms[]) => {
      this.rooms = rooms;
      this.showRooms = [...this.rooms];
    });

    this.chatService
      .GetSingleRoom(this.route.snapshot.params.id)
      .subscribe((singleRoom: Rooms) => {
        this.singleRoom = singleRoom;
        console.log(this.singleRoom);
        // Nested ! //
        this.chatService.retrieveUsersInRoom().subscribe((user: RoomUsers) => {
          this.singleRoom.roomUsers.push({
            id: user.userId,
            username: user.username,
          });
        });
      });

    this.auth
      .getOne(this.object.unique_name)
      .subscribe((single: UserReceived) => {
        this.user = single;
        this.loading = false;
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
      let newRooms = this.rooms.filter((rooms) =>
        rooms.roomName.toLocaleLowerCase().includes(valueToSearch)
      );
      this.showRooms = newRooms;
    }, 500);
  }

  triggerFunction(event) {
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
      // this.send(el);
    }
  }
}
