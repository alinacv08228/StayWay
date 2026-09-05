"use client";

import {
    Suspense,
    useEffect,
    useState,
} from "react";

import {
    useSearchParams,
    useRouter,
} from "next/navigation";

import Link from "next/link";

import ProtectedRoute from "../../../components/ProtectedRoute";

import {
    getProperties,
} from "../../../services/propertyService";

import {
    getRoomsByPropertyId,
} from "../../../services/roomService";

import {
    useSettings,
} from "../../../context/SettingsContext";

import {
    useUser,
} from "../../../context/UserContext";

import {
    currencyInfo,
} from "../../../data/currency";

import {
    Property,
    Room,
} from "../../../types/types";


function getTodayDate(): string {
    const today = new Date();

    const year =
        today.getFullYear();

    const month =
        String(
            today.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            today.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


/* =========================================================
   BOOKING FORM
   ========================================================= */

function NewBookingForm() {

    const searchParams =
        useSearchParams();

    const router =
        useRouter();

    const { currency } =
        useSettings();

    const { currentUser } =
        useUser();


    /* =====================================================
       CURRENCY
       ===================================================== */

    const selectedCurrency =
        currencyInfo[currency] ??
        currencyInfo["Euro"];


    /* =====================================================
       URL PARAMETERS
       ===================================================== */

    const propertyId =
        Number(
            searchParams.get(
                "propertyId"
            )
        );

    const roomId =
        Number(
            searchParams.get(
                "roomId"
            )
        );


    /* =====================================================
       DATA
       ===================================================== */

    const [
        property,
        setProperty,
    ] =
        useState<Property | null>(
            null
        );

    const [
        propertyRooms,
        setPropertyRooms,
    ] =
        useState<Room[]>([]);

    const [
        isLoaded,
        setIsLoaded,
    ] =
        useState(false);


    /*
     * IMPORTANT:
     *
     * getProperties() and getRoomsByPropertyId()
     * use localStorage.
     *
     * Therefore we load them only after the
     * component has mounted in the browser.
     *
     * This prevents the Next.js hydration error.
     */

    useEffect(() => {

        const allProperties =
            getProperties();

        const foundProperty =
            allProperties.find(
                (item) =>
                    item.id ===
                    propertyId
            );

        setProperty(
            foundProperty ?? null
        );

        if (foundProperty) {

            const rooms =
                getRoomsByPropertyId(
                    foundProperty.id
                );

            setPropertyRooms(
                rooms
            );
        } else {

            setPropertyRooms([]);

        }

        setIsLoaded(true);

    }, [propertyId]);


    /* =====================================================
       FORM STATE
       ===================================================== */

    const [
        checkIn,
        setCheckIn,
    ] =
        useState("");

    const [
        checkOut,
        setCheckOut,
    ] =
        useState("");


    const [
        adults,
        setAdults,
    ] =
        useState(1);

    const [
        children,
        setChildren,
    ] =
        useState(0);

    const [
        infants,
        setInfants,
    ] =
        useState(0);


    const [
        error,
        setError,
    ] =
        useState("");


    /* =====================================================
       SELECTED ROOM
       ===================================================== */

    const selectedRoom =
        propertyRooms.find(
            (room) =>
                room.id ===
                roomId
        );

    const formattedRoomSize =
        selectedRoom &&
        selectedRoom.size !== undefined &&
        selectedRoom.size !== null &&
        selectedRoom.size !== ""
            ? typeof selectedRoom.size === "number"
                ? `${selectedRoom.size} m²`
                : selectedRoom.size
            : "";


    /* =====================================================
       PRICES
       ===================================================== */

    const pricePerNight =
        selectedRoom?.pricePerNight ??
        property?.pricePerNight ??
        0;


    const totalGuests =
        adults +
        children +
        infants;


    const roomCapacity =
        selectedRoom?.guests ??
        1;


    /* =====================================================
       NIGHTS
       ===================================================== */

    const calculateNights =
        () => {

            if (
                !checkIn ||
                !checkOut
            ) {
                return 0;
            }

            const start =
                new Date(
                    checkIn
                );

            const end =
                new Date(
                    checkOut
                );

            const difference =
                end.getTime() -
                start.getTime();

            return Math.ceil(
                difference /
                (
                    1000 *
                    60 *
                    60 *
                    24
                )
            );
        };


    const nights =
        calculateNights();


    const totalPrice =
        nights *
        pricePerNight;


    /* =====================================================
       FORMAT PRICE
       ===================================================== */

    const formatPrice =
        (
            price: number
        ) => {

            const convertedPrice =
                price *
                selectedCurrency.rate;

            return (
                `${selectedCurrency.symbol}${Math.round(
                    convertedPrice
                ).toLocaleString()}`
            );
        };


    /* =====================================================
       BOOKING
       ===================================================== */

    const handleBooking =
        () => {

            setError("");


            /* ---------------------------------------------
               DATES REQUIRED
               --------------------------------------------- */

            if (
                !checkIn ||
                !checkOut
            ) {

                setError(
                    "Please select check-in and check-out dates."
                );

                return;
            }


            /* ---------------------------------------------
               TODAY
               --------------------------------------------- */

            const today =
                getTodayDate();


            /* ---------------------------------------------
               CHECK-IN CANNOT BE IN THE PAST
               --------------------------------------------- */

            if (
                checkIn <
                today
            ) {

                setError(
                    "Check-in date cannot be in the past."
                );

                return;
            }


            /* ---------------------------------------------
               CHECK-OUT CANNOT BE IN THE PAST
               --------------------------------------------- */

            if (
                checkOut <
                today
            ) {

                setError(
                    "Check-out date cannot be in the past."
                );

                return;
            }


            /* ---------------------------------------------
               CHECK-OUT MUST BE AFTER CHECK-IN
               --------------------------------------------- */

            if (
                checkOut <=
                checkIn
            ) {

                setError(
                    "Check-out date must be after check-in date."
                );

                return;
            }


            /* ---------------------------------------------
               ADULT REQUIRED
               --------------------------------------------- */

            if (
                adults < 1
            ) {

                setError(
                    "At least one adult is required."
                );

                return;
            }


            /* ---------------------------------------------
               ROOM CAPACITY
               --------------------------------------------- */

            if (
                selectedRoom &&
                adults +
                children >
                selectedRoom.guests
            ) {

                setError(
                    `This room can accommodate up to ${selectedRoom.guests} adults and children.`
                );

                return;
            }


            /* ---------------------------------------------
               USER REQUIRED
               --------------------------------------------- */

            if (
                !currentUser
            ) {

                setError(
                    "You must be logged in to make a booking."
                );

                return;
            }


            /* ---------------------------------------------
               PROPERTY REQUIRED
               --------------------------------------------- */

            if (
                !property
            ) {

                setError(
                    "Property not found."
                );

                return;
            }


            /* ---------------------------------------------
               CREATE BOOKING
               --------------------------------------------- */

            const newBooking = {

                id:
                    Date.now(),

                userId:
                currentUser.id,

                propertyId:
                property.id,

                roomId:
                selectedRoom?.id,

                checkIn,

                checkOut,

                adults,

                children,

                infants,

                /*
                 * Total number of guests.
                 */
                guests:
                totalGuests,

                /*
                 * Price is stored in the
                 * application's base currency.
                 */
                totalPrice,

                status:
                    "confirmed" as const,
            };


            /* ---------------------------------------------
               LOAD EXISTING BOOKINGS
               --------------------------------------------- */

            const savedBookings =
                localStorage.getItem(
                    "stayway_bookings"
                );


            let bookings: typeof newBooking[] =
                [];


            if (
                savedBookings
            ) {

                try {

                    bookings =
                        JSON.parse(
                            savedBookings
                        );

                } catch {

                    bookings = [];

                }

            }


            /* ---------------------------------------------
               SAVE
               --------------------------------------------- */

            bookings.push(
                newBooking
            );


            localStorage.setItem(
                "stayway_bookings",
                JSON.stringify(
                    bookings
                )
            );


            /* ---------------------------------------------
               REDIRECT
               --------------------------------------------- */

            router.push(
                "/bookings"
            );
        };


    /* =====================================================
       ADULTS
       ===================================================== */

    const decreaseAdults =
        () => {

            setAdults(
                (current) =>
                    Math.max(
                        1,
                        current - 1
                    )
            );
        };


    const increaseAdults =
        () => {

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


    /* =====================================================
       CHILDREN
       ===================================================== */

    const decreaseChildren =
        () => {

            setChildren(
                (current) =>
                    Math.max(
                        0,
                        current - 1
                    )
            );
        };


    const increaseChildren =
        () => {

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


    /* =====================================================
       INFANTS
       ===================================================== */

    const decreaseInfants =
        () => {

            setInfants(
                (current) =>
                    Math.max(
                        0,
                        current - 1
                    )
            );
        };


    const increaseInfants =
        () => {

            setInfants(
                (current) =>
                    current + 1
            );
        };


    /* =====================================================
       LOADING
       ===================================================== */

    if (
        !isLoaded
    ) {

        return (

            <main className="bookings-loading-page">

                <section className="section">

                    <div className="container booking-page">

                        <p>
                            Loading booking...
                        </p>

                    </div>

                </section>

            </main>
        );
    }


    /* =====================================================
       PROPERTY NOT FOUND
       ===================================================== */

    if (
        !property
    ) {

        return (

            <main className="container">

                <h1>
                    Property not found
                </h1>

                <Link
                    href="/stays"
                >
                    ← Back to stays
                </Link>

            </main>
        );
    }


    /* =====================================================
       MAIN UI
       ===================================================== */

    return (

        <ProtectedRoute>

            <main>

                <section className="section">

                    <div className="container booking-page">


                        {/* BACK */}

                        <Link
                            href={`/stays/${property.id}`}
                        >
                            ← Back to property
                        </Link>


                        {/* TITLE */}

                        <h1>
                            Book your stay
                        </h1>


                        <div className="booking-layout">


                            {/* =================================================
                               FORM
                               ================================================= */}

                            <div className="booking-form">


                                <h2>
                                    {property.name}
                                </h2>


                                <p>
                                    {property.address}
                                </p>


                                {/* SELECTED ROOM */}

                                {selectedRoom && (

                                    <div className="selected-room-info">

                                        <strong>
                                            {
                                                selectedRoom.name
                                            }
                                        </strong>

                                        <p>
                                            {formattedRoomSize}

                                            {" · "}

                                            {selectedRoom.bed}
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


                                {/* =================================================
                                   CHECK-IN
                                   ================================================= */}

                                <label>

                                    Check-in

                                    <input
                                        type="date"
                                        value={
                                            checkIn
                                        }
                                        min={
                                            getTodayDate()
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setCheckIn(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                    />

                                </label>


                                {/* =================================================
                                   CHECK-OUT
                                   ================================================= */}

                                <label>

                                    Check-out

                                    <input
                                        type="date"
                                        value={
                                            checkOut
                                        }
                                        min={
                                            checkIn ||
                                            getTodayDate()
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setCheckOut(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                    />

                                </label>


                                {/* =================================================
                                   GUESTS
                                   ================================================= */}

                                <div className="guests-section">

                                    <h2>
                                        Guests
                                    </h2>


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


                                    {/* GUEST SUMMARY */}

                                    <p className="guest-summary">

                                        {adults}{" "}

                                        {
                                            adults === 1
                                                ? "adult"
                                                : "adults"
                                        }

                                        {" · "}

                                        {children}{" "}

                                        {
                                            children === 1
                                                ? "child"
                                                : "children"
                                        }

                                        {" · "}

                                        {infants}{" "}

                                        {
                                            infants === 1
                                                ? "infant"
                                                : "infants"
                                        }

                                    </p>


                                    <p className="guest-capacity">

                                        Room capacity:{" "}

                                        {
                                            roomCapacity
                                        }{" "}

                                        guests

                                    </p>

                                </div>


                                {/* ERROR */}

                                {error && (

                                    <p className="booking-error">

                                        {
                                            error
                                        }

                                    </p>

                                )}


                                {/* CONFIRM */}

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


                            {/* =================================================
                               SUMMARY
                               ================================================= */}

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
                                    {
                                        property.name
                                    }
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
                                            {formattedRoomSize}

                                            {" · "}

                                            {selectedRoom.bed}
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

                                            {
                                                nights
                                            }{" "}

                                            {
                                                nights === 1
                                                    ? "night"
                                                    : "nights"
                                            }

                                        </p>


                                        <p>

                                            {
                                                formatPrice(
                                                    pricePerNight
                                                )
                                            }

                                            {" × "}

                                            {
                                                nights
                                            }

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


/* =========================================================
   PAGE
   ========================================================= */

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