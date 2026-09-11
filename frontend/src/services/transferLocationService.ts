import { getDestinations } from "./destinationService";
import { getProperties } from "./propertyService";
import { getAirportsByCity } from "../data/airports";

export type TransferLocation = {
    id: string;
    cityId: number;
    cityName: string;
    type: "airport" | "hotel";
    name: string;
    code?: string;
    searchTerms: string[];
};

export function getTransferLocations(): TransferLocation[] {
    const destinations = getDestinations();
    const properties = getProperties();

    const locations: TransferLocation[] = [];

    destinations.forEach((destination) => {
        const cityName = destination.name;

        // ================================
        // AIRPORTS
        // ================================

        const cityAirports = getAirportsByCity(cityName);

        cityAirports.forEach((airport) => {
            locations.push({
                id: airport.id,
                cityId: destination.id,
                cityName,
                type: "airport",
                name: airport.name,
                code: airport.code,
                searchTerms: airport.searchTerms,
            });
        });

        // ================================
        // HOTELS
        // ================================

        const cityHotels = properties.filter(
            (property) =>
                property.destinationId === destination.id
        );

        cityHotels.forEach((hotel) => {
            locations.push({
                id: `hotel-${hotel.id}`,
                cityId: destination.id,
                cityName,
                type: "hotel",
                name: hotel.name,
                searchTerms: [
                    hotel.name,
                    hotel.address,
                    cityName,
                    "hotel",
                ],
            });
        });
    });

    return locations;
}

export function getTransferLocationsByCity(
    cityId: number
): TransferLocation[] {
    return getTransferLocations().filter(
        (location) =>
            location.cityId === cityId
    );
}

export function searchTransferLocations(
    query: string
): TransferLocation[] {
    const normalizedQuery =
        query.trim().toLowerCase();

    if (!normalizedQuery) {
        return getTransferLocations();
    }

    return getTransferLocations().filter(
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