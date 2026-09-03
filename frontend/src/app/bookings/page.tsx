"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Building2,
    DoorOpen,
    User,
    CalendarDays,
    Users,
    Tag,
    Circle,
} from "lucide-react";
import {
    bookings as mockBookings,
    properties,
    users,
    rooms,
} from "../../data/mockData";

type Booking = {
    id: number;
    userId: number;
    propertyId: number;
    roomId?: number;
    checkIn: string;
    checkOut: string;
    guests: number;
    totalPrice: number;
    status: string;
};

function formatDate(date: string) {
    const [year, month, day] = date.split("-");
    return `${day}.${month}.${year}`;
}

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
                <div className="container bookings-page">

                    <h1 className="page-title bookings-title-animation">
                        My Bookings
                    </h1>

                    {userBookings.length === 0 ? (
                        <p className="bookings-description-animation">
                            You don't have any bookings yet.
                        </p>
                    ) : (
                        <div className="bookings-list">

                            {userBookings.map((booking, index) => {
                                const user = users.find(
                                    (item) =>
                                        item.id === booking.userId
                                );

                                const property = properties.find(
                                    (item) =>
                                        item.id === booking.propertyId
                                );

                                const room = rooms.find(
                                    (item) =>
                                        item.id === booking.roomId &&
                                        item.propertyId === booking.propertyId
                                );

                                return (
                                    <div
                                        className="booking-card"
                                        key={booking.id}
                                        style={{
                                            animationDelay: `${index * 0.12}s`,
                                        }}
                                    >
                                        <div className="booking-content">

                                            <h2>
                                                {property?.name}
                                            </h2>

                                            <div className="booking-info">

                                                <div className="booking-info-row">
                                                    <Building2 className="booking-info-icon" />

                                                    <div>
                                                        <strong>Property:</strong>
                                                        <span>
                                                            {property?.name}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="booking-info-row">
                                                    <DoorOpen className="booking-info-icon" />

                                                    <div>
                                                        <strong>Room:</strong>
                                                        <span>
                                                            {room?.name ?? "Room not specified"}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="booking-info-row">
                                                    <User className="booking-info-icon" />

                                                    <div>
                                                        <strong>User:</strong>
                                                        <span>
                                                            {user?.name}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="booking-info-row">
                                                    <CalendarDays className="booking-info-icon" />

                                                    <div>
                                                        <strong>Check-in:</strong>
                                                        <span>
                                                            {formatDate(
                                                                booking.checkIn
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="booking-info-row">
                                                    <CalendarDays className="booking-info-icon" />

                                                    <div>
                                                        <strong>Check-out:</strong>
                                                        <span>
                                                            {formatDate(
                                                                booking.checkOut
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="booking-info-row">
                                                    <Users className="booking-info-icon" />

                                                    <div>
                                                        <strong>Guests:</strong>
                                                        <span>
                                                            {booking.guests}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="booking-info-row">
                                                    <Tag className="booking-info-icon" />

                                                    <div>
                                                        <strong>Total:</strong>
                                                        <span>
                                                            €{booking.totalPrice}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="booking-info-row">
                                                    <Circle className="booking-info-icon status-icon" />

                                                    <div>
                                                        <strong>Status:</strong>

                                                        <span className="booking-status">
                                                            {booking.status}
                                                        </span>
                                                    </div>
                                                </div>

                                            </div>

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