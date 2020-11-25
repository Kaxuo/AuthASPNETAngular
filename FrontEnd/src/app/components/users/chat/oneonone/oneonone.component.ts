import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Rooms } from 'src/app/Models/ChatModels/Rooms';
import { MessageReceived } from 'src/app/Models/Messages';

@Component({
  selector: 'app-oneonone',
  templateUrl: './oneonone.component.html',
  styleUrls: ['./oneonone.component.scss'],
})
export class OneononeComponent implements OnInit {
  loading: boolean = false;
  rooms: Rooms[] = [];

  messages: MessageReceived[] = [];

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

  breakLineForTextBox(event) {
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
