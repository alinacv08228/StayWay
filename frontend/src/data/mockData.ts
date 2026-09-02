import { Booking, Destination, Property, User } from "../types/types";

export const users: User[] = [
    {
        id: 1,
        name: "Alina",
        email: "alina@example.com",
        role: "user",
    },
    {
        id: 2,
        name: "Admin",
        email: "admin@stayway.com",
        role: "admin",
    },
];

export const destinations: Destination[] = [
    {
        id: 1,
        name: "Paris",
        country: "France",
        image: "/paris.jpg",
    },
    {
        id: 2,
        name: "Rome",
        country: "Italy",
        image: "/rome.jpg",
    },
    {
        id: 3,
        name: "Barcelona",
        country: "Spain",
        image: "/barcelona.jpg",
    },
];

export const properties: Property[] = [
    {
        id: 1,
        name: "Hotel Paris Central",
        destinationId: 1,
        address: "Paris, France",
        rating: 4.8,
        pricePerNight: 120,
        image: "/hotel-paris.jpg",
    },
    {
        id: 2,
        name: "Rome City Hotel",
        destinationId: 2,
        address: "Rome, Italy",
        rating: 4.6,
        pricePerNight: 95,
        image: "/hotel-rome.jpg",
    },
    {
        id: 3,
        name: "Barcelona Beach Hotel",
        destinationId: 3,
        address: "Barcelona, Spain",
        rating: 4.9,
        pricePerNight: 150,
        image: "/hotel-barcelona.jpg",
    },
];

export const bookings: Booking[] = [
    {
        id: 1,
        userId: 1,
        propertyId: 1,
        checkIn: "2026-09-10",
        checkOut: "2026-09-14",
        guests: 2,
        totalPrice: 480,
        status: "confirmed",
    },
];