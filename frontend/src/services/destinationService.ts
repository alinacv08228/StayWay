import {
    destinations as mockDestinations,
} from "../data/mockData";

import {
    Destination,
} from "../types/types";

const DESTINATIONS_KEY =
    "stayway_destinations";

function getNextDestinationId(
    destinations: Destination[]
): number {
    if (destinations.length === 0) {
        return 1;
    }

    return (
        Math.max(
            ...destinations.map(
                (destination) =>
                    destination.id
            )
        ) + 1
    );
}

/*
 * Returnează toate destinațiile
 * salvate de Admin.
 *
 * IMPORTANT:
 * Nu adăugăm automat țări sau orașe
 * noi aici.
 *
 * O destinație nouă apare doar când
 * Admin creează o proprietate.
 */
export function getDestinations(): Destination[] {
    if (
        typeof window ===
        "undefined"
    ) {
        return mockDestinations;
    }

    const saved =
        localStorage.getItem(
            DESTINATIONS_KEY
        );

    if (!saved) {
        localStorage.setItem(
            DESTINATIONS_KEY,
            JSON.stringify(
                mockDestinations
            )
        );

        return mockDestinations;
    }

    try {
        return JSON.parse(
            saved
        ) as Destination[];
    } catch {
        localStorage.setItem(
            DESTINATIONS_KEY,
            JSON.stringify(
                mockDestinations
            )
        );

        return mockDestinations;
    }
}

/*
 * Salvează lista completă
 * în localStorage.
 */
export function saveDestinations(
    destinations: Destination[]
): void {
    localStorage.setItem(
        DESTINATIONS_KEY,
        JSON.stringify(
            destinations
        )
    );
}

/*
 * Creează o destinație nouă.
 */
export function createDestination(
    destination: Destination
): Destination {
    const destinations =
        getDestinations();

    const updated = [
        ...destinations,
        destination,
    ];

    saveDestinations(
        updated
    );

    return destination;
}

/*
 * Actualizează o destinație.
 */
export function updateDestination(
    destination: Destination
): void {
    const destinations =
        getDestinations();

    const updated =
        destinations.map(
            (item) =>
                item.id ===
                destination.id
                    ? destination
                    : item
        );

    saveDestinations(
        updated
    );
}

/*
 * Caută o destinație după
 * țară + oraș.
 */
export function findDestination(
    country: string,
    city: string
): Destination | undefined {
    const normalizedCountry =
        country
            .trim()
            .toLowerCase();

    const normalizedCity =
        city
            .trim()
            .toLowerCase();

    return getDestinations().find(
        (destination) =>
            destination.country
                .trim()
                .toLowerCase() ===
            normalizedCountry &&
            destination.name
                .trim()
                .toLowerCase() ===
            normalizedCity
    );
}

/*
 * Creează destinația dacă
 * nu există deja.
 *
 * Dacă există, actualizează
 * imaginile.
 */
export function getOrCreateDestination(
    country: string,
    city: string,
    cityImage: string,
    countryImage: string
): Destination {
    const existing =
        findDestination(
            country,
            city
        );

    if (existing) {
        const updated: Destination =
            {
                ...existing,

                image:
                    cityImage.trim() ||
                    existing.image,

                countryImage:
                    countryImage.trim() ||
                    existing.countryImage,
            };

        updateDestination(
            updated
        );

        return updated;
    }

    const destinations =
        getDestinations();

    const newDestination:
        Destination = {
        id:
            getNextDestinationId(
                destinations
            ),

        name:
            city.trim(),

        country:
            country.trim(),

        image:
            cityImage.trim(),

        countryImage:
            countryImage.trim(),
    };

    return createDestination(
        newDestination
    );
}

export function deleteDestination(
    destinationId: number
): void {
    const destinations =
        getDestinations();

    const updated =
        destinations.filter(
            (destination) =>
                destination.id !==
                destinationId
        );

    saveDestinations(
        updated
    );
}