"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import {
    getTransferBookings,
    saveTransferBooking,
} from "@/services/transferService";

import {
    getTransferDriverBookings,
    getTransferDriversByCity,
} from "@/services/transferDriverService";

import {
    getTransferLocations,
} from "@/services/transferLocationService";

import {
    getTransferVehiclesByCity,
} from "@/services/transferVehicleService";

import {
    isAuthenticated,
} from "@/services/authService";

export default function TransferCheckoutPage() {
    const searchParams =
        useSearchParams();

    const [
        firstName,
        setFirstName,
    ] = useState("");

    const [
        lastName,
        setLastName,
    ] = useState("");

    const [
        email,
        setEmail,
    ] = useState("");

    const [
        phone,
        setPhone,
    ] = useState("");

    const [
        specialRequests,
        setSpecialRequests,
    ] = useState("");

    /*
     * =========================================
     * TRANSFER DATA
     * =========================================
     */

    const transferType =
        searchParams.get(
            "transferType"
        ) || "one-way";

    const optionId =
        searchParams.get(
            "optionId"
        ) || "";

    const optionTitle =
        searchParams.get(
            "optionTitle"
        ) || "Private transfer";

    const price =
        searchParams.get(
            "price"
        ) || "32";

    const pickup =
        searchParams.get(
            "pickup"
        ) || "—";

    const destination =
        searchParams.get(
            "destination"
        ) || "—";

    const date =
        searchParams.get(
            "date"
        ) || "—";

    const time =
        searchParams.get(
            "time"
        ) || "—";

    const passengers =
        searchParams.get(
            "passengers"
        ) || "2";

    const returnDate =
        searchParams.get(
            "returnDate"
        ) || "—";

    const returnTime =
        searchParams.get(
            "returnTime"
        ) || "—";


    /*
     * =========================================
     * AUTHENTICATION
     * =========================================
     *
     * If somebody manually opens checkout
     * while logged out, send them to 401.
     *
     * The main authentication check should
     * ALSO happen on "Select transfer" in
     * transfers/page.tsx.
     */

    useEffect(() => {
        if (!isAuthenticated()) {
            window.location.href =
                `/401?from=${encodeURIComponent(
                    window.location.pathname +
                    window.location.search
                )}`;
        }
    }, []);


    /*
     * =========================================
     * BACK URL
     * =========================================
     */

    const backToTransfers =
        `/transfers`;


    /*
     * =========================================
     * TRANSFER DURATION
     * =========================================
     */

    const getTransferDuration = (
        title: string
    ) => {
        return title
            .toLowerCase()
            .includes("family")
            ? 40
            : 35;
    };


    /*
     * =========================================
     * VEHICLE BOOKINGS
     * =========================================
     */

    const getTransferBookingsForVehicle = (
        vehicleId: string
    ) => {
        return getTransferBookings().filter(
            (booking) =>
                booking.vehicleId ===
                vehicleId
        );
    };


    /*
     * =========================================
     * AVAILABILITY
     * =========================================
     */

    const isTransferAvailable = (
        bookings: {
            date: string;
            time: string;
            optionTitle: string;
            transferType:
                | "one-way"
                | "return";
            returnDate?: string;
            returnTime?: string;
        }[],
        bookingDate: string,
        bookingTime: string,
        bookingDuration: number
    ) => {
        const requestedStart =
            new Date(
                `${bookingDate}T${bookingTime}`
            ).getTime();

        if (
            Number.isNaN(
                requestedStart
            )
        ) {
            return false;
        }

        const requestedEnd =
            requestedStart +
            bookingDuration *
            60 *
            1000;

        return !bookings.some(
            (booking) => {
                const existingStart =
                    new Date(
                        `${booking.date}T${booking.time}`
                    ).getTime();

                if (
                    Number.isNaN(
                        existingStart
                    )
                ) {
                    return false;
                }

                const existingDuration =
                    getTransferDuration(
                        booking.optionTitle
                    );

                const existingEnd =
                    existingStart +
                    existingDuration *
                    60 *
                    1000;

                if (
                    requestedStart <
                    existingEnd &&
                    requestedEnd >
                    existingStart
                ) {
                    return true;
                }

                if (
                    booking.transferType ===
                    "return" &&
                    booking.returnDate &&
                    booking.returnTime
                ) {
                    const returnStart =
                        new Date(
                            `${booking.returnDate}T${booking.returnTime}`
                        ).getTime();

                    if (
                        Number.isNaN(
                            returnStart
                        )
                    ) {
                        return false;
                    }

                    const returnEnd =
                        returnStart +
                        existingDuration *
                        60 *
                        1000;

                    return (
                        requestedStart <
                        returnEnd &&
                        requestedEnd >
                        returnStart
                    );
                }

                return false;
            }
        );
    };


    /*
     * =========================================
     * CONFIRM TRANSFER
     * =========================================
     */

    const handleConfirmTransfer =
        () => {

            /*
             * DOUBLE CHECK AUTHENTICATION
             */

            if (!isAuthenticated()) {
                window.location.href =
                    `/401?from=${encodeURIComponent(
                        window.location.pathname +
                        window.location.search
                    )}`;

                return;
            }


            /*
             * PASSENGER DETAILS
             */

            if (
                !firstName ||
                !lastName ||
                !email ||
                !phone
            ) {
                alert(
                    "Please complete all required passenger details."
                );

                return;
            }


            /*
             * DATE AND TIME
             */

            if (
                !date ||
                date === "—" ||
                !time ||
                time === "—"
            ) {
                alert(
                    "Please select a valid transfer date and time."
                );

                return;
            }


            /*
             * RETURN DATE AND TIME
             */

            if (
                transferType ===
                "return" &&
                (
                    !returnDate ||
                    returnDate === "—" ||
                    !returnTime ||
                    returnTime === "—"
                )
            ) {
                alert(
                    "Please select a valid return date and time."
                );

                return;
            }


            /*
             * FIND TRANSFER CITY
             */

            const transferLocations =
                getTransferLocations();

            const pickupLocation =
                transferLocations.find(
                    (location) =>
                        location.name
                            .toLowerCase() ===
                        pickup.toLowerCase()
                );

            const city =
                pickupLocation?.cityName ||
                "";

            if (!city) {
                alert(
                    "We could not determine the transfer city."
                );

                return;
            }


            /*
             * TRANSFER DURATION
             */

            const duration =
                getTransferDuration(
                    optionTitle
                );


            /*
             * REQUIRED CATEGORY
             */

            const requiredCategory =
                optionTitle
                    .toLowerCase()
                    .includes("family")
                    ? "Family"
                    : optionTitle
                        .toLowerCase()
                        .includes(
                            "comfort"
                        )
                        ? "Comfort"
                        : "Private";


            /*
             * VEHICLES + DRIVERS
             */

            const vehicles =
                getTransferVehiclesByCity(
                    city
                );

            const drivers =
                getTransferDriversByCity(
                    city
                );


            /*
             * FIND AVAILABLE VEHICLE
             */

            const availableVehicle =
                vehicles.find(
                    (vehicle) => {

                        if (
                            vehicle.category !==
                            requiredCategory
                        ) {
                            return false;
                        }

                        if (
                            vehicle.passengers <
                            Number(
                                passengers
                            )
                        ) {
                            return false;
                        }

                        if (
                            !vehicle.driverId
                        ) {
                            return false;
                        }

                        const assignedDriver =
                            drivers.find(
                                (driver) =>
                                    driver.id ===
                                    vehicle.driverId
                            );

                        if (
                            !assignedDriver ||
                            assignedDriver.status !==
                            "available"
                        ) {
                            return false;
                        }


                        /*
                         * VEHICLE AVAILABILITY
                         */

                        const vehicleBookings =
                            getTransferBookingsForVehicle(
                                vehicle.id
                            );

                        if (
                            !isTransferAvailable(
                                vehicleBookings,
                                date,
                                time,
                                duration
                            )
                        ) {
                            return false;
                        }


                        /*
                         * DRIVER AVAILABILITY
                         */

                        const driverBookings =
                            getTransferDriverBookings(
                                vehicle.driverId
                            );

                        if (
                            !isTransferAvailable(
                                driverBookings,
                                date,
                                time,
                                duration
                            )
                        ) {
                            return false;
                        }


                        /*
                         * RETURN JOURNEY
                         */

                        if (
                            transferType ===
                            "return"
                        ) {
                            if (
                                !isTransferAvailable(
                                    vehicleBookings,
                                    returnDate,
                                    returnTime,
                                    duration
                                )
                            ) {
                                return false;
                            }

                            if (
                                !isTransferAvailable(
                                    driverBookings,
                                    returnDate,
                                    returnTime,
                                    duration
                                )
                            ) {
                                return false;
                            }
                        }

                        return true;
                    }
                );


            /*
             * NO VEHICLE
             */

            if (
                !availableVehicle
            ) {
                alert(
                    "No vehicle with an available assigned driver is available for the selected date and time."
                );

                return;
            }


            /*
             * FIND DRIVER
             */

            const availableDriver =
                drivers.find(
                    (driver) =>
                        driver.id ===
                        availableVehicle.driverId
                );

            if (
                !availableDriver
            ) {
                alert(
                    "The selected vehicle does not have an assigned driver."
                );

                return;
            }


            /*
             * CREATE BOOKING
             */

            const booking = {
                id:
                    `transfer-${Date.now()}`,

                transferType:
                    transferType ===
                    "return"
                        ? "return"
                        : "one-way",

                optionId,

                optionTitle,

                price:
                    Number(price),

                vehicleId:
                availableVehicle.id,

                vehicleName:
                availableVehicle.name,

                licensePlate:
                availableVehicle.licensePlate,

                vehicleImage:
                availableVehicle.image,

                driverId:
                availableDriver.id,

                driverName:
                availableDriver.name,

                pickup,

                destination,

                date,

                time,

                passengers:
                    Number(
                        passengers
                    ),

                returnDate:
                    transferType ===
                    "return"
                        ? returnDate
                        : undefined,

                returnTime:
                    transferType ===
                    "return"
                        ? returnTime
                        : undefined,

                firstName,

                lastName,

                email,

                phone,

                specialRequests,

                createdAt:
                    new Date().toISOString(),
            };


            /*
             * SAVE
             */

            saveTransferBooking(
                booking
            );


            /*
             * CONFIRMATION
             */

            window.location.href =
                "/transfers/confirmation";
        };


    /*
     * =========================================
     * RENDER
     * =========================================
     */

    return (
        <main className="transfer-checkout-page">

            {/* HERO */}

            <section className="transfer-checkout-hero">

                <div className="transfers-container">

                    <span className="transfers-eyebrow stayway-load-in stayway-load-1">
                        STAYWAY TRANSFERS
                    </span>

                    <h1 className="stayway-load-in stayway-load-2">
                        Complete your
                        <br />
                        <span>
                            transfer booking.
                        </span>
                    </h1>

                    <p className="stayway-load-in stayway-load-3">
                        Enter your details to complete
                        your transfer reservation.
                    </p>

                </div>

            </section>


            {/* CONTENT */}

            <section className="transfer-checkout-content">

                <div className="transfers-container">

                    <div className="transfer-checkout-layout">

                        {/* PASSENGER DETAILS */}

                        <div className="transfer-checkout-form-card stayway-load-in stayway-load-4">

                            <span className="transfers-eyebrow">
                                PASSENGER DETAILS
                            </span>

                            <h2>
                                Who is travelling?
                            </h2>


                            <div className="transfer-form-grid">

                                <div className="transfer-form-field">

                                    <label htmlFor="firstName">
                                        First name
                                    </label>

                                    <input
                                        id="firstName"
                                        type="text"
                                        placeholder="Your first name"
                                        value={
                                            firstName
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setFirstName(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                    />

                                </div>


                                <div className="transfer-form-field">

                                    <label htmlFor="lastName">
                                        Last name
                                    </label>

                                    <input
                                        id="lastName"
                                        type="text"
                                        placeholder="Your last name"
                                        value={
                                            lastName
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setLastName(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                    />

                                </div>


                                <div className="transfer-form-field">

                                    <label htmlFor="email">
                                        Email address
                                    </label>

                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={
                                            email
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setEmail(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                    />

                                </div>


                                <div className="transfer-form-field">

                                    <label htmlFor="phone">
                                        Phone number
                                    </label>

                                    <input
                                        id="phone"
                                        type="tel"
                                        placeholder="Enter your phone number"
                                        value={
                                            phone
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setPhone(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                    />

                                </div>

                            </div>


                            {/* SPECIAL REQUESTS */}

                            <div className="transfer-form-field transfer-form-field-full">

                                <label htmlFor="requests">
                                    Special requests
                                </label>

                                <textarea
                                    id="requests"
                                    rows={4}
                                    placeholder="Anything we should know about your journey?"
                                    value={
                                        specialRequests
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setSpecialRequests(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                />

                            </div>


                            {/* NOTE */}

                            <div className="transfer-checkout-note">

                                <span>
                                    ✓
                                </span>

                                <p>
                                    Your transfer details
                                    will be reviewed before
                                    the reservation is confirmed.
                                </p>

                            </div>

                        </div>


                        {/* SUMMARY */}

                        <aside className="transfer-summary-card stayway-load-in stayway-load-5">

                            <div className="transfer-summary-header">

                                <div>

                                    <span className="transfers-eyebrow">
                                        YOUR TRANSFER
                                    </span>

                                    <h2>
                                        {optionTitle}
                                    </h2>

                                </div>


                                <div className="transfer-summary-price">

                                    <span>
                                        from
                                    </span>

                                    <strong>
                                        €{price}
                                    </strong>

                                </div>

                            </div>


                            {/* ROUTE */}

                            <div className="transfer-summary-route">

                                <div>

                                    <span>
                                        Pick-up
                                    </span>

                                    <strong>
                                        {pickup}
                                    </strong>

                                </div>


                                <div className="transfer-summary-arrow">
                                    →
                                </div>


                                <div>

                                    <span>
                                        Destination
                                    </span>

                                    <strong>
                                        {destination}
                                    </strong>

                                </div>

                            </div>


                            {/* DETAILS */}

                            <div className="transfer-summary-details">

                                <div>

                                    <span>
                                        Date
                                    </span>

                                    <strong>
                                        {date}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Time
                                    </span>

                                    <strong>
                                        {time}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Passengers
                                    </span>

                                    <strong>
                                        {passengers}{" "}
                                        {passengers ===
                                        "1"
                                            ? "passenger"
                                            : "passengers"}
                                    </strong>

                                </div>

                            </div>


                            {/* RETURN */}

                            {transferType ===
                                "return" && (

                                    <div className="transfer-summary-return">

                                        <span className="transfers-eyebrow">
                                            RETURN JOURNEY
                                        </span>

                                        <div className="transfer-summary-return-details">

                                            <div>

                                                <span>
                                                    Return date
                                                </span>

                                                <strong>
                                                    {returnDate}
                                                </strong>

                                            </div>


                                            <div>

                                                <span>
                                                    Return time
                                                </span>

                                                <strong>
                                                    {returnTime}
                                                </strong>

                                            </div>

                                        </div>

                                    </div>
                                )}


                            <div className="transfer-summary-divider" />


                            {/* TOTAL */}

                            <div className="transfer-summary-total">

                                <span>
                                    Total
                                </span>

                                <strong>
                                    €{price}
                                </strong>

                            </div>


                            {/* CONFIRM */}

                            <button
                                type="button"
                                className="transfer-confirm-button"
                                onClick={
                                    handleConfirmTransfer
                                }
                            >
                                Confirm transfer
                            </button>


                            {/* BACK */}

                            <Link
                                href={backToTransfers}
                                className="transfer-summary-back"
                            >
                                ← Back to transfer details
                            </Link>

                        </aside>

                    </div>

                </div>

            </section>

        </main>
    );
}