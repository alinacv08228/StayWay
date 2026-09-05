import { properties as mockProperties } from "../data/mockData";
import { Property } from "../types/types";

const STORAGE_KEY = "stayway_properties";

export function getProperties(): Property[] {
    const savedProperties =
        localStorage.getItem(STORAGE_KEY);

    if (!savedProperties) {
        const initialProperties =
            mockProperties.filter(
                (property) =>
                    property.destinationId === 1 ||
                    property.destinationId === 2 ||
                    property.destinationId === 3
            );

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(initialProperties)
        );

        return [...initialProperties];
    }

    try {
        return JSON.parse(savedProperties) as Property[];
    } catch {
        localStorage.removeItem(STORAGE_KEY);

        const initialProperties =
            mockProperties.filter(
                (property) =>
                    property.destinationId === 1 ||
                    property.destinationId === 2 ||
                    property.destinationId === 3
            );

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(initialProperties)
        );

        return [...initialProperties];
    }
}


/* =========================================================
   CREATE
   ========================================================= */

export function createProperty(
    property: Omit<Property, "id">
): Property {
    const currentProperties =
        getProperties();

    const newId =
        currentProperties.length > 0
            ? Math.max(
            ...currentProperties.map(
                (item) => item.id
            )
        ) + 1
            : 1;

    const newProperty: Property = {
        id: newId,
        ...property,
    };

    const updatedProperties = [
        ...currentProperties,
        newProperty,
    ];

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedProperties)
    );

    return newProperty;
}


/* =========================================================
   UPDATE
   ========================================================= */

export function updateProperty(
    id: number,
    updatedData: Omit<Property, "id">
): Property | null {
    const currentProperties =
        getProperties();

    const propertyExists =
        currentProperties.find(
            (property) =>
                property.id === id
        );

    if (!propertyExists) {
        return null;
    }

    const updatedProperty: Property = {
        id,
        ...updatedData,
    };

    const updatedProperties =
        currentProperties.map(
            (property) =>
                property.id === id
                    ? updatedProperty
                    : property
        );

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedProperties)
    );

    return updatedProperty;
}


/* =========================================================
   DELETE
   ========================================================= */

export function deleteProperty(
    id: number
): boolean {
    const currentProperties =
        getProperties();

    const propertyExists =
        currentProperties.some(
            (property) =>
                property.id === id
        );

    if (!propertyExists) {
        return false;
    }

    const updatedProperties =
        currentProperties.filter(
            (property) =>
                property.id !== id
        );

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedProperties)
    );

    return true;
}


/* =========================================================
   SEARCH
   ========================================================= */

export function searchProperties(
    propertiesList: Property[],
    searchTerm: string
): Property[] {
    const normalizedSearch =
        searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
        return propertiesList;
    }

    return propertiesList.filter(
        (property) =>
            property.name
                .toLowerCase()
                .includes(normalizedSearch) ||
            property.address
                .toLowerCase()
                .includes(normalizedSearch)
    );
}


/* =========================================================
   FILTER BY RATING
   ========================================================= */

export function filterPropertiesByRating(
    propertiesList: Property[],
    minimumRating: number
): Property[] {
    if (minimumRating <= 0) {
        return propertiesList;
    }

    return propertiesList.filter(
        (property) =>
            property.rating >= minimumRating
    );
}


/* =========================================================
   SORT
   ========================================================= */

export function sortProperties(
    propertiesList: Property[],
    sortBy:
        | "name"
        | "rating"
        | "price"
): Property[] {
    return [...propertiesList].sort(
        (a, b) => {
            if (sortBy === "name") {
                return a.name.localeCompare(
                    b.name
                );
            }

            if (sortBy === "rating") {
                return b.rating - a.rating;
            }

            return (
                a.pricePerNight -
                b.pricePerNight
            );
        }
    );
}