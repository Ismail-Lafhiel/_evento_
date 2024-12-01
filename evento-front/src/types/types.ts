export interface Location {
  _id?: string;
  address: string;
  city: string;
  country: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  fullname: string;
  eventsOrganized: Event[];
  registeredEvents: Event[];
}

export interface Event {
  _id?: string;
  name: string;
  description: string;
  sportType: string;
  date: Date;
  capacity: number;
  location: Location | string;
  participants: (User | string)[];
  createdAt?: Date;
  updatedAt?: Date;
}
