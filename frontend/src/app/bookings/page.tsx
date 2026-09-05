"use client";

import ProtectedRoute from "../../components/ProtectedRoute";

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

import { useUser } from "../../context/UserContext";

import { currencyInfo } from "../../data/currency";

import { getTranslation } from "../../data/translations";

type Booking = {
    id: number;
    userId: number;
    propertyId: number;
    roomId?: number;
    checkIn: string;
    checkOut: string;

    // Pentru rezervările noi
    adults?: number;
    children?: number;
    infants?: number;

    // Păstrăm guests pentru rezervările vechi
    guests: number;

    totalPrice: number;

    status:
        | "confirmed"
        | "cancelled"
        | string;
};

function formatDate(date: string) {
    const [year, month, day] =
        date.split("-");

    return `${day}.${month}.${year}`;
}

export default function BookingsPage() {
    return (
        <ProtectedRoute>
            <BookingsContent />
        </ProtectedRoute>
    );
}

function BookingsContent() {
    const {
        language,
        currency,
    } = useSettings();

    const {
        currentUser,
    } = useUser();

    const [userBookings, setUserBookings] =
        useState<Booking[]>([]);

    const [isLoaded, setIsLoaded] =
        useState(false);

    const selectedCurrency =
        currencyInfo[currency] ??
        currencyInfo["Euro"];

    useEffect(() => {
        if (!currentUser) {
            return;
        }

        const savedBookings =
            localStorage.getItem(
                "stayway_bookings"
            );

        let allBookings: Booking[] = [];

        if (savedBookings) {
            try {
                allBookings =
                    JSON.parse(
                        savedBookings
                    );
            } catch {
                allBookings =
                    mockBookings as Booking[];
            }
        } else {
            allBookings =
                mockBookings as Booking[];

            localStorage.setItem(
                "stayway_bookings",
                JSON.stringify(
                    allBookings
                )
            );
        }

        /*
         * Adminul vede toate rezervările.
         *
         * Un user normal vede doar rezervările
         * care au userId-ul lui.
         */
        const visibleBookings =
            currentUser.role === "admin"
                ? allBookings
                : allBookings.filter(
                    (booking) =>
                        booking.userId ===
                        currentUser.id
                );

        setUserBookings(
            visibleBookings
        );

        setIsLoaded(true);
    }, [currentUser]);

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

        const savedBookings =
            localStorage.getItem(
                "stayway_bookings"
            );

        if (!savedBookings) {
            return;
        }

        let allBookings: Booking[];

        try {
            allBookings =
                JSON.parse(
                    savedBookings
                );
        } catch {
            return;
        }

        /*
         * Nu ștergem rezervarea.
         * Schimbăm statusul în cancelled.
         */
        const updatedAllBookings =
            allBookings.map(
                (booking) =>
                    booking.id ===
                    bookingId
                        ? {
                            ...booking,
                            status:
                                "cancelled",
                        }
                        : booking
            );

        localStorage.setItem(
            "stayway_bookings",
            JSON.stringify(
                updatedAllBookings
            )
        );

        /*
         * După modificare:
         * Adminul vede toate rezervările.
         * Userul vede doar rezervările lui.
         */
        const visibleBookings =
            currentUser?.role ===
            "admin"
                ? updatedAllBookings
                : updatedAllBookings.filter(
                    (booking) =>
                        booking.userId ===
                        currentUser?.id
                );

        setUserBookings(
            visibleBookings
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

    const getStatusText = (
        status: string
    ) => {
        if (
            status ===
            "confirmed"
        ) {
            return getTranslation(
                language,
                "confirmed"
            );
        }

        if (
            status ===
            "cancelled"
        ) {
            return getTranslation(
                language,
                "cancelled"
            );
        }

        return status;
    };

    const getGuestText = (
        booking: Booking
    ) => {
        /*
         * Rezervare nouă:
         * avem adulți, copii și sugari.
         */
        if (
            booking.adults !==
            undefined ||
            booking.children !==
            undefined ||
            booking.infants !==
            undefined
        ) {
            const adults =
                booking.adults ?? 0;

            const children =
                booking.children ?? 0;

            const infants =
                booking.infants ?? 0;

            return `${adults} ${
                adults === 1
                    ? "adult"
                    : "adults"
            } · ${children} ${
                children === 1
                    ? "child"
                    : "children"
            } · ${infants} ${
                infants === 1
                    ? "infant"
                    : "infants"
            }`;
        }

        /*
         * Rezervare veche:
         * folosim guests.
         */
        return `${booking.guests} ${
            booking.guests === 1
                ? "guest"
                : "guests"
        }`;
    };

    if (!isLoaded) {
        return (
            <main className="bookings-loading-page">
                <section className="section">
                    <div className="container bookings-page">
                        <p>
                            {getTranslation(
                                language,
                                "loading"
                            )}
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

                    <h1 className="page-title">
                        {getTranslation(
                            language,
                            "myBookings"
                        )}
                    </h1>

                    {userBookings.length === 0 ? (
                        <p>
                            {getTranslation(
                                language,
                                "noBookings"
                            )}
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
                                            (
                                                item
                                            ) =>
                                                item.id ===
                                                booking.userId
                                        );

                                    const property =
                                        properties.find(
                                            (
                                                item
                                            ) =>
                                                item.id ===
                                                booking.propertyId
                                        );

                                    const room =
                                        rooms.find(
                                            (
                                                item
                                            ) =>
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

                                                    {/* PROPERTY */}
                                                    <div className="booking-info-row">

                                                        <Building2 className="booking-info-icon" />

                                                        <div>
                                                            <strong>
                                                                {
                                                                    getTranslation(
                                                                        language,
                                                                        "property"
                                                                    )
                                                                }
                                                            </strong>

                                                            <span>
                                                                {
                                                                    property?.name
                                                                }
                                                            </span>
                                                        </div>

                                                    </div>

                                                    {/* ROOM */}
                                                    <div className="booking-info-row">

                                                        <DoorOpen className="booking-info-icon" />

                                                        <div>
                                                            <strong>
                                                                {
                                                                    getTranslation(
                                                                        language,
                                                                        "room"
                                                                    )
                                                                }
                                                            </strong>

                                                            <span>
                                                                {
                                                                    room?.name ??
                                                                    getTranslation(
                                                                        language,
                                                                        "roomNotSpecified"
                                                                    )
                                                                }
                                                            </span>
                                                        </div>

                                                    </div>

                                                    {/* USER */}
                                                    <div className="booking-info-row">

                                                        <User className="booking-info-icon" />

                                                        <div>
                                                            <strong>
                                                                {
                                                                    getTranslation(
                                                                        language,
                                                                        "user"
                                                                    )
                                                                }
                                                            </strong>

                                                            <span>
                                                                {
                                                                    user?.name ??
                                                                    "Unknown user"
                                                                }
                                                            </span>
                                                        </div>

                                                    </div>

                                                    {/* CHECK-IN */}
                                                    <div className="booking-info-row">

                                                        <CalendarDays className="booking-info-icon" />

                                                        <div>
                                                            <strong>
                                                                {
                                                                    getTranslation(
                                                                        language,
                                                                        "checkIn"
                                                                    )
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

                                                    {/* CHECK-OUT */}
                                                    <div className="booking-info-row">

                                                        <CalendarDays className="booking-info-icon" />

                                                        <div>
                                                            <strong>
                                                                {
                                                                    getTranslation(
                                                                        language,
                                                                        "checkOut"
                                                                    )
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

                                                    {/* GUESTS */}
                                                    <div className="booking-info-row">

                                                        <Users className="booking-info-icon" />

                                                        <div>
                                                            <strong>
                                                                {
                                                                    getTranslation(
                                                                        language,
                                                                        "guests"
                                                                    )
                                                                }
                                                            </strong>

                                                            <span>
                                                                {
                                                                    getGuestText(
                                                                        booking
                                                                    )
                                                                }
                                                            </span>
                                                        </div>

                                                    </div>

                                                    {/* TOTAL */}
                                                    <div className="booking-info-row">

                                                        <Tag className="booking-info-icon" />

                                                        <div>
                                                            <strong>
                                                                {
                                                                    getTranslation(
                                                                        language,
                                                                        "total"
                                                                    )
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

                                                    {/* STATUS */}
                                                    <div className="booking-info-row">

                                                        <Circle className="booking-info-icon status-icon" />

                                                        <div>
                                                            <strong>
                                                                {
                                                                    getTranslation(
                                                                        language,
                                                                        "status"
                                                                    )
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
                                                                getTranslation(
                                                                    language,
                                                                    "viewProperty"
                                                                )
                                                            }
                                                        </Link>
                                                    )}

                                                    {booking.status !==
                                                        "cancelled" && (
                                                            <button
                                                                type="button"
                                                                className="cancel-button"
                                                                onClick={() =>
                                                                    handleCancelBooking(
                                                                        booking.id
                                                                    )
                                                                }
                                                            >
                                                                {
                                                                    getTranslation(
                                                                        language,
                                                                        "cancelBooking"
                                                                    )
                                                                }
                                                            </button>
                                                        )}

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