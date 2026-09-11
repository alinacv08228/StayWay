export type TransferBooking = {
    id: string;
    transferType: "one-way" | "return";
    optionId: string;
    optionTitle: string;
    price: number;

    vehicleId?: string;
    vehicleName?: string;
    licensePlate?: string;
    driverId?: string;
    driverName?: string;

    pickup: string;
    destination: string;

    date: string;
    time: string;
    passengers: number;

    returnDate?: string;
    returnTime?: string;

    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    specialRequests: string;

    createdAt: string;
};

const STORAGE_KEY = "stayway_transfers";

export function getTransferBookings(): TransferBooking[] {
    if (typeof window === "undefined") {
        return [];
    }

    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
        return [];
    }

    try {
        return JSON.parse(stored);
    } catch {
        return [];
    }
}

export function saveTransferBooking(
    booking: TransferBooking
): void {
    if (typeof window === "undefined") {
        return;
    }

    const bookings = getTransferBookings();

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([booking, ...bookings])
    );
}

export function getTransferDriverBookings(
    driverId: string
): TransferBooking[] {
    return getTransferBookings().filter(
        (booking) => booking.driverId === driverId
    );
}

export function isTransferDriverBusy(
    driverId: string,
    date: string,
    time: string,
    durationMinutes: number = 60
): boolean {
    const bookings = getTransferDriverBookings(driverId);

    const requestedStart = new Date(
        `${date}T${time}`
    ).getTime();

    const requestedEnd =
        requestedStart + durationMinutes * 60 * 1000;

    return bookings.some((booking) => {
        const bookingStart = new Date(
            `${booking.date}T${booking.time}`
        ).getTime();

        const bookingEnd =
            bookingStart + durationMinutes * 60 * 1000;

        return (
            requestedStart < bookingEnd &&
            requestedEnd > bookingStart
        );
    });
}