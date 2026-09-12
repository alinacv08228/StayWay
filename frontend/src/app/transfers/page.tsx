"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useSettings } from "../../context/SettingsContext";
import { getTranslation } from "../../data/translations";

import TransferLocationInput from "../../components/TransferLocationInput";
import { getTransferLocations } from "../../services/transferLocationService";
import { isAuthenticated } from "../../services/authService";

type TransferType = "one-way" | "return";

type TransferOption = {
    id: number;
    titleKey:
        | "privateTransfer"
        | "comfortTransfer"
        | "familyTransfer";
    descriptionKey:
        | "privateDescription"
        | "comfortDescription"
        | "familyDescription";
    passengers: string;
    luggage: string;
    duration: string;
    price: number;
    icon: string;
};

const transferExtraTranslations: Record<
    string,
    Record<string, string>
> = {
    English: {
        privateDescription:
            "A comfortable private ride just for you and your group.",
        comfortDescription:
            "Extra space and comfort for a relaxed journey.",
        familyDescription:
            "More space for families, groups and extra luggage.",
        airportTransfers:
            "Airport & city transfers,",
        madeSimple:
            "made simple.",
        heroDescription:
            "Book a comfortable ride from the airport, hotel, or anywhere in the city.",
        yourJourneyStarts:
            "Your journey starts",
        beforeYouArrive:
            "before you arrive.",
        onTimePickup:
            "On-time pickup",
        onTimeDescription:
            "Your driver is ready when you are, so you can travel without unnecessary waiting.",
        travelComfortably:
            "Travel comfortably",
        comfortDescriptionBenefit:
            "Choose the vehicle that fits your trip, from couples to larger groups.",
        transferOptions:
            "TRANSFER OPTIONS",
        chooseTheRide:
            "Choose the ride",
        thatFits:
            "that fits your trip.",
        from:
            "from",
        selectTransfer:
            "Select transfer",
        howItWorks:
            "HOW IT WORKS",
        fromAirport:
            "From airport",
        toDoorstep:
            "to doorstep.",
        howDescription:
            "A simple transfer experience designed to remove one more thing from your travel planning.",
        tellUsWhere:
            "Tell us where",
        tellUsDescription:
            "Enter your pick-up and destination details.",
        chooseYourRide:
            "Choose your ride",
        chooseRideDescription:
            "Pick the vehicle that works best for your group.",
        enjoyJourney:
            "Enjoy the journey",
        enjoyDescription:
            "Meet your driver and get to your destination comfortably.",
        travelWith:
            "TRAVEL WITH STAYWAY",
        arriveRelaxed:
            "Arrive relaxed.",
        leaveRest:
            "Leave the rest to us.",
        exploreStays:
            "Explore stays",
    },

    Română: {
        privateDescription:
            "O călătorie privată confortabilă, doar pentru tine și grupul tău.",
        comfortDescription:
            "Mai mult spațiu și confort pentru o călătorie relaxată.",
        familyDescription:
            "Mai mult spațiu pentru familii, grupuri și bagaje suplimentare.",
        airportTransfers:
            "Transferuri în oraș,",
        madeSimple:
            "fără complicații.",
        heroDescription:
            "Rezervă o mașină confortabilă de la aeroport, hotel sau orice altă adresă din oraș.",
        yourJourneyStarts:
            "Călătoria ta începe",
        beforeYouArrive:
            "înainte să ajungi.",
        onTimePickup:
            "Preluare la timp",
        onTimeDescription:
            "Șoferul tău este pregătit când ești și tu, fără așteptări inutile.",
        travelComfortably:
            "Călătorește confortabil",
        comfortDescriptionBenefit:
            "Alege vehiculul potrivit pentru călătoria ta, de la cupluri la grupuri mai mari.",
        transferOptions:
            "OPȚIUNI DE TRANSFER",
        chooseTheRide:
            "Alege transferul",
        thatFits:
            "potrivit pentru călătoria ta.",
        from:
            "de la",
        selectTransfer:
            "Selectează transferul",
        howItWorks:
            "CUM FUNCȚIONEAZĂ",
        fromAirport:
            "De la aeroport",
        toDoorstep:
            "până la destinație.",
        howDescription:
            "O experiență simplă de transfer, creată pentru a elimina încă un lucru de pe lista planificării călătoriei.",
        tellUsWhere:
            "Spune-ne unde",
        tellUsDescription:
            "Introdu detaliile locului de preluare și ale destinației.",
        chooseYourRide:
            "Alege transferul",
        chooseRideDescription:
            "Alege vehiculul potrivit pentru grupul tău.",
        enjoyJourney:
            "Bucură-te de călătorie",
        enjoyDescription:
            "Întâlnește șoferul și ajungi confortabil la destinație.",
        travelWith:
            "CĂLĂTOREȘTE CU STAYWAY",
        arriveRelaxed:
            "Ajungi relaxat.",
        leaveRest:
            "De restul ne ocupăm noi.",
        exploreStays:
            "Explorează cazări",
    },
};

const transferOptions: TransferOption[] = [
    {
        id: 1,
        titleKey: "privateTransfer",
        descriptionKey: "privateDescription",
        passengers: "3",
        luggage: "2",
        duration: "35",
        price: 32,
        icon: "🚘",
    },
    {
        id: 2,
        titleKey: "comfortTransfer",
        descriptionKey: "comfortDescription",
        passengers: "4",
        luggage: "3",
        duration: "35",
        price: 42,
        icon: "🚙",
    },
    {
        id: 3,
        titleKey: "familyTransfer",
        descriptionKey: "familyDescription",
        passengers: "7",
        luggage: "6",
        duration: "40",
        price: 58,
        icon: "🚐",
    },
];

export default function TransfersPage() {
    const { language } = useSettings();

    const t = (key: string) => {
        const langName = language.split("|")[0];

        return (
            transferExtraTranslations[langName]?.[key] ??
            transferExtraTranslations.English[key] ??
            getTranslation(
                language,
                key as Parameters<
                    typeof getTranslation
                >[1]
            )
        );
    };

    const [transferType, setTransferType] =
        useState<TransferType>("one-way");

    const [pickup, setPickup] =
        useState("");

    const [destination, setDestination] =
        useState("");

    const [selectedCityName, setSelectedCityName] =
        useState("");

    const [
        transferLocations,
        setTransferLocations,
    ] = useState<
        ReturnType<typeof getTransferLocations>
    >([]);

    useEffect(() => {
        const updateTransferLocations = () => {
            setTransferLocations(
                getTransferLocations()
            );
        };

        updateTransferLocations();

        const interval = setInterval(() => {
            updateTransferLocations();
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    function findTransferLocation(value: string) {
        const normalized = value.trim().toLowerCase();

        return transferLocations.find(
            (location) =>
                location.name.trim().toLowerCase() ===
                normalized
        );
    }

    const destinationLocations =
        selectedCityName
            ? transferLocations.filter(
                (location) =>
                    location.cityName ===
                    selectedCityName
            )
            : transferLocations;

    const [date, setDate] =
        useState("");

    const [time, setTime] =
        useState("");

    const [returnDate, setReturnDate] =
        useState("");

    const [returnTime, setReturnTime] =
        useState("");

    const [passengers, setPassengers] =
        useState("2");

    const [searched, setSearched] =
        useState(false);

    const getLocalDateString = () => {
        const today = new Date();

        const year = today.getFullYear();
        const month = String(
            today.getMonth() + 1
        ).padStart(2, "0");
        const day = String(
            today.getDate()
        ).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    const todayDate = getLocalDateString();

    function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        const pickupLocation =
            findTransferLocation(pickup);

        const destinationLocation =
            findTransferLocation(destination);

        if (
            !pickupLocation ||
            !destinationLocation
        ) {
            alert(
                "Please select a valid pick-up location and destination."
            );

            return;
        }

        if (
            pickupLocation.cityName !==
            destinationLocation.cityName
        ) {
            alert(
                "Pick-up and destination must be in the same city."
            );

            return;
        }

        if (
            !pickup ||
            !destination ||
            !date ||
            !time
        ) {
            return;
        }

        const today = getLocalDateString();

        if (date < today) {
            alert(
                "Please select today or a future date for your transfer."
            );

            return;
        }

        if (
            transferType === "return"
        ) {
            if (!returnDate || !returnTime) {
                return;
            }

            if (returnDate < date) {
                alert(
                    "Return date cannot be before the departure date."
                );

                return;
            }
        }

        setSearched(true);

        setTimeout(() => {
            document
                .getElementById(
                    "transfer-options"
                )
                ?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
        }, 50);
    }

    return (
        <main className="transfers-page">

            {/* HERO */}

            <section className="transfers-hero">
                <div className="transfers-container">

                    <div className="transfers-hero-content stayway-load-in stayway-load-1">

                        <span className="transfers-eyebrow">
                            STAYWAY TRANSFERS
                        </span>

                        <h1>
                            {t("airportTransfers")}
                            <br />
                            <span>
                                {t("madeSimple")}
                            </span>
                        </h1>

                        <p>
                            {t("heroDescription")}
                        </p>

                    </div>

                    <div className="transfers-hero-image stayway-load-in stayway-load-2">

                        <img
                            src="/transfers/transfer1.png"
                            alt="Private car transfer"
                        />

                    </div>

                    {/* SEARCH CARD */}

                    <div className="transfers-search-card stayway-load-in stayway-load-3">

                        <div className="transfers-type-switch">

                            <button
                                type="button"
                                className={
                                    transferType ===
                                    "one-way"
                                        ? "active"
                                        : ""
                                }
                                onClick={() =>
                                    setTransferType(
                                        "one-way"
                                    )
                                }
                            >
                                <span className="transfer-radio">
                                    {transferType ===
                                        "one-way" &&
                                        "✓"}
                                </span>

                                {t("oneWay")}
                            </button>

                            <button
                                type="button"
                                className={
                                    transferType ===
                                    "return"
                                        ? "active"
                                        : ""
                                }
                                onClick={() =>
                                    setTransferType(
                                        "return"
                                    )
                                }
                            >
                                <span className="transfer-radio">
                                    {transferType ===
                                        "return" &&
                                        "✓"}
                                </span>

                                {t("return")}
                            </button>

                        </div>

                        <form
                            className={`transfers-form ${
                                transferType ===
                                "return"
                                    ? "is-return"
                                    : ""
                            }`}
                            onSubmit={
                                handleSubmit
                            }
                        >

                            {/* PICK-UP */}

                            <div className="transfer-field transfer-location-field">

                                <span className="transfer-field-icon">
                                    📍
                                </span>

                                <div>

                                    <label htmlFor="pickup">
                                        {t(
                                            "pickupLocation"
                                        )}
                                    </label>

                                    <TransferLocationInput
                                        value={pickup}
                                        onChange={(value) => {
                                            setPickup(value);
                                        }}
                                        onSelect={(location) => {
                                            setPickup(location.name);
                                            setSelectedCityName(location.cityName);
                                            setDestination("");
                                        }}
                                        placeholder={t(
                                            "pickupPlaceholder"
                                        )}
                                        locations={transferLocations}
                                    />

                                </div>

                            </div>

                            {/* ROUTE ARROW */}

                            <div className="transfer-route-arrow">
                                →
                            </div>

                            {/* DESTINATION */}

                            <div className="transfer-field transfer-location-field">

                                <span className="transfer-field-icon">
                                    🏁
                                </span>

                                <div>

                                    <label htmlFor="destination">
                                        {t(
                                            "destination"
                                        )}
                                    </label>

                                    <TransferLocationInput
                                        value={destination}
                                        onChange={(value) => {
                                            setDestination(value);
                                        }}
                                        onSelect={(location) => {
                                            setDestination(location.name);
                                        }}
                                        placeholder={t(
                                            "destinationPlaceholder"
                                        )}
                                        locations={destinationLocations}
                                    />

                                </div>

                            </div>

                            {/* DATE */}

                            <div className="transfer-field">

                                <span className="transfer-field-icon">
                                    📅
                                </span>

                                <div>

                                    <label htmlFor="transfer-date">
                                        {t("date")}
                                    </label>

                                    <input
                                        id="transfer-date"
                                        type="date"
                                        value={date}
                                        min={todayDate}
                                        onChange={(event) =>
                                            setDate(
                                                event.target.value
                                            )
                                        }
                                        required
                                    />

                                </div>

                            </div>

                            {/* TIME */}

                            <div className="transfer-field">

                                <span className="transfer-field-icon">
                                    🕐
                                </span>

                                <div>

                                    <label htmlFor="transfer-time">
                                        {t("time")}
                                    </label>

                                    <input
                                        id="transfer-time"
                                        type="time"
                                        value={
                                            time
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setTime(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        required
                                    />

                                </div>

                            </div>

                            {/* RETURN DATE + RETURN TIME */}

                            {transferType ===
                                "return" && (
                                    <>
                                        <div className="transfer-field return-date-field">

                                            <span className="transfer-field-icon">
                                                📅
                                            </span>

                                            <div>

                                                <label htmlFor="return-date">
                                                    {t(
                                                        "returnDate"
                                                    )}
                                                </label>

                                                <input
                                                    id="return-date"
                                                    type="date"
                                                    value={returnDate}
                                                    min={date || todayDate}
                                                    onChange={(event) =>
                                                        setReturnDate(
                                                            event.target.value
                                                        )
                                                    }
                                                    required
                                                />

                                            </div>

                                        </div>

                                        <div className="transfer-field return-time-field">

                                            <span className="transfer-field-icon">
                                                🕐
                                            </span>

                                            <div>

                                                <label htmlFor="return-time">
                                                    {t(
                                                        "returnTime"
                                                    )}
                                                </label>

                                                <input
                                                    id="return-time"
                                                    type="time"
                                                    value={
                                                        returnTime
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        setReturnTime(
                                                            event
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    required
                                                />

                                            </div>

                                        </div>
                                    </>
                                )}

                            {/* PASSENGERS */}

                            <div className="transfer-field passengers-field">

                                <span className="transfer-field-icon">
                                    👤
                                </span>

                                <div>

                                    <label htmlFor="passengers">
                                        {t(
                                            "passengers"
                                        )}
                                    </label>

                                    <select
                                        id="passengers"
                                        value={
                                            passengers
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setPassengers(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                    >

                                        <option value="1">
                                            1 passenger
                                        </option>

                                        <option value="2">
                                            2 passengers
                                        </option>

                                        <option value="3">
                                            3 passengers
                                        </option>

                                        <option value="4">
                                            4 passengers
                                        </option>

                                        <option value="5">
                                            5 passengers
                                        </option>

                                        <option value="6">
                                            6 passengers
                                        </option>

                                        <option value="7">
                                            7 passengers
                                        </option>

                                        <option value="8">
                                            8 passengers
                                        </option>

                                    </select>

                                </div>

                            </div>

                            {/* SEARCH */}

                            <button
                                type="submit"
                                className="transfers-search-button"
                            >
                                {t(
                                    "searchTransfers"
                                )}
                            </button>

                        </form>

                    </div>

                </div>
            </section>

            {/* BENEFITS */}

            <section className="transfers-benefits">

                <div className="transfers-container">

                    <div className="transfers-section-heading stayway-load-in stayway-load-4">

                        <span className="transfers-eyebrow">
                            {t("whyStayWay")}
                        </span>

                        <h2>
                            {t(
                                "yourJourneyStarts"
                            )}
                            <br />
                            {t(
                                "beforeYouArrive"
                            )}
                        </h2>

                    </div>

                    <div className="transfers-benefits-grid stayway-load-in stayway-load-5">

                        <article className="transfer-benefit-card">

                            <div className="transfer-benefit-icon">
                                ✓
                            </div>

                            <h3>
                                {t(
                                    "fixedPrices"
                                )}
                            </h3>

                            <p>
                                {t(
                                    "fixedPrices"
                                )}
                            </p>

                        </article>

                        <article className="transfer-benefit-card">

                            <div className="transfer-benefit-icon">
                                ◷
                            </div>

                            <h3>
                                {t(
                                    "onTimePickup"
                                )}
                            </h3>

                            <p>
                                Your driver is ready
                                when you are, so you
                                can travel without
                                unnecessary waiting.
                            </p>

                        </article>

                        <article className="transfer-benefit-card">

                            <div className="transfer-benefit-icon">
                                ♡
                            </div>

                            <h3>
                                {t(
                                    "travelComfortably"
                                )}
                            </h3>

                            <p>
                                {t(
                                    "comfortDescriptionBenefit"
                                )}
                            </p>

                        </article>

                    </div>

                </div>

            </section>

            {/* SEARCH RESULTS */}

            <section
                id="transfer-options"
                className={`transfers-options ${
                    searched
                        ? "is-visible"
                        : ""
                }`}
            >

                <div className="transfers-container">

                    <div className="transfers-section-heading centered stayway-load-in stayway-load-6">

                        <span className="transfers-eyebrow">
                            {t(
                                "transferOptions"
                            )}
                        </span>

                        <h2>
                            {t(
                                "chooseTheRide"
                            )}
                            <br />
                            {t(
                                "thatFits"
                            )}
                        </h2>

                        {searched && (
                            <p className="transfer-search-summary">
                                {pickup}
                                <span>
                                    →
                                </span>
                                {destination}
                            </p>
                        )}

                    </div>

                    <div className="transfers-options-grid stayway-load-in stayway-load-7">

                        {transferOptions.map(
                            (option) => (
                                <article
                                    className="transfer-option-card"
                                    key={
                                        option.id
                                    }
                                >

                                    <div className="transfer-option-top">

                                        <span className="transfer-option-badge">
                                            {option.id ===
                                            1
                                                ? "01"
                                                : option.id ===
                                                2
                                                    ? "02"
                                                    : "03"}
                                        </span>

                                        <div className="transfer-car-icon">
                                            {
                                                option.icon
                                            }
                                        </div>

                                        <div className="transfer-option-price">

                                            <span>
                                                {t(
                                                    "from"
                                                )}
                                            </span>

                                            <strong>
                                                €
                                                {
                                                    option.price
                                                }
                                            </strong>

                                        </div>

                                    </div>

                                    <h3>
                                        {t(
                                            option.titleKey
                                        )}
                                    </h3>

                                    <p className="transfer-option-description">
                                        {t(
                                            option.descriptionKey
                                        )}
                                    </p>

                                    <div className="transfer-option-details">

                                        <span>
                                            👤{" "}
                                            {t(
                                                "upTo"
                                            )}{" "}
                                            {
                                                option.passengers
                                            }{" "}
                                            {t(
                                                "passengers"
                                            ).toLowerCase()}
                                        </span>

                                        <span>
                                            🧳{" "}
                                            {
                                                option.luggage
                                            }{" "}
                                            {t(
                                                "suitcases"
                                            )}
                                        </span>

                                        <span>
                                            ◷{" "}
                                            {t(
                                                "approx"
                                            )}{" "}
                                            {
                                                option.duration
                                            }{" "}
                                            {t(
                                                "minutes"
                                            )}
                                        </span>

                                    </div>

                                    {/* SELECT TRANSFER */}

                                    <button
                                        type="button"
                                        className="transfer-select-button"
                                        onClick={() => {

                                            if (
                                                !isAuthenticated()
                                            ) {
                                                window.location.href =
                                                    `/401?from=${encodeURIComponent(
                                                        "/transfers"
                                                    )}`;

                                                return;
                                            }

                                            const params =
                                                new URLSearchParams();

                                            params.set(
                                                "transferType",
                                                transferType
                                            );

                                            params.set(
                                                "optionId",
                                                String(
                                                    option.id
                                                )
                                            );

                                            params.set(
                                                "optionTitle",
                                                t(
                                                    option.titleKey
                                                )
                                            );

                                            params.set(
                                                "price",
                                                String(
                                                    option.price
                                                )
                                            );

                                            params.set(
                                                "pickup",
                                                pickup
                                            );

                                            params.set(
                                                "destination",
                                                destination
                                            );

                                            params.set(
                                                "date",
                                                date
                                            );

                                            params.set(
                                                "time",
                                                time
                                            );

                                            params.set(
                                                "passengers",
                                                passengers
                                            );

                                            if (
                                                transferType ===
                                                "return"
                                            ) {
                                                params.set(
                                                    "returnDate",
                                                    returnDate
                                                );

                                                params.set(
                                                    "returnTime",
                                                    returnTime
                                                );
                                            }

                                            window.location.href =
                                                `/transfers/checkout?${params.toString()}`;
                                        }}
                                    >
                                        {t(
                                            "selectTransfer"
                                        )}
                                    </button>

                                </article>
                            )
                        )}

                    </div>

                </div>

            </section>

            {/* HOW IT WORKS */}

            <section className="transfers-how-it-works">

                <div className="transfers-container">

                    <div className="transfers-how-grid">

                        <div
                            className="transfers-section-heading stayway-load-in stayway-load-8"
                            style={{
                                transform:
                                    "translateY(70px)",
                            }}
                        >

                            <span className="transfers-eyebrow">
                                {t(
                                    "howItWorks"
                                )}
                            </span>

                            <h2>
                                {t(
                                    "fromAirport"
                                )}
                                <br />
                                {t(
                                    "toDoorstep"
                                )}
                            </h2>

                            <p>
                                {t(
                                    "howDescription"
                                )}
                            </p>

                        </div>

                        <div className="transfer-steps stayway-load-in stayway-load-1">

                            <div className="transfer-step">

                                <span className="transfer-step-number">
                                    01
                                </span>

                                <div>

                                    <h3>
                                        {t(
                                            "tellUsWhere"
                                        )}
                                    </h3>

                                    <p>
                                        {t(
                                            "tellUsDescription"
                                        )}
                                    </p>

                                </div>

                            </div>

                            <div className="transfer-step">

                                <span className="transfer-step-number">
                                    02
                                </span>

                                <div>

                                    <h3>
                                        {t(
                                            "chooseYourRide"
                                        )}
                                    </h3>

                                    <p>
                                        {t(
                                            "chooseRideDescription"
                                        )}
                                    </p>

                                </div>

                            </div>

                            <div className="transfer-step">

                                <span className="transfer-step-number">
                                    03
                                </span>

                                <div>

                                    <h3>
                                        {t(
                                            "enjoyJourney"
                                        )}
                                    </h3>

                                    <p>
                                        {t(
                                            "enjoyDescription"
                                        )}
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </section>

            {/* CTA */}

            <section className="transfers-cta">

                <div className="transfers-container">

                    <div className="transfers-cta-card stayway-load-in stayway-load-2">

                        <div>

                            <span className="transfers-eyebrow">
                                {t(
                                    "travelWith"
                                )}
                            </span>

                            <h2>
                                {t(
                                    "arriveRelaxed"
                                )}
                                <br />
                                {t(
                                    "leaveRest"
                                )}
                            </h2>

                        </div>

                        <Link
                            href="/stays"
                            className="transfers-cta-button"
                        >
                            {t(
                                "exploreStays"
                            )}
                        </Link>

                    </div>

                </div>

            </section>

            <style jsx>{`

    .transfers-page {
    --tw-purple: #7055e8;
    --tw-purple-dark: #5d43d4;
    --tw-ink: #272333;
    --tw-muted: #746d80;
    --tw-border: #e9e4f2;

    overflow: visible;
    background: #fff;
}

.transfers-container {
    width: min(
        1360px,
        calc(100% - 64px)
    );

    margin: 0 auto;
}

.transfers-hero {
    position: relative;
    z-index: 10;
    overflow: visible;
    padding: 68px 0 64px;

    background:
        linear-gradient(
            135deg,
            #f7f3ff 0%,
            #f3efff 52%,
            #faf8ff 100%
        );

    isolation: isolate;
}

.transfers-hero::after {
    content: "";
    position: absolute;
    inset: auto 0 0;
    height: 1px;
    background:
        rgba(
            112,
            85,
            232,
            0.08
        );
}

.transfers-hero-content {
    max-width: 760px;
    position: relative;
    z-index: 2;
    transform: translateX(60px);
}

.transfers-hero-image {
    position: absolute;
    top: -20px;
    right: 7%;
    width: min(
        33%,
        660px
    );
    z-index: 1;
    pointer-events: none;
}

.transfers-hero-image img {
    display: block;
    width: 85%;
    height: auto;
    object-fit: contain;
}

.transfers-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;

    color: var(--tw-purple);

    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.16em;
    text-transform: uppercase;
}

.transfers-eyebrow::before {
    content: "";
    width: 22px;
    height: 2px;
    border-radius: 999px;
    background: currentColor;
}

.transfers-hero h1 {
    margin: 18px 0 18px;
    max-width: 680px;

    color: var(--tw-ink);

    font-size:
        clamp(
            42px,
            4.2vw,
            58px
        );

    line-height: 1.02;
    letter-spacing: -0.045em;
    font-weight: 850;
}

.transfers-hero h1 span {
    color: var(--tw-purple);
}

.transfers-hero-content > p {
    max-width: 620px;
    margin: 0;

    color: var(--tw-muted);

    font-size: 17px;
    line-height: 1.7;
}

.transfers-search-card {
    position: relative;
    z-index: 4;

    margin-top: 85px;
    padding: 16px;

    border:
        1px solid
        rgba(
            255,
            255,
            255,
            0.92
        );

    border-radius: 26px;

    background:
        rgba(
            255,
            255,
            255,
            0.92
        );

    box-shadow:
        0 28px 70px
        rgba(
            69,
            49,
            125,
            0.12
        ),
        0 5px 18px
        rgba(
            69,
            49,
            125,
            0.05
        );

    backdrop-filter: blur(18px);
}

.transfers-type-switch {
    display: inline-flex;
    padding: 4px;
    margin-bottom: 12px;

    border-radius: 14px;
    background: #f5f1ff;
}

.transfers-type-switch button {
    display: inline-flex;
    align-items: center;
    gap: 8px;

    min-height: 38px;
    padding: 0 14px;

    border: 0;
    border-radius: 11px;

    background: transparent;
    color: #7c748b;

    font-weight: 750;

    cursor: pointer;
    transition: 180ms ease;
}

.transfers-type-switch button.active {
    color: var(--tw-purple);
    background: #fff;

    box-shadow:
        0 5px 14px
        rgba(
            80,
            57,
            150,
            0.09
        );
}

.transfer-radio {
    display: grid;
    place-items: center;

    width: 18px;
    height: 18px;

    border:
        1.5px solid
        #bdb2dd;

    border-radius: 50%;

    font-size: 10px;
}

.active .transfer-radio {
    border-color:
        var(--tw-purple);

    color: #fff;
    background:
        var(--tw-purple);
}

.transfers-form {
    display: grid;

    grid-template-columns:
        minmax(230px, 1.35fr)
        30px
        minmax(230px, 1.35fr)
        minmax(150px, 0.9fr)
        minmax(150px, 0.9fr)
        minmax(160px, 0.95fr)
        minmax(145px, 0.9fr)
        auto;

    gap: 10px;
    align-items: stretch;
}

.transfer-field {
    min-width: 0;
    min-height: 68px;

    display: flex;
    align-items: center;
    gap: 10px;

    padding: 12px 13px;

    border:
        1px solid
        var(--tw-border);

    border-radius: 15px;

    background: #fff;

    transition: 180ms ease;
}

.transfer-field:focus-within {
    border-color: #b9aaf5;

    box-shadow:
        0 0 0 4px
        rgba(
            112,
            85,
            232,
            0.08
        );
}

.transfer-location-field > div,
.transfer-field > div {
    min-width: 0;
    flex: 1;
}

.transfer-field-icon {
    flex: 0 0 auto;

    display: grid;
    place-items: center;

    width: 30px;
    height: 30px;

    border-radius: 9px;
    background: #f0ebff;

    font-size: 15px;
}

.transfer-field label {
    display: block;
    margin-bottom: 4px;

    color: #7d7688;

    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.03em;
}

.transfer-field input,
.transfer-field select {
    width: 100%;
    min-width: 0;

    padding: 0;

    border: 0;
    outline: 0;

    background: transparent;
    color: var(--tw-ink);

    font-size: 13px;
    font-weight: 650;
}

.transfer-field input::placeholder {
    color: #aaa3b2;
}

.transfer-route-arrow {
    display: grid;
    place-items: center;

    color: var(--tw-purple);

    font-size: 23px;
    font-weight: 700;
}

.transfers-form.is-return
.return-date-field {
    grid-column: 4;
    grid-row: 2;
}

.transfers-form.is-return
.return-time-field {
    grid-column: 5;
    grid-row: 2;
}

.transfers-form.is-return
.passengers-field {
    grid-column: 6;
    grid-row: 1;
}

.transfers-form.is-return
.transfers-search-button {
    grid-column: 6;
    grid-row: 2;

    width: 100%;
    min-width: 0;

    justify-self: stretch;
    align-self: stretch;

    box-sizing: border-box;
}

.transfers-search-button {
    align-self: stretch;

    min-width: 142px;
    padding: 0 22px;

    border: 0;
    border-radius: 15px;

    color: #fff;

    background:
        linear-gradient(
            135deg,
            var(--tw-purple),
            var(--tw-purple-dark)
        );

    font-weight: 800;

    cursor: pointer;

    box-shadow:
        0 12px 25px
        rgba(
            112,
            85,
            232,
            0.24
        );

    transition:
        transform 180ms ease,
        box-shadow 180ms ease;
}

.transfers-search-button:hover,
.transfer-select-button:hover,
.transfers-cta-button:hover {
    transform:
        translateY(-2px);

    box-shadow:
        0 16px 30px
        rgba(
            112,
            85,
            232,
            0.28
        );
}

.transfers-benefits {
    padding: 68px 0 72px;
    background: #fff;
}

.transfers-section-heading h2 {
    margin: 14px 0 0;

    color: var(--tw-ink);

    font-size:
        clamp(
            38px,
            4vw,
            58px
        );

    line-height: 1.02;
    letter-spacing: -0.045em;
    font-weight: 850;
}

.transfers-benefits
    .transfers-section-heading {
    max-width: 700px;
}

.transfers-benefits-grid {
    display: grid;

    grid-template-columns:
        repeat(
            3,
            minmax(0, 1fr)
        );

    gap: 18px;
    margin-top: 30px;
}

.transfer-benefit-card {
    position: relative;

    min-height: 190px;
    padding: 26px;

    border:
        1.5px solid
        #d9d0ff;

    border-radius: 22px;

    background:
        linear-gradient(
            145deg,
            #f8f5ff,
            #f1ebff
        );

    box-shadow:
        0 12px 32px
        rgba(
            54,
            40,
            91,
            0.045
        );

    transition:
        transform 180ms ease,
        box-shadow 180ms ease;
}

.transfer-benefit-card:hover {
    transform:
        translateY(-4px);

    box-shadow:
        0 20px 40px
        rgba(
            54,
            40,
            91,
            0.09
        );
}

.transfer-benefit-icon,
.transfer-car-icon {
    display: grid;
    place-items: center;

    width: 54px;
    height: 54px;

    border-radius: 17px;

    color: var(--tw-purple);
    background: #f0ebff;

    font-size: 21px;
    font-weight: 800;
}

.transfer-benefit-card h3 {
    margin: 22px 0 8px;

    color: var(--tw-ink);

    font-size: 19px;
    letter-spacing: -0.02em;
}

.transfer-benefit-card p,
.transfer-option-description,
.transfers-how-it-works
    .transfers-section-heading
    > p,
.transfer-step p {
    color: var(--tw-muted);
    line-height: 1.65;
}

.transfer-benefit-card p {
    margin: 0;
    font-size: 14px;
}

.transfers-options {
    padding: 40px 0 80px;

    background:
        linear-gradient(
            180deg,
            #f8f5ff 0%,
            #f5f1ff 100%
        );
}

.transfers-section-heading.centered {
    text-align: center;

    max-width: 720px;
    margin: 0 auto;
}

.transfer-search-summary {
    display: inline-flex;
    align-items: center;
    gap: 10px;

    margin: 20px 0 0;
    padding: 9px 14px;

    border:
        1px solid
        #e7e0fa;

    border-radius: 999px;

    color: #655b78;

    background:
        rgba(
            255,
            255,
            255,
            0.72
        );

    font-size: 13px;
    font-weight: 700;
}

.transfer-search-summary span {
    color:
        var(--tw-purple);
}

.transfers-options-grid {
    display: grid;

    grid-template-columns:
        repeat(
            3,
            minmax(0, 1fr)
        );

    gap: 20px;
    margin-top: 48px;
}

.transfer-option-card {
    position: relative;

    display: flex;
    flex-direction: column;

    min-height: 390px;
    padding: 27px;

    overflow: hidden;

    border:
        1px solid
        #e6e0f0;

    border-radius: 24px;

    background: #fff;

    box-shadow:
        0 18px 45px
        rgba(
            60,
            42,
            103,
            0.08
        );

    transition:
        transform 200ms ease,
        box-shadow 200ms ease,
        border-color 200ms ease;
}

.transfer-option-card::before {
    content: "";

    position: absolute;

    width: 180px;
    height: 180px;

    top: -115px;
    right: -80px;

    border-radius: 50%;

    background:
        #f0ebff;
}

.transfer-option-card:hover {
    transform:
        translateY(-6px);

    border-color:
        #d8cef5;

    box-shadow:
        0 28px 58px
        rgba(
            60,
            42,
            103,
            0.13
        );
}

.transfer-option-top {
    position: relative;

    display: flex;
    align-items: flex-start;
    justify-content: space-between;

    gap: 16px;
}

.transfer-option-badge {
    position: absolute;

    top: 1px;
    left: 66px;

    color: #a49bae;

    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.08em;
}

.transfer-car-icon {
    position: relative;
    z-index: 1;

    width: 58px;
    height: 58px;

    font-size: 24px;
}

.transfer-option-price {
    position: relative;
    z-index: 1;

    display: flex;
    flex-direction: column;
    align-items: flex-end;
}

.transfer-option-price span {
    color: #9991a4;
    font-size: 11px;
}

.transfer-option-price strong {
    color: var(--tw-ink);

    font-size: 28px;
    line-height: 1.05;

    letter-spacing: -0.04em;
}

.transfer-option-card h3 {
    margin: 29px 0 9px;

    color: var(--tw-ink);

    font-size: 21px;
    letter-spacing: -0.025em;
}

.transfer-option-description {
    min-height: 52px;
    margin: 0;

    font-size: 14px;
}

.transfer-option-details {
    display: grid;
    gap: 10px;

    margin: 23px 0;
    padding: 19px 0;

    border-top:
        1px solid
        #eeeaf5;

    border-bottom:
        1px solid
        #eeeaf5;
}

.transfer-option-details span {
    color: #645d70;

    font-size: 13px;
    font-weight: 650;
}

.transfer-select-button {
    width: 100%;

    margin-top: auto;

    min-height: 48px;

    border: 0;
    border-radius: 14px;

    color: #fff;

    background:
        linear-gradient(
            135deg,
            var(--tw-purple),
            var(--tw-purple-dark)
        );

    font-weight: 800;

    cursor: pointer;

    transition:
        transform 180ms ease,
        box-shadow 180ms ease;
}

.transfer-steps {
    position: relative;

    display: flex;
    flex-direction: column;

    gap: 22px;
}

.transfer-steps::before {
    content: "";

    position: absolute;

    left: 23px;
    top: 48px;
    bottom: 48px;

    width: 2px;

    background:
        linear-gradient(
            to bottom,
            #ddd2ff,
            #8b5cf6,
            #ddd2ff
        );
}

.transfer-step {
    position: relative;

    display: flex;
    align-items: center;

    gap: 22px;

    padding:
        24px
        30px
        24px
        20px;

    background:
        linear-gradient(
            135deg,
            #ffffff 0%,
            #faf8ff 55%,
            #f3eeff 100%
        );

    border:
        1px solid
        #ddd2ff;

    border-radius: 20px;

    box-shadow:
        0 10px 30px
        rgba(
            109,
            72,
            246,
            0.08
        );

    transition:
        all 0.25s ease;
}

.transfer-step:hover {
    transform:
        translateX(5px);

    border-color:
        #a78bfa;

    box-shadow:
        0 14px 35px
        rgba(
            109,
            72,
            246,
            0.14
        );
}

.transfer-step-number {
    position: relative;
    z-index: 2;

    flex-shrink: 0;

    width: 48px;
    height: 48px;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 50%;

    background:
        linear-gradient(
            135deg,
            #7c3aed,
            #6d4df5
        );

    color: white;

    font-size: 13px;
    font-weight: 700;

    box-shadow:
        0 8px 18px
        rgba(
            109,
            72,
            246,
            0.28
        ),
        0 0 0 6px
        #f0eaff;
}

.transfer-step h3 {
    margin: 0 0 7px;

    color: #27213a;

    font-size: 18px;
    font-weight: 700;
}

.transfer-step p {
    margin: 0;

    color: #746d85;

    font-size: 14px;
    line-height: 1.6;
}

.transfers-cta {
    padding: 0 0 110px;
    background: #fff;
}

.transfers-cta-card {
    display: flex;
    align-items: center;
    justify-content: space-between;

    gap: 35px;

    padding: 55px 58px;

    border-radius: 30px;

    background:
        radial-gradient(
            circle at 88% 15%,
            rgba(
                112,
                85,
                232,
                0.18
            )
            0 90px,
            transparent 91px
        ),
        linear-gradient(
            135deg,
            #eee8ff,
            #f6f2ff
        );

    box-shadow:
        0 20px 55px
        rgba(
            64,
            44,
            112,
            0.08
        );
}

.transfers-cta-card h2 {
    margin: 14px 0 0;

    color: var(--tw-ink);

    font-size:
        clamp(
            34px,
            4vw,
            54px
        );

    line-height: 0.98;
    letter-spacing: -0.045em;
}

.transfers-cta-button {
    flex: 0 0 auto;

    display: inline-flex;
    align-items: center;
    justify-content: center;

    min-height: 50px;
    padding: 0 23px;

    border-radius: 14px;

    color: #fff;

    background:
        linear-gradient(
            135deg,
            var(--tw-purple),
            var(--tw-purple-dark)
        );

    font-weight: 800;
    text-decoration: none;

    box-shadow:
        0 12px 25px
        rgba(
            112,
            85,
            232,
            0.22
        );

    transition:
        transform 180ms ease,
        box-shadow 180ms ease;
}

@media (max-width: 1180px) {

.transfers-form {
    grid-template-columns:
        repeat(
            2,
            minmax(0, 1fr)
        );
}

.transfers-form.is-return
.return-date-field,
.transfers-form.is-return
.return-time-field,
.transfers-form.is-return
.passengers-field,
.transfers-form.is-return
.transfers-search-button {
    grid-column: auto;
    grid-row: auto;
}

.transfer-route-arrow {
    display: none;
}

.transfers-search-button {
    min-height: 62px;
}
}

@media (max-width: 800px) {

.transfers-how-grid
    > .transfers-section-heading {
    margin-top: 0;
}

.transfers-container {
    width:
        min(
            100% - 32px,
            680px
        );
}

.transfers-hero {
    padding:
        62px
        0
        48px;
}

.transfers-hero h1 {
    font-size:
        clamp(
            42px,
            11vw,
            64px
        );
}

.transfers-benefits,
.transfers-options,
.transfers-how-it-works {
    padding:
        25px
        0
        30px;
}

.transfers-how-grid
    > .transfers-section-heading {
    position: relative;
    top: 70px;
}

.transfers-benefits-grid,
.transfers-options-grid {
    grid-template-columns: 1fr;
}

.transfer-benefit-card {
    min-height: 0;
}

.transfers-how-grid {
    grid-template-columns: 1fr;
    gap: 48px;
}

.transfers-cta {
    padding-bottom: 78px;
}

.transfers-cta-card {
    align-items: flex-start;
    flex-direction: column;

    padding:
        38px
        30px;
}
}

@media (max-width: 560px) {

.transfers-container {
    width:
        min(
            100% - 24px,
            680px
        );
}

.transfers-hero {
    padding-top: 45px;
}

.transfers-search-card {
    margin-top: 32px;
    padding: 11px;
    border-radius: 20px;
}

.transfers-type-switch {
    display: flex;
    width: 100%;
}

.transfers-type-switch button {
    flex: 1;
    justify-content: center;
}

.transfers-form {
    grid-template-columns: 1fr;
}

.transfer-field {
    min-height: 58px;
}

.transfers-search-button {
    min-height: 56px;
}

.transfers-section-heading h2 {
    font-size: 39px;
}

.transfer-option-card {
    min-height: 0;
    padding: 23px;
}

.transfer-option-description {
    min-height: 0;
}

.transfer-step {
    grid-template-columns:
        42px
        1fr;

    gap: 13px;
}

.transfers-cta-card h2 {
    font-size: 38px;
}
}

`}</style>

        </main>
    );
}