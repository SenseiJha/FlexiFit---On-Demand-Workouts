import { Gym, User, Booking, DailyChallenge, Slot } from "../types";

export const CURRENT_USER: User = {
  id: 'u1',
  name: 'Sidhant',
  points: 2450,
  streak: 12,
  avatar: 'https://picsum.photos/100/100'
};

export const GYMS: Gym[] = [
  {
    id: 'g1',
    name: 'Iron Paradise Gym',
    address: '12 Main St, Downtown',
    rating: 4.8,
    image: 'https://picsum.photos/800/600?random=1',
    tags: ['Gym', 'Strength', 'Sauna'],
    pricePerHour: 150,
    lat: 37.7749,
    lng: -122.4194,
    capacity: 85,
    description: 'Premium equipment, juice bar, and expert trainers on floor.'
  },
  {
    id: 'g2',
    name: 'Zen Soul Yoga',
    address: '45 River Rd, Green Valley',
    rating: 4.9,
    image: 'https://picsum.photos/800/600?random=2',
    tags: ['Yoga', 'Meditation', 'Pilates'],
    pricePerHour: 200,
    lat: 37.7849,
    lng: -122.4094,
    capacity: 40,
    description: 'Find your inner peace with our sunrise yoga sessions.'
  },
  {
    id: 'g3',
    name: 'Velocity Cycling',
    address: '88 Turbo Ln, Metro',
    rating: 4.7,
    image: 'https://picsum.photos/800/600?random=3',
    tags: ['Cycling', 'Cardio', 'HIIT'],
    pricePerHour: 180,
    lat: 37.7649,
    lng: -122.4294,
    capacity: 92,
    description: 'High intensity cycling to the beat of the music.'
  },
];

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'b1',
    gymId: 'g1',
    gymName: 'Iron Paradise Gym',
    time: '18:00',
    date: '2023-10-25',
    status: 'UPCOMING',
    qrCode: 'mock-qr-code-data'
  },
  {
    id: 'b2',
    gymId: 'g2',
    gymName: 'Zen Soul Yoga',
    time: '07:00',
    date: '2023-10-22',
    status: 'COMPLETED',
    qrCode: 'mock-qr-code-data-2'
  }
];

export const DAILY_CHALLENGE: DailyChallenge = {
  title: "The Early Bird",
  reward: 150,
  target: "Book a morning session (before 9 AM)"
};

export const GENERATE_SLOTS = (gymId: string): Slot[] => [
  { id: 's1', gymId, time: '06:00 AM', seatsLeft: 5, totalSeats: 20 },
  { id: 's2', gymId, time: '07:00 AM', seatsLeft: 2, totalSeats: 20 },
  { id: 's3', gymId, time: '05:00 PM', seatsLeft: 12, totalSeats: 20 },
  { id: 's4', gymId, time: '06:00 PM', seatsLeft: 0, totalSeats: 20 },
];