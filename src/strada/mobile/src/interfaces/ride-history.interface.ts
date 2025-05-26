export interface RideHistoryInterface {
    id: string; // Changed to string to match API
    driver_id?: string; // Optional, only for passenger view
    date: string;
    time: string;
    type: "passenger" | "driver";
    status: "completed" | "cancelled" | "active" | "pending" | "accepted"; // Added 'active', 'pending', 'accepted'
    origin: string;
    destination: string;
    distance: string;
    duration: string;
    price: string;
    cancellationReason?: string;
  }

export interface ParticipantsInterface {
    name: string;
    rating: number;
    photo: string;
    role: "passenger" | "driver";
}