export enum AppMode {
  USER = 'USER',
  PROVIDER = 'PROVIDER'
}

export interface User {
  id: string;
  name: string;
  points: number;
  streak: number;
  avatar: string;
}

export interface Gym {
  id: string;
  name: string;
  address: string;
  rating: number;
  image: string;
  tags: string[];
  pricePerHour: number;
  lat: number;
  lng: number;
  capacity: number;
  description: string;
}

export interface Slot {
  id: string;
  gymId: string;
  time: string;
  seatsLeft: number;
  totalSeats: number;
}

export interface Booking {
  id: string;
  gymId: string;
  gymName: string;
  time: string;
  date: string;
  status: 'UPCOMING' | 'COMPLETED' | 'CANCELLED';
  qrCode: string;
}

export interface DailyChallenge {
  title: string;
  reward: number;
  target: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}