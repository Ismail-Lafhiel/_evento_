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
  }
  
  export interface Event {
    _id?: string;
    name: string;
    description: string;
    sportType: string;
    date: Date;
    location: Location | string;
    participants: (User | string)[];
    createdAt?: Date;
    updatedAt?: Date;
  }
  