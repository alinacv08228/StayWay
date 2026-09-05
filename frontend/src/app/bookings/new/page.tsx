"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

import { properties, rooms } from "../../../data/mockData";
import ProtectedRoute from "../../../components/ProtectedRoute";
import { useSettings } from "../../../context/SettingsContext";
import { useUser } from "../../../context/UserContext";
import { currencyInfo } from "../../../data/currency";

function NewBookingForm() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const { currency } = useSettings();
    const { currentUser } = useUser();

    const selectedCurrency =
        currencyInfo[currency] ??
        currencyInfo["Euro"];

    const propertyId = Number(
        searchParams.get("propertyId")
    );

    const roomId = Number(
        searchParams.get("roomId")
    );

    const property = properties.find(
        (item) => item.id === propertyId
    );

    const selectedRoom = rooms.find(
        (room) =>
            room.id === roomId &&
            room.propertyId === propertyId
    );

    const [checkIn, setCheckIn] =
        useState("");

    const [checkOut, setCheckOut] =
        useState("");

    const [adults, setAdults] =
        useState(1);

    const [children, setChildren] =
        useState(0);

    const [infants, setInfants] =
        useState(0);

    const [error, setError] =
        useState("");

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

    const totalGuests =
        adults +
        children +
        infants;

    const roomCapacity =
        selectedRoom?.guests ??
        1;

    const calculateNights = () => {
        if (!checkIn || !checkOut) {
            return 0;
        }

        const start =
            new Date(checkIn);

        const end =
            new Date(checkOut);

        const difference =
            end.getTime() -
            start.getTime();

        return Math.ceil(
            difference /
            (1000 * 60 * 60 * 24)
        );
    };

    const nights =
        calculateNights();

    const totalPrice =
        nights * pricePerNight;

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

        if (adults < 1) {
            setError(
                "At least one adult is required."
            );

            return;
        }

        if (
            selectedRoom &&
            adults + children >
            selectedRoom.guests
        ) {
            setError(
                `This room can accommodate up to ${selectedRoom.guests} adults and children.`
            );

            return;
        }

        const newBooking = {
            id: Date.now(),

            userId: currentUser?.id ?? 0,

            propertyId:
            property.id,

            roomId:
            selectedRoom?.id,

            checkIn,
            checkOut,

            adults,
            children,
            infants,

            // Totalul tuturor oaspeților.
            guests: totalGuests,

            // Prețul este salvat în moneda
            // de bază a aplicației.
            totalPrice,

            status:
                "confirmed" as const,
        };

        const savedBookings =
            localStorage.getItem(
                "stayway_bookings"
            );

        const bookings =
            savedBookings
                ? JSON.parse(
                    savedBookings
                )
                : [];

        bookings.push(
            newBooking
        );

        localStorage.setItem(
            "stayway_bookings",
            JSON.stringify(
                bookings
            )
        );

        router.push(
            "/bookings"
        );
    };

    const decreaseAdults = () => {
        setAdults(
            (current) =>
                Math.max(
                    1,
                    current - 1
                )
        );
    };

    const decreaseChildren = () => {
        setChildren(
            (current) =>
                Math.max(
                    0,
                    current - 1
                )
        );
    };

    const decreaseInfants = () => {
        setInfants(
            (current) =>
                Math.max(
                    0,
                    current - 1
                )
        );
    };

    const increaseAdults = () => {
        if (
            adults +
            1 +
            children <=
            roomCapacity
        ) {
            setAdults(
                (current) =>
                    current + 1
            );
        }
    };

    const increaseChildren = () => {
        if (
            adults +
            children +
            1 <=
            roomCapacity
        ) {
            setChildren(
                (current) =>
                    current + 1
            );
        }
    };

    const increaseInfants = () => {
        setInfants(
            (current) =>
                current + 1
        );
    };

    return (
        <ProtectedRoute>
            <main>
                <section className="section">
                    <div className="container booking-page">

                        <Link
                            href={`/stays/${property.id}`}
                        >
                            ← Back to property
                        </Link>

                        <h1>
                            Book your stay
                        </h1>

                        <div className="booking-layout">

                            {/* FORMULAR */}
                            <div className="booking-form">

                                <h2>
                                    {property.name}
                                </h2>

                                <p>
                                    {
                                        property.address
                                    }
                                </p>

                                {selectedRoom && (
                                    <div className="selected-room-info">

                                        <strong>
                                            {
                                                selectedRoom.name
                                            }
                                        </strong>

                                        <p>
                                            {
                                                selectedRoom.size
                                            }
                                            {" · "}
                                            {
                                                selectedRoom.bed
                                            }
                                        </p>

                                        <p>
                                            {
                                                formatPrice(
                                                    selectedRoom.pricePerNight
                                                )
                                            }
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

                                {/* GUESTS */}
                                <div className="guest-selector">

                                    <h3>
                                        Guests
                                    </h3>

                                    {/* ADULTS */}
                                    <div className="guest-row">

                                        <div>
                                            <strong>
                                                Adults
                                            </strong>

                                            <span>
                                                13+ years
                                            </span>
                                        </div>

                                        <div className="guest-counter">

                                            <button
                                                type="button"
                                                onClick={
                                                    decreaseAdults
                                                }
                                                disabled={
                                                    adults === 1
                                                }
                                            >
                                                −
                                            </button>

                                            <span>
                                                {adults}
                                            </span>

                                            <button
                                                type="button"
                                                onClick={
                                                    increaseAdults
                                                }
                                                disabled={
                                                    adults +
                                                    children >=
                                                    roomCapacity
                                                }
                                            >
                                                +
                                            </button>

                                        </div>

                                    </div>

                                    {/* CHILDREN */}
                                    <div className="guest-row">

                                        <div>
                                            <strong>
                                                Children
                                            </strong>

                                            <span>
                                                2–12 years
                                            </span>
                                        </div>

                                        <div className="guest-counter">

                                            <button
                                                type="button"
                                                onClick={
                                                    decreaseChildren
                                                }
                                                disabled={
                                                    children === 0
                                                }
                                            >
                                                −
                                            </button>

                                            <span>
                                                {children}
                                            </span>

                                            <button
                                                type="button"
                                                onClick={
                                                    increaseChildren
                                                }
                                                disabled={
                                                    adults +
                                                    children >=
                                                    roomCapacity
                                                }
                                            >
                                                +
                                            </button>

                                        </div>

                                    </div>

                                    {/* INFANTS */}
                                    <div className="guest-row">

                                        <div>
                                            <strong>
                                                Infants
                                            </strong>

                                            <span>
                                                Under 2 years
                                            </span>
                                        </div>

                                        <div className="guest-counter">

                                            <button
                                                type="button"
                                                onClick={
                                                    decreaseInfants
                                                }
                                                disabled={
                                                    infants === 0
                                                }
                                            >
                                                −
                                            </button>

                                            <span>
                                                {infants}
                                            </span>

                                            <button
                                                type="button"
                                                onClick={
                                                    increaseInfants
                                                }
                                            >
                                                +
                                            </button>

                                        </div>

                                    </div>

                                    <p className="guest-summary">

                                        {adults}{" "}

                                        {adults === 1
                                            ? "adult"
                                            : "adults"}

                                        {" · "}

                                        {children}{" "}

                                        {children === 1
                                            ? "child"
                                            : "children"}

                                        {" · "}

                                        {infants}{" "}

                                        {infants === 1
                                            ? "infant"
                                            : "infants"}

                                    </p>

                                    <p className="guest-capacity">
                                        Room capacity:{" "}
                                        {roomCapacity}{" "}
                                        guests
                                    </p>

                                </div>

                                {error && (
                                    <p className="booking-error">
                                        {error}
                                    </p>
                                )}

                                <button
                                    type="button"
                                    className="primary-button"
                                    onClick={
                                        handleBooking
                                    }
                                >
                                    Confirm booking
                                </button>

                            </div>

                            {/* REZUMAT */}
                            <div className="booking-summary">

                                <img
                                    src={
                                        property.image
                                    }
                                    alt={
                                        property.name
                                    }
                                />

                                <h2>
                                    {property.name}
                                </h2>

                                <p>
                                    {
                                        property.address
                                    }
                                </p>

                                {selectedRoom && (
                                    <div className="booking-room-summary">

                                        <strong>
                                            {
                                                selectedRoom.name
                                            }
                                        </strong>

                                        <p>
                                            {
                                                selectedRoom.size
                                            }
                                            {" · "}
                                            {
                                                selectedRoom.bed
                                            }
                                        </p>

                                    </div>
                                )}

                                <p>
                                    {
                                        formatPrice(
                                            pricePerNight
                                        )
                                    }
                                    {" / night"}
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
                                            {
                                                formatPrice(
                                                    pricePerNight
                                                )
                                            }
                                            {" × "}
                                            {nights}
                                        </p>

                                        <strong>
                                            Total:{" "}
                                            {
                                                formatPrice(
                                                    totalPrice
                                                )
                                            }
                                        </strong>

                                    </div>
                                )}

                            </div>

                        </div>

                    </div>
                </section>
            </main>
        </ProtectedRoute>
    );
}

export default function NewBookingPage() {
    return (
        <Suspense
            fallback={
                <main className="container">
                    <p>
                        Loading booking...
                    </p>
                </main>
            }
        >
            <NewBookingForm />
        </Suspense>
    );
}