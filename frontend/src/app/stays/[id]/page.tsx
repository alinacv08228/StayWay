import Link from "next/link";
import { properties, reviews, rooms } from "../../../data/mockData";
import PhotoGallery from "../../../components/PhotoGallery";
import RoomImageViewer from "../../../components/RoomImageViewer";
import Price from "../../../components/Price";

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

    const propertyRooms = rooms.filter(
        (room) => room.propertyId === property.id
    );

    const propertyReviews = reviews.filter(
        (review) => review.propertyId === property.id
    );

    return (
        <main className="stay-details-page">

            {/* HEADER */}
            <section className="stay-details-header">
                <div className="container">

                    <Link
                        href={`/destinations/${property.destinationId}`}
                        className="back-link"
                    >
                        ← Back to destination
                    </Link>

                    <div className="stay-title-row">

                        <div>
                            <span className="section-eyebrow">
                                STAYWAY STAY
                            </span>

                            <h1>{property.name}</h1>

                            <p className="stay-location">
                                📍 {property.address}
                            </p>
                        </div>

                        <div className="stay-rating-large">
                            <strong>
                                ★ {property.rating}
                            </strong>

                            <span>
                                Excellent
                            </span>
                        </div>

                    </div>

                </div>
            </section>


            {/* GALLERY */}
            <section className="stay-gallery-section">
                <div className="container">

                    <PhotoGallery
                        hotelName={property.name}
                        photos={[
                            property.image,
                            ...propertyRooms.map((room) => room.image),
                        ]}
                    />

                </div>
            </section>


            {/* CONTENT */}
            <section className="stay-main-section">

                <div className="container">

                    <div className="stay-main-content">


                        {/* ABOUT */}
                        <div className="stay-info-block">

                            <h2>
                                About this property
                            </h2>

                            <p>
                                Discover {property.name} in{" "}
                                {property.address}. This property
                                offers comfortable accommodation
                                and convenient access to the city's
                                main attractions.
                            </p>

                            <p>
                                Browse the available rooms below
                                and choose the accommodation that
                                best fits your stay.
                            </p>

                        </div>


                        {/* FACILITIES */}
                        <div className="stay-info-block">

                            <h2>
                                Popular facilities
                            </h2>

                            <div className="amenities-grid">

                                <div className="amenity">
                                    <span>📶</span>
                                    <div>
                                        <strong>Free Wi-Fi</strong>
                                        <p>
                                            Available for guests
                                        </p>
                                    </div>
                                </div>

                                <div className="amenity">
                                    <span>❄️</span>
                                    <div>
                                        <strong>
                                            Air conditioning
                                        </strong>
                                        <p>
                                            Available in selected rooms
                                        </p>
                                    </div>
                                </div>

                                <div className="amenity">
                                    <span>🛏️</span>
                                    <div>
                                        <strong>
                                            Comfortable rooms
                                        </strong>
                                        <p>
                                            Several room options
                                        </p>
                                    </div>
                                </div>

                                <div className="amenity">
                                    <span>📺</span>
                                    <div>
                                        <strong>TV</strong>
                                        <p>
                                            Available in rooms
                                        </p>
                                    </div>
                                </div>

                                <div className="amenity">
                                    <span>🛁</span>
                                    <div>
                                        <strong>
                                            Private bathroom
                                        </strong>
                                        <p>
                                            Available in rooms
                                        </p>
                                    </div>
                                </div>

                                <div className="amenity">
                                    <span>🛎️</span>
                                    <div>
                                        <strong>
                                            Guest services
                                        </strong>
                                        <p>
                                            Services available for guests
                                        </p>
                                    </div>
                                </div>

                            </div>

                        </div>


                        {/* ROOMS */}
                        <div
                            className="stay-info-block"
                            id="rooms"
                        >

                            <div className="rooms-heading">

                                <div>
                                    <h2>
                                        Choose your room
                                    </h2>

                                    <p>
                                        Select the room that best
                                        fits your stay.
                                    </p>
                                </div>

                            </div>


                            <div className="rooms-list">

                                {propertyRooms.map((room) => (

                                    <div
                                        className="room-card"
                                        key={room.id}
                                    >

                                        {/* IMAGE */}

                                        <div className="room-image">
                                            <RoomImageViewer
                                                image={room.image}
                                                alt={room.name}
                                            />
                                        </div>


                                        {/* DETAILS */}

                                        <div className="room-details">

                                            <h3>
                                                {room.name}
                                            </h3>

                                            <p className="room-description">
                                                {room.description}
                                            </p>

                                            <div className="room-meta">

                                                <span>
                                                    👤 Up to{" "}
                                                    {room.guests} guests
                                                </span>

                                                <span>
                                                    📐 {room.size}
                                                </span>

                                                <span>
                                                    🛏️ {room.bed}
                                                </span>

                                            </div>


                                            <div className="room-features">

                                                {room.features
                                                    .slice(0, 3)
                                                    .map(
                                                        (feature) => (
                                                            <span
                                                                key={
                                                                    feature
                                                                }
                                                            >
                                                                ✓{" "}
                                                                {feature}
                                                            </span>
                                                        )
                                                    )}

                                            </div>

                                        </div>


                                        {/* PRICE */}

                                        <div className="room-price">

                                            <strong>
                                                <Price amount={room.pricePerNight} />
                                            </strong>

                                            <span>
                                                / night
                                            </span>

                                            <small>
                                                + taxes and fees
                                            </small>

                                            <Link
                                                href={`/bookings/new?propertyId=${property.id}&roomId=${room.id}`}
                                                className="room-button"
                                            >
                                                Select room
                                            </Link>

                                        </div>

                                    </div>

                                ))}

                            </div>

                        </div>


                        {/* REVIEWS */}
                        <div className="stay-info-block">

                            <div className="reviews-title">

                                <div>
                                    <h2>
                                        Guest reviews
                                    </h2>

                                    <p>
                                        See what other guests think
                                        about this property.
                                    </p>
                                </div>

                                <div className="review-score">

                                    <strong>
                                        {property.rating}
                                    </strong>

                                    <span>
                                        ★ Excellent
                                    </span>

                                </div>

                            </div>


                            <div className="reviews-list">

                                {propertyReviews.map(
                                    (review) => (

                                        <div
                                            className="review-card"
                                            key={review.id}
                                        >

                                            <div className="review-top">

                                                <strong>
                                                    {review.author}
                                                </strong>

                                                <span>
                                                    ★{" "}
                                                    {review.rating}
                                                </span>

                                            </div>

                                            <p>
                                                {review.comment}
                                            </p>

                                        </div>

                                    )
                                )}

                            </div>

                        </div>

                    </div>

                </div>

            </section>

        </main>
    );
}