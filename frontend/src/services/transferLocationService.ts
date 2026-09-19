import api from "../lib/api";

export type TransferLocation = {
    id: string;
    cityId: number;
    cityName: string;
    type: "airport" | "hotel";
    name: string;
    code?: string;
    searchTerms: string[];
};

export async function getTransferLocationsFromApi():
    Promise<TransferLocation[]> {
    const response =
        await api.get<TransferLocation[]>(
            "/api/TransferLocations"
        );

    return response.data;
}

export async function getTransferLocationsByCityFromApi(
    city: string
): Promise<TransferLocation[]> {
    const response =
        await api.get<TransferLocation[]>(
            `/api/TransferLocations/city/${encodeURIComponent(
                city
            )}`
        );

    return response.data;
}

export function filterTransferLocationsByCity(
    locations: TransferLocation[],
    cityId: number
): TransferLocation[] {
    return locations.filter(
        (location) =>
            location.cityId === cityId
    );
}

export function filterTransferLocationsBySearch(
    locations: TransferLocation[],
    query: string
): TransferLocation[] {
    const normalizedQuery =
        query.trim().toLowerCase();

    if (!normalizedQuery) {
        return locations;
    }

    return locations.filter(
        (location) => {
            const searchableText = [
                location.name,
                location.cityName,
                location.code ?? "",
                ...location.searchTerms,
            ]
                .join(" ")
                .toLowerCase();

            return searchableText.includes(
                normalizedQuery
            );
        }
    );
}