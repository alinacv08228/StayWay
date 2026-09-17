import api from "../lib/api";

export type Booking = {
    id: number;
    userId: string;
    propertyId: number;
    roomId?: number;
    checkIn: string;
    checkOut: string;
    adults: number;
    children: number;
    infants: number;
    guests: number;
    totalPrice: number;
    status: "pending" | "confirmed" | "cancelled" | string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    specialRequests: string;
};

export type BookingInput = Omit<Booking, "id">;

export async function getBookingsFromApi(): Promise<Booking[]> {
    const response = await api.get<Booking[]>("/api/Bookings");
    return response.data;
}

export async function getBookingByIdFromApi(
    bookingId: number
): Promise<Booking> {
    const response = await api.get<Booking>(
        `/api/Bookings/${bookingId}`
    );

    return response.data;
}

export async function getBookingsByUserIdFromApi(
    userId: string | number
): Promise<Booking[]> {
    const response = await api.get<Booking[]>(
        `/api/Bookings/user/${String(userId)}`
    );

    return response.data;
}

export async function checkRoomAvailabilityFromApi(
    propertyId: number,
    roomId: number,
    checkIn: string,
    checkOut: string
): Promise<boolean> {
    const response = await api.get<boolean>(
        "/api/Bookings/availability",
        {
            params: {
                propertyId,
                roomId,
                checkIn,
                checkOut,
            },
        }
    );

    return response.data;
}

export async function createBookingInApi(
    booking: BookingInput
): Promise<Booking> {
    const response = await api.post<Booking>(
        "/api/Bookings",
        {
            id: 0,
            ...booking,
            userId: String(booking.userId),
        }
    );

    return response.data;
}

export async function updateBookingInApi(
    bookingId: number,
    booking: BookingInput
): Promise<Booking> {
    const response = await api.put<Booking>(
        `/api/Bookings/${bookingId}`,
        {
            id: bookingId,
            ...booking,
            userId: String(booking.userId),
        }
    );

    return response.data;
}

export async function deleteBookingInApi(
    bookingId: number
): Promise<void> {
    await api.delete(`/api/Bookings/${bookingId}`);
}