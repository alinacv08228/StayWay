import { properties } from "../../data/mockData";
import PropertyCard from "../../components/PropertyCard";

export default function StaysPage() {
    return (
        <main>
            <section className="section">
                <div className="container">

                    <p className="admin-label">
                        STAYWAY
                    </p>

                    <h1>Find your perfect stay</h1>

                    <p className="admin-description">
                        Discover comfortable places to stay in your favorite destinations.
                    </p>

                    <div className="property-grid">
                        {properties.map((property) => (
                            <PropertyCard
                                key={property.id}
                                property={property}
                            />
                        ))}
                    </div>

                </div>
            </section>
        </main>
    );
}