"use client";

import Link from "next/link";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    properties as mockProperties,
} from "../data/mockData";

import SearchBar from "../components/SearchBar";

import {
    useSettings,
} from "../context/SettingsContext";

import {
    getTranslation,
} from "../data/translations";

import {
    currencyInfo,
} from "../data/currency";

import {
    getProperties,
} from "../services/propertyService";

import {
    getDestinations,
} from "../services/destinationService";

import {
    Property,
    Destination,
} from "../types/types";

export default function Home() {
    const {
        language,
        currency,
    } = useSettings();

    const selectedCurrency =
        currencyInfo[currency] ??
        currencyInfo["Euro"];

    // =========================================
    // PROPERTIES
    // =========================================

    const [
        availableProperties,
        setAvailableProperties,
    ] = useState<Property[]>(
        []
    );

    // =========================================
    // DESTINATIONS
    // =========================================

    const [
        availableDestinations,
        setAvailableDestinations,
    ] = useState<
        Destination[]
    >([]);

    // =========================================
    // LOADING / ERROR
    // =========================================

    const [
        isLoading,
        setIsLoading,
    ] = useState(true);

    const [
        hasError,
        setHasError,
    ] = useState(false);

    // =========================================
    // LOAD DATA FROM SERVICES
    // =========================================

    useEffect(() => {
        try {
            const loadedProperties =
                getProperties();

            const loadedDestinations =
                getDestinations();

            setAvailableProperties(
                loadedProperties
            );

            setAvailableDestinations(
                loadedDestinations
            );

            setHasError(false);
        } catch {
            /*
             * Dacă serviciul nu poate încărca
             * datele, folosim mock properties
             * pentru ca pagina să nu rămână goală.
             */
            setAvailableProperties(
                mockProperties
            );

            setAvailableDestinations(
                getDestinations()
            );

            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // =========================================
    // DESTINATIONS WITH PROPERTIES
    // =========================================
    /*
     * O destinație este vizibilă numai dacă
     * există cel puțin o proprietate care
     * folosește destinationId-ul ei.
     */

    const visibleDestinations =
        useMemo(() => {
            return availableDestinations.filter(
                (destination) =>
                    availableProperties.some(
                        (property) =>
                            property.destinationId ===
                            destination.id
                    )
            );
        }, [
            availableDestinations,
            availableProperties,
        ]);

    // =========================================
    // ONE COUNTRY CARD PER COUNTRY
    // =========================================
    /*
     * Mai multe orașe pot aparține aceleiași
     * țări.
     *
     * Exemplu:
     *
     * France
     *   Paris
     *   Lyon
     *   Nice
     *
     * Home trebuie să afișeze:
     *
     * France
     *
     * o singură dată.
     *
     * Imaginea folosită este countryImage.
     */

    const visibleCountries =
        useMemo(() => {
            const countries =
                new Map<
                    string,
                    Destination
                >();

            visibleDestinations.forEach(
                (destination) => {
                    const countryKey =
                        destination.country
                            .trim()
                            .toLowerCase();

                    /*
                     * Dacă țara nu există încă
                     * în Map, o adăugăm.
                     *
                     * Dacă există deja, nu mai
                     * creăm un al doilea card.
                     */
                    if (
                        !countries.has(
                            countryKey
                        )
                    ) {
                        countries.set(
                            countryKey,
                            destination
                        );
                    }
                }
            );

            return Array.from(
                countries.values()
            ).sort(
                (a, b) =>
                    a.country.localeCompare(
                        b.country
                    )
            );
        }, [
            visibleDestinations,
        ]);

    // =========================================
    // FEATURED PROPERTIES
    // =========================================

    const featuredProperties =
        useMemo(() => {
            return availableProperties.slice(
                0,
                6
            );
        }, [
            availableProperties,
        ]);

    // =========================================
    // LOADING
    // =========================================

    if (isLoading) {
        return (
            <main className="home-page page-enter">

                <section className="home-hero">
                    <div className="container home-hero-inner">

                        <div className="hero-content">

                            <div className="hero-badge">
                                ✦ YOUR JOURNEY STARTS HERE
                            </div>

                            <h1>
                                FIND YOUR
                                <br />
                                <span>
                                    PERFECT STAY.
                                </span>
                            </h1>

                            <p className="hero-subtitle">
                                Loading StayWay...
                            </p>

                        </div>

                    </div>
                </section>

            </main>
        );
    }

    // =========================================
    // ERROR
    // =========================================

    if (
        hasError &&
        availableProperties.length === 0
    ) {
        return (
            <main className="home-page page-enter">

                <section className="home-hero">
                    <div className="container home-hero-inner">

                        <div className="hero-content">

                            <div className="hero-badge">
                                ✦ STAYWAY
                            </div>

                            <h1>
                                SOMETHING
                                <br />
                                <span>
                                    WENT WRONG.
                                </span>
                            </h1>

                            <p className="hero-subtitle">
                                We could not load
                                the available
                                stays.
                            </p>

                            <Link
                                href="/500"
                                className="home-cta-button"
                            >
                                VIEW ERROR PAGE
                                <span>↗</span>
                            </Link>

                        </div>

                    </div>
                </section>

            </main>
        );
    }

    return (
        <main className="home-page page-enter">

            {/* =================================================
                HERO
            ================================================= */}

            <section className="home-hero">

                <div className="hero-glow hero-glow-one"></div>

                <div className="hero-glow hero-glow-two"></div>

                <div className="container home-hero-inner">

                    <div className="hero-content">

                        <div className="hero-badge">
                            ✦ YOUR JOURNEY STARTS HERE
                        </div>

                        <h1>
                            FIND YOUR
                            <br />
                            <span>
                                PERFECT STAY.
                            </span>
                        </h1>

                        <p className="hero-subtitle">
                            Discover beautiful places,
                            unforgettable stays
                            and destinations worth
                            exploring.
                        </p>

                        <div className="hero-stats">

                            {/* UNIQUE STAYS */}

                            <div>
                                <strong>
                                    {
                                        availableProperties.length
                                    }
                                </strong>

                                <span>
                                    Unique stays
                                </span>
                            </div>

                            {/* COUNTRIES */}

                            <div>
                                <strong>
                                    {
                                        visibleCountries.length
                                    }
                                </strong>

                                <span>
                                    Available countries
                                </span>
                            </div>

                            {/* RATING */}

                            <div>
                                <strong>
                                    4.8
                                </strong>

                                <span>
                                    Guest rating
                                </span>
                            </div>

                        </div>

                    </div>

                    {/* SEARCH */}

                    <div className="home-search-wrapper">
                        <SearchBar />
                    </div>

                </div>

                <div className="hero-scroll">

                    <span>
                        SCROLL TO EXPLORE
                    </span>

                    <div className="scroll-line"></div>

                </div>

            </section>


            {/* =================================================
                COUNTRIES
            ================================================= */}

            <section className="home-destinations">

                <div className="container">

                    <div className="home-section-heading">

                        <div>

                            <span className="home-eyebrow">
                                DISCOVER
                            </span>

                            <h2>
                                EXPLORE
                                <br />
                                <span>
                                    THE WORLD.
                                </span>
                            </h2>

                        </div>

                        <p>
                            Explore countries with
                            available StayWay
                            properties and discover
                            cities waiting for your
                            next adventure.
                        </p>

                    </div>


                    {/* COUNTRY CARDS */}

                    {visibleCountries.length ===
                    0 ? (
                        <div className="home-empty-state">

                            <h3>
                                No destinations
                                available
                            </h3>

                            <p>
                                New countries will
                                appear here when an
                                administrator adds a
                                property there.
                            </p>

                        </div>
                    ) : (
                        <div className="home-destination-grid">

                            {visibleCountries.map(
                                (
                                    destination,
                                    index
                                ) => (
                                    <Link
                                        href="/destinations"
                                        className={`home-destination-card destination-card-${
                                            index + 1
                                        }`}
                                        key={
                                            destination.country
                                        }
                                    >

                                        {/* COUNTRY IMAGE */}

                                        <img
                                            src={
                                                destination.countryImage ||
                                                destination.image
                                            }
                                            alt={
                                                destination.country
                                            }
                                        />

                                        <div className="destination-overlay"></div>

                                        {/* NUMBER */}

                                        <div className="destination-number">

                                            {String(
                                                index + 1
                                            ).padStart(
                                                2,
                                                "0"
                                            )}

                                        </div>

                                        {/* ARROW */}

                                        <div className="destination-arrow">
                                            ↗
                                        </div>

                                        {/* COUNTRY INFO */}

                                        <div className="destination-info">

                                            <span>
                                                STAYWAY
                                            </span>

                                            <h3>
                                                {
                                                    destination.country
                                                }
                                            </h3>

                                        </div>

                                    </Link>
                                )
                            )}

                        </div>
                    )}

                </div>

            </section>


            {/* =================================================
                FEATURED STAYS
            ================================================= */}

            <section className="home-stays">

                <div className="container">

                    <div className="home-section-heading stays-heading">

                        <div>

                            <span className="home-eyebrow">
                                HANDPICKED STAYS
                            </span>

                            <h2>
                                STAY SOMEWHERE
                                <br />
                                <span>
                                    SPECIAL.
                                </span>
                            </h2>

                        </div>

                        <Link
                            href="/stays"
                            className="home-outline-button"
                        >
                            View all stays ↗
                        </Link>

                    </div>


                    {/* FEATURED PROPERTY CARDS */}

                    {featuredProperties.length ===
                    0 ? (
                        <div className="home-empty-state">

                            <h3>
                                No stays available
                            </h3>

                            <p>
                                Properties added by
                                the administrator
                                will appear here.
                            </p>

                        </div>
                    ) : (
                        <div className="home-property-grid">

                            {featuredProperties.map(
                                (
                                    property
                                ) => (
                                    <Link
                                        href={`/stays/${property.id}`}
                                        className="home-property-card"
                                        key={
                                            property.id
                                        }
                                    >

                                        <div className="home-property-image">

                                            <img
                                                src={
                                                    property.image
                                                }
                                                alt={
                                                    property.name
                                                }
                                            />

                                            <div className="property-image-overlay"></div>

                                            <div className="property-rating-badge">
                                                ★{" "}
                                                {
                                                    property.rating
                                                }
                                            </div>

                                            <div className="property-view">
                                                VIEW STAY ↗
                                            </div>

                                        </div>

                                        <div className="home-property-content">

                                            <div>

                                                <span className="property-location">
                                                    📍{" "}
                                                    {
                                                        property.address
                                                    }
                                                </span>

                                                <h3>
                                                    {
                                                        property.name
                                                    }
                                                </h3>

                                            </div>

                                            <div className="home-property-price">

                                                <strong>
                                                    {
                                                        selectedCurrency.symbol
                                                    }

                                                    {Math.round(
                                                        property.pricePerNight *
                                                        selectedCurrency.rate
                                                    ).toLocaleString()}
                                                </strong>

                                                <span>
                                                    {" / "}
                                                    {
                                                        getTranslation(
                                                            language,
                                                            "perNight"
                                                        )
                                                    }
                                                </span>

                                            </div>

                                        </div>

                                    </Link>
                                )
                            )}

                        </div>
                    )}

                </div>

            </section>


            {/* =================================================
                CTA
            ================================================= */}

            <section className="home-cta">

                <div className="home-cta-shape home-cta-shape-one"></div>

                <div className="home-cta-shape home-cta-shape-two"></div>

                <div className="container home-cta-inner">

                    <div className="home-cta-title">

                        <span className="home-eyebrow">
                            YOUR NEXT ADVENTURE
                        </span>

                        <h2>
                            READY TO
                            <br />
                            <span>
                                GET AWAY?
                            </span>
                        </h2>

                    </div>


                    <div className="home-cta-stats">

                        {/* STAYS */}

                        <div>

                            <strong>
                                {
                                    availableProperties.length
                                }
                            </strong>

                            <span>
                                STAYS
                            </span>

                        </div>


                        {/* COUNTRIES */}

                        <div>

                            <strong>
                                {
                                    visibleCountries.length
                                }
                            </strong>

                            <span>
                                COUNTRIES
                            </span>

                        </div>


                        {/* RATING */}

                        <div>

                            <strong>
                                4.8
                            </strong>

                            <span>
                                GUEST RATING
                            </span>

                        </div>

                    </div>


                    <Link
                        href="/stays"
                        className="home-cta-button"
                    >
                        EXPLORE ALL STAYS
                        <span>↗</span>
                    </Link>

                </div>

            </section>

        </main>
    );
}