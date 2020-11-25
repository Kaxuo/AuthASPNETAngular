import { Rooms } from './Rooms';
export interface MongoUsers {
  id: string;
  username: string;
  rooms: Rooms[];
  contacts: Contact[];
}

interface Contact {
  contactName: string;
  contactId: string;
}
