import { ConnectedUsers } from './ConnectedUsers';
export interface Rooms {
  id: string;
  roomName: string;
  roomUsers?: ConnectedUsers[];
}
