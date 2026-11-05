export type BookingStatus =
  | "Pending"
  | "Confirmed"
  | "Completed"
  | "Cancelled";

/** A studio document as returned by the Express/MongoDB API. */
export interface Studio {
  _id: string;
  title: string;
  category: string;
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  location: string;
  imageUrl: string;
  amenities: string[];
  overview: string;
  ownerEmail: string;
  ownerName: string;
  rating: number;
  createdAt?: string;
  updatedAt?: string;
  /** Optional extra gallery images. */
  images?: string[];
}

/** Payload accepted by POST /studios and PUT /studios/:id. */
export interface StudioInput {
  title: string;
  category: string;
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  location: string;
  imageUrl: string;
  amenities: string[];
  overview: string;
  ownerEmail: string;
  ownerName: string;
}

export interface Booking {
  _id: string;
  studioId: string;
  studioTitle: string;
  imageUrl: string;
  userEmail: string;
  userName: string;
  hostEmail: string;
  bookingDate: string;
  totalPrice: number;
  status: BookingStatus;
  createdAt?: string;
}

export interface BookingInput {
  studioId: string;
  studioTitle: string;
  imageUrl: string;
  userEmail: string;
  userName: string;
  hostEmail: string;
  bookingDate: string;
  totalPrice: number;
}
