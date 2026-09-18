import api from "../lib/api";

export type TransferDriver = {
    id: string;
    city: string;
    name: string;
    phone: string;
    status: "available" | "busy" | "inactive";
};

/* =========================================================
   BACKEND API
========================================================= */

export async function getTransferDriversFromApi(): Promise<
    TransferDriver[]
> {
    const response = await api.get<TransferDriver[]>(
        "/api/TransferDrivers"
    );

    return response.data;
}

export async function getTransferDriverFromApi(
    driverId: string
): Promise<TransferDriver> {
    const response = await api.get<TransferDriver>(
        `/api/TransferDrivers/${encodeURIComponent(driverId)}`
    );

    return response.data;
}

export async function getTransferDriversByCityFromApi(
    city: string
): Promise<TransferDriver[]> {
    const response = await api.get<TransferDriver[]>(
        `/api/TransferDrivers/city/${encodeURIComponent(city)}`
    );

    return response.data;
}

export async function createTransferDriverInApi(
    driver: TransferDriver
): Promise<TransferDriver> {
    const response = await api.post<TransferDriver>(
        "/api/TransferDrivers",
        driver
    );

    return response.data;
}

export async function updateTransferDriverInApi(
    driverId: string,
    driver: TransferDriver
): Promise<TransferDriver> {
    const response = await api.put<TransferDriver>(
        `/api/TransferDrivers/${encodeURIComponent(driverId)}`,
        driver
    );

    return response.data;
}

export async function deleteTransferDriverInApi(
    driverId: string
): Promise<void> {
    await api.delete(
        `/api/TransferDrivers/${encodeURIComponent(driverId)}`
    );
}
