import api from "../lib/api";

import {
    transferVehicles as initialTransferVehicles,
    TransferVehicle,
} from "../data/transferVehicles";

import {
    getTransferBookings,
    isActiveTransferBooking,
    TransferBooking,
} from "./transferService";

const STORAGE_KEY = "stayway_transfer_vehicles";

/* =========================================================
   BACKEND API
========================================================= */

export async function getTransferVehiclesFromApi(): Promise<
    TransferVehicle[]
> {
    const response =
        await api.get<TransferVehicle[]>(
            "/api/TransferVehicles"
        );

    const vehicles = response.data;

    saveTransferVehicles(vehicles);

    return vehicles;
}

export async function getTransferVehicleByIdFromApi(
    vehicleId: string
): Promise<TransferVehicle> {
    const response =
        await api.get<TransferVehicle>(
            `/api/TransferVehicles/${vehicleId}`
        );

    return response.data;
}

export async function getTransferVehiclesByCityFromApi(
    city: string
): Promise<TransferVehicle[]> {
    const response =
        await api.get<TransferVehicle[]>(
            `/api/TransferVehicles/city/${encodeURIComponent(
                city
            )}`
        );

    return response.data;
}

export async function createTransferVehicleInApi(
    vehicle: TransferVehicle
): Promise<TransferVehicle> {
    const response =
        await api.post<TransferVehicle>(
            "/api/TransferVehicles",
            vehicle
        );

    await getTransferVehiclesFromApi();

    return response.data;
}

export async function updateTransferVehicleInApi(
    vehicleId: string,
    updates: Partial<TransferVehicle>
): Promise<TransferVehicle> {
    /*
     * Backend PUT expects the complete vehicle,
     * therefore we first obtain the current object
     * and then apply the requested changes.
     */
    let currentVehicle: TransferVehicle;

    try {
        currentVehicle =
            await getTransferVehicleByIdFromApi(
                vehicleId
            );
    } catch {
        const localVehicle =
            getTransferVehicleById(vehicleId);

        if (!localVehicle) {
            throw new Error(
                "Transfer vehicle not found."
            );
        }

        currentVehicle = localVehicle;
    }

    const updatedVehicle: TransferVehicle = {
        ...currentVehicle,
        ...updates,
        id: vehicleId,
    };

    const response =
        await api.put<TransferVehicle>(
            `/api/TransferVehicles/${vehicleId}`,
            updatedVehicle
        );

    await getTransferVehiclesFromApi();

    return response.data;
}

export async function deleteTransferVehicleInApi(
    vehicleId: string
): Promise<void> {
    await api.delete(
        `/api/TransferVehicles/${vehicleId}`
    );

    await getTransferVehiclesFromApi();
}

/* =========================================================
   LOCAL STORAGE FALLBACK
========================================================= */

export function getTransferVehicles(): TransferVehicle[] {
    if (typeof window === "undefined") {
        return initialTransferVehicles;
    }

    const stored =
        localStorage.getItem(STORAGE_KEY);

    if (!stored) {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(
                initialTransferVehicles
            )
        );

        return initialTransferVehicles;
    }

    try {
        const storedVehicles: TransferVehicle[] =
            JSON.parse(stored);

        /*
         * Keep existing saved data, but automatically
         * add any initial vehicles that are missing
         * from localStorage.
         */
        const updatedVehicles =
            initialTransferVehicles.map(
                (initialVehicle) => {
                    const existingVehicle =
                        storedVehicles.find(
                            (vehicle) =>
                                vehicle.id ===
                                initialVehicle.id
                        );

                    if (!existingVehicle) {
                        return initialVehicle;
                    }

                    return {
                        ...initialVehicle,
                        ...existingVehicle,

                        licensePlate:
                            existingVehicle
                                .licensePlate ||
                            initialVehicle
                                .licensePlate ||
                            "",

                        driverId:
                            existingVehicle
                                .driverId ||
                            initialVehicle
                                .driverId,
                    };
                }
            );

        /*
         * Keep custom vehicles created from
         * Admin as well.
         */
        const customVehicles =
            storedVehicles.filter(
                (vehicle) =>
                    !initialTransferVehicles.some(
                        (initialVehicle) =>
                            initialVehicle.id ===
                            vehicle.id
                    )
            );

        const allVehicles = [
            ...updatedVehicles,
            ...customVehicles,
        ];

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(allVehicles)
        );

        return allVehicles;
    } catch {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(
                initialTransferVehicles
            )
        );

        return initialTransferVehicles;
    }
}

export function saveTransferVehicles(
    vehicles: TransferVehicle[]
): void {
    if (typeof window === "undefined") {
        return;
    }

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(vehicles)
    );
}

export function createTransferVehicle(
    vehicle: TransferVehicle
): TransferVehicle {
    const vehicles =
        getTransferVehicles();

    const newVehicle = {
        ...vehicle,

        id:
            vehicle.id ||
            `vehicle-${Date.now()}`,
    };

    saveTransferVehicles([
        ...vehicles,
        newVehicle,
    ]);

    return newVehicle;
}

export function updateTransferVehicle(
    vehicleId: string,
    updates: Partial<TransferVehicle>
): TransferVehicle | null {
    const vehicles =
        getTransferVehicles();

    const index =
        vehicles.findIndex(
            (vehicle) =>
                vehicle.id === vehicleId
        );

    if (index === -1) {
        return null;
    }

    const updatedVehicle = {
        ...vehicles[index],
        ...updates,
    };

    vehicles[index] =
        updatedVehicle;

    saveTransferVehicles(
        vehicles
    );

    return updatedVehicle;
}

export function deleteTransferVehicle(
    vehicleId: string
): boolean {
    const vehicles =
        getTransferVehicles();

    const filteredVehicles =
        vehicles.filter(
            (vehicle) =>
                vehicle.id !== vehicleId
        );

    if (
        filteredVehicles.length ===
        vehicles.length
    ) {
        return false;
    }

    saveTransferVehicles(
        filteredVehicles
    );

    return true;
}

export function getTransferVehiclesByCity(
    city: string
): TransferVehicle[] {
    return getTransferVehicles().filter(
        (vehicle) =>
            vehicle.city.toLowerCase() ===
            city.toLowerCase()
    );
}

export function getTransferVehicleById(
    vehicleId: string
): TransferVehicle | undefined {
    return getTransferVehicles().find(
        (vehicle) =>
            vehicle.id === vehicleId
    );
}

/* =========================================================
   VEHICLE BOOKINGS
========================================================= */

/**
 * Returns only active bookings assigned to a
 * specific vehicle.
 *
 * pending   -> occupies the vehicle
 * confirmed -> occupies the vehicle
 * cancelled -> does not occupy the vehicle
 *
 * Older bookings without a status are treated
 * as active by isActiveTransferBooking().
 */
export function getTransferVehicleBookings(
    vehicleId: string
): TransferBooking[] {
    return getTransferBookings().filter(
        (booking) =>
            booking.vehicleId === vehicleId &&
            isActiveTransferBooking(
                booking
            )
    );
}