import Link from "next/link";
import { destinations, properties } from "../../../data/mockData";
import PropertyCard from "../../../components/PropertyCard";

type DestinationPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function DestinationPage({
                                                  params,
                                              }: DestinationPageProps) {
    const { id } = await params;

    const destination = destinations.find(
        (item) => item.id === Number(id)
    );

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

    const destinationProperties = properties.filter(
        (property) =>
            property.destinationId === destination.id
    );

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

                    <div className="property-grid">
                        {destinationProperties.map(
                            (property) => (
                                <PropertyCard
                                    key={property.id}
                                    property={property}
                                />
                            )
                        )}
                    </div>

                </div>
            </section>
        </main>
    );
}