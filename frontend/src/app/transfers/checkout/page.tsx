
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import {
    getTransferBookings,
    getTransferDuration,
    saveTransferBooking,
} from "@/services/transferService";

import {
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

    const [availabilityError, setAvailabilityError] = useState("");

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

    const basePrice =
        Number(
            searchParams.get(
                "price"
            ) || "32"
        );

    const totalPrice =
        transferType === "return"
            ? basePrice * 2
            : basePrice;

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
     * DISPLAY DATE FORMAT
     * =========================================
     *
     * Keep the original ISO date in the booking
     * data, but display it as DD.MM.YYYY.
     */

    const formatDisplayDate = (
        value: string
    ) => {
        if (
            !value ||
            value === "—"
        ) {
            return value;
        }

        const parts =
            value.split("-");

        if (
            parts.length !== 3
        ) {
            return value;
        }

        return `${parts[2]}.${parts[1]}.${parts[0]}`;
    };


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
     * AVAILABILITY HELPERS
     * =========================================
     *
     * pending   -> occupies the pair
     * confirmed -> occupies the pair
     * cancelled -> frees the pair
     *
     * Older bookings without a status are treated
     * as active for backwards compatibility.
     */

    const isActiveTransferBooking = (
        booking: {
            status?: "pending" | "confirmed" | "cancelled";
        }
    ) => {
        return booking.status !== "cancelled";
    };

    const isTransferLegBusy = (
        existingDate: string,
        existingTime: string,
        existingDuration: number,
        requestedDate: string,
        requestedTime: string,
        requestedDuration: number
    ) => {
        const existingStart = new Date(
            `${existingDate}T${existingTime}`
        ).getTime();

        const requestedStart = new Date(
            `${requestedDate}T${requestedTime}`
        ).getTime();

        if (
            Number.isNaN(existingStart) ||
            Number.isNaN(requestedStart)
        ) {
            return false;
        }

        const existingEnd =
            existingStart +
            existingDuration * 60 * 1000;

        const requestedEnd =
            requestedStart +
            requestedDuration * 60 * 1000;

        return (
            requestedStart < existingEnd &&
            requestedEnd > existingStart
        );
    };

    /*
     * =========================================
     * AVAILABILITY HELPERS
     * =========================================
     *
     * A vehicle and its assigned driver are ONE
     * availability pair.
     *
     * pending   -> occupies the pair
     * confirmed -> occupies the pair
     * cancelled -> frees the pair
     *
     * One-way:
     *   check only the requested outbound leg.
     *
     * Return:
     *   check BOTH requested legs against BOTH legs
     *   of every active existing booking.
     */

    const getActiveTransferBookings = () => {
        return getTransferBookings().filter(
            (booking) =>
                isActiveTransferBooking(booking)
        );
    };

    const getTransferBookingsForVehicle = (
        vehicleId: string
    ) => {
        return getActiveTransferBookings().filter(
            (booking) =>
                booking.vehicleId === vehicleId
        );
    };

    const getTransferBookingsForDriver = (
        driverId: string
    ) => {
        return getActiveTransferBookings().filter(
            (booking) =>
                booking.driverId === driverId
        );
    };

    const isLegAvailable = (
        bookings: ReturnType<
            typeof getActiveTransferBookings
        >,
        requestedDate: string,
        requestedTime: string,
        requestedDuration: number
    ) => {
        if (
            !requestedDate ||
            requestedDate === "—" ||
            !requestedTime ||
            requestedTime === "—"
        ) {
            return false;
        }

        return !bookings.some(
            (booking) => {
                const existingDuration =
                    getTransferDuration(
                        booking.optionTitle
                    );

                /*
                 * Existing outbound leg.
                 */
                if (
                    isTransferLegBusy(
                        booking.date,
                        booking.time,
                        existingDuration,
                        requestedDate,
                        requestedTime,
                        requestedDuration
                    )
                ) {
                    return true;
                }

                /*
                 * Existing return leg.
                 */
                if (
                    booking.transferType ===
                    "return" &&
                    booking.returnDate &&
                    booking.returnTime
                ) {
                    if (
                        isTransferLegBusy(
                            booking.returnDate,
                            booking.returnTime,
                            existingDuration,
                            requestedDate,
                            requestedTime,
                            requestedDuration
                        )
                    ) {
                        return true;
                    }
                }

                return false;
            }
        );
    };

    const isPairAvailable = (
        vehicleId: string,
        driverId: string,
        requiredCategory: string,
        duration: number,
        requestedPassengers: number,
        requestedTransferType:
            | "one-way"
            | "return",
        requestedDate: string,
        requestedTime: string,
        requestedReturnDate: string,
        requestedReturnTime: string,
        city: string
    ) => {
        /*
         * Always read the current vehicle/driver data
         * for this exact city.
         */
        const cityVehicles =
            getTransferVehiclesByCity(
                city
            );

        const cityDrivers =
            getTransferDriversByCity(
                city
            );

        const vehicle =
            cityVehicles.find(
                (item) =>
                    item.id === vehicleId
            );

        const driver =
            cityDrivers.find(
                (item) =>
                    item.id === driverId
            );

        if (
            !vehicle ||
            !driver
        ) {
            return false;
        }

        /*
         * Category and capacity.
         */
        if (
            vehicle.category !==
            requiredCategory
        ) {
            return false;
        }

        if (
            vehicle.passengers <
            requestedPassengers
        ) {
            return false;
        }

        /*
         * The driver MUST be the one assigned
         * to this vehicle.
         */
        if (
            vehicle.driverId !==
            driver.id
        ) {
            return false;
        }

        /*
         * An inactive driver can never be assigned.
         * "busy" is NOT used here because scheduled
         * availability is determined by bookings.
         */
        if (
            driver.status ===
            "inactive"
        ) {
            return false;
        }

        /*
         * Both resources must be free.
         */
        const vehicleBookings =
            getTransferBookingsForVehicle(
                vehicle.id
            );

        const driverBookings =
            getTransferBookingsForDriver(
                driver.id
            );

        /*
         * One-way: only outbound.
         */
        if (
            !isLegAvailable(
                vehicleBookings,
                requestedDate,
                requestedTime,
                duration
            )
        ) {
            return false;
        }

        if (
            !isLegAvailable(
                driverBookings,
                requestedDate,
                requestedTime,
                duration
            )
        ) {
            return false;
        }

        /*
         * Return: the SAME vehicle + driver pair
         * must also be free for the return leg.
         */
        if (
            requestedTransferType ===
            "return"
        ) {
            if (
                !isLegAvailable(
                    vehicleBookings,
                    requestedReturnDate,
                    requestedReturnTime,
                    duration
                )
            ) {
                return false;
            }

            if (
                !isLegAvailable(
                    driverBookings,
                    requestedReturnDate,
                    requestedReturnTime,
                    duration
                )
            ) {
                return false;
            }
        }

        return true;
    };

    /*
     * =========================================
     * CONFIRM TRANSFER
     * =========================================
     */

    const handleConfirmTransfer =
        () => {

            setAvailabilityError("");

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
             * FIND AVAILABLE VEHICLE + DRIVER PAIR
             *
             * Each vehicle already contains its assigned driverId.
             * We test the exact vehicle + driver pair.
             *
             * If pair #1 is occupied, .find() automatically
             * continues to pair #2.
             */

            const availableVehicle =
                vehicles.find(
                    (vehicle) => {
                        if (
                            !vehicle.driverId
                        ) {
                            return false;
                        }

                        /*
                         * Skip vehicles that are not in
                         * the requested category/capacity.
                         */
                        if (
                            vehicle.category !==
                            requiredCategory
                        ) {
                            return false;
                        }

                        if (
                            vehicle.passengers <
                            Number(passengers)
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
                            !assignedDriver
                        ) {
                            return false;
                        }

                        /*
                         * Only an inactive driver is
                         * permanently unavailable.
                         * Busy is determined by bookings.
                         */
                        if (
                            assignedDriver.status ===
                            "inactive"
                        ) {
                            return false;
                        }

                        return isPairAvailable(
                            vehicle.id,
                            assignedDriver.id,
                            requiredCategory,
                            duration,
                            Number(passengers),
                            transferType ===
                            "return"
                                ? "return"
                                : "one-way",
                            date,
                            time,
                            returnDate,
                            returnTime,
                            city
                        );
                    }
                );

            if (
                !availableVehicle
            ) {
                /*
                 * Tell the customer exactly which leg is unavailable.
                 *
                 * For a Return transfer we check the two legs separately
                 * only for the purpose of the error message:
                 * - departure
                 * - return
                 *
                 * The real booking check above still requires the SAME
                 * vehicle + driver pair to be available for BOTH legs.
                 */

                const hasAvailableDeparturePair =
                    vehicles.some(
                        (vehicle) => {
                            if (
                                !vehicle.driverId ||
                                vehicle.category !==
                                requiredCategory ||
                                vehicle.passengers <
                                Number(passengers)
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
                                assignedDriver.status ===
                                "inactive"
                            ) {
                                return false;
                            }

                            return isPairAvailable(
                                vehicle.id,
                                assignedDriver.id,
                                requiredCategory,
                                duration,
                                Number(passengers),
                                "one-way",
                                date,
                                time,
                                "—",
                                "—",
                                city
                            );
                        }
                    );

                if (
                    transferType === "return"
                ) {
                    const hasAvailableReturnPair =
                        vehicles.some(
                            (vehicle) => {
                                if (
                                    !vehicle.driverId ||
                                    vehicle.category !==
                                    requiredCategory ||
                                    vehicle.passengers <
                                    Number(passengers)
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
                                    assignedDriver.status ===
                                    "inactive"
                                ) {
                                    return false;
                                }

                                return isPairAvailable(
                                    vehicle.id,
                                    assignedDriver.id,
                                    requiredCategory,
                                    duration,
                                    Number(passengers),
                                    "one-way",
                                    returnDate,
                                    returnTime,
                                    "—",
                                    "—",
                                    city
                                );
                            }
                        );

                    if (
                        !hasAvailableDeparturePair
                    ) {
                        setAvailabilityError(
                            `No vehicle with an available assigned driver is available for the departure on ${formatDisplayDate(date)} at ${time}. Please choose a different departure date or time.`
                        );

                        return;
                    }

                    if (
                        !hasAvailableReturnPair
                    ) {
                        setAvailabilityError(
                            `No vehicle with an available assigned driver is available for the return on ${formatDisplayDate(returnDate)} at ${returnTime}. Please choose a different return date or time.`
                        );

                        return;
                    }

                    /*
                     * Both individual legs have an available pair,
                     * but no SINGLE pair is free for both legs.
                     */
                    setAvailabilityError(
                        `No single vehicle and assigned driver pair is available for both the departure on ${formatDisplayDate(date)} at ${time} and the return on ${formatDisplayDate(returnDate)} at ${returnTime}. Please choose different departure or return date/time.`
                    );

                    return;
                }

                setAvailabilityError(
                    `No vehicle with an available assigned driver is available for the transfer on ${formatDisplayDate(date)} at ${time}. Please choose a different date or time.`
                );

                return;
            }

            /*
             * The selected driver is always the driver
             * assigned to the selected vehicle.
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
             * FINAL CHECK
             *
             * Re-read bookings immediately before saving.
             * This prevents the pair from being reused if
             * another booking was created after the first check.
             */
            /*
             * isPairAvailable() reads localStorage again here,
             * so this is the final availability check immediately
             * before the booking is saved.
             */

            const stillAvailable =
                isPairAvailable(
                    availableVehicle.id,
                    availableDriver.id,
                    requiredCategory,
                    duration,
                    Number(passengers),
                    transferType ===
                    "return"
                        ? "return"
                        : "one-way",
                    date,
                    time,
                    returnDate,
                    returnTime,
                    city
                );

            if (!stillAvailable) {
                setAvailabilityError(
                    "This vehicle and driver pair is no longer available for the selected transfer. Please choose a different date or time."
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
                    Number(totalPrice),

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

                status:
                    "pending",

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

                    {availabilityError && (
                        <div
                            role="alert"
                            style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: "12px",
                                marginBottom: "22px",
                                padding: "14px 16px",
                                border: "1px solid #f1b8b8",
                                borderRadius: "12px",
                                background: "#fff5f5",
                                color: "#7f1d1d",
                                fontSize: "14px",
                                lineHeight: 1.5,
                            }}
                        >
                            <span
                                aria-hidden="true"
                                style={{
                                    flexShrink: 0,
                                    width: "24px",
                                    height: "24px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: "50%",
                                    background: "#fee2e2",
                                    color: "#dc2626",
                                    fontWeight: 700,
                                    fontSize: "13px",
                                }}
                            >
                                !
                            </span>
                            <div>
                                <strong
                                    style={{
                                        display: "block",
                                        marginBottom: "3px",
                                        color: "#b91c1c",
                                    }}
                                >
                                    Transfer unavailable
                                </strong>
                                <span>{availabilityError}</span>
                            </div>
                        </div>
                    )}

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
                                        €{basePrice}
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
                                        {formatDisplayDate(date)}
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
                                                    {formatDisplayDate(returnDate)}
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


                            {transferType === "return" && (
                                <div className="transfer-summary-divider" />
                            )}


                            {/* TOTAL */}

                            <div className="transfer-summary-total">

                                <span>
                                    Total
                                </span>

                                <strong>
                                    €{totalPrice}
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


            <style jsx global>{`
                /* =========================================================
                   TRANSFER CHECKOUT — DARK MODE
                   Removes the white/light surfaces and keeps the page navy.
                ========================================================= */

                html[data-theme="dark"] .transfer-checkout-page {
                    background: #172338 !important;
                    color: #f5f8fc !important;
                }

                html[data-theme="dark"] .transfer-checkout-hero {
                    background: #101d30 !important;
                    border-bottom: 1px solid #2d4059 !important;
                }

                html[data-theme="dark"] .transfer-checkout-hero h1 {
                    color: #f7f9fc !important;
                }

                html[data-theme="dark"] .transfer-checkout-hero h1 span {
                    color: #9b8cff !important;
                }

                html[data-theme="dark"] .transfer-checkout-hero p {
                    color: #aebed1 !important;
                }

                html[data-theme="dark"] .transfer-checkout-content {
                    background: #172338 !important;
                }

                html[data-theme="dark"] .transfer-checkout-content .transfers-container {
                    background: transparent !important;
                }

                html[data-theme="dark"] .transfer-checkout-layout {
                    background: transparent !important;
                }

                html[data-theme="dark"] .transfer-checkout-form-card,
                html[data-theme="dark"] .transfer-summary-card {
                    background: #0d1c2f !important;
                    border: 1px solid #304660 !important;
                    color: #f5f8fc !important;
                    box-shadow: 0 18px 45px rgba(0, 0, 0, 0.18) !important;
                }

                html[data-theme="dark"] .transfer-checkout-form-card h2,
                html[data-theme="dark"] .transfer-summary-card h2 {
                    color: #f7f9fc !important;
                }

                html[data-theme="dark"] .transfer-checkout-form-card .transfers-eyebrow,
                html[data-theme="dark"] .transfer-summary-card .transfers-eyebrow {
                    color: #9b8cff !important;
                }

                html[data-theme="dark"] .transfer-form-field label {
                    color: #dce6f2 !important;
                }

                html[data-theme="dark"] .transfer-form-field input,
                html[data-theme="dark"] .transfer-form-field textarea {
                    background: #16263d !important;
                    border: 1px solid #3c526d !important;
                    color: #f5f8fc !important;
                    box-shadow: none !important;
                }

                html[data-theme="dark"] .transfer-form-field input::placeholder,
                html[data-theme="dark"] .transfer-form-field textarea::placeholder {
                    color: #8295ad !important;
                    opacity: 1 !important;
                }

                html[data-theme="dark"] .transfer-form-field input:focus,
                html[data-theme="dark"] .transfer-form-field textarea:focus {
                    border-color: #6e7fa0 !important;
                    outline: none !important;
                    box-shadow: 0 0 0 3px rgba(124, 109, 255, 0.10) !important;
                }

                html[data-theme="dark"] .transfer-checkout-note {
                    background: #16263d !important;
                    border: 1px solid #38506c !important;
                    color: #c9d5e4 !important;
                }

                html[data-theme="dark"] .transfer-checkout-note p {
                    color: #c9d5e4 !important;
                }

                html[data-theme="dark"] .transfer-checkout-note > span {
                    background: #2b3e5b !important;
                    color: #a99cff !important;
                }

                html[data-theme="dark"] .transfer-summary-price span,
                html[data-theme="dark"] .transfer-summary-route span,
                html[data-theme="dark"] .transfer-summary-details span,
                html[data-theme="dark"] .transfer-summary-return-details span,
                html[data-theme="dark"] .transfer-summary-total > span {
                    color: #91a3ba !important;
                }

                html[data-theme="dark"] .transfer-summary-price strong,
                html[data-theme="dark"] .transfer-summary-route strong,
                html[data-theme="dark"] .transfer-summary-details strong,
                html[data-theme="dark"] .transfer-summary-return-details strong,
                html[data-theme="dark"] .transfer-summary-total strong {
                    color: #f7f9fc !important;
                }

                html[data-theme="dark"] .transfer-summary-route,
                html[data-theme="dark"] .transfer-summary-details,
                html[data-theme="dark"] .transfer-summary-return,
                html[data-theme="dark"] .transfer-summary-divider,
                html[data-theme="dark"] .transfer-summary-total {
                    border-color: #2e435d !important;
                }

                html[data-theme="dark"] .transfer-summary-arrow {
                    background: #203752 !important;
                    color: #a99cff !important;
                }

                html[data-theme="dark"] .transfer-summary-back {
                    color: #9fb2c8 !important;
                }

                html[data-theme="dark"] .transfer-summary-back:hover {
                    color: #ffffff !important;
                }

                html[data-theme="dark"] .transfer-confirm-button {
                    background: #6d55e8 !important;
                    color: #ffffff !important;
                }

                html[data-theme="dark"] .transfer-confirm-button:hover {
                    background: #7a63ef !important;
                }

                /* Availability error in dark mode */
                html[data-theme="dark"] [role="alert"] {
                    background: #2a1b22 !important;
                    border-color: #6b3342 !important;
                    color: #ffd5dc !important;
                }

                html[data-theme="dark"] [role="alert"] strong {
                    color: #ff9eab !important;
                }
            `}</style>

        </main>
    );
}
