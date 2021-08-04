import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChildActivationStart } from '@angular/router';

@Component({
  selector: 'app-private-chat',
  templateUrl: './private-chat.component.html',
  styleUrls: ['./private-chat.component.scss'],
})
export class PrivateChatComponent implements OnInit {
  messages: any = [
    "Hello, that's me",
    'Nice to meet you',
    'My name is Hoang',
    'Mine is Bob',
    'What do you like to do ?',
    "Hello, that's me",
    'Nice to meet you',
    'My name is Hoang',
    'Mine is Bob',
    'What do you like to do ?',
  ];
  @ViewChild('container') containerRef: ElementRef;
  constructor() {}

  ngOnInit(): void {

  }
  ngAfterViewInit() {
    this.scrollDown()
  }

  scrollDown() {
    this.containerRef.nativeElement.scrollTop = this.containerRef.nativeElement.scrollHeight;
  }
}
