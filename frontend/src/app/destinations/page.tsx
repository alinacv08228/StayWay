"use client";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import Link from "next/link";

import {
    Search,
    SlidersHorizontal,
    X,
} from "lucide-react";

import {
    properties as mockProperties,
} from "../../data/mockData";

import {
    getProperties,
} from "../../services/propertyService";

import {
    getDestinations,
} from "../../services/destinationService";

import {
    Destination,
    Property,
} from "../../types/types";

import DestinationCard from "../../components/DestinationCard";

export default function DestinationsPage() {
    const [
        destinations,
        setDestinations,
    ] = useState<Destination[]>(
        []
    );

    const [
        properties,
        setProperties,
    ] = useState<Property[]>(
        mockProperties
    );

    const [
        isLoading,
        setIsLoading,
    ] = useState(true);

    const [
        hasError,
        setHasError,
    ] = useState(false);

    const [
        search,
        setSearch,
    ] = useState("");

    const [
        countryFilter,
        setCountryFilter,
    ] = useState("All");

    const [
        sortBy,
        setSortBy,
    ] = useState("az");

    useEffect(() => {
        try {
            setDestinations(
                getDestinations()
            );

            setProperties(
                getProperties()
            );

            setIsLoading(false);
        } catch {
            setHasError(true);
            setIsLoading(false);
        }
    }, []);

    /*
     * Afișăm DOAR orașele care
     * au cel puțin un hotel.
     */
    const availableDestinations =
        useMemo(() => {
            return destinations.filter(
                (destination) =>
                    properties.some(
                        (property) =>
                            property.destinationId ===
                            destination.id
                    )
            );
        }, [
            destinations,
            properties,
        ]);

    /*
     * Lista țărilor disponibile este
     * construită doar din destinațiile
     * care au cel puțin un hotel.
     */
    const availableCountries =
        useMemo(() => {
            return Array.from(
                new Set(
                    availableDestinations.map(
                        (destination) =>
                            destination.country
                    )
                )
            ).sort((a, b) =>
                a.localeCompare(b)
            );
        }, [
            availableDestinations,
        ]);

    /*
     * Search + country filter + sort.
     */
    const filteredDestinations =
        useMemo(() => {
            const query =
                search
                    .trim()
                    .toLowerCase();

            const filtered =
                availableDestinations.filter(
                    (destination) => {
                        const matchesSearch =
                            query === "" ||
                            destination.name
                                .toLowerCase()
                                .includes(query) ||
                            destination.country
                                .toLowerCase()
                                .includes(query);

                        const matchesCountry =
                            countryFilter ===
                            "All" ||
                            destination.country ===
                            countryFilter;

                        return (
                            matchesSearch &&
                            matchesCountry
                        );
                    }
                );

            return [...filtered].sort(
                (a, b) => {
                    /*
                     * City A–Z
                     */
                    if (
                        sortBy ===
                        "az"
                    ) {
                        return a.name.localeCompare(
                            b.name
                        );
                    }

                    /*
                     * City Z–A
                     */
                    if (
                        sortBy ===
                        "za"
                    ) {
                        return b.name.localeCompare(
                            a.name
                        );
                    }

                    /*
                     * Country A–Z
                     */
                    if (
                        sortBy ===
                        "countryAz"
                    ) {
                        const countryCompare =
                            a.country.localeCompare(
                                b.country
                            );

                        if (
                            countryCompare !==
                            0
                        ) {
                            return countryCompare;
                        }

                        return a.name.localeCompare(
                            b.name
                        );
                    }

                    /*
                     * Country Z–A
                     */
                    if (
                        sortBy ===
                        "countryZa"
                    ) {
                        const countryCompare =
                            b.country.localeCompare(
                                a.country
                            );

                        if (
                            countryCompare !==
                            0
                        ) {
                            return countryCompare;
                        }

                        return b.name.localeCompare(
                            a.name
                        );
                    }

                    return a.name.localeCompare(
                        b.name
                    );
                }
            );
        }, [
            availableDestinations,
            search,
            countryFilter,
            sortBy,
        ]);

    const hasActiveFilters =
        search.trim() !== "" ||
        countryFilter !== "All" ||
        sortBy !== "az";

    const clearFilters = () => {
        setSearch("");
        setCountryFilter("All");
        setSortBy("az");
    };

    if (isLoading) {
        return (
            <main>
                <section className="section">
                    <div className="container">
                        <p className="admin-label">
                            STAYWAY
                        </p>

                        <h1>
                            Destinations
                        </h1>

                        <p className="admin-description">
                            Loading destinations...
                        </p>
                    </div>
                </section>
            </main>
        );
    }

    if (hasError) {
        return (
            <main>
                <section className="section">
                    <div className="container">
                        <div className="error-page-card">
                            <p className="admin-label">
                                ERROR 500
                            </p>

                            <h1>
                                Something went wrong
                            </h1>

                            <p>
                                We could not load
                                the destinations.
                            </p>

                            <Link
                                href="/"
                                className="button"
                            >
                                Back to home
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
        );
    }

    return (
        <main>
            <section className="section">
                <div className="container">

                    {/* HEADER */}

                    <div
                        className="destinations-page-header"
                        style={{
                            animation:
                                "heroFadeUp 0.8s ease both",
                        }}
                    >
                        <p className="admin-label">
                            STAYWAY
                        </p>

                        <h1>
                            Destinations
                        </h1>

                        <p className="admin-description">
                            Explore cities and
                            discover comfortable
                            places to stay.
                        </p>
                    </div>

                    {availableDestinations.length ===
                    0 ? (
                        <div
                            className="empty-state"
                            style={{
                                animation:
                                    "heroFadeUp 0.8s ease 0.15s both",
                            }}
                        >
                            <h2>
                                No destinations
                                available
                            </h2>

                            <p>
                                There are currently
                                no destinations
                                with available
                                properties.
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* SEARCH + FILTERS */}

                            <div
                                style={{
                                    display:
                                        "grid",
                                    gridTemplateColumns:
                                        "minmax(280px, 1fr) minmax(190px, 220px) minmax(190px, 220px) auto",
                                    gap: "12px",
                                    alignItems:
                                        "stretch",
                                    marginTop:
                                        "28px",
                                    marginBottom:
                                        "20px",
                                    animation:
                                        "heroFadeUp 0.8s ease 0.12s both",
                                }}
                            >
                                {/* SEARCH */}

                                <div
                                    style={{
                                        display:
                                            "flex",
                                        alignItems:
                                            "center",
                                        minHeight:
                                            "58px",
                                        background:
                                            "#ffffff",
                                        border:
                                            "1px solid #ddd8ec",
                                        borderRadius:
                                            "16px",
                                        boxShadow:
                                            "0 8px 24px rgba(78, 64, 125, 0.06)",
                                        boxSizing:
                                            "border-box",
                                    }}
                                >
                                    <Search
                                        size={20}
                                        style={{
                                            marginLeft:
                                                "18px",
                                            color:
                                                "#6c5ce7",
                                            flexShrink:
                                                0,
                                        }}
                                    />

                                    <input
                                        type="text"
                                        value={
                                            search
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setSearch(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        placeholder="Search destinations..."
                                        aria-label="Search destinations"
                                        style={{
                                            width:
                                                "100%",
                                            height:
                                                "56px",
                                            border:
                                                "none",
                                            outline:
                                                "none",
                                            background:
                                                "transparent",
                                            padding:
                                                "0 10px 0 12px",
                                            fontSize:
                                                "15px",
                                            color:
                                                "#302d3a",
                                            boxSizing:
                                                "border-box",
                                        }}
                                    />

                                    {search && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setSearch(
                                                    ""
                                                )
                                            }
                                            aria-label="Clear search"
                                            style={{
                                                display:
                                                    "flex",
                                                alignItems:
                                                    "center",
                                                justifyContent:
                                                    "center",
                                                border:
                                                    "none",
                                                background:
                                                    "transparent",
                                                color:
                                                    "#777184",
                                                cursor:
                                                    "pointer",
                                                padding:
                                                    "8px",
                                                marginRight:
                                                    "8px",
                                            }}
                                        >
                                            <X
                                                size={
                                                    18
                                                }
                                            />
                                        </button>
                                    )}
                                </div>

                                {/* COUNTRY FILTER */}

                                <div
                                    style={{
                                        display:
                                            "flex",
                                        alignItems:
                                            "center",
                                        minHeight:
                                            "58px",
                                        background:
                                            "#ffffff",
                                        border:
                                            "1px solid #ddd8ec",
                                        borderRadius:
                                            "16px",
                                        boxShadow:
                                            "0 8px 24px rgba(78, 64, 125, 0.06)",
                                        boxSizing:
                                            "border-box",
                                    }}
                                >
                                    <span
                                        style={{
                                            marginLeft:
                                                "17px",
                                            fontSize:
                                                "18px",
                                            flexShrink:
                                                0,
                                        }}
                                    >
                                        🌍
                                    </span>

                                    <select
                                        value={
                                            countryFilter
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setCountryFilter(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        aria-label="Filter by country"
                                        style={{
                                            width:
                                                "100%",
                                            height:
                                                "56px",
                                            border:
                                                "none",
                                            outline:
                                                "none",
                                            background:
                                                "transparent",
                                            padding:
                                                "0 14px 0 10px",
                                            fontSize:
                                                "15px",
                                            color:
                                                "#302d3a",
                                            cursor:
                                                "pointer",
                                        }}
                                    >
                                        <option value="All">
                                            All countries
                                        </option>

                                        {availableCountries.map(
                                            (
                                                country
                                            ) => (
                                                <option
                                                    key={
                                                        country
                                                    }
                                                    value={
                                                        country
                                                    }
                                                >
                                                    {
                                                        country
                                                    }
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>

                                {/* SORT */}

                                <div
                                    style={{
                                        display:
                                            "flex",
                                        alignItems:
                                            "center",
                                        minHeight:
                                            "58px",
                                        background:
                                            "#ffffff",
                                        border:
                                            "1px solid #ddd8ec",
                                        borderRadius:
                                            "16px",
                                        boxShadow:
                                            "0 8px 24px rgba(78, 64, 125, 0.06)",
                                        boxSizing:
                                            "border-box",
                                    }}
                                >
                                    <SlidersHorizontal
                                        size={18}
                                        style={{
                                            marginLeft:
                                                "17px",
                                            color:
                                                "#6c5ce7",
                                            flexShrink:
                                                0,
                                        }}
                                    />

                                    <select
                                        value={
                                            sortBy
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setSortBy(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        aria-label="Sort destinations"
                                        style={{
                                            width:
                                                "100%",
                                            height:
                                                "56px",
                                            border:
                                                "none",
                                            outline:
                                                "none",
                                            background:
                                                "transparent",
                                            padding:
                                                "0 14px 0 10px",
                                            fontSize:
                                                "15px",
                                            color:
                                                "#302d3a",
                                            cursor:
                                                "pointer",
                                        }}
                                    >
                                        <option value="az">
                                            City: A–Z
                                        </option>

                                        <option value="za">
                                            City: Z–A
                                        </option>

                                        <option value="countryAz">
                                            Country: A–Z
                                        </option>

                                        <option value="countryZa">
                                            Country: Z–A
                                        </option>
                                    </select>
                                </div>

                                {/* CLEAR */}

                                <button
                                    type="button"
                                    onClick={
                                        clearFilters
                                    }
                                    disabled={
                                        !hasActiveFilters
                                    }
                                    style={{
                                        minHeight:
                                            "58px",
                                        padding:
                                            "0 22px",
                                        border:
                                            "1px solid #ddd8ec",
                                        borderRadius:
                                            "16px",
                                        background:
                                            hasActiveFilters
                                                ? "#ffffff"
                                                : "#f7f5fb",
                                        color:
                                            hasActiveFilters
                                                ? "#5b526b"
                                                : "#aaa4b4",
                                        fontSize:
                                            "15px",
                                        fontWeight:
                                            700,
                                        cursor:
                                            hasActiveFilters
                                                ? "pointer"
                                                : "default",
                                        boxShadow:
                                            "0 8px 24px rgba(78, 64, 125, 0.06)",
                                    }}
                                >
                                    Clear
                                </button>
                            </div>

                            {/* RESULTS COUNT */}

                            <div
                                style={{
                                    display:
                                        "flex",
                                    alignItems:
                                        "center",
                                    marginBottom:
                                        "18px",
                                    color:
                                        "#777184",
                                    fontSize:
                                        "14px",
                                    animation:
                                        "heroFadeUp 0.7s ease 0.22s both",
                                }}
                            >
                                <span>
                                    Showing{" "}
                                    <strong
                                        style={{
                                            color:
                                                "#393343",
                                        }}
                                    >
                                        {
                                            filteredDestinations.length
                                        }
                                    </strong>{" "}
                                    of{" "}
                                    <strong
                                        style={{
                                            color:
                                                "#393343",
                                        }}
                                    >
                                        {
                                            availableDestinations.length
                                        }
                                    </strong>{" "}
                                    destinations
                                </span>
                            </div>

                            {/* NO RESULTS */}

                            {filteredDestinations.length ===
                            0 ? (
                                <div
                                    className="empty-state"
                                    style={{
                                        animation:
                                            "heroFadeUp 0.7s ease both",
                                    }}
                                >
                                    <h2>
                                        No destinations
                                        found
                                    </h2>

                                    <p>
                                        Try another
                                        search term or
                                        change the
                                        filters.
                                    </p>
                                </div>
                            ) : (
                                <div className="destination-grid">
                                    {filteredDestinations.map(
                                        (
                                            destination,
                                            index
                                        ) => (
                                            <div
                                                key={
                                                    destination.id
                                                }
                                                style={{
                                                    animation:
                                                        "heroFadeUp 0.7s ease both",
                                                    animationDelay:
                                                        `${0.12 + index * 0.08}s`,
                                                }}
                                            >
                                                <DestinationCard
                                                    destination={
                                                        destination
                                                    }
                                                />
                                            </div>
                                        )
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
        </main>
    );
}