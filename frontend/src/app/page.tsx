import Link from "next/link";
import { destinations, properties } from "../data/mockData";
import SearchBar from "../components/SearchBar";

export default function Home() {
    return (
        <main>
            {/* HERO */}
            <section className="hero">
                <div className="container">
                    <h1>Find your perfect stay</h1>
                    <p>Search hotels, apartments and more.</p>

                    <SearchBar />
                </div>
            </section>

            {/* POPULAR DESTINATIONS */}
            <section className="section">
                <div className="container">
                    <h2>Popular destinations</h2>

                    <div className="destination-grid">
                        {destinations.map((destination) => (
                            <Link
                                href={`/destinations/${destination.id}`}
                                className="destination-card"
                                key={destination.id}
                            >
                                <img
                                    src={destination.image}
                                    alt={destination.name}
                                />

                                <div className="destination-content">
                                    <h3>{destination.name}</h3>
                                    <p>{destination.country}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* FEATURED STAYS */}
            <section className="section">
                <div className="container">
                    <h2>Featured stays</h2>

                    <div className="property-grid">
                        {properties.map((property) => (
                            <Link
                                href={`/stays/${property.id}`}
                                className="property-card"
                                key={property.id}
                            >
                                <div className="property-image">
                                    <img
                                        src={property.image}
                                        alt={property.name}
                                    />
                                </div>

                                <div className="property-content">
                                    <h3>{property.name}</h3>

                                    <p>{property.address}</p>

                                    <p className="property-rating">
                                        ★ {property.rating}
                                    </p>

                                    <p className="property-price">
                                        €{property.pricePerNight} / night
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}