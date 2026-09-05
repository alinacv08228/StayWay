"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import ReviewSection from "../../../components/ReviewSection";
import DynamicRoomList from "../../../components/DynamicRoomList";
import PhotoGallery from "../../../components/PhotoGallery";

import { getProperties } from "../../../services/propertyService";
import { getRoomsByPropertyId } from "../../../services/roomService";
import { getDestinations } from "../../../services/destinationService";

import {
    Property,
    Room,
    Destination,
} from "../../../types/types";

type StayPageClientProps = {
    id: string;
};

export default function StayPageClient({
                                           id,
                                       }: StayPageClientProps) {
    const [property, setProperty] =
        useState<Property | null>(null);

    const [propertyRooms, setPropertyRooms] =
        useState<Room[]>([]);

    const [destination, setDestination] =
        useState<Destination | null>(null);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {
        let mounted = true;

        const loadStay = () => {
            const propertyId = Number(id);

            const savedProperties =
                getProperties();

            const savedDestinations =
                getDestinations();

            const foundProperty =
                savedProperties.find(
                    (item) =>
                        item.id === propertyId
                );

            if (!mounted) {
                return;
            }

            if (!foundProperty) {
                setProperty(null);
                setPropertyRooms([]);
                setDestination(null);
                setLoading(false);
                return;
            }

            const savedRooms =
                getRoomsByPropertyId(
                    foundProperty.id
                );

            setProperty(foundProperty);

            setPropertyRooms(
                savedRooms
            );

            setDestination(
                savedDestinations.find(
                    (item) =>
                        item.id ===
                        foundProperty.destinationId
                ) ?? null
            );

            setLoading(false);
        };

        loadStay();

        return () => {
            mounted = false;
        };
    }, [id]);

    const selectedFacilities =
        useMemo(() => {
            const facilities =
                propertyRooms.flatMap(
                    (room) =>
                        room.features ?? []
                );

            return Array.from(
                new Set(facilities)
            );
        }, [propertyRooms]);

    const hasFreeCancellation =
        propertyRooms.some(
            (room) =>
                room.freeCancellation !== false
        );

    const hasNoPrepayment =
        propertyRooms.some(
            (room) =>
                room.noPrepayment !== false
        );

    if (loading) {
        return (
            <main className="container">
                <div className="home-loading-state">
                    <p>
                        Loading stay...
                    </p>
                </div>
            </main>
        );
    }

    if (!property) {
        return (
            <main className="container">
                <h1>
                    Stay not found
                </h1>

                <Link href="/">
                    Back to home
                </Link>
            </main>
        );
    }

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

                            <h1>
                                {property.name}
                            </h1>

                            <p className="stay-location">
                                📍 {property.address}

                                {destination
                                    ? ` · ${destination.name}, ${destination.country}`
                                    : ""}
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
                        hotelName={
                            property.name
                        }
                        photos={[
                            property.image,
                            ...propertyRooms.map(
                                (room) =>
                                    room.image
                            ),
                        ]}
                    />

                </div>
            </section>


            {/* MAIN CONTENT */}

            <section className="stay-main-section">
                <div className="container">

                    <div className="stay-main-content">

                        {/* ABOUT */}

                        <div className="stay-info-block">

                            <h2>
                                About this property
                            </h2>

                            {property.description?.trim() ? (

                                property.description
                                    .split(/\n\s*\n/)
                                    .map(
                                        (
                                            paragraph,
                                            index
                                        ) => (
                                            <p
                                                key={index}
                                                className="property-description-text"
                                            >
                                                {paragraph.trim()}
                                            </p>
                                        )
                                    )

                            ) : (

                                <div className="home-empty-state">

                                    <h3>
                                        No property description
                                    </h3>

                                    <p>
                                        The administrator has not added a description for this property yet.
                                    </p>

                                </div>
                            )}

                        </div>


                        {/* FACILITIES */}

                        <div className="stay-info-block">

                            <div className="rooms-heading">

                                <div>

                                    <h2>
                                        Facilities & policies
                                    </h2>

                                    <p>
                                        These are the facilities and policies selected by the property administrator.
                                    </p>

                                </div>

                            </div>


                            {selectedFacilities.length === 0 &&
                            !hasFreeCancellation &&
                            !hasNoPrepayment ? (

                                <div className="home-empty-state">

                                    <h3>
                                        No facilities listed
                                    </h3>

                                    <p>
                                        The property has not added any room facilities yet.
                                    </p>

                                </div>

                            ) : (

                                <div className="selected-facilities-list">

                                    {selectedFacilities.map(
                                        (facility) => (

                                            <div
                                                className="selected-facility"
                                                key={facility}
                                            >

                                                <span>
                                                    ✓
                                                </span>

                                                <strong>
                                                    {facility}
                                                </strong>

                                            </div>

                                        )
                                    )}

                                    {hasFreeCancellation && (

                                        <div className="selected-facility">

                                            <span>
                                                ✓
                                            </span>

                                            <strong>
                                                Free cancellation
                                            </strong>

                                        </div>

                                    )}

                                    {hasNoPrepayment && (

                                        <div className="selected-facility">

                                            <span>
                                                ✓
                                            </span>

                                            <strong>
                                                No prepayment needed
                                            </strong>

                                        </div>

                                    )}

                                </div>

                            )}

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
                                        Select a room and see its exact description, capacity, size, bed type, facilities and policies.
                                    </p>

                                </div>

                            </div>


                            <DynamicRoomList
                                propertyId={
                                    property.id
                                }
                                initialRooms={
                                    propertyRooms
                                }
                            />

                        </div>


                        {/* REVIEWS */}

                        <div className="stay-info-block">

                            <ReviewSection
                                propertyId={
                                    property.id
                                }
                                propertyRating={
                                    property.rating
                                }
                            />

                        </div>

                    </div>

                </div>
            </section>

        </main>
    );
}