export interface RideData {
  id: number;
  driverName: string;
  driverImage: string;
  carModel: string;
  carColor?: string;
  licensePlate?: string;
  seatsAvailable: number;
  dist?: number;
  reviews?: number;
  rating: number;
  pricePerSeat: number;
  totalFare?: number;
  departureLocation: string;
  departureTime: string;
  duration: string;
  availableSeats: number;
  destination: string;
  isFavorite?: boolean;
  paymentMethod?: string;
  pickup?: {
    address: string;
    coordinates: [number, number];
  };
  dropoff?: {
    address: string;
    coordinates: [number, number];
  };
  passengers?: {
    id: number;
    name: string;
    imgUrl: string;
    rating: number;
    pickup?: {
      address: string;
      coordinates: [number, number];
    };
  }[];
  feedback?: string;
}