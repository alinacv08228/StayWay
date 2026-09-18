import api from "../lib/api";
import { Destination } from "../types/types";

/* =========================================================
   BACKEND API
========================================================= */

export async function getDestinationsFromApi(): Promise<Destination[]> {
    const response =
        await api.get<Destination[]>(
            "/api/Destinations"
        );

    return response.data;
}

export async function createDestinationInApi(
    destination: Destination
): Promise<Destination> {
    const response =
        await api.post<Destination>(
            "/api/Destinations",
            destination
        );

    return response.data;
}

export async function updateDestinationInApi(
    destination: Destination
): Promise<Destination> {
    const response =
        await api.put<Destination>(
            `/api/Destinations/${destination.id}`,
            destination
        );

    return response.data;
}

export async function deleteDestinationInApi(
    destinationId: number
): Promise<void> {
    await api.delete(
        `/api/Destinations/${destinationId}`
    );
}
