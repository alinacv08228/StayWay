"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import PropertyCard from "../../../components/PropertyCard";
import { getDestinations } from "../../../services/destinationService";
import { getProperties } from "../../../services/propertyService";
import { Destination, Property } from "../../../types/types";

type DestinationPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default function DestinationPage({
                                            params,
                                        }: DestinationPageProps) {
    const [destination, setDestination] = useState<Destination | null>(null);
    const [destinationProperties, setDestinationProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        const loadDestination = async () => {
            const { id } = await params;
            const destinationId = Number(id);

            const savedDestinations = getDestinations();
            const savedProperties = getProperties();

            const foundDestination = savedDestinations.find(
                (item) => item.id === destinationId
            );

            if (!mounted) return;

            if (!foundDestination) {
                setDestination(null);
                setDestinationProperties([]);
                setLoading(false);
                return;
            }

            setDestination(foundDestination);
            setDestinationProperties(
                savedProperties.filter(
                    (property) => property.destinationId === foundDestination.id
                )
            );
            setLoading(false);
        };

        loadDestination();

        return () => {
            mounted = false;
        };
    }, [params]);

    if (loading) {
        return (
            <main className="container">
                <div className="home-loading-state">
                    <p>Loading destination...</p>
                </div>
            </main>
        );
    }

    if (!destination) {
        return (
            <main className="container">
                <h1>Destination not found</h1>

                <Link href="/">
                    Back to home
                </Link>
            </main>
        );
    }

    return (
        <main>
            <section className="destination-hero">
                <div className="container">
                    <img
                        src={destination.image}
                        alt={destination.name}
                    />

                    <div>
                        <h1>{destination.name}</h1>
                        <p>{destination.country}</p>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <h2>
                        Stays in {destination.name}
                    </h2>

                    {destinationProperties.length === 0 ? (
                        <div className="home-empty-state">
                            <h3>No stays available</h3>
                            <p>
                                There are currently no properties available in this destination.
                            </p>
                        </div>
                    ) : (
                        <div className="property-grid">
                            {destinationProperties.map((property) => (
                                <PropertyCard
                                    key={property.id}
                                    property={property}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}