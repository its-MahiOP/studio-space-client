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
  /** Extra gallery photos rendered as the detail-page carousel. */
  images?: string[];
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
  /** Length of the session in hours; the server derives the end of the window. */
  durationHours: number;
  totalPrice: number;
  /** New reservations always start as Pending; the API enforces this. */
  status: BookingStatus;
}

/** A creator review attached to a studio document. */
export interface Review {
  _id: string;
  studioId: string;
  studioTitle: string;
  userEmail: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ReviewInput {
  rating: number;
  comment: string;
}

/** A saved-studio row from the wishlists collection. */
export interface WishlistItem {
  _id: string;
  userEmail: string;
  studioId: string;
  studioTitle: string;
  imageUrl: string;
  createdAt?: string;
}
