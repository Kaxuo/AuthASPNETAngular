import { Rooms } from './Rooms';
export interface MongoUsers {
  id: string;
  username: string;
  rooms: Rooms[];
}
