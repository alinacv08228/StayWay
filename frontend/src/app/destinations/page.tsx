"use client";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    destinations,
    properties as mockProperties,
} from "../../data/mockData";

import DestinationCard from "../../components/DestinationCard";

import { getProperties } from "../../services/propertyService";

import { Property } from "../../types/types";

export default function DestinationsPage() {
    const [availableProperties, setAvailableProperties] =
        useState<Property[]>(mockProperties);

    useEffect(() => {
        try {
            const loadedProperties =
                getProperties();

            setAvailableProperties(
                loadedProperties
            );
        } catch {
            setAvailableProperties(
                mockProperties
            );
        }
    }, []);

    const visibleDestinations = useMemo(() => {
        return destinations.filter(
            (destination) =>
                availableProperties.some(
                    (property) =>
                        property.destinationId ===
                        destination.id
                )
        );
    }, [availableProperties]);

    return (
        <main>
            <section className="section">
                <div className="container">

                    <div className="destinations-page-header">
                        <p className="admin-label">
                            EXPLORE
                        </p>

                        <h1 className="page-title">
                            Popular destinations
                        </h1>

                        <p className="admin-description">
                            Explore beautiful destinations and find your next place to stay.
                        </p>
                    </div>

                    <div className="destination-grid">
                        {visibleDestinations.map(
                            (destination) => (
                                <DestinationCard
                                    key={destination.id}
                                    destination={destination}
                                />
                            )
                        )}
                    </div>

                </div>
            </section>
        </main>
    );
}