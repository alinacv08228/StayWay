import {
    getDestinationsFromApi,
} from "./destinationService";

import {
    getPropertiesFromApi,
} from "./propertyService";

import {
    getAirportsByCity,
} from "../data/airports";

import type {
    Destination,
    Property,
} from "../types/types";

export type TransferLocation = {
    id: string;
    cityId: number;
    cityName: string;
    type: "airport" | "hotel";
    name: string;
    code?: string;
    searchTerms: string[];
};

function buildTransferLocations(
    destinations: Destination[],
    properties: Property[]
): TransferLocation[] {
    const locations: TransferLocation[] = [];

    destinations.forEach((destination) => {
        const cityName = destination.name;

        /*
         * Airports are static reference data.
         */
        const cityAirports =
            getAirportsByCity(cityName);

        cityAirports.forEach((airport) => {
            locations.push({
                id: airport.id,
                cityId: destination.id,
                cityName,
                type: "airport",
                name: airport.name,
                code: airport.code,
                searchTerms:
                airport.searchTerms,
            });
        });

        /*
         * Hotels come from backend properties.
         */
        const cityHotels =
            properties.filter(
                (property) =>
                    property.destinationId ===
                    destination.id
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

/*
 * Transfer locations are derived data.
 * No separate TransferLocations endpoint is needed:
 * backend destinations + backend properties + static airports.
 */
export async function getTransferLocationsFromApi():
    Promise<TransferLocation[]> {
    const [
        destinations,
        properties,
    ] = await Promise.all([
        getDestinationsFromApi(),
        getPropertiesFromApi(),
    ]);

    return buildTransferLocations(
        destinations,
        properties
    );
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
