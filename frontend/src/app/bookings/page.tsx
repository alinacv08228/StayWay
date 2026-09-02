"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    bookings as mockBookings,
    properties,
    users,
} from "../../data/mockData";

type Booking = {
    id: number;
    userId: number;
    propertyId: number;
    checkIn: string;
    checkOut: string;
    guests: number;
    totalPrice: number;
    status: string;
};

export default function BookingsPage() {
    const [userBookings, setUserBookings] = useState<Booking[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const savedBookings =
            localStorage.getItem("stayway_bookings");

        if (savedBookings) {
            const saved: Booking[] =
                JSON.parse(savedBookings);

            setUserBookings(saved);
        } else {
            localStorage.setItem(
                "stayway_bookings",
                JSON.stringify(mockBookings)
            );

            setUserBookings(mockBookings);
        }

        setIsLoaded(true);
    }, []);

    const handleCancelBooking = (bookingId: number) => {
        const confirmed = window.confirm(
            "Are you sure you want to cancel this booking?"
        );

        if (!confirmed) {
            return;
        }

        const updatedBookings = userBookings.filter(
            (booking) => booking.id !== bookingId
        );

        setUserBookings(updatedBookings);

        localStorage.setItem(
            "stayway_bookings",
            JSON.stringify(updatedBookings)
        );
    };

    if (!isLoaded) {
        return (
            <main>
                <section className="section">
                    <div className="container">
                        <p>Loading bookings...</p>
                    </div>
                </section>
            </main>
        );
    }

    return (
        <main>
            <section className="section">
                <div className="container">

                    <h1>My Bookings</h1>

                    {userBookings.length === 0 ? (
                        <p>
                            You don't have any bookings yet.
                        </p>
                    ) : (
                        <div className="bookings-list">

                            {userBookings.map((booking) => {
                                const user = users.find(
                                    (item) =>
                                        item.id === booking.userId
                                );

                                const property = properties.find(
                                    (item) =>
                                        item.id === booking.propertyId
                                );

                                return (
                                    <div
                                        className="booking-card"
                                        key={booking.id}
                                    >
                                        <div className="booking-content">

                                            <h2>
                                                {property?.name}
                                            </h2>

                                            <p>
                                                <strong>
                                                    User:
                                                </strong>{" "}
                                                {user?.name}
                                            </p>

                                            <p>
                                                <strong>
                                                    Check-in:
                                                </strong>{" "}
                                                {booking.checkIn}
                                            </p>

                                            <p>
                                                <strong>
                                                    Check-out:
                                                </strong>{" "}
                                                {booking.checkOut}
                                            </p>

                                            <p>
                                                <strong>
                                                    Guests:
                                                </strong>{" "}
                                                {booking.guests}
                                            </p>

                                            <p>
                                                <strong>
                                                    Total:
                                                </strong>{" "}
                                                €{booking.totalPrice}
                                            </p>

                                            <p>
                                                <strong>
                                                    Status:
                                                </strong>{" "}
                                                {booking.status}
                                            </p>

                                            <div className="booking-actions">

                                                {property && (
                                                    <Link
                                                        href={`/stays/${property.id}`}
                                                        className="button"
                                                    >
                                                        View property
                                                    </Link>
                                                )}

                                                <button
                                                    className="cancel-button"
                                                    onClick={() =>
                                                        handleCancelBooking(
                                                            booking.id
                                                        )
                                                    }
                                                >
                                                    Cancel booking
                                                </button>

                                            </div>

                                        </div>
                                    </div>
                                );
                            })}

                        </div>
                    )}

                </div>
            </section>
        </main>
    );
}