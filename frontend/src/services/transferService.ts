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

    status?: "pending" | "confirmed" | "cancelled";

    createdAt: string;
};

const STORAGE_KEY = "stayway_transfers";

/**
 * Only pending and confirmed bookings occupy a vehicle/driver.
 * Cancelled bookings must never block availability.
 *
 * Older bookings without a status are treated as confirmed
 * for backwards compatibility with existing localStorage data.
 */
export function isActiveTransferBooking(
    booking: TransferBooking
): boolean {
    return (
        booking.status === undefined ||
        booking.status === "pending" ||
        booking.status === "confirmed"
    );
}

export function getTransferBookings(): TransferBooking[] {
    if (typeof window === "undefined") {
        return [];
    }

    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
        return [];
    }

    try {
        const parsed = JSON.parse(stored);

        if (!Array.isArray(parsed)) {
            return [];
        }

        return parsed as TransferBooking[];
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
        (booking) =>
            booking.driverId === driverId &&
            isActiveTransferBooking(booking)
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

/**
 * Checks a requested leg against every occupied leg
 * of the driver's existing bookings.
 *
 * For Return bookings, both the outbound and return
 * legs are checked.
 */
export function isTransferDriverBusy(
    driverId: string,
    date: string,
    time: string,
    durationMinutes: number = 60,
    returnDate?: string,
    returnTime?: string
): boolean {
    const bookings =
        getTransferDriverBookings(driverId);

    const requestedLegs: {
        date: string;
        time: string;
    }[] = [
        {
            date,
            time,
        },
    ];

    if (returnDate && returnTime) {
        requestedLegs.push({
            date: returnDate,
            time: returnTime,
        });
    }

    return bookings.some((booking) => {
        const existingDuration =
            getTransferDuration(
                booking.optionTitle
            );

        const existingLegs: {
            date: string;
            time: string;
        }[] = [
            {
                date: booking.date,
                time: booking.time,
            },
        ];

        if (
            booking.transferType === "return" &&
            booking.returnDate &&
            booking.returnTime
        ) {
            existingLegs.push({
                date: booking.returnDate,
                time: booking.returnTime,
            });
        }

        return requestedLegs.some(
            (requestedLeg) =>
                existingLegs.some(
                    (existingLeg) =>
                        isTransferLegBusy(
                            existingLeg.date,
                            existingLeg.time,
                            existingDuration,
                            requestedLeg.date,
                            requestedLeg.time,
                            durationMinutes
                        )
                )
        );
    });
}
