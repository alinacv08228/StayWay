import { destinations } from "../../data/mockData";
import DestinationCard from "../../components/DestinationCard";

export default function DestinationsPage() {
    return (
        <main>
            <section className="section">
                <div className="container">

                    <p className="admin-label">
                        EXPLORE
                    </p>

                    <h1>Popular destinations</h1>

                    <p className="admin-description">
                        Explore beautiful destinations and find your next place to stay.
                    </p>

                    <div className="destination-grid">
                        {destinations.map((destination) => (
                            <DestinationCard
                                key={destination.id}
                                destination={destination}
                            />
                        ))}
                    </div>

                </div>
            </section>
        </main>
    );
}