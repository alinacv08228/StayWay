export interface User {
    id: number;
    name: string;
    email: string;
    role: "user" | "admin";
}

export interface Destination {
    id: number;
    name: string;
    country: string;
    image: string;
}

export interface Property {
    id: number;
    name: string;
    destinationId: number;
    address: string;
    rating: number;
    pricePerNight: number;
    image: string;
}

export interface Booking {
    id: number;
    userId: number;
    propertyId: number;
    checkIn: string;
    checkOut: string;
    guests: number;
    totalPrice: number;
    status: "confirmed" | "cancelled" | "pending";
}