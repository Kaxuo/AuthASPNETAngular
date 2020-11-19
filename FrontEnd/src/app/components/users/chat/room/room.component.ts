import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Rooms } from 'src/app/Models/ChatModels/Rooms';
import { MessageReceived } from 'src/app/Models/Messages';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
})
export class RoomComponent implements OnInit {
  loading: boolean = false;
  rooms: Rooms[] = [
    {
      id: 'lmao',
      roomName: 'Fish',
    },
    {
      id: 'lmao',
      roomName: 'Hunt',
    },
    {
      id: 'lmao',
      roomName: 'Build',
    },
    {
      id: 'lmao',
      roomName: 'Gaming',
    },
    {
      id: 'lmao',
      roomName: 'Camping',
    },
  ];

  messages: MessageReceived[] = [
    {
      senderName: 'Bob',
      sentDate: new Date(),
      content: "Hello man , it's your boy",
    },
    {
      senderName: 'Kain',
      sentDate: new Date(),
      content: "azeazn , it's your boy",
    },
    {
      senderName: 'Kayle',
      sentDate: new Date(),
      content: "Hello man , it'sazeazer boy",
    },
    {
      senderName: 'Jin',
      sentDate: new Date(),
      content: "Hello man , it's your azeaz",
    },
  ];

  show: Rooms[] = [...this.rooms];

  @ViewChild('message') messageRef: ElementRef;
  @ViewChild('container') containerRef: ElementRef;
  constructor() {}

  ngOnInit(): void {
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
      this.show = newRooms;
    }, 500);
  }

  searchUser(el) {
    let valueToSearch = el.toLocaleLowerCase().trim();
    setTimeout(() => {
      let newRooms = this.rooms.filter((rooms) =>
        rooms.roomName.toLocaleLowerCase().includes(valueToSearch)
      );
      this.show = newRooms;
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
