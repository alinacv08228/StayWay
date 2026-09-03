"use client";

import {
    Suspense,
    useMemo,
    useState,
} from "react";
import { useSearchParams } from "next/navigation";

import {
    properties,
    destinations,
} from "../../data/mockData";

import PropertyCard from "../../components/PropertyCard";

import { useSettings } from "../../context/SettingsContext";

import { getTranslation } from "../../data/translations";

import {
    getFilterTranslation,
} from "../../data/filterTranslations";

import { currencyInfo } from "../../data/currency";

function StaysContent() {
    const searchParams = useSearchParams();

    const { language, currency } = useSettings();
    const selectedCurrencyInfo =
        currencyInfo[currency] ??
        currencyInfo["Euro"];

    const destinationName =
        searchParams.get("destination");

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
        "franta": "France",
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
            ? countryAliases[
                normalizedDestination
                ]
            : undefined;

    const selectedDestination =
        destinations.find(
            (destination) =>
                destination.name.toLowerCase() ===
                destinationInEnglish?.toLowerCase()
        );

    // =========================================
    // FILTER STATE
    // =========================================

    const [selectedCountry, setSelectedCountry] =
        useState(
            selectedDestination?.country ??
            countryInEnglish ??
            ""
        );

    const [selectedCity, setSelectedCity] =
        useState(
            selectedDestination?.name ?? ""
        );

    const [minPrice, setMinPrice] =
        useState("");

    const [maxPrice, setMaxPrice] =
        useState("");

    const [minRating, setMinRating] =
        useState("0");

    const [sortBy, setSortBy] =
        useState("default");

    // =========================================
    // COUNTRIES
    // =========================================

    const countries = useMemo(() => {
        return Array.from(
            new Set(
                destinations.map(
                    (destination) =>
                        destination.country
                )
            )
        ).sort();
    }, []);

    // =========================================
    // CITIES
    // =========================================

    const availableCities = useMemo(() => {
        return destinations
            .filter((destination) =>
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
    }, [selectedCountry]);

    // =========================================
    // FILTER + SORT
    // =========================================

    const filteredProperties = useMemo(() => {
        let result = [...properties];

        // SearchBar destination
        if (selectedDestination) {
            result = result.filter(
                (property) =>
                    property.destinationId ===
                    selectedDestination.id
            );
        }

        // Country
        if (selectedCountry) {
            const countryDestinationIds =
                destinations
                    .filter(
                        (destination) =>
                            destination.country ===
                            selectedCountry
                    )
                    .map(
                        (destination) =>
                            destination.id
                    );

            result = result.filter(
                (property) =>
                    countryDestinationIds.includes(
                        property.destinationId
                    )
            );
        }

        // City
        if (selectedCity) {
            const cityDestination =
                destinations.find(
                    (destination) =>
                        destination.name ===
                        selectedCity
                );

            if (cityDestination) {
                result = result.filter(
                    (property) =>
                        property.destinationId ===
                        cityDestination.id
                );
            }
        }

        // Minimum price
        if (minPrice) {
            result = result.filter(
                (property) =>
                    property.pricePerNight >=
                    Number(minPrice) /
                    selectedCurrencyInfo.rate
            );
        }

        // Maximum price
        if (maxPrice) {
            result = result.filter(
                (property) =>
                    property.pricePerNight <=
                    Number(maxPrice) /
                    selectedCurrencyInfo.rate
            );
        }

        // Rating
        if (minRating !== "0") {
            result = result.filter(
                (property) =>
                    property.rating >=
                    Number(minRating)
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

        if (sortBy === "rating-high") {
            result.sort(
                (a, b) =>
                    b.rating -
                    a.rating
            );
        }

        return result;
    }, [
        selectedDestination,
        selectedCountry,
        selectedCity,
        minPrice,
        maxPrice,
        minRating,
        sortBy,
        selectedCurrencyInfo.rate,
    ]);

    // =========================================
    // RESET
    // =========================================

    const handleResetFilters = () => {
        setSelectedCountry("");
        setSelectedCity("");
        setMinPrice("");
        setMaxPrice("");
        setMinRating("0");
        setSortBy("default");
    };

    // =========================================
    // COUNTRY CHANGE
    // =========================================

    const handleCountryChange = (
        value: string
    ) => {
        setSelectedCountry(value);

        if (!value) {
            setSelectedCity("");
            return;
        }

        const firstCity =
            destinations.find(
                (destination) =>
                    destination.country ===
                    value
            )?.name ?? "";

        setSelectedCity(firstCity);
    };

    return (
        <main>
            <section className="section">
                <div className="container">

                    {/* PAGE TITLE */}

                    <p className="admin-label stays-title-animation">
                        STAYWAY
                    </p>

                    <h1 className="page-title stays-title-animation">
                        {getTranslation(
                            language,
                            "findYourPerfectStay"
                        )}
                    </h1>

                    <p className="admin-description stays-title-animation">
                        Discover comfortable places to stay
                        in your favorite destinations.
                    </p>

                    {destinationName && (
                        <p className="stays-search-result">
                            Search results for:{" "}
                            <strong>
                                {destinationName}
                            </strong>
                        </p>
                    )}

                    {/* FILTERS */}

                    <div className="stays-filters">

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
                                value={selectedCountry}
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
                                            key={country}
                                            value={country}
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
                                value={selectedCity}
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
                                            key={city}
                                            value={city}
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
                                value={minPrice}
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
                                value={maxPrice}
                                onChange={(event) =>
                                    setMaxPrice(
                                        event.target.value
                                    )
                                }
                            />
                        </div>

                        {/* RATING */}

                        <div className="filter-group">
                            <label htmlFor="rating">
                                {getFilterTranslation(
                                    language,
                                    "minimumRating"
                                )}
                            </label>

                            <select
                                id="rating"
                                value={minRating}
                                onChange={(event) =>
                                    setMinRating(
                                        event.target.value
                                    )
                                }
                            >
                                <option value="0">
                                    {getFilterTranslation(
                                        language,
                                        "anyRating"
                                    )}
                                </option>

                                <option value="3">
                                    3+
                                </option>

                                <option value="4">
                                    4+
                                </option>

                                <option value="4.5">
                                    4.5+
                                </option>

                                <option value="4.8">
                                    4.8+
                                </option>
                            </select>
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
                                value={sortBy}
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

                                <option value="rating-high">
                                    {getFilterTranslation(
                                        language,
                                        "ratingHigh"
                                    )}
                                </option>

                                <option value="rating-low">
                                    {getFilterTranslation(
                                        language,
                                        "ratingLow"
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

                    <p className="stays-results-count">
                        {filteredProperties.length}{" "}
                        {filteredProperties.length === 1
                            ? "stay"
                            : "stays"}{" "}
                        found
                    </p>

                    {filteredProperties.length > 0 ? (
                        <div className="property-grid">
                            {filteredProperties.map(
                                (
                                    property,
                                    index
                                ) => (
                                    <div
                                        className="stay-card-animation"
                                        style={{
                                            animationDelay: `${
    index * 0.08
}s`,
                                        }}
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
                        <div className="no-stays">
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

export default function StaysPage() {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <StaysContent />
        </Suspense>
    );
}
