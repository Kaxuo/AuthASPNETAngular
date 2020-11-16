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

  readonly GET_URL = 'https://localhost:5001/api/chat/public';
  readonly POST_URL = 'https://localhost:5001/api/chat/public/send';

  private connection: any;

  private receivedMessageObject: any = { user: 'lmao' };
  private sharedObj = new Subject<MessageReceived>();

  private singleUser: any = { userId: 'lmao' };
  private sharedSingle = new Subject<any>();

  private usersConnection: any = { users: 'lmao' };
  private sharedUsers = new Subject<any>();

  constructor(
    private http: HttpClient,
    private LocalStorageService: LocalStorageService
  ) {
    // this.connection.on('ReceiveOne', (user, message) => {
    //   this.mapReceivedMessage(user, message);
    // });
    this.isAuthenticated().subscribe((authenticated) => {
      if (authenticated) {
        this.start();
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
      .configureLogging(signalR.LogLevel.Information)
      .build();
    try {
      await this.connection.start();
      this.connection.on(
        'receiveNewPublicMessage',
        (user, message, sentDate) => {
          this.mapReceivedMessage(user, message, sentDate);
        }
      );
      this.connection.on('updatedConnectedUser', (user) => {
        this.singleUserConnected(user);
      });
      this.connection.on('userConnectedList', (users) => {
        this.usersConnecting(users);
      });

      this.connection.onclose(async (user) => {
        console.log('someonedisconnectedCLOSE');
        this.isAuthenticated().subscribe((authenticated) => {
          if (authenticated) {
            setTimeout(() => this.start(), 1000);
          }
        });
      });
      console.log('connected');
    } catch (err) {
      console.log(err);
      setTimeout(() => this.start(), 5000);
    }
  }

  // Receive message and put them as the next value in the river //
  private mapReceivedMessage(user: string, message: string, date: Date): void {
    this.receivedMessageObject.senderName = user;
    this.receivedMessageObject.content = message;
    this.receivedMessageObject.sentDate = date;
    this.sharedObj.next(this.receivedMessageObject);
  }

  // Get the user that connects
  private singleUserConnected(userId: string) {
    this.singleUser.userId = userId;
    this.sharedSingle.next(this.singleUser);
  }

  // Get all the users and put them as the next value in the river if someone connects
  private usersConnecting(users: string) {
    this.usersConnection.users = users;
    this.sharedUsers.next(this.usersConnection);
  }

  private userDisconnecting(user: string) {
    this.usersConnection.userId = user;
  }

  /* ****************************** Public Methods **************************************** */

  // Calls the controller method
  public GetMessage() {
    return this.http.get(this.GET_URL);
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

  public retrieveSingleUser(): Observable<MessageReceived> {
    return this.sharedSingle.asObservable();
  }

  public retrieveUsers(): Observable<MessageReceived> {
    return this.sharedUsers.asObservable();
  }

  public disconnectUser() {
    this.connection.stop();
  }

  // Charlotte
  GetAllUserMongo() {
    return this.http.get('https://localhost:5001/api/account/');
  }

  GetAllConnectedUserMongo() {
    return this.http.get('https://localhost:5001/api/account/all');
  }

  CreateAccount(body) {
    return this.http.post('https://localhost:5001/api/account/', body, {
      observe: 'response',
    });
  }

  Log(body) {
    return this.http.get(`https://localhost:5001/api/account/login/${body}`, {
      observe: 'response',
    });
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
