import Link from "next/link";
import { properties } from "../../../data/mockData";

type StayPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function StayPage({
                                           params,
                                       }: StayPageProps) {
    const { id } = await params;

    const property = properties.find(
        (item) => item.id === Number(id)
    );

    if (!property) {
        return (
            <main className="container">
                <h1>Stay not found</h1>
                <Link href="/">Back to home</Link>
            </main>
        );
    }

    return (
        <main>
            <section className="stay-page">
                <div className="container">

                    <Link
                        href={`/destinations/${property.destinationId}`}
                        className="back-link"
                    >
                        ← Back to destination
                    </Link>

                    <div className="stay-layout">

                        <div className="stay-image-wrapper">
                            <img
                                className="stay-image"
                                src={property.image}
                                alt={property.name}
                            />
                        </div>

                        <div className="stay-info">

                            <h1>{property.name}</h1>

                            <p className="stay-address">
                                {property.address}
                            </p>

                            <p className="stay-rating">
                                ★ {property.rating}
                            </p>

                            <p className="stay-price">
                                €{property.pricePerNight}
                                <span> / night</span>
                            </p>

                            <Link
                                href={`/bookings/new?propertyId=${property.id}`}
                                className="book-button"
                            >
                                Book now
                            </Link>

                        </div>

                    </div>
                </div>
            </section>
        </main>
    );
}