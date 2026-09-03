"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { properties, rooms } from "../../../data/mockData";

function NewBookingForm() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const propertyId = Number(searchParams.get("propertyId"));
    const roomId = Number(searchParams.get("roomId"));

    const property = properties.find(
        (item) => item.id === propertyId
    );

    const selectedRoom = rooms.find(
        (room) =>
            room.id === roomId &&
            room.propertyId === propertyId
    );

    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [guests, setGuests] = useState(1);
    const [error, setError] = useState("");

    if (!property) {
        return (
            <main className="container">
                <h1>Property not found</h1>

                <Link href="/stays">
                    ← Back to stays
                </Link>
            </main>
        );
    }

    const pricePerNight =
        selectedRoom?.pricePerNight ??
        property.pricePerNight;

    const calculateNights = () => {
        if (!checkIn || !checkOut) {
            return 0;
        }

        const start = new Date(checkIn);
        const end = new Date(checkOut);

        const difference =
            end.getTime() - start.getTime();

        return Math.ceil(
            difference / (1000 * 60 * 60 * 24)
        );
    };

    const nights = calculateNights();

    const totalPrice =
        nights * pricePerNight;

    const handleBooking = () => {
        setError("");

        if (!checkIn || !checkOut) {
            setError(
                "Please select check-in and check-out dates."
            );
            return;
        }

        if (nights <= 0) {
            setError(
                "Check-out date must be after check-in date."
            );
            return;
        }

        if (
            selectedRoom &&
            guests > selectedRoom.guests
        ) {
            setError(
                `This room can accommodate up to ${selectedRoom.guests} guests.`
            );
            return;
        }

        const newBooking = {
            id: Date.now(),
            userId: 1,
            propertyId: property.id,
            roomId: selectedRoom?.id,
            checkIn,
            checkOut,
            guests,
            totalPrice,
            status: "confirmed" as const,
        };

        const savedBookings =
            localStorage.getItem("stayway_bookings");

        const bookings = savedBookings
            ? JSON.parse(savedBookings)
            : [];

        bookings.push(newBooking);

        localStorage.setItem(
            "stayway_bookings",
            JSON.stringify(bookings)
        );

        router.push("/bookings");
    };

    return (
        <main>
            <section className="section">
                <div className="container booking-page">

                    <Link href={`/stays/${property.id}`}>
                        ← Back to property
                    </Link>

                    <h1>Book your stay</h1>

                    <div className="booking-layout">

                        {/* FORMULAR */}
                        <div className="booking-form">

                            <h2>{property.name}</h2>

                            <p>{property.address}</p>

                            {selectedRoom && (
                                <div className="selected-room-info">

                                    <strong>
                                        {selectedRoom.name}
                                    </strong>

                                    <p>
                                        {selectedRoom.size}
                                        {" · "}
                                        {selectedRoom.bed}
                                    </p>

                                    <p>
                                        €{selectedRoom.pricePerNight}
                                        {" / night"}
                                    </p>

                                </div>
                            )}

                            <label>
                                Check-in

                                <input
                                    type="date"
                                    value={checkIn}
                                    onChange={(e) =>
                                        setCheckIn(
                                            e.target.value
                                        )
                                    }
                                />
                            </label>

                            <label>
                                Check-out

                                <input
                                    type="date"
                                    value={checkOut}
                                    onChange={(e) =>
                                        setCheckOut(
                                            e.target.value
                                        )
                                    }
                                />
                            </label>

                            <label>
                                Guests

                                <select
                                    value={guests}
                                    onChange={(e) =>
                                        setGuests(
                                            Number(
                                                e.target.value
                                            )
                                        )
                                    }
                                >
                                    <option value={1}>
                                        1 guest
                                    </option>

                                    <option value={2}>
                                        2 guests
                                    </option>

                                    <option value={3}>
                                        3 guests
                                    </option>

                                    <option value={4}>
                                        4 guests
                                    </option>

                                    <option value={5}>
                                        5 guests
                                    </option>

                                    <option value={6}>
                                        6 guests
                                    </option>
                                </select>
                            </label>

                            {error && (
                                <p className="booking-error">
                                    {error}
                                </p>
                            )}

                            <button
                                className="primary-button"
                                onClick={handleBooking}
                            >
                                Confirm booking
                            </button>

                        </div>


                        {/* REZUMAT */}
                        <div className="booking-summary">

                            <img
                                src={property.image}
                                alt={property.name}
                            />

                            <h2>
                                {property.name}
                            </h2>

                            <p>
                                {property.address}
                            </p>

                            {selectedRoom && (
                                <div className="booking-room-summary">

                                    <strong>
                                        {selectedRoom.name}
                                    </strong>

                                    <p>
                                        {selectedRoom.size}
                                        {" · "}
                                        {selectedRoom.bed}
                                    </p>

                                </div>
                            )}

                            <p>
                                €{pricePerNight} / night
                            </p>

                            {nights > 0 && (
                                <div className="booking-total">

                                    <p>
                                        {nights}{" "}
                                        {nights === 1
                                            ? "night"
                                            : "nights"}
                                    </p>

                                    <p>
                                        €{pricePerNight} ×{" "}
                                        {nights}
                                    </p>

                                    <strong>
                                        Total: €{totalPrice}
                                    </strong>

                                </div>
                            )}

                        </div>

                    </div>

                </div>
            </section>
        </main>
    );
}

export default function NewBookingPage() {
    return (
        <Suspense
            fallback={
                <main className="container">
                    <p>Loading booking...</p>
                </main>
            }
        >
            <NewBookingForm />
        </Suspense>
    );
}