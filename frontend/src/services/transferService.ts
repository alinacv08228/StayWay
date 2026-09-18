import api from "../lib/api";

export type TransferBooking = {
    id: string;
    transferType: "one-way" | "return";
    optionId: string;
    optionTitle: string;
    price: number;

    vehicleId?: string;
    vehicleName?: string;
    licensePlate?: string;
    vehicleImage?: string;
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

    status?: "pending" | "confirmed" | "cancelled";

    createdAt: string;
};

export function getCanonicalTransferOptionTitle(
    optionId: string,
    optionTitle?: string
): string {
    const normalizedOptionId =
        optionId.trim().toLowerCase();

    const titlesByOptionId: Record<string, string> = {
        "1": "Private transfer",
        "private": "Private transfer",
        "2": "Comfort transfer",
        "comfort": "Comfort transfer",
        "3": "Family transfer",
        "family": "Family transfer",
    };

    const titleFromId =
        titlesByOptionId[normalizedOptionId];

    if (titleFromId) {
        return titleFromId;
    }

    const normalizedTitle =
        (optionTitle ?? "")
            .trim()
            .toLowerCase();

    if (normalizedTitle.includes("comfort")) {
        return "Comfort transfer";
    }

    if (normalizedTitle.includes("family")) {
        return "Family transfer";
    }

    if (
        normalizedTitle.includes("private") ||
        normalizedTitle.includes("individual")
    ) {
        return "Private transfer";
    }

    /*
     * StayWay currently has three fixed transfer options.
     * If an old/localized title reaches this point and the
     * option ID is unknown, keep a stable English fallback.
     */
    return "Private transfer";
}

// =========================================
// BACKEND API
// =========================================

export async function getTransferBookingsFromApi(): Promise<
    TransferBooking[]
> {
    const response = await api.get<TransferBooking[]>(
        "/api/TransferBookings"
    );

    return response.data;
}

export async function getTransferBookingFromApi(
    bookingId: string
): Promise<TransferBooking> {
    const response = await api.get<TransferBooking>(
        `/api/TransferBookings/${encodeURIComponent(bookingId)}`
    );

    return response.data;
}

export async function getTransferBookingsByDriverIdFromApi(
    driverId: string
): Promise<TransferBooking[]> {
    const response = await api.get<TransferBooking[]>(
        `/api/TransferBookings/driver/${encodeURIComponent(driverId)}`
    );

    return response.data;
}

export async function createTransferBookingInApi(
    booking: TransferBooking
): Promise<TransferBooking> {
    const normalizedBooking: TransferBooking = {
        ...booking,
        optionTitle:
            getCanonicalTransferOptionTitle(
                booking.optionId,
                booking.optionTitle
            ),
    };

    const response = await api.post<TransferBooking>(
        "/api/TransferBookings",
        normalizedBooking
    );

    return response.data;
}

export async function updateTransferBookingInApi(
    bookingId: string,
    booking: TransferBooking
): Promise<TransferBooking> {
    const normalizedBooking: TransferBooking = {
        ...booking,
        optionTitle:
            getCanonicalTransferOptionTitle(
                booking.optionId,
                booking.optionTitle
            ),
    };

    const response = await api.put<TransferBooking>(
        `/api/TransferBookings/${encodeURIComponent(bookingId)}`,
        normalizedBooking
    );

    return response.data;
}

export async function deleteTransferBookingInApi(
    bookingId: string
): Promise<void> {
    await api.delete(
        `/api/TransferBookings/${encodeURIComponent(bookingId)}`
    );
}

export function isActiveTransferBooking(
    booking: TransferBooking
): boolean {
    return (
        booking.status === undefined ||
        booking.status === "pending" ||
        booking.status === "confirmed"
    );
}

/**
 * Returns the duration used for availability checks.
 * Private and Comfort transfers take 35 minutes.
 * Family transfers take 40 minutes.
 */
export function getTransferDuration(
    optionTitle: string
): number {
    const normalizedTitle =
        optionTitle.toLowerCase();

    if (normalizedTitle.includes("family")) {
        return 40;
    }

    return 35;
}

function getTimestamp(
    date: string,
    time: string
): number | null {
    const timestamp = new Date(
        `${date}T${time}`
    ).getTime();

    return Number.isNaN(timestamp)
        ? null
        : timestamp;
}

function isTimeRangeOverlapping(
    requestedStart: number,
    requestedEnd: number,
    existingStart: number,
    existingEnd: number
): boolean {
    return (
        requestedStart < existingEnd &&
        requestedEnd > existingStart
    );
}

/**
 * Checks whether one requested transfer leg overlaps
 * with one booking leg.
 */
export function isTransferLegBusy(
    bookingDate: string,
    bookingTime: string,
    bookingDuration: number,
    requestedDate: string,
    requestedTime: string,
    requestedDuration: number
): boolean {
    const existingStart = getTimestamp(
        bookingDate,
        bookingTime
    );

    const requestedStart = getTimestamp(
        requestedDate,
        requestedTime
    );

    if (
        existingStart === null ||
        requestedStart === null
    ) {
        return false;
    }

    const existingEnd =
        existingStart +
        bookingDuration * 60 * 1000;

    const requestedEnd =
        requestedStart +
        requestedDuration * 60 * 1000;

    return isTimeRangeOverlapping(
        requestedStart,
        requestedEnd,
        existingStart,
        existingEnd
    );
}
