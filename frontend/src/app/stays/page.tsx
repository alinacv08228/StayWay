"use client";

import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import PropertyCard from "../../components/PropertyCard";

import { useSettings } from "../../context/SettingsContext";

import {
    getTranslation,
    getLocalizedCountryName,
} from "../../data/translations";

import {
    getFilterTranslation,
} from "../../data/filterTranslations";

import { currencyInfo } from "../../data/currency";

import {
    properties as mockProperties,
} from "../../data/mockData";

import {
    getProperties,
} from "../../services/propertyService";

import {
    getDestinations,
} from "../../services/destinationService";

import { Property } from "../../types/types";

export default function StaysPage() {
    const { language, currency } = useSettings();

    const selectedCurrencyInfo =
        currencyInfo[currency] ??
        currencyInfo["Euro"];

    // =========================================
    // INITIAL DATA
    // =========================================

    const [allProperties, setAllProperties] =
        useState<Property[]>(mockProperties);

    const [availableDestinations, setAvailableDestinations] =
        useState(() => {
            try {
                return getDestinations();
            } catch {
                return [];
            }
        });

    const [isLoading, setIsLoading] =
        useState(false);

    const [hasError, setHasError] =
        useState(false);

    // =========================================
    // DESTINATION FROM URL
    // =========================================

    const [destinationName, setDestinationName] =
        useState<string | null>(null);

    useEffect(() => {
        try {
            const params = new URLSearchParams(
                window.location.search
            );

            setDestinationName(
                params.get("destination")
            );
        } catch {
            setDestinationName(null);
        }
    }, []);

    // =========================================
    // LOAD LOCAL STORAGE DATA
    // =========================================

    useEffect(() => {
        let mounted = true;

        try {
            const loadedProperties =
                getProperties();

            const loadedDestinations =
                getDestinations();

            if (!mounted) {
                return;
            }

            setAllProperties(
                loadedProperties.length > 0
                    ? loadedProperties
                    : mockProperties
            );

            setAvailableDestinations(
                loadedDestinations
            );

            setHasError(false);
        } catch {
            if (!mounted) {
                return;
            }

            setAllProperties(
                mockProperties
            );

            setHasError(false);
        } finally {
            if (mounted) {
                setIsLoading(false);
            }
        }

        return () => {
            mounted = false;
        };
    }, []);

    // =========================================
    // DESTINATION ALIASES
    // =========================================

    const destinationAliases: Record<
        string,
        string
    > = {
        paris: "Paris",
        pariz: "Paris",
        париж: "Paris",

        rome: "Rome",
        roma: "Rome",
        рим: "Rome",

        barcelona: "Barcelona",
        барселона: "Barcelona",
    };

    const countryAliases: Record<
        string,
        string
    > = {
        france: "France",
        franța: "France",
        franta: "France",
        франция: "France",

        italy: "Italy",
        italia: "Italy",
        италия: "Italy",

        spain: "Spain",
        españa: "Spain",
        espana: "Spain",
        spania: "Spain",
        испания: "Spain",
    };

    const normalizedDestination =
        destinationName
            ?.trim()
            .toLowerCase();

    const destinationInEnglish =
        normalizedDestination
            ? destinationAliases[
                normalizedDestination
                ]
            : undefined;

    const countryInEnglish =
        normalizedDestination
            ? (
                availableDestinations.find(
                    (destination) =>
                        getLocalizedCountryName(
                            destination.country,
                            language
                        )
                            .trim()
                            .toLowerCase() ===
                        normalizedDestination
                )?.country ??
                countryAliases[
                    normalizedDestination
                    ]
            )
            : undefined;

    const selectedDestination =
        availableDestinations.find(
            (destination) =>
                destination.name
                    .trim()
                    .toLowerCase() ===
                (
                    destinationInEnglish ??
                    normalizedDestination ??
                    ""
                ).toLowerCase()
        );

    // =========================================
    // FILTER STATE
    // =========================================

    const [selectedCountry, setSelectedCountry] =
        useState("");

    const [selectedCity, setSelectedCity] =
        useState("");

    const [minPrice, setMinPrice] =
        useState("");

    const [maxPrice, setMaxPrice] =
        useState("");

    const [hotelSearch, setHotelSearch] =
        useState("");

    const [sortBy, setSortBy] =
        useState("default");

    // =========================================
    // INITIAL DESTINATION FILTER
    // =========================================

    useEffect(() => {
        if (selectedDestination) {
            setSelectedCountry(
                selectedDestination.country
            );

            setSelectedCity(
                selectedDestination.name
            );

            return;
        }

        if (!normalizedDestination) {
            return;
        }

        const matchingCountry =
            availableDestinations.find(
                (destination) =>
                    getLocalizedCountryName(
                        destination.country,
                        language
                    )
                        .trim()
                        .toLowerCase() ===
                    normalizedDestination
            );

        if (matchingCountry) {
            setSelectedCountry(
                matchingCountry.country
            );

            setSelectedCity("");
        }
    }, [
        selectedDestination,
        normalizedDestination,
        availableDestinations,
        language,
    ]);

    // =========================================
    // VISIBLE DESTINATIONS
    // =========================================

    const visibleDestinations =
        useMemo(() => {
            return availableDestinations.filter(
                (destination) =>
                    allProperties.some(
                        (property) =>
                            property.destinationId ===
                            destination.id
                    )
            );
        }, [
            availableDestinations,
            allProperties,
        ]);

    // =========================================
    // COUNTRIES
    // =========================================

    const countries =
        useMemo(() => {
            return Array.from(
                new Set(
                    visibleDestinations.map(
                        (destination) =>
                            destination.country
                    )
                )
            ).sort();
        }, [
            visibleDestinations,
        ]);

    // =========================================
    // CITIES
    // =========================================

    const availableCities =
        useMemo(() => {
            return visibleDestinations
                .filter(
                    (destination) =>
                        selectedCountry
                            ? destination.country ===
                            selectedCountry
                            : true
                )
                .map(
                    (destination) =>
                        destination.name
                )
                .sort();
        }, [
            visibleDestinations,
            selectedCountry,
        ]);

    // =========================================
    // FILTER + SORT
    // =========================================

    const filteredProperties =
        useMemo(() => {
            let result = [
                ...allProperties,
            ];

            // SearchBar destination
            if (selectedDestination) {
                result =
                    result.filter(
                        (property) =>
                            property.destinationId ===
                            selectedDestination.id
                    );
            }

            // Hotel name search
            if (hotelSearch.trim()) {
                const normalizedHotelSearch =
                    hotelSearch.trim().toLowerCase();

                result =
                    result.filter(
                        (property) =>
                            property.name
                                .toLowerCase()
                                .includes(
                                    normalizedHotelSearch
                                )
                    );
            }

            // Country
            if (selectedCountry) {
                const countryDestinationIds =
                    availableDestinations
                        .filter(
                            (destination) =>
                                destination.country ===
                                selectedCountry
                        )
                        .map(
                            (destination) =>
                                destination.id
                        );

                result =
                    result.filter(
                        (property) =>
                            countryDestinationIds.includes(
                                property.destinationId
                            )
                    );
            }

            // City
            if (selectedCity) {
                const cityDestination =
                    availableDestinations.find(
                        (destination) =>
                            destination.name ===
                            selectedCity
                    );

                if (cityDestination) {
                    result =
                        result.filter(
                            (property) =>
                                property.destinationId ===
                                cityDestination.id
                        );
                }
            }

            // Minimum price
            if (minPrice) {
                result =
                    result.filter(
                        (property) =>
                            property.pricePerNight >=
                            Number(minPrice) /
                            selectedCurrencyInfo.rate
                    );
            }

            // Maximum price
            if (maxPrice) {
                result =
                    result.filter(
                        (property) =>
                            property.pricePerNight <=
                            Number(maxPrice) /
                            selectedCurrencyInfo.rate
                    );
            }

            // Sort
            if (sortBy === "price-low") {
                result.sort(
                    (a, b) =>
                        a.pricePerNight -
                        b.pricePerNight
                );
            }

            if (sortBy === "price-high") {
                result.sort(
                    (a, b) =>
                        b.pricePerNight -
                        a.pricePerNight
                );
            }

            // Minimum stars
            if (sortBy === "stars-low") {
                result.sort(
                    (a, b) =>
                        a.stars -
                        b.stars
                );
            }

            // Maximum stars
            if (sortBy === "stars-high") {
                result.sort(
                    (a, b) =>
                        b.stars -
                        a.stars
                );
            }

            return result;
        }, [
            allProperties,
            availableDestinations,
            selectedDestination,
            selectedCountry,
            selectedCity,
            minPrice,
            maxPrice,
            hotelSearch,
            sortBy,
            selectedCurrencyInfo.rate,
        ]);

    // =========================================
    // RESET FILTERS
    // =========================================

    const handleResetFilters =
        useCallback(() => {
            setSelectedCountry("");
            setSelectedCity("");
            setMinPrice("");
            setMaxPrice("");
            setHotelSearch("");
            setSortBy("default");
        }, []);

    // =========================================
    // COUNTRY CHANGE
    // =========================================

    const handleCountryChange =
        useCallback(
            (value: string) => {
                setSelectedCountry(value);

                if (!value) {
                    setSelectedCity("");
                    return;
                }

                const firstCity =
                    availableDestinations.find(
                        (destination) =>
                            destination.country ===
                            value
                    )?.name ?? "";

                setSelectedCity(
                    firstCity
                );
            },
            [
                availableDestinations,
            ]
        );

    // =========================================
    // ERROR
    // =========================================

    if (hasError) {
        return (
            <main>
                <section className="section">
                    <div className="container">

                        <div className="no-stays stayway-load-in stayway-load-1">
                            <h2>
                                Something went wrong
                            </h2>

                            <p>
                                We could not load the
                                available stays.
                            </p>

                            <button
                                type="button"
                                className="reset-filters-button"
                                onClick={() =>
                                    window.location.reload()
                                }
                            >
                                Try again
                            </button>
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

                    {/* PAGE TITLE */}

                    <p className="admin-label stayway-load-in stayway-load-1">
                        STAYWAY
                    </p>

                    <h1
                        className="page-title stayway-load-in stayway-load-2"
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
                            "findYourPerfectStay"
                        )}
                    </h1>

                    <p className="admin-description stayway-load-in stayway-load-3">
                        {getTranslation(
                            language,
                            "staysDescription"
                        )}
                    </p>

                    {destinationName && (
                        <p className="stays-search-result stayway-load-in stayway-load-4">
                            Search results for:{" "}
                            <strong>
                                {destinationName}
                            </strong>
                        </p>
                    )}

                    {/* FILTERS */}

                    <div className="stays-filters stayway-load-in stayway-load-5">

                        {/* HOTEL NAME SEARCH */}

                        <div className="filter-group">
                            <label htmlFor="hotel-search">
                                {getTranslation(
                                    language,
                                    "hotelName"
                                )}
                            </label>

                            <input
                                id="hotel-search"
                                type="text"
                                placeholder={getTranslation(
                                    language,
                                    "searchByHotelName"
                                )}
                                value={
                                    hotelSearch
                                }
                                onChange={(event) =>
                                    setHotelSearch(
                                        event.target.value
                                    )
                                }
                            />
                        </div>

                        {/* COUNTRY */}

                        <div className="filter-group">
                            <label htmlFor="country">
                                {getFilterTranslation(
                                    language,
                                    "country"
                                )}
                            </label>

                            <select
                                id="country"
                                value={
                                    selectedCountry
                                }
                                onChange={(event) =>
                                    handleCountryChange(
                                        event.target.value
                                    )
                                }
                            >
                                <option value="">
                                    {getFilterTranslation(
                                        language,
                                        "country"
                                    )}
                                </option>

                                {countries.map(
                                    (country) => (
                                        <option
                                            key={
                                                country
                                            }
                                            value={
                                                country
                                            }
                                        >
                                            {country}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>

                        {/* CITY */}

                        <div className="filter-group">
                            <label htmlFor="city">
                                {getFilterTranslation(
                                    language,
                                    "city"
                                )}
                            </label>

                            <select
                                id="city"
                                value={
                                    selectedCity
                                }
                                onChange={(event) =>
                                    setSelectedCity(
                                        event.target.value
                                    )
                                }
                            >
                                <option value="">
                                    {getFilterTranslation(
                                        language,
                                        "city"
                                    )}
                                </option>

                                {availableCities.map(
                                    (city) => (
                                        <option
                                            key={
                                                city
                                            }
                                            value={
                                                city
                                            }
                                        >
                                            {city}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>

                        {/* MIN PRICE */}

                        <div className="filter-group">
                            <label htmlFor="min-price">
                                {getFilterTranslation(
                                    language,
                                    "minimumPrice"
                                )}
                            </label>

                            <input
                                id="min-price"
                                type="number"
                                min="0"
                                placeholder={`${selectedCurrencyInfo.symbol}0`}
                                value={
                                    minPrice
                                }
                                onChange={(event) =>
                                    setMinPrice(
                                        event.target.value
                                    )
                                }
                            />
                        </div>

                        {/* MAX PRICE */}

                        <div className="filter-group">
                            <label htmlFor="max-price">
                                {getFilterTranslation(
                                    language,
                                    "maximumPrice"
                                )}
                            </label>

                            <input
                                id="max-price"
                                type="number"
                                min="0"
                                placeholder={`${selectedCurrencyInfo.symbol}1000`}
                                value={
                                    maxPrice
                                }
                                onChange={(event) =>
                                    setMaxPrice(
                                        event.target.value
                                    )
                                }
                            />
                        </div>

                        {/* SORT */}

                        <div className="filter-group">
                            <label htmlFor="sort">
                                {getFilterTranslation(
                                    language,
                                    "sortBy"
                                )}
                            </label>

                            <select
                                id="sort"
                                value={
                                    sortBy
                                }
                                onChange={(event) =>
                                    setSortBy(
                                        event.target.value
                                    )
                                }
                            >
                                <option value="default">
                                    {getFilterTranslation(
                                        language,
                                        "recommended"
                                    )}
                                </option>

                                <option value="price-low">
                                    {getFilterTranslation(
                                        language,
                                        "priceLow"
                                    )}
                                </option>

                                <option value="price-high">
                                    {getFilterTranslation(
                                        language,
                                        "priceHigh"
                                    )}
                                </option>

                                <option value="stars-low">
                                    {getTranslation(
                                        language,
                                        "minimumStars"
                                    )}
                                </option>

                                <option value="stars-high">
                                    {getTranslation(
                                        language,
                                        "maximumStars"
                                    )}
                                </option>
                            </select>
                        </div>

                        {/* RESET */}

                        <button
                            type="button"
                            className="reset-filters-button"
                            onClick={
                                handleResetFilters
                            }
                        >
                            {getFilterTranslation(
                                language,
                                "resetFilters"
                            )}
                        </button>
                    </div>

                    {/* RESULTS */}

                    <p className="stays-results-count stayway-load-in stayway-load-6">
                        {
                            filteredProperties.length
                        }{" "}
                        {
                            filteredProperties.length ===
                            1
                                ? "stay"
                                : "stays"
                        }{" "}
                        found
                    </p>

                    {filteredProperties.length >
                    0 ? (
                        <div className="property-grid stayway-load-in stayway-load-7">

                            {filteredProperties.map(
                                (
                                    property
                                ) => (
                                    <div
                                        key={
                                            property.id
                                        }
                                    >
                                        <PropertyCard
                                            property={
                                                property
                                            }
                                        />
                                    </div>
                                )
                            )}

                        </div>
                    ) : (
                        <div className="no-stays stayway-load-in stayway-load-7">

                            <h2>
                                No stays found
                            </h2>

                            <p>
                                Try changing your
                                filters.
                            </p>

                            <button
                                type="button"
                                className="reset-filters-button"
                                onClick={
                                    handleResetFilters
                                }
                            >
                                {getFilterTranslation(
                                    language,
                                    "resetFilters"
                                )}
                            </button>

                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
