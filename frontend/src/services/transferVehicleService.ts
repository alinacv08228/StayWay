import {
    transferVehicles as initialTransferVehicles,
    TransferVehicle,
} from "../data/transferVehicles";

const STORAGE_KEY = "stayway_transfer_vehicles";

export function getTransferVehicles(): TransferVehicle[] {
    if (typeof window === "undefined") {
        return initialTransferVehicles;
    }

    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(initialTransferVehicles)
        );

        return initialTransferVehicles;
    }

    try {
        const storedVehicles: TransferVehicle[] = JSON.parse(stored);

        // Keep existing saved data, but automatically add any
        // initial vehicles that are missing from localStorage.
        const updatedVehicles = initialTransferVehicles.map(
            (initialVehicle) => {
                const existingVehicle = storedVehicles.find(
                    (vehicle) => vehicle.id === initialVehicle.id
                );

                if (!existingVehicle) {
                    return initialVehicle;
                }

                return {
                    ...initialVehicle,
                    ...existingVehicle,
                    licensePlate:
                        existingVehicle.licensePlate ||
                        initialVehicle.licensePlate ||
                        "",
                    driverId:
                        existingVehicle.driverId ||
                        initialVehicle.driverId,
                };
            }
        );

        // Keep custom vehicles created from Admin as well.
        const customVehicles = storedVehicles.filter(
            (vehicle) =>
                !initialTransferVehicles.some(
                    (initialVehicle) =>
                        initialVehicle.id === vehicle.id
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
            JSON.stringify(initialTransferVehicles)
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
    const vehicles = getTransferVehicles();

    const newVehicle = {
        ...vehicle,
        id: vehicle.id || `vehicle-${Date.now()}`,
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
    const vehicles = getTransferVehicles();

    const index = vehicles.findIndex(
        (vehicle) => vehicle.id === vehicleId
    );

    if (index === -1) {
        return null;
    }

    const updatedVehicle = {
        ...vehicles[index],
        ...updates,
    };

    vehicles[index] = updatedVehicle;

    saveTransferVehicles(vehicles);

    return updatedVehicle;
}

export function deleteTransferVehicle(
    vehicleId: string
): boolean {
    const vehicles = getTransferVehicles();

    const filteredVehicles = vehicles.filter(
        (vehicle) => vehicle.id !== vehicleId
    );

    if (filteredVehicles.length === vehicles.length) {
        return false;
    }

    saveTransferVehicles(filteredVehicles);

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
        (vehicle) => vehicle.id === vehicleId
    );
}
