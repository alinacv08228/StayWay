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

import { useSettings } from "../../context/SettingsContext";
import { currencyInfo } from "../../data/currency";
import { getTranslation } from "../../data/translations";

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
    const {
        language,
        currency,
    } = useSettings();

    const [userBookings, setUserBookings] =
        useState<Booking[]>([]);

    const [isLoaded, setIsLoaded] =
        useState(false);
    

    const selectedCurrency =
        currencyInfo[currency] ??
        currencyInfo["Euro"];

    

    useEffect(() => {
        const savedBookings =
            localStorage.getItem(
                "stayway_bookings"
            );

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

    const handleCancelBooking = (
        bookingId: number
    ) => {
        const confirmed =
            window.confirm(
                getTranslation(
                    language,
                    "cancelQuestion"
                )
            );

        if (!confirmed) {
            return;
        }

        const updatedBookings =
            userBookings.filter(
                (booking) =>
                    booking.id !== bookingId
            );

        setUserBookings(
            updatedBookings
        );

        localStorage.setItem(
            "stayway_bookings",
            JSON.stringify(
                updatedBookings
            )
        );
    };

    const formatPrice = (
        price: number
    ) => {
        const convertedPrice =
            price *
            selectedCurrency.rate;

        return `${selectedCurrency.symbol}${Math.round(
            convertedPrice
        ).toLocaleString()}`;
    };
    const getStatusText = (status: string) => {
        if (status === "confirmed") {
            return getTranslation(
                language,
                "confirmed"
            );
        }

        return status;
    };

    if (!isLoaded) {
        return (
            <main>
                <section className="section">
                    <div className="container">
                        <p>
                            getTranslation(language, "loading")
                        </p>
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
                        {getTranslation(language, "myBookings")}
                    </h1>

                    {userBookings.length ===
                    0 ? (
                        <p className="bookings-description-animation">
                            getTranslation(language, "noBookings")
                        </p>
                    ) : (
                        <div className="bookings-list">

                            {userBookings.map(
                                (
                                    booking,
                                    index
                                ) => {
                                    const user =
                                        users.find(
                                            (item) =>
                                                item.id ===
                                                booking.userId
                                        );

                                    const property =
                                        properties.find(
                                            (item) =>
                                                item.id ===
                                                booking.propertyId
                                        );

                                    const room =
                                        rooms.find(
                                            (item) =>
                                                item.id ===
                                                booking.roomId &&
                                                item.propertyId ===
                                                booking.propertyId
                                        );

                                    return (
                                        <div
                                            className="booking-card"
                                            key={
                                                booking.id
                                            }
                                            style={{
                                                animationDelay:
                                                    `${index * 0.12}s`,
                                            }}
                                        >
                                            <div className="booking-content">

                                                <h2>
                                                    {
                                                        property?.name
                                                    }
                                                </h2>

                                                <div className="booking-info">

                                                    <div className="booking-info-row">
                                                        <Building2 className="booking-info-icon" />

                                                        <div>
                                                            <strong>
                                                                {
                                                                    getTranslation(language, "property")  
                                                                }
                                                            </strong>

                                                            <span>
                                                                {
                                                                    property?.name
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="booking-info-row">
                                                        <DoorOpen className="booking-info-icon" />

                                                        <div>
                                                            <strong>
                                                                {
                                                                    getTranslation(language, "room")
                                                                }
                                                            </strong>

                                                            <span>
                                                                {
                                                                    room?.name ??
                                                                    getTranslation(language, "roomNotSpecified")
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="booking-info-row">
                                                        <User className="booking-info-icon" />

                                                        <div>
                                                            <strong>
                                                                {
                                                                    getTranslation(language, "user")
                                                                }
                                                            </strong>

                                                            <span>
                                                                {
                                                                    user?.name
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="booking-info-row">
                                                        <CalendarDays className="booking-info-icon" />

                                                        <div>
                                                            <strong>
                                                                {
                                                                    getTranslation(language, "checkIn")
                                                                }
                                                            </strong>

                                                            <span>
                                                                {
                                                                    formatDate(
                                                                        booking.checkIn
                                                                    )
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="booking-info-row">
                                                        <CalendarDays className="booking-info-icon" />

                                                        <div>
                                                            <strong>
                                                                {
                                                                    getTranslation(language, "checkOut")
                                                                }
                                                            </strong>

                                                            <span>
                                                                {
                                                                    formatDate(
                                                                        booking.checkOut
                                                                    )
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="booking-info-row">
                                                        <Users className="booking-info-icon" />

                                                        <div>
                                                            <strong>
                                                                {
                                                                    getTranslation(language, "guests")
                                                                }
                                                            </strong>

                                                            <span>
                                                                {
                                                                    booking.guests
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="booking-info-row">
                                                        <Tag className="booking-info-icon" />

                                                        <div>
                                                            <strong>
                                                                {
                                                                    getTranslation(language, "total")
                                                                }
                                                            </strong>

                                                            <span>
                                                                {
                                                                    formatPrice(
                                                                        booking.totalPrice
                                                                    )
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="booking-info-row">
                                                        <Circle className="booking-info-icon status-icon" />

                                                        <div>
                                                            <strong>
                                                                {
                                                                    getTranslation(language, "status")
                                                                }
                                                            </strong>

                                                            <span className="booking-status">
                                                                {
                                                                    getStatusText(
                                                                        booking.status
                                                                    )
                                                                }
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
                                                            {
                                                                getTranslation(language, "viewProperty")
                                                            }
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
                                                        {
                                                            getTranslation(language, "cancelBooking")
                                                        }
                                                    </button>

                                                </div>

                                            </div>
                                        </div>
                                    );
                                }
                            )}

                        </div>
                    )}

                </div>
            </section>
        </main>
    );
}