import { Injectable, OnInit } from '@angular/core';
import * as signalR from '@microsoft/signalr'; // import signalR
import { HttpClient } from '@angular/common/http';
import { MessageReceived } from '../Models/Messages';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private connection: any = new signalR.HubConnectionBuilder()
    .withUrl('https://localhost:5001/chatsocket', {
      skipNegotiation: true,
      transport: signalR.HttpTransportType.WebSockets,
    }) // mapping to the chathub as in startup.cs
    .configureLogging(signalR.LogLevel.Information)
    .build();
  readonly POST_URL = 'https://localhost:5001/api/chat/send';

  private receivedMessageObject: any = { user: 'lmao' };
  private sharedObj = new Subject<MessageReceived>();

  constructor(private http: HttpClient) {
    this.connection.onclose(async () => {
      await this.start();
    });
    this.connection.on('ReceiveOne', (user, message) => {
      this.mapReceivedMessage(user, message);
    });
    this.start();
  }

  // Start the connection
  public async start() {
    try {
      await this.connection.start();
      console.log('connected');
    } catch (err) {
      console.log(err);
      setTimeout(() => this.start(), 5000);
    }
  }

  // Receive message and put them as the next value in the river //
  private mapReceivedMessage(user: string, message: string): void {
    this.receivedMessageObject.user = user;
    this.receivedMessageObject.message = message;
    this.sharedObj.next(this.receivedMessageObject);
  }

  /* ****************************** Public Mehods **************************************** */

  // Calls the controller method
  public broadcastMessage(msgDto: any) {
    this.http
      .post(this.POST_URL, msgDto)
      .subscribe((data) => console.log(data));
    // this.connection.invoke("SendMessage1", msgDto.user, msgDto.msgText).catch(err => console.error(err));    // This can invoke the server method named as "SendMethod1" directly.
  }

  // Share the data received from the backend, with other components in the project. , transfomr values into observable to be consumed
  public retrieveMappedObject(): Observable<MessageReceived> {
    return this.sharedObj.asObservable();
  }
}
