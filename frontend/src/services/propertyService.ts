import api from "../lib/api";
import { Property } from "../types/types";

/* =========================================================
   BACKEND API
========================================================= */

export async function getPropertiesFromApi(): Promise<Property[]> {
    const response =
        await api.get<Property[]>(
            "/api/Properties"
        );

    return response.data;
}

export async function createPropertyInApi(
    property: Omit<Property, "id">
): Promise<Property> {
    const response =
        await api.post<Property>(
            "/api/Properties",
            {
                id: 0,
                ...property,
            }
        );

    return response.data;
}

export async function updatePropertyInApi(
    id: number,
    updatedData: Omit<Property, "id">
): Promise<Property> {
    const response =
        await api.put<Property>(
            `/api/Properties/${id}`,
            {
                id,
                ...updatedData,
            }
        );

    return response.data;
}

export async function deletePropertyInApi(
    id: number
): Promise<void> {
    await api.delete(
        `/api/Properties/${id}`
    );
}

/* =========================================================
   PURE FRONTEND HELPERS
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
