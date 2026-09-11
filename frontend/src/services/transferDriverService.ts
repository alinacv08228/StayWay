import { getTransferBookings, TransferBooking } from "./transferService";

export type TransferDriver = {
    id: string;
    city: string;
    name: string;
    phone: string;
    status: "available" | "busy" | "inactive";
};

const initialTransferDrivers: TransferDriver[] = [
    // =========================
    // ATHENS
    // =========================
    {
        id: "driver-athens-1",
        city: "Athens",
        name: "Nikos Papadopoulos",
        phone: "+30 690 123 4567",
        status: "available",
    },
    {
        id: "driver-athens-2",
        city: "Athens",
        name: "Georgios Nikolaou",
        phone: "+30 691 234 5678",
        status: "available",
    },
    {
        id: "driver-athens-3",
        city: "Athens",
        name: "Dimitris Georgiou",
        phone: "+30 692 345 6789",
        status: "available",
    },
    {
        id: "driver-athens-4",
        city: "Athens",
        name: "Konstantinos Alexiou",
        phone: "+30 693 456 7890",
        status: "available",
    },
    {
        id: "driver-athens-5",
        city: "Athens",
        name: "Panagiotis Dimitriou",
        phone: "+30 694 567 8901",
        status: "available",
    },
    {
        id: "driver-athens-6",
        city: "Athens",
        name: "Andreas Nikolaidis",
        phone: "+30 695 678 9012",
        status: "available",
    },

    // =========================
    // BARCELONA
    // =========================
    {
        id: "driver-barcelona-1",
        city: "Barcelona",
        name: "Carlos Martinez",
        phone: "+34 612 345 678",
        status: "available",
    },
    {
        id: "driver-barcelona-2",
        city: "Barcelona",
        name: "Javier Garcia",
        phone: "+34 613 456 789",
        status: "available",
    },
    {
        id: "driver-barcelona-3",
        city: "Barcelona",
        name: "Miguel Fernandez",
        phone: "+34 614 567 890",
        status: "available",
    },
    {
        id: "driver-barcelona-4",
        city: "Barcelona",
        name: "Alejandro Ruiz",
        phone: "+34 615 678 901",
        status: "available",
    },
    {
        id: "driver-barcelona-5",
        city: "Barcelona",
        name: "Daniel Navarro",
        phone: "+34 616 789 012",
        status: "available",
    },
    {
        id: "driver-barcelona-6",
        city: "Barcelona",
        name: "Sergio Moreno",
        phone: "+34 617 890 123",
        status: "available",
    },

    // =========================
    // LISBON
    // =========================
    {
        id: "driver-lisbon-1",
        city: "Lisbon",
        name: "João Silva",
        phone: "+351 910 123 456",
        status: "available",
    },
    {
        id: "driver-lisbon-2",
        city: "Lisbon",
        name: "Miguel Santos",
        phone: "+351 911 234 567",
        status: "available",
    },
    {
        id: "driver-lisbon-3",
        city: "Lisbon",
        name: "Pedro Costa",
        phone: "+351 912 345 678",
        status: "available",
    },
    {
        id: "driver-lisbon-4",
        city: "Lisbon",
        name: "Rui Ferreira",
        phone: "+351 913 456 789",
        status: "available",
    },
    {
        id: "driver-lisbon-5",
        city: "Lisbon",
        name: "Tiago Rodrigues",
        phone: "+351 914 567 890",
        status: "available",
    },
    {
        id: "driver-lisbon-6",
        city: "Lisbon",
        name: "Bruno Almeida",
        phone: "+351 915 678 901",
        status: "available",
    },

    // =========================
    // MUNICH
    // =========================
    {
        id: "driver-munich-1",
        city: "Munich",
        name: "Thomas Müller",
        phone: "+49 170 1234567",
        status: "available",
    },
    {
        id: "driver-munich-2",
        city: "Munich",
        name: "Michael Schneider",
        phone: "+49 171 2345678",
        status: "available",
    },
    {
        id: "driver-munich-3",
        city: "Munich",
        name: "Daniel Weber",
        phone: "+49 172 3456789",
        status: "available",
    },
    {
        id: "driver-munich-4",
        city: "Munich",
        name: "Andreas Fischer",
        phone: "+49 173 4567890",
        status: "available",
    },
    {
        id: "driver-munich-5",
        city: "Munich",
        name: "Stefan Wagner",
        phone: "+49 174 5678901",
        status: "available",
    },
    {
        id: "driver-munich-6",
        city: "Munich",
        name: "Markus Hoffmann",
        phone: "+49 175 6789012",
        status: "available",
    },

    // =========================
    // PARIS
    // =========================
    {
        id: "driver-paris-1",
        city: "Paris",
        name: "Pierre Martin",
        phone: "+33 6 12 34 56 78",
        status: "available",
    },
    {
        id: "driver-paris-2",
        city: "Paris",
        name: "Thomas Bernard",
        phone: "+33 6 23 45 67 89",
        status: "available",
    },
    {
        id: "driver-paris-3",
        city: "Paris",
        name: "Julien Dubois",
        phone: "+33 6 34 56 78 90",
        status: "available",
    },
    {
        id: "driver-paris-4",
        city: "Paris",
        name: "Antoine Moreau",
        phone: "+33 6 45 67 89 01",
        status: "available",
    },
    {
        id: "driver-paris-5",
        city: "Paris",
        name: "Lucas Laurent",
        phone: "+33 6 56 78 90 12",
        status: "available",
    },
    {
        id: "driver-paris-6",
        city: "Paris",
        name: "Nicolas Lefevre",
        phone: "+33 6 67 89 01 23",
        status: "available",
    },

    // =========================
    // ROME
    // =========================
    {
        id: "driver-rome-1",
        city: "Rome",
        name: "Marco Rossi",
        phone: "+39 333 123 4567",
        status: "available",
    },
    {
        id: "driver-rome-2",
        city: "Rome",
        name: "Luca Bianchi",
        phone: "+39 334 234 5678",
        status: "available",
    },
    {
        id: "driver-rome-3",
        city: "Rome",
        name: "Matteo Romano",
        phone: "+39 335 345 6789",
        status: "available",
    },
    {
        id: "driver-rome-4",
        city: "Rome",
        name: "Andrea Conti",
        phone: "+39 336 456 7890",
        status: "available",
    },
    {
        id: "driver-rome-5",
        city: "Rome",
        name: "Francesco Ricci",
        phone: "+39 337 567 8901",
        status: "available",
    },
    {
        id: "driver-rome-6",
        city: "Rome",
        name: "Stefano Esposito",
        phone: "+39 338 678 9012",
        status: "available",
    },
];

const STORAGE_KEY = "stayway_transfer_drivers";

export function getTransferDrivers(): TransferDriver[] {
    if (typeof window === "undefined") {
        return initialTransferDrivers;
    }

    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(initialTransferDrivers)
        );

        return initialTransferDrivers;
    }

    try {
        const storedDrivers: TransferDriver[] = JSON.parse(stored);

        const updatedDrivers = initialTransferDrivers.map(
            (initialDriver) => {
                const existingDriver = storedDrivers.find(
                    (driver) => driver.id === initialDriver.id
                );

                return existingDriver || initialDriver;
            }
        );

        const customDrivers = storedDrivers.filter(
            (driver) =>
                !initialTransferDrivers.some(
                    (initialDriver) =>
                        initialDriver.id === driver.id
                )
        );

        const allDrivers = [
            ...updatedDrivers,
            ...customDrivers,
        ];

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(allDrivers)
        );

        return allDrivers;
    } catch {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(initialTransferDrivers)
        );

        return initialTransferDrivers;
    }
}

export function saveTransferDrivers(
    drivers: TransferDriver[]
): void {
    if (typeof window === "undefined") {
        return;
    }

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(drivers)
    );
}

export function createTransferDriver(
    driver: TransferDriver
): TransferDriver {
    const drivers = getTransferDrivers();

    const newDriver = {
        ...driver,
        id: driver.id || `driver-${Date.now()}`,
    };

    saveTransferDrivers([
        ...drivers,
        newDriver,
    ]);

    return newDriver;
}

export function updateTransferDriver(
    driverId: string,
    updates: Partial<TransferDriver>
): TransferDriver | null {
    const drivers = getTransferDrivers();

    const index = drivers.findIndex(
        (driver) => driver.id === driverId
    );

    if (index === -1) {
        return null;
    }

    const updatedDriver = {
        ...drivers[index],
        ...updates,
    };

    drivers[index] = updatedDriver;

    saveTransferDrivers(drivers);

    return updatedDriver;
}

export function deleteTransferDriver(
    driverId: string
): boolean {
    const drivers = getTransferDrivers();

    const filteredDrivers = drivers.filter(
        (driver) => driver.id !== driverId
    );

    if (filteredDrivers.length === drivers.length) {
        return false;
    }

    saveTransferDrivers(filteredDrivers);

    return true;
}

export function getTransferDriversByCity(
    city: string
): TransferDriver[] {
    return getTransferDrivers().filter(
        (driver) =>
            driver.city.toLowerCase() ===
            city.toLowerCase()
    );
}

export function getTransferDriverById(
    driverId: string
): TransferDriver | undefined {
    return getTransferDrivers().find(
        (driver) => driver.id === driverId
    );
}
export function getTransferDriverBookings(
    driverId: string
): TransferBooking[] {
    return getTransferBookings().filter(
        (booking) => booking.driverId === driverId
    );
}

export function getTransferDriverSchedule(
    driverId: string
): TransferBooking[] {
    return getTransferDriverBookings(driverId).filter(
        (booking) => booking.date && booking.time
    );
}


export function getTransferDriverStatus(
    driverId: string,
    date?: string,
    time?: string
): "available" | "busy" | "inactive" {
    const driver = getTransferDriverById(driverId);

    if (!driver) {
        return "available";
    }

    if (driver.status === "inactive") {
        return "inactive";
    }

    if (driver.status === "busy") {
        return "busy";
    }

    const bookings = getTransferDriverBookings(driverId);

    const getDuration = (booking: TransferBooking) =>
        booking.optionTitle
            .toLowerCase()
            .includes("family")
            ? 40
            : 35;

    const isOverlapping = (
        bookingDate: string,
        bookingTime: string,
        duration: number,
        requestedStart: number,
        requestedEnd: number
    ) => {
        const bookingStart = new Date(
            `${bookingDate}T${bookingTime}`
        ).getTime();

        if (Number.isNaN(bookingStart)) {
            return false;
        }

        const bookingEnd =
            bookingStart + duration * 60 * 1000;

        return (
            requestedStart < bookingEnd &&
            requestedEnd > bookingStart
        );
    };

    // If a specific date/time is provided,
    // check whether the driver is available for that period.
    if (date && time) {
        const requestedStart = new Date(
            `${date}T${time}`
        ).getTime();

        if (Number.isNaN(requestedStart)) {
            return "available";
        }

        const requestedEnd =
            requestedStart + 35 * 60 * 1000;

        const hasOverlappingBooking = bookings.some(
            (booking) => {
                const duration = getDuration(booking);

                if (
                    isOverlapping(
                        booking.date,
                        booking.time,
                        duration,
                        requestedStart,
                        requestedEnd
                    )
                ) {
                    return true;
                }

                if (
                    booking.transferType === "return" &&
                    booking.returnDate &&
                    booking.returnTime
                ) {
                    return isOverlapping(
                        booking.returnDate,
                        booking.returnTime,
                        duration,
                        requestedStart,
                        requestedEnd
                    );
                }

                return false;
            }
        );

        return hasOverlappingBooking
            ? "busy"
            : "available";
    }

    // In Admin: show the driver's status for the current moment.
    const now = Date.now();

    const isCurrentlyBusy = bookings.some(
        (booking) => {
            const duration = getDuration(booking);

            if (
                isOverlapping(
                    booking.date,
                    booking.time,
                    duration,
                    now,
                    now
                )
            ) {
                return true;
            }

            if (
                booking.transferType === "return" &&
                booking.returnDate &&
                booking.returnTime
            ) {
                return isOverlapping(
                    booking.returnDate,
                    booking.returnTime,
                    duration,
                    now,
                    now
                );
            }

            return false;
        }
    );

    return isCurrentlyBusy
        ? "busy"
        : "available";
}