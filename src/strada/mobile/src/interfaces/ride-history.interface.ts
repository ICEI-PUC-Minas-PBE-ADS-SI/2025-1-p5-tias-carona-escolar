export interface RideHistoryInterface {
    id: number;
    date: string;
    time: string;
    type: "driver" | "passenger";
    status: "completed" | "cancelled" | "ongoing";
    origin: string;
    destination: string;
    distance: string;
    duration: string;
    price: string;
    participants: ParticipantsInterface[];
    cancellationReason?: string;
}

export interface ParticipantsInterface {
    name: string;
    rating: number;
    photo: string;
    role: "passenger" | "driver";
}