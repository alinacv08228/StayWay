"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { properties, destinations } from "../../data/mockData";
import PropertyCard from "../../components/PropertyCard";

function StaysContent() {
    const searchParams = useSearchParams();

    const destinationName = searchParams.get("destination");

    const destinationAliases: Record<string, string> = {
        // Paris
        "paris": "Paris",
        "pariz": "Paris",
        "париж": "Paris",

        // Rome
        "rome": "Rome",
        "roma": "Rome",
        "рим": "Rome",

        // Barcelona
        "barcelona": "Barcelona",
        "барселона": "Barcelona",
    };

    const normalizedDestination = destinationName
        ?.trim()
        .toLowerCase();

    const destinationInEnglish = normalizedDestination
        ? destinationAliases[normalizedDestination]
        : undefined;

    const selectedDestination = destinations.find(
        (destination) =>
            destination.name.toLowerCase() ===
            destinationInEnglish?.toLowerCase()
    );

    const filteredProperties = destinationName
        ? selectedDestination
            ? properties.filter(
                (property) =>
                    property.destinationId === selectedDestination.id
            )
            : []
        : properties;

    return (
        <main>
            <section className="section">
                <div className="container">


                    <p className="admin-label stays-title-animation">
                        STAYWAY
                    </p>


                    <h1 className="page-title stays-title-animation">
                        Find your perfect stay
                    </h1>

                    <p className="admin-description stays-title-animation">
                        Discover comfortable places to stay in your favorite destinations.
                    </p>
                    
                    {destinationName && (
                        <p>
                            Search results for:{" "}
                            <strong>{destinationName}</strong>
                        </p>
                    )}

                    {filteredProperties.length > 0 ? (
                        <div className="property-grid">
                            {filteredProperties.map((property) => (
                                <PropertyCard
                                    key={property.id}
                                    property={property}
                                />
                            ))}
                        </div>
                    ) : (
                        <p>
                            No stays found for this destination.
                        </p>
                    )}

                </div>
            </section>
        </main>
    );
}

export default function StaysPage() {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <StaysContent />
        </Suspense>
    );
}