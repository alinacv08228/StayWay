import api from "../lib/api";

import type {
    TransferVehicle,
} from "../data/transferVehicles";

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

    return response.data;
}

export async function getTransferVehicleByIdFromApi(
    vehicleId: string
): Promise<TransferVehicle> {
    const response =
        await api.get<TransferVehicle>(
            `/api/TransferVehicles/${encodeURIComponent(
                vehicleId
            )}`
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

    return response.data;
}

export async function updateTransferVehicleInApi(
    vehicleId: string,
    updates: Partial<TransferVehicle>
): Promise<TransferVehicle> {
    /*
     * Backend PUT expects the complete vehicle.
     * Load the current backend entity first,
     * then merge the requested changes.
     */
    const currentVehicle =
        await getTransferVehicleByIdFromApi(
            vehicleId
        );

    const updatedVehicle: TransferVehicle = {
        ...currentVehicle,
        ...updates,
        id: vehicleId,
    };

    const response =
        await api.put<TransferVehicle>(
            `/api/TransferVehicles/${encodeURIComponent(
                vehicleId
            )}`,
            updatedVehicle
        );

    return response.data;
}

export async function deleteTransferVehicleInApi(
    vehicleId: string
): Promise<void> {
    await api.delete(
        `/api/TransferVehicles/${encodeURIComponent(
            vehicleId
        )}`
    );
}
