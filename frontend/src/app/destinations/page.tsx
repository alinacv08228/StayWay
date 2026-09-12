
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
    useSettings,
} from "../../context/SettingsContext";

import {
    getTranslation,
    getDestinationUiTranslation,
    getLocalizedCountryName,
    getLocalizedCityName,
} from "../../data/translations";

import {
    Destination,
    Property,
} from "../../types/types";

import DestinationCard from "../../components/DestinationCard";

export default function DestinationsPage() {
    const { language } = useSettings();

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
                        const localizedCity =
                            getLocalizedCityName(
                                destination.name,
                                language
                            );

                        const localizedCountry =
                            getLocalizedCountryName(
                                destination.country,
                                language
                            );

                        const matchesSearch =
                            query === "" ||
                            destination.name
                                .toLowerCase()
                                .includes(query) ||
                            localizedCity
                                .toLowerCase()
                                .includes(query) ||
                            destination.country
                                .toLowerCase()
                                .includes(query) ||
                            localizedCountry
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
                        return getLocalizedCityName(
                            a.name,
                            language
                        ).localeCompare(
                            getLocalizedCityName(
                                b.name,
                                language
                            )
                        );
                    }

                    /*
                     * City Z–A
                     */
                    if (
                        sortBy ===
                        "za"
                    ) {
                        return getLocalizedCityName(
                            b.name,
                            language
                        ).localeCompare(
                            getLocalizedCityName(
                                a.name,
                                language
                            )
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
                            getLocalizedCountryName(
                                a.country,
                                language
                            ).localeCompare(
                                getLocalizedCountryName(
                                    b.country,
                                    language
                                )
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
                            getLocalizedCountryName(
                                b.country,
                                language
                            ).localeCompare(
                                getLocalizedCountryName(
                                    a.country,
                                    language
                                )
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

                    return getLocalizedCityName(
                        a.name,
                        language
                    ).localeCompare(
                        getLocalizedCityName(
                            b.name,
                            language
                        )
                    );
                }
            );
        }, [
            availableDestinations,
            search,
            countryFilter,
            sortBy,
            language,
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

                        <h1
                            style={{
                                fontSize: "42px",
                                lineHeight: 1.1,
                                fontWeight: 700,
                                letterSpacing: "-0.02em",
                                margin: 0,
                            }}
                        >
                            {getTranslation(
                                language,
                                "destinations"
                            )}
                        </h1>

                        <p className="admin-description">
                            {getDestinationUiTranslation(
                                language,
                                "loadingDestinations"
                            )}
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

                    <div className="destinations-page-header stayway-load-in stayway-load-1">
                        <p className="admin-label">
                            STAYWAY
                        </p>

                        <h1>
                            {getTranslation(
                                language,
                                "destinations"
                            )}
                        </h1>

                        <p className="admin-description">
                            {getDestinationUiTranslation(
                                language,
                                "exploreCities"
                            )}
                        </p>
                    </div>

                    {availableDestinations.length ===
                    0 ? (
                        <div className="empty-state stayway-load-in stayway-load-2">
                            <h2>
                                {getDestinationUiTranslation(
                                    language,
                                    "noDestinationsAvailable"
                                )}
                            </h2>

                            <p>
                                {getDestinationUiTranslation(
                                    language,
                                    "noDestinationsWithProperties"
                                )}
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* SEARCH + FILTERS */}

                            <div
                                className="destinations-filters stayway-load-in stayway-load-2"
                                style={{
                                    display:
                                        "grid",
                                    gridTemplateColumns:
                                        "minmax(280px, 1fr) 200px 200px 76px",
                                    gap: "12px",
                                    alignItems:
                                        "stretch",
                                    marginTop:
                                        "28px",
                                    marginBottom:
                                        "20px",
                                }}
                            >
                                {/* SEARCH */}

                                <div
                                    className="destination-search-control"
                                    style={{
                                        display:
                                            "flex",
                                        alignItems:
                                            "center",
                                        minHeight:
                                            "58px",
                                        minWidth:
                                            0,
                                        overflow:
                                            "hidden",
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
                                        placeholder={getDestinationUiTranslation(
                                            language,
                                            "destinationSearch"
                                        )}
                                        aria-label={getDestinationUiTranslation(
                                            language,
                                            "destinationSearch"
                                        )}
                                        style={{
                                            flex: 1,
                                            minWidth: 0,
                                            width:
                                                "auto",
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
                                            aria-label={getDestinationUiTranslation(
                                                language,
                                                "clearSearch"
                                            )}
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
                                    className="destination-filter-control"
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
                                        aria-label={getDestinationUiTranslation(
                                            language,
                                            "filterByCountry"
                                        )}
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
                                            {getDestinationUiTranslation(
                                                language,
                                                "allCountries"
                                            )}
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
                                                    {getLocalizedCountryName(
                                                        country,
                                                        language
                                                    )}
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>

                                {/* SORT */}

                                <div
                                    className="destination-filter-control"
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
                                        aria-label={getDestinationUiTranslation(
                                            language,
                                            "sortDestinations"
                                        )}
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
                                            {getDestinationUiTranslation(
                                                language,
                                                "cityAZ"
                                            )}
                                        </option>

                                        <option value="za">
                                            {getDestinationUiTranslation(
                                                language,
                                                "cityZA"
                                            )}
                                        </option>

                                        <option value="countryAz">
                                            {getDestinationUiTranslation(
                                                language,
                                                "countryAZ"
                                            )}
                                        </option>

                                        <option value="countryZa">
                                            {getDestinationUiTranslation(
                                                language,
                                                "countryZA"
                                            )}
                                        </option>
                                    </select>
                                </div>

                                {/* CLEAR */}

                                <button
                                    type="button"
                                    className="destination-clear-button"
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
                                            "none",
                                        borderRadius:
                                            "0",
                                        background:
                                            "transparent",
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
                                            "none",
                                    }}
                                >
                                    {getDestinationUiTranslation(
                                        language,
                                        "clear"
                                    )}
                                </button>
                            </div>

                            {/* RESULTS COUNT */}

                            <div
                                className="destinations-results-count stayway-load-in stayway-load-3"
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
                                }}
                            >
                                <span>
                                    {getDestinationUiTranslation(
                                        language,
                                        "showing"
                                    )}{" "}
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
                                    {getDestinationUiTranslation(
                                        language,
                                        "of"
                                    )}{" "}
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
                                    {getDestinationUiTranslation(
                                        language,
                                        "destinationsLower"
                                    )}
                                </span>
                            </div>

                            {/* NO RESULTS */}

                            {filteredDestinations.length ===
                            0 ? (
                                <div className="empty-state stayway-load-in stayway-load-4">
                                    <h2>
                                        {getDestinationUiTranslation(
                                            language,
                                            "noDestinationsFound"
                                        )}
                                    </h2>

                                    <p>
                                        {getDestinationUiTranslation(
                                            language,
                                            "tryAnotherSearch"
                                        )}
                                    </p>
                                </div>
                            ) : (
                                <div className="destination-grid stayway-load-in stayway-load-4">
                                    {filteredDestinations.map(
                                        (
                                            destination
                                        ) => (
                                            <div
                                                key={
                                                    destination.id
                                                }
                                            >
                                                <DestinationCard
                                                    destination={{
                                                        ...destination,
                                                        name: getLocalizedCityName(
                                                            destination.name,
                                                            language
                                                        ),
                                                        country: getLocalizedCountryName(
                                                            destination.country,
                                                            language
                                                        ),
                                                    }}
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