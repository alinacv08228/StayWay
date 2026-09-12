
"use client";

import Link from "next/link";
import type { CSSProperties } from "react";

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
    // HOME CAROUSEL
    // =========================================

    const carouselImages = [
        "/carousel/carousel-1.png",
        "/carousel/carousel-2.png",
        "/carousel/carousel-3.png",
        "/carousel/carousel-4.png",
        "/carousel/carousel-5.png",
        "/carousel/carousel-6.png",
        "/carousel/carousel-7.png",
        "/carousel/carousel-8.png",
    ];

    const [
        currentCarouselIndex,
        setCurrentCarouselIndex,
    ] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentCarouselIndex((current) =>
                (current + 1) %
                carouselImages.length
            );
        }, 3500);

        return () => clearInterval(interval);
    }, []);

    const goToPreviousCarouselImage = () => {
        setCurrentCarouselIndex((current) =>
            (current - 1 + carouselImages.length) %
            carouselImages.length
        );
    };

    const goToNextCarouselImage = () => {
        setCurrentCarouselIndex((current) =>
            (current + 1) %
            carouselImages.length
        );
    };

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
            <main className="home-page page-enter home-animated">

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

                            <p className="hero-subtitle home-hero-subtitle-animated">
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
        <main className="home-page page-enter home-animated">


            {/* =================================================
    HERO
================================================= */}

            <section className="home-hero home-animate home-animate-1">

                <div className="hero-glow hero-glow-one"></div>

                <div className="hero-glow hero-glow-two"></div>

                <div className="container home-hero-inner">

                    {/* HERO CONTENT */}

                    <div className="hero-content">

                        <div className="hero-badge home-hero-item home-hero-item-1">
                            ✦ YOUR JOURNEY STARTS HERE
                        </div>

                        <h1 className="home-hero-item home-hero-item-2">
                            FIND YOUR
                            <br />
                            <span>
                    PERFECT STAY.
                </span>
                        </h1>

                        <p className="hero-subtitle home-hero-subtitle-animated">
                            Discover beautiful places,
                            unforgettable stays
                            and destinations worth
                            exploring.
                        </p>

                        <div className="hero-stats home-hero-item home-hero-item-4">

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

                    {/* HOME MAP */}

                    <div className="home-hero-map">

                        <img
                            src="/map-home/map.png"
                            alt="StayWay travel map"
                        />

                    </div>

                    {/* SEARCH */}

                    <div className="home-search-wrapper">

                        <SearchBar />

                    </div>

                </div>

                <div className="hero-scroll">

                </div>

            </section>
            
            {/* =================================================
                TRAVEL CAROUSEL
            ================================================= */}

            <section
                className="home-carousel home-animate home-animate-2"
            >

                <div className="container">

                    <div className="home-carousel-track">

                        {carouselImages.map(
                            (image, index) => {

                                const position =
                                    (
                                        index -
                                        currentCarouselIndex +
                                        carouselImages.length
                                    ) %
                                    carouselImages.length;

                                let positionClass =
                                    "carousel-hidden";

                                if (
                                    position === 0
                                ) {
                                    positionClass =
                                        "carousel-center";
                                } else if (
                                    position === 1
                                ) {
                                    positionClass =
                                        "carousel-right";
                                } else if (
                                    position ===
                                    carouselImages.length -
                                    1
                                ) {
                                    positionClass =
                                        "carousel-left";
                                }

                                return (
                                    <button
                                        type="button"
                                        key={image}
                                        className={`home-carousel-slide ${positionClass}`}
                                        onClick={() =>
                                            setCurrentCarouselIndex(
                                                index
                                            )
                                        }
                                        aria-label={`View travel image ${
    index + 1
}`}
                                    >
                                        <img
                                            src={image}
                                            alt={`StayWay travel ${
    index + 1
}`}
                                        />
                                    </button>
                                );
                            }
                        )}

                    </div>

                    <div className="home-carousel-controls">

                        <button
                            type="button"
                            className="home-carousel-arrow"
                            onClick={
                                goToPreviousCarouselImage
                            }
                            aria-label="Previous image"
                        >
                            ←
                        </button>

                        <div className="home-carousel-dots">

                            {carouselImages.map(
                                (_, index) => (
                                    <button
                                        type="button"
                                        key={index}
                                        className={
                                            index ===
                                            currentCarouselIndex
                                                ? "active"
                                                : ""
                                        }
                                        onClick={() =>
                                            setCurrentCarouselIndex(
                                                index
                                            )
                                        }
                                        aria-label={`Go to image ${
    index + 1
}`}
                                    />
                                )
                            )}

                        </div>

                        <button
                            type="button"
                            className="home-carousel-arrow"
                            onClick={
                                goToNextCarouselImage
                            }
                            aria-label="Next image"
                        >
                            →
                        </button>

                    </div>

                </div>

            </section>


            {/* =================================================
                COUNTRIES
            ================================================= */}

            <section className="home-destinations home-animate home-animate-3">

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
                                        style={{
                                            "--card-index": index,
                                        } as CSSProperties}
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

            <section className="home-stays home-animate home-animate-4">

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
                                        style={{
                                            "--card-index": featuredProperties.indexOf(property),
                                        } as CSSProperties}
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

            <section className="home-cta home-animate home-animate-5">
                <div
                    className="home-cta-shape home-cta-shape-one"
                    aria-hidden="true"
                />
                <div
                    className="home-cta-shape home-cta-shape-two"
                    aria-hidden="true"
                />

                <div
                    className="container home-cta-inner"
                    style={{
                        position: "relative",
                        zIndex: 2,
                    }}
                >
                    {/* LEFT — MESSAGE */}
                    <div
                        className="home-cta-title"
                        style={{
                            position: "relative",
                            zIndex: 2,
                        }}
                    >
                        <span
                            className="home-eyebrow"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "9px",
                                color: "rgba(255,255,255,0.68)",
                                fontSize: "11px",
                                fontWeight: 800,
                                letterSpacing: "0.14em",
                                marginBottom: "18px",
                            }}
                        >
                            <span
                                style={{
                                    width: "7px",
                                    height: "7px",
                                    borderRadius: "50%",
                                    background: "#ffffff",
                                    boxShadow: "0 0 0 6px rgba(255,255,255,0.10)",
                                }}
                            />
                            YOUR NEXT ADVENTURE
                        </span>

                        <h2
                            style={{
                                margin: 0,
                                color: "#ffffff",
                                fontSize: "clamp(38px, 4.5vw, 64px)",
                                lineHeight: 0.98,
                                fontWeight: 700,
                                letterSpacing: "-0.045em",
                            }}
                        >
                            READY TO
                            <br />
                            <span
                                style={{
                                    color: "#ffffff",
                                }}
                            >
                                GET AWAY?
                            </span>
                        </h2>

                        <p
                            style={{
                                maxWidth: "360px",
                                margin: "18px 0 0",
                                color: "rgba(255,255,255,0.72)",
                                fontSize: "14px",
                                lineHeight: 1.6,
                            }}
                        >
                            Find your next stay and turn your plans into
                            something worth remembering.
                        </p>
                    </div>

                    {/* CENTER — QUICK STATS */}
                    <div
                        className="home-cta-stats"
                        style={{
                            display: "flex",
                            alignItems: "stretch",
                            justifyContent: "center",
                            gap: 0,
                            padding: "0 10px",
                        }}
                    >
                        <div
                            style={{
                                minWidth: "105px",
                                padding: "8px 22px",
                                borderLeft: "1px solid rgba(255,255,255,0.16)",
                            }}
                        >
                            <strong
                                style={{
                                    display: "block",
                                    color: "#ffffff",
                                    fontSize: "30px",
                                    lineHeight: 1,
                                    fontWeight: 700,
                                    letterSpacing: "-0.03em",
                                }}
                            >
                                {availableProperties.length}
                            </strong>
                            <span
                                style={{
                                    display: "block",
                                    marginTop: "8px",
                                    color: "rgba(255,255,255,0.62)",
                                    fontSize: "10px",
                                    fontWeight: 800,
                                    letterSpacing: "0.12em",
                                }}
                            >
                                STAYS
                            </span>
                        </div>

                        <div
                            style={{
                                minWidth: "105px",
                                padding: "8px 22px",
                                borderLeft: "1px solid rgba(255,255,255,0.16)",
                            }}
                        >
                            <strong
                                style={{
                                    display: "block",
                                    color: "#ffffff",
                                    fontSize: "30px",
                                    lineHeight: 1,
                                    fontWeight: 700,
                                    letterSpacing: "-0.03em",
                                }}
                            >
                                {visibleCountries.length}
                            </strong>
                            <span
                                style={{
                                    display: "block",
                                    marginTop: "8px",
                                    color: "rgba(255,255,255,0.62)",
                                    fontSize: "10px",
                                    fontWeight: 800,
                                    letterSpacing: "0.12em",
                                }}
                            >
                                COUNTRIES
                            </span>
                        </div>

                        <div
                            style={{
                                minWidth: "125px",
                                padding: "8px 22px",
                                borderLeft: "1px solid rgba(255,255,255,0.16)",
                                borderRight: "1px solid rgba(255,255,255,0.16)",
                            }}
                        >
                            <strong
                                style={{
                                    display: "block",
                                    color: "#ffffff",
                                    fontSize: "30px",
                                    lineHeight: 1,
                                    fontWeight: 700,
                                    letterSpacing: "-0.03em",
                                }}
                            >
                                4.8
                            </strong>
                            <span
                                style={{
                                    display: "block",
                                    marginTop: "8px",
                                    color: "rgba(255,255,255,0.62)",
                                    fontSize: "10px",
                                    fontWeight: 800,
                                    letterSpacing: "0.12em",
                                }}
                            >
                                GUEST RATING
                            </span>
                        </div>
                    </div>

                    {/* RIGHT — CTA */}
                    <Link
                        href="/stays"
                        className="home-cta-button"
                        style={{
                            position: "relative",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: "20px",
                            minWidth: "205px",
                            padding: "15px 17px 15px 20px",
                            borderRadius: "999px",
                            background: "#ffffff",
                            color: "#292532",
                            textDecoration: "none",
                            fontSize: "12px",
                            fontWeight: 900,
                            letterSpacing: "0.04em",
                            boxShadow: "0 14px 34px rgba(40,28,110,0.18)",
                            transition: "transform 0.2s ease, box-shadow 0.2s ease",
                        }}
                    >
                        <span>EXPLORE ALL STAYS</span>
                        <span
                            style={{
                                width: "34px",
                                height: "34px",
                                borderRadius: "50%",
                                display: "grid",
                                placeItems: "center",
                                background: "#7059e8",
                                color: "#ffffff",
                                fontSize: "17px",
                                lineHeight: 1,
                                flexShrink: 0,
                            }}
                        >
                            ↗
                        </span>
                    </Link>
                </div>
            </section>


            <style jsx>{`
    .home-animated .home-animate {
    opacity: 0;
    animation: homeFadeUp 0.8s ease both;
}

.home-animated .home-animate-1 {
    animation-delay: 0s;
}

.home-animated .home-animate-2 {
    animation-delay: 0.12s;
}

.home-animated .home-animate-3 {
    animation-delay: 0.18s;
}

.home-animated .home-animate-4 {
    animation-delay: 0.24s;
}

.home-animated .home-animate-5 {
    animation-delay: 0.30s;
}

.home-animated .home-destination-card,
.home-animated .home-property-card {
    opacity: 0;
    animation: homeFadeUp 0.7s ease both;
}

.home-animated .home-destination-card {
    animation-delay: calc(0.22s + (var(--card-index, 0) * 0.08s));
}

.home-animated .home-property-card {
    animation-delay: calc(0.22s + (var(--card-index, 0) * 0.08s));
}

@keyframes homeFadeUp {
    from {
        opacity: 0;
        transform: translateY(22px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.home-animated .home-hero-item {
    opacity: 0;
    animation: homeFadeUp 0.8s ease both;
}

.home-animated .home-hero-item-1 {
    animation-delay: 0.04s;
}

.home-animated .home-hero-item-2 {
    animation-delay: 0.08s;
}

.home-animated .home-hero-subtitle-animated {
    opacity: 0;
    animation: homeFadeUp 0.8s ease both;
    animation-delay: 0.12s;
}

.home-animated .home-hero-item-4 {
    animation-delay: 0.16s;
}

.home-animated .home-hero-item-5 {
    animation-delay: 0.20s;
}

.home-animated .home-hero-item-6 {
    animation-delay: 0.24s;
}

.home-cta {
    position: relative;
    overflow: visible;
    background: #f6f1ff;
    border-radius: 0;
    box-shadow: none;
    padding: 0 0 0;
    margin-bottom: 0;
}

.home-cta::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: -64px;
    height: 64px;
    background: #f6f1ff;
    pointer-events: none;
    z-index: 0;
}

.home-cta .home-cta-inner {
    position: relative;
    overflow: hidden;
    border-radius: 34px;
    background:
        radial-gradient(circle at 82% 22%, rgba(176, 158, 255, 0.34), transparent 28%),
    linear-gradient(120deg, #6955df 0%, #745fe8 50%, #8070eb 100%);
    box-shadow: 0 28px 60px rgba(78, 64, 125, 0.18);
    padding-top: 72px;
    padding-bottom: 72px;
}

.home-cta .home-cta-inner::before {
    content: "";
    position: absolute;
    inset: 1px;
    border-radius: 33px;
    border: 1px solid rgba(255,255,255,0.16);
    pointer-events: none;
}

.home-cta .home-cta-inner::after {
    content: "";
    position: absolute;
    width: 280px;
    height: 280px;
    right: 6%;
    top: -175px;
    border-radius: 50%;
    background: rgba(255,255,255,0.08);
    filter: blur(2px);
    pointer-events: none;
}

.home-cta .home-cta-shape-one,
.home-cta .home-cta-shape-two {
    display: none;
}

@media (max-width: 1050px) {
.home-cta-inner {
        grid-template-columns: 1fr;
        gap: 26px;
    }

.home-cta-stats {
        justify-content: flex-start !important;
        padding: 0 !important;
    }

.home-cta-button {
        justify-self: flex-start;
    }
}

@media (max-width: 600px) {
.home-cta {
        padding-bottom: 56px;
    }

.home-cta .home-cta-inner {
        border-radius: 26px;
        padding-top: 52px;
        padding-bottom: 52px;
    }

.home-cta .home-cta-inner::before {
        border-radius: 25px;
    }

.home-cta-stats {
        width: 100%;
        overflow-x: auto;
    }

.home-cta-stats > div {
        min-width: 95px !important;
        padding-left: 14px !important;
        padding-right: 14px !important;
    }

.home-cta-button {
        width: 100%;
        box-sizing: border-box;
    }
}

@media (prefers-reduced-motion: reduce) {
.home-animated .home-hero-subtitle-animated,
.home-animated .home-animate,
.home-animated .home-destination-card,
.home-animated .home-property-card,
.home-animated .home-hero-item {
        opacity: 1;
        animation: none;
    }
}
`}</style>

        </main>
    );
}

