// export interface MessageReceived {
//   user: string;
//   dateCreated?: Date;
//   message: string;
//   id?: number;
// }

export interface MessageReceived {
  senderName: string;
  sentDate?: Date;
  content: string;
  senderId?: number;
}
