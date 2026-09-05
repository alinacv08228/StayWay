export interface User {
    id: number;
    name: string;
    email: string;
    role: "user" | "admin";
}

export interface Country {
    id: number;
    name: string;
    image: string;
}

export interface Destination {
    id: number;
    name: string;
    country: string;
    image: string;
    countryImage: string;
}

export interface Property {
    id: number;
    name: string;
    description?: string;
    destinationId: number;
    address: string;
    rating: number;
    pricePerNight: number;
    image: string;
}

export interface Room {
    id: number;
    propertyId: number;
    name: string;
    description: string;
    guests: number;
    size: number | string;
    bed: string;
    pricePerNight: number;
    image: string;
    features: string[];
    freeCancellation?: boolean;
    noPrepayment?: boolean;
}

export interface Review {
    id: number;
    propertyId: number;
    userId?: number;
    userName: string;
    rating: number;
    comment: string;
    createdAt?: string;
    isMock?: boolean;
}

export interface Booking {
    id: number;
    userId: number;
    propertyId: number;
    roomId: number;
    checkIn: string;
    checkOut: string;
    adults?: number;
    children?: number;
    infants?: number;
    guests: number;
    totalPrice: number;
    status: "confirmed" | "cancelled";
}