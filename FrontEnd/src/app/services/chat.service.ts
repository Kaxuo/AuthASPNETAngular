import { Injectable, OnInit } from '@angular/core';
import * as signalR from '@microsoft/signalr'; // import signalR
import { HttpClient } from '@angular/common/http';
import { MessageReceived } from '../Models/Messages';
import { BehaviorSubject, merge, Observable, of, Subject } from 'rxjs';
import { LocalStorageService } from 'ngx-webstorage';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  // private chat = 'https://authaspnetcore.azurewebsites.net/chatsocket';
  // readonly GET_URL = 'https://authaspnetcore.azurewebsites.net/api/chat/get';
  // readonly POST_URL = 'https://authaspnetcore.azurewebsites.net/api/chat/send';

  // private chat = 'https://localhost:5001/chatsocket'
  // readonly GET_URL = 'https://localhost:5001/api/chat/get';
  // readonly POST_URL = 'https://localhost:5001/api/chat/send';

  // Charlotte //

  readonly URL = `https://localhost:5001/api`;
  readonly POST_URL = 'https://localhost:5001/api/chat/public/send';

  private connection: any = new signalR.HubConnectionBuilder()
    .withUrl(`https://localhost:5001/chat?userId=default`, {
      skipNegotiation: true,
      transport: signalR.HttpTransportType.WebSockets,
    }) // mapping to the chathub as in startup.cs
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build();

  private receivedMessageObject: any = {};
  private sharedObj = new Subject<MessageReceived>();

  private singleUser: any = {};
  private sharedSingle = new Subject<any>();

  private usersConnected: any = {};
  private sharedUsers = new Subject<any>();

  private removedUsers = new Subject<any>();

  constructor(
    private http: HttpClient,
    private LocalStorageService: LocalStorageService
  ) {
    this.isAuthenticated().subscribe((authenticated) => {
      if (authenticated) {
        this.start();
        this.connection.on('userConnectedList', (users) => {
          this.usersConnecting(users);
        });
        this.connection.on('updatedConnectedUser', (user) => {
          this.singleUserConnected(user);
        });
        this.connection.on('newDisconnectedUser', (user) => {
          this.removedUsers.next(user);
          this.removeConnected(user.id).subscribe();
        });
      }
    });
  }

  // Start the connection
  public async start() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(
        `https://localhost:5001/chat?userId=${this.LocalStorageService.retrieve(
          'mongoID'
        )}`,
        {
          skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets,
        }
      ) // mapping to the chathub as in startup.cs
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();
    try {
      await this.connection.start();
      this.connection.on('userConnectedList', (users) => {
        this.usersConnecting(users);
      });
      this.connection.on('newConnectedUser', (user) => {
        this.singleUserConnected(user);
      });
      this.connection.on('receiveNewPublicMessage', (message) => {
        this.mapReceivedMessage(message);
      });
      this.connection.on('updatedConnectedUser', (user) => {
        this.singleUserConnected(user);
      });
      console.log('connected');
    } catch (err) {
      console.log(err);
      setTimeout(() => this.start(), 5000);
    }
  }

  // Receive message and put them as the next value in the river //
  private mapReceivedMessage(message: string): void {
    this.receivedMessageObject = message;
    this.sharedObj.next(this.receivedMessageObject);
  }

  // Get the user that connects
  private singleUserConnected(id: string) {
    this.singleUser = id;
    this.sharedSingle.next(this.singleUser);
  }

  // Get all the users and put them as the next value in the river if someone connects
  private usersConnecting(users: string) {
    this.usersConnected = users;
    this.sharedUsers.next(this.usersConnected);
  }

  /* ****************************** Public Methods **************************************** */

  // Calls the controller method
  public GetMessage() {
    return this.http.get(`${this.URL}/chat/public`);
  }

  public broadcastMessage(msgDto: any) {
    this.http
      .post(this.POST_URL, msgDto)
      .subscribe((data) => console.log(data));
    // this.connection.invoke("SendMessage1", msgDto.user, msgDto.msgText).catch(err => console.error(err));    // This can invoke the server method named as "SendMethod1" directly.
  }

  // Share the data received from the backend, with other components in the project. , transform values into observable to be consumed
  public retrieveMappedObject(): Observable<MessageReceived> {
    return this.sharedObj.asObservable();
  }

  public retrieveSingleUser(): Observable<any> {
    return this.sharedSingle.asObservable();
  }

  public retrieveUsers(): Observable<any> {
    return this.sharedUsers.asObservable();
  }

  public removeUser(): Observable<any> {
    this.removedUsers.next('lmao');
    return this.removedUsers.asObservable();
  }

  public disconnectUser() {
    if (this.connection) {
      this.connection.stop();
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(`https://localhost:5001/chat?userId=default`, {
          skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets,
        }) // mapping to the chathub as in startup.cs
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Information)
        .build();
      this.removeConnected(
        this.LocalStorageService.retrieve('mongoID')
      ).subscribe();
    }
  }

  // Charlotte
  GetAllUserMongo() {
    return this.http.get(`${this.URL}/account`);
  }

  GetAllConnectedUserMongo() {
    return this.http.get(`${this.URL}/account/all`);
  }

  CreateAccount(body) {
    return this.http.post(`${this.URL}/account`, body, {
      observe: 'response',
    });
  }

  Log(body) {
    return this.http.get(`${this.URL}/account/login/${body}`, {
      observe: 'response',
    });
  }

  removeConnected(id) {
    return this.http.get(`${this.URL}/account/remove/${id}`);
  }

  observeToken(): Observable<string> {
    return merge(
      of(this.LocalStorageService.retrieve('token')),
      this.LocalStorageService.observe('token')
    );
  }

  isAuthenticated(): Observable<boolean> {
    return this.observeToken().pipe(map((result) => !!result));
  }
}
