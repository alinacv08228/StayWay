"use client";

import {
    FormEvent,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    bookings as mockBookings,
    properties,
    users,
    destinations as mockDestinations,
} from "../../data/mockData";

import { useUser } from "../../context/UserContext";

import { useSettings } from "../../context/SettingsContext";
import { currencyInfo } from "../../data/currency";

import {
    Booking,
    Property,
    Destination,
    Room,
} from "../../types/types";

import {
    createProperty,
    deleteProperty,
    getProperties,
    updateProperty,
} from "../../services/propertyService";

import {
    createDestination,
    getDestinations,
    updateDestination,
} from "../../services/destinationService";

import {
    createRoom,
    deleteRoom,
    getRoomsByPropertyId,
    updateRoom,
} from "../../services/roomService";

export default function AdminPage() {
    const { currentUser } = useUser();

    const { currency } = useSettings();

    const selectedCurrency =
        currencyInfo[currency] ??
        currencyInfo["Euro"];

    const formatPrice = (price: number) => {
        const convertedPrice =
            price * selectedCurrency.rate;

        return `${selectedCurrency.symbol}${Math.round(
            convertedPrice
        ).toLocaleString()}`;
    };

    const [allBookings, setAllBookings] =
        useState<Booking[]>([]);

    const [allProperties, setAllProperties] =
        useState<Property[]>(properties);

    const [allDestinations, setAllDestinations] =
        useState<Destination[]>(mockDestinations);

    const [isPropertyFormOpen, setIsPropertyFormOpen] =
        useState(false);

    const [editingPropertyId, setEditingPropertyId] =
        useState<number | null>(null);

    const [propertyName, setPropertyName] =
        useState("");

    const [propertyDescription, setPropertyDescription] =
        useState("");

    const [propertyCountry, setPropertyCountry] =
        useState("France");

    const [propertyCity, setPropertyCity] =
        useState("");

    const [isNewCity, setIsNewCity] =
        useState(false);

    const [newCityName, setNewCityName] =
        useState("");

    const [cityImage, setCityImage] =
        useState("");

    const [countryImage, setCountryImage] =
        useState("");

    const [propertyDestinationId, setPropertyDestinationId] =
        useState("1");

    const [propertyAddress, setPropertyAddress] =
        useState("");

    const [propertyRating, setPropertyRating] =
        useState("");

    const [propertyPrice, setPropertyPrice] =
        useState("");

    const [propertyImage, setPropertyImage] =
        useState("");

    const [propertyError, setPropertyError] =
        useState("");

    // =========================================
    // PROPERTY SEARCH / FILTER / SORT
    // =========================================

    const [propertySearch, setPropertySearch] =
        useState("");

    const [propertyDestinationFilter, setPropertyDestinationFilter] =
        useState("All");

    const [propertySort, setPropertySort] =
        useState("default");

    // =========================================
    // USER SEARCH / FILTER
    // =========================================

    const [userSearch, setUserSearch] =
        useState("");

    const [userRoleFilter, setUserRoleFilter] =
        useState("All");

    // =========================================
    // BOOKING SEARCH / FILTER / SORT
    // =========================================

    const [bookingSearch, setBookingSearch] =
        useState("");

    const [bookingStatusFilter, setBookingStatusFilter] =
        useState("All");

    const [bookingSort, setBookingSort] =
        useState("newest");

    // =========================================
    // COUNTRIES
    // =========================================

    const countries = useMemo(() => {
        return Array.from(
            new Set(
                allDestinations.map(
                    (destination) =>
                        destination.country
                )
            )
        ).sort();
    }, [allDestinations]);

    // =========================================
    // CITIES FOR SELECTED COUNTRY
    // =========================================

    const availableCities = useMemo(() => {
        return allDestinations
            .filter(
                (destination) =>
                    destination.country ===
                    propertyCountry
            )
            .sort((a, b) =>
                a.name.localeCompare(b.name)
            );
    }, [propertyCountry, allDestinations]);

    // =========================================
    // FILTERED / SORTED PROPERTIES
    // =========================================

    const filteredProperties = useMemo(() => {
        const search =
            propertySearch.trim().toLowerCase();

        const result = allProperties.filter(
            (property) => {
                const destination =
                    allDestinations.find(
                        (item) =>
                            item.id ===
                            property.destinationId
                    );

                const destinationName =
                    destination?.name ?? "";

                const matchesSearch =
                    property.name
                        .toLowerCase()
                        .includes(search) ||
                    property.address
                        .toLowerCase()
                        .includes(search) ||
                    destinationName
                        .toLowerCase()
                        .includes(search);

                const matchesDestination =
                    propertyDestinationFilter ===
                    "All" ||
                    destinationName ===
                    propertyDestinationFilter;

                return (
                    matchesSearch &&
                    matchesDestination
                );
            }
        );

        return [...result].sort((a, b) => {
            switch (propertySort) {
                case "priceAsc":
                    return (
                        a.pricePerNight -
                        b.pricePerNight
                    );

                case "priceDesc":
                    return (
                        b.pricePerNight -
                        a.pricePerNight
                    );

                case "ratingDesc":
                    return b.rating - a.rating;

                case "nameAsc":
                    return a.name.localeCompare(
                        b.name
                    );

                default:
                    return 0;
            }
        });
    }, [
        allProperties,
        propertySearch,
        propertyDestinationFilter,
        propertySort,
    ]);

    // =========================================
    // FILTERED USERS
    // =========================================

    const filteredUsers = useMemo(() => {
        const search =
            userSearch.trim().toLowerCase();

        return users.filter((user) => {
            const matchesSearch =
                user.name
                    .toLowerCase()
                    .includes(search) ||
                user.email
                    .toLowerCase()
                    .includes(search);

            const matchesRole =
                userRoleFilter === "All" ||
                user.role === userRoleFilter;

            return (
                matchesSearch &&
                matchesRole
            );
        });
    }, [userSearch, userRoleFilter]);

    // =========================================
    // FILTERED / SORTED BOOKINGS
    // =========================================

    const filteredBookings = useMemo(() => {
        const search =
            bookingSearch.trim().toLowerCase();

        const result = allBookings.filter(
            (booking) => {
                const property =
                    allProperties.find(
                        (item) =>
                            item.id ===
                            booking.propertyId
                    );

                const user =
                    users.find(
                        (item) =>
                            item.id ===
                            booking.userId
                    );

                const propertyName =
                    property?.name
                        .toLowerCase() ?? "";

                const userName =
                    user?.name
                        .toLowerCase() ?? "";

                const status =
                    booking.status.toLowerCase();

                const matchesSearch =
                    propertyName.includes(search) ||
                    userName.includes(search) ||
                    status.includes(search);

                const matchesStatus =
                    bookingStatusFilter ===
                    "All" ||
                    booking.status ===
                    bookingStatusFilter;

                return (
                    matchesSearch &&
                    matchesStatus
                );
            }
        );

        return [...result].sort((a, b) => {
            switch (bookingSort) {
                case "oldest":
                    return (
                        new Date(a.checkIn).getTime() -
                        new Date(b.checkIn).getTime()
                    );

                case "totalDesc":
                    return (
                        b.totalPrice -
                        a.totalPrice
                    );

                case "totalAsc":
                    return (
                        a.totalPrice -
                        b.totalPrice
                    );

                default:
                    return (
                        new Date(b.checkIn).getTime() -
                        new Date(a.checkIn).getTime()
                    );
            }
        });
    }, [
        allBookings,
        allProperties,
        bookingSearch,
        bookingStatusFilter,
        bookingSort,
    ]);

    // =========================================
    // DASHBOARD STATISTICS
    // =========================================

    const confirmedBookingsCount = useMemo(() => {
        return allBookings.filter(
            (booking) =>
                booking.status === "confirmed"
        ).length;
    }, [allBookings]);

    const confirmedRevenue = useMemo(() => {
        return allBookings
            .filter(
                (booking) =>
                    booking.status === "confirmed"
            )
            .reduce(
                (total, booking) =>
                    total + booking.totalPrice,
                0
            );
    }, [allBookings]);

    // =========================================
    // LOAD DATA
    // =========================================

    useEffect(() => {
        const savedBookings =
            localStorage.getItem(
                "stayway_bookings"
            );

        if (savedBookings) {
            try {
                const parsedBookings =
                    JSON.parse(
                        savedBookings
                    ) as Booking[];

                /*
                 * Păstrăm rezervările existente
                 * din localStorage.
                 *
                 * Adăugăm și rezervările mock
                 * care lipsesc, dar fără duplicate.
                 *
                 * Dacă aceeași rezervare există
                 * în ambele locuri, versiunea din
                 * localStorage are prioritate.
                 */
                const existingIds =
                    new Set(
                        parsedBookings.map(
                            (booking) =>
                                booking.id
                        )
                    );

                const missingMockBookings =
                    mockBookings.filter(
                        (booking) =>
                            !existingIds.has(
                                booking.id
                            )
                    );

                const mergedBookings =
                    [
                        ...missingMockBookings,
                        ...parsedBookings,
                    ];

                localStorage.setItem(
                    "stayway_bookings",
                    JSON.stringify(
                        mergedBookings
                    )
                );

                setAllBookings(
                    mergedBookings
                );
            } catch {
                const initialBookings =
                    mockBookings as Booking[];

                localStorage.setItem(
                    "stayway_bookings",
                    JSON.stringify(
                        initialBookings
                    )
                );

                setAllBookings(
                    initialBookings
                );
            }
        } else {
            /*
             * Prima utilizare:
             * salvăm rezervările mock în
             * localStorage.
             */
            const initialBookings =
                mockBookings as Booking[];

            localStorage.setItem(
                "stayway_bookings",
                JSON.stringify(
                    initialBookings
                )
            );

            setAllBookings(
                initialBookings
            );
        }

        setAllProperties(
            getProperties()
        );

        setAllDestinations(
            getDestinations()
        );
    }, []);

    // =========================================
    // RESET FORM
    // =========================================

    const resetPropertyForm = () => {
        setPropertyName("");

        setPropertyDescription("");
        
        setPropertyCountry(
            "France"
        );

        setPropertyDestinationId(
            "1"
        );

        setPropertyCity(
            "Paris"
        );

        setIsNewCity(false);

        setNewCityName("");

        setCityImage("");

        setCountryImage("");

        setPropertyAddress("");

        setPropertyRating("");

        setPropertyPrice("");

        setPropertyImage("");

        setPropertyError("");

        setEditingPropertyId(
            null
        );
    };

    // =========================================
    // COUNTRY CHANGE
    // =========================================

    const handleCountryChange = (
        value: string
    ) => {
        setPropertyCountry(
            value
        );

        setIsNewCity(false);

        setNewCityName("");

        setCityImage("");

        const allDestinations =
            getDestinations();

        const firstCity =
            allDestinations.find(
                (destination) =>
                    destination.country ===
                    value
            );

        if (firstCity) {
            setPropertyDestinationId(
                String(firstCity.id)
            );

            setPropertyCity(
                firstCity.name
            );

            setCityImage(
                firstCity.image
            );

            setCountryImage(
                firstCity.countryImage
            );
        } else {
            setPropertyDestinationId(
                ""
            );

            setPropertyCity(
                ""
            );
        }
    };

    // =========================================
    // CITY CHANGE
    // =========================================

    const handleCityChange = (
        value: string
    ) => {
        if (value === "__new__") {
            setIsNewCity(true);

            setPropertyDestinationId(
                ""
            );

            setPropertyCity("");

            setNewCityName("");

            setCityImage("");

            return;
        }

        setIsNewCity(false);

        setPropertyDestinationId(
            value
        );

        const destination =
            getDestinations().find(
                (item) =>
                    item.id ===
                    Number(value)
            );

        if (destination) {
            setPropertyCity(
                destination.name
            );

            setCityImage(
                destination.image
            );

            setCountryImage(
                destination.countryImage
            );
        }
    };

    // =========================================
    // SUBMIT PROPERTY
    // =========================================

    const handlePropertySubmit = (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setPropertyError("");

        /*
         * VALIDARE PROPERTY
         */
        if (
            !propertyName.trim() ||
            !propertyCountry ||
            !propertyAddress.trim() ||
            !propertyRating ||
            !propertyPrice ||
            !propertyImage.trim()
        ) {
            setPropertyError(
                "Please complete all property fields."
            );

            return;
        }

        /*
         * VALIDARE CITY
         */
        if (
            isNewCity &&
            !newCityName.trim()
        ) {
            setPropertyError(
                "Please enter the new city name."
            );

            return;
        }

        if (
            isNewCity &&
            !cityImage.trim()
        ) {
            setPropertyError(
                "Please enter an image for the new city."
            );

            return;
        }

        /*
         * COUNTRY IMAGE
         */
        if (
            !countryImage.trim()
        ) {
            setPropertyError(
                "Please enter an image for the country."
            );

            return;
        }

        /*
         * RATING
         */
        const rating =
            Number(
                propertyRating
            );

        if (
            Number.isNaN(rating) ||
            rating < 1 ||
            rating > 10
        ) {
            setPropertyError(
                "Rating must be a number between 1 and 10."
            );

            return;
        }

        /*
         * PRICE
         */
        const price =
            Number(
                propertyPrice
            );

        if (
            Number.isNaN(price) ||
            price <= 0
        ) {
            setPropertyError(
                "Price must be greater than 0."
            );

            return;
        }

        /*
         * DESTINATION
         */
        let destinationId =
            Number(
                propertyDestinationId
            );

        /*
         * NEW CITY
         */
        if (isNewCity) {
            const cityName =
                newCityName.trim();

            const existingDestination =
                getDestinations().find(
                    (destination) =>
                        destination.country
                            .toLowerCase()
                            .trim() ===
                        propertyCountry
                            .toLowerCase()
                            .trim() &&
                        destination.name
                            .toLowerCase()
                            .trim() ===
                        cityName
                            .toLowerCase()
                            .trim()
                );

            if (
                existingDestination
            ) {
                destinationId =
                    existingDestination.id;

                updateDestination({
                    ...existingDestination,
                    image:
                        cityImage.trim(),
                    countryImage:
                        countryImage.trim(),
                });
            } else {
                const newDestination =
                    createDestination({
                        id:
                            Date.now(),
                        name:
                        cityName,
                        country:
                        propertyCountry,
                        image:
                            cityImage.trim(),
                        countryImage:
                            countryImage.trim(),
                    });

                destinationId =
                    newDestination.id;
            }
        } else {
            /*
             * EXISTING CITY
             */
            if (
                Number.isNaN(
                    destinationId
                )
            ) {
                setPropertyError(
                    "Please select a valid city."
                );

                return;
            }

            const existingDestination =
                getDestinations().find(
                    (destination) =>
                        destination.id ===
                        destinationId
                );

            if (
                !existingDestination
            ) {
                setPropertyError(
                    "Please select a valid city."
                );

                return;
            }

            /*
             * Actualizăm imaginile
             * orașului și țării dacă
             * Admin-ul a modificat
             * aceste valori.
             */
            updateDestination({
                ...existingDestination,
                image:
                    cityImage.trim() ||
                    existingDestination.image,
                countryImage:
                    countryImage.trim() ||
                    existingDestination.countryImage,
            });
        }

        /*
         * PROPERTY DATA
         */

        const propertyData = {
            name: propertyName.trim(),

            description: propertyDescription.trim(),

            destinationId,

            address: propertyAddress.trim(),

            rating,

            pricePerNight: price,

            image: propertyImage.trim(),
        };

        /*
         * CREATE / UPDATE
         */
        if (
            editingPropertyId !==
            null
        ) {
            updateProperty(
                editingPropertyId,
                propertyData
            );
        } else {
            createProperty(
                propertyData
            );
        }

        /*
         * REFRESH
         */
        setAllProperties(
            getProperties()
        );

        setAllDestinations(
            getDestinations()
        );

        /*
         * RESET
         */
        resetPropertyForm();

        setIsPropertyFormOpen(
            false
        );
    };

    // =========================================
    // EDIT
    // =========================================

    const handleEditProperty = (
        property: Property
    ) => {
        const destination =
            allDestinations.find(
                (item) =>
                    item.id ===
                    property.destinationId
            );

        setEditingPropertyId(
            property.id
        );

        setPropertyName(
            property.name
        );

        setPropertyDescription(
            property.description ?? ""
        );

        setPropertyCountry(
            destination?.country ??
            "France"
        );

        setPropertyDestinationId(
            String(
                property.destinationId
            )
        );

        setPropertyCity(
            destination?.name ?? ""
        );

        setIsNewCity(false);

        setNewCityName("");

        setCityImage(
            destination?.image ?? ""
        );

        setCountryImage(
            destination?.countryImage ?? ""
        );

        setPropertyAddress(
            property.address
        );

        setPropertyRating(
            String(property.rating)
        );

        setPropertyPrice(
            String(
                property.pricePerNight
            )
        );

        setPropertyImage(
            property.image
        );

        setPropertyError("");

        setIsPropertyFormOpen(
            true
        );
    };

    // =========================================
    // DELETE
    // =========================================

    const handleDeleteProperty = (
        property: Property
    ) => {
        const confirmed =
            window.confirm(
                `Are you sure you want to delete "${property.name}"?`
            );

        if (!confirmed) {
            return;
        }

        deleteProperty(
            property.id
        );

        setAllProperties(
            getProperties()
        );
    };

    // =========================================
    // ACCESS CONTROL
    // =========================================

    if (!currentUser) {
        return (
            <main>
                <section className="section">
                    <div className="container">
                        <div className="error-page-card">
                            <p className="admin-label">
                                ERROR 401
                            </p>

                            <h1>
                                Unauthorized
                            </h1>

                            <p>
                                You need to log in
                                to access the
                                admin dashboard.
                            </p>

                            <a
                                href="/login"
                                className="button"
                            >
                                Log in
                            </a>
                        </div>
                    </div>
                </section>
            </main>
        );
    }

    if (
        currentUser.role !==
        "admin"
    ) {
        return (
            <main>
                <section className="section">
                    <div className="container">
                        <div className="error-page-card">
                            <p className="admin-label">
                                ERROR 403
                            </p>

                            <h1>
                                Access denied
                            </h1>

                            <p>
                                You do not have
                                permission to
                                access the admin
                                dashboard.
                            </p>

                            <a
                                href="/"
                                className="button"
                            >
                                Back to home
                            </a>
                        </div>
                    </div>
                </section>
            </main>
        );
    }

    // =========================================
    // ADMIN USERS
    // =========================================

    const adminUsers =
        users.filter(
            (user) =>
                user.role ===
                "admin"
        );

    // =========================================
    // RENDER
    // =========================================

    return (
        <main>
            <section className="section">
                <div className="container admin-page">

                    {/* HEADER */}

                    <div className="admin-header">
                        <p className="admin-label">
                            ADMIN PANEL
                        </p>

                        <h1>
                            Admin Dashboard
                        </h1>

                        <p className="admin-description">
                            Manage users, stays and
                            bookings on StayWay.
                        </p>
                    </div>

                    {/* STATISTICS */}

                    <div className="admin-stats">

                        <div className="admin-stat-card">
                            <span>
                                Properties
                            </span>

                            <strong>
                                {
                                    allProperties.length
                                }
                            </strong>
                        </div>

                        <div className="admin-stat-card">
                            <span>
                                Users
                            </span>

                            <strong>
                                {users.length}
                            </strong>
                        </div>

                        <div className="admin-stat-card">
                            <span>
                                Confirmed bookings
                            </span>

                            <strong>
                                {
                                    confirmedBookingsCount
                                }
                            </strong>
                        </div>

                        <div className="admin-stat-card">
                            <span>
                                Revenue
                            </span>

                            <strong>
                                {
                                    formatPrice(
                                        confirmedRevenue
                                    )
                                }
                            </strong>
                        </div>

                    </div>

                    {/* PROPERTIES */}

                    <section className="admin-section">

                        <div className="admin-section-header">

                            <div>
                                <h2>
                                    Properties
                                </h2>

                                <p>
                                    Manage available
                                    stays.
                                </p>
                            </div>

                            <button
                                type="button"
                                className="admin-action-button"
                                onClick={() => {
                                    resetPropertyForm();

                                    setIsPropertyFormOpen(
                                        true
                                    );
                                }}
                            >
                                + Add property
                            </button>

                        </div>

                        {/* PROPERTY FORM */}

                        {isPropertyFormOpen && (
                            <form
                                className="admin-property-form"
                                onSubmit={
                                    handlePropertySubmit
                                }
                            >

                                <h3>
                                    {
                                        editingPropertyId !==
                                        null
                                            ? "Edit property"
                                            : "Add property"
                                    }
                                </h3>

                                {propertyError && (
                                    <p className="form-error">
                                        {
                                            propertyError
                                        }
                                    </p>
                                )}

                                <div className="admin-form-grid">

                                    {/* PROPERTY NAME */}

                                    <div className="form-group">
                                        <label htmlFor="propertyName">
                                            Property name
                                        </label>

                                        <input
                                            id="propertyName"
                                            type="text"
                                            value={
                                                propertyName
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                setPropertyName(
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            placeholder="Hotel name"
                                        />
                                    </div>

                                    {/* PROPERTY DESCRIPTION */}

                                    <div className="form-group form-group-full">
                                        <label htmlFor="propertyDescription">
                                            Property description
                                        </label>

                                        <textarea
                                            id="propertyDescription"
                                            value={propertyDescription}
                                            onChange={(event) =>
                                                setPropertyDescription(
                                                    event.target.value
                                                )
                                            }
                                            placeholder="Write the description that guests will see on the property page..."
                                            rows={5}
                                        />
                                    </div>

                                    {/* COUNTRY */}

                                    <div className="form-group">
                                        <label htmlFor="propertyCountry">
                                            Country
                                        </label>

                                        <select
                                            id="propertyCountry"
                                            value={
                                                propertyCountry
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                handleCountryChange(
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                        >
                                            {countries.map(
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

                                    {/* CITY */}

                                    <div className="form-group">
                                        <label htmlFor="propertyCity">
                                            City
                                        </label>

                                        <select
                                            id="propertyCity"
                                            value={
                                                isNewCity
                                                    ? "__new__"
                                                    : propertyDestinationId
                                            }
                                            onChange={(event) =>
                                                handleCityChange(
                                                    event.target.value
                                                )
                                            }
                                        >
                                            {availableCities.map(
                                                (city) => (
                                                    <option
                                                        key={city.id}
                                                        value={city.id}
                                                    >
                                                        {city.name}
                                                    </option>
                                                )
                                            )}

                                            <option value="__new__">
                                                + Add new city
                                            </option>
                                        </select>
                                    </div>

                                    {isNewCity && (
                                        <div className="form-group">
                                            <label htmlFor="newCityName">
                                                New city name
                                            </label>

                                            <input
                                                id="newCityName"
                                                type="text"
                                                value={newCityName}
                                                onChange={(event) =>
                                                    setNewCityName(
                                                        event.target.value
                                                    )
                                                }
                                                placeholder="City name"
                                            />
                                        </div>
                                    )}

                                    {/* CITY IMAGE */}

                                    <div className="form-group">
                                        <label htmlFor="cityImage">
                                            City image
                                        </label>

                                        <input
                                            id="cityImage"
                                            type="text"
                                            value={cityImage}
                                            onChange={(event) =>
                                                setCityImage(
                                                    event.target.value
                                                )
                                            }
                                            placeholder="/city-image.jpg"
                                        />
                                    </div>

                                    {/* COUNTRY IMAGE */}

                                    <div className="form-group">
                                        <label htmlFor="countryImage">
                                            Country image
                                        </label>

                                        <input
                                            id="countryImage"
                                            type="text"
                                            value={countryImage}
                                            onChange={(event) =>
                                                setCountryImage(
                                                    event.target.value
                                                )
                                            }
                                            placeholder="/country-image.jpg"
                                        />
                                    </div>

                                    {/* ADDRESS */}

                                    <div className="form-group">
                                        <label htmlFor="propertyAddress">
                                            Address
                                        </label>

                                        <input
                                            id="propertyAddress"
                                            type="text"
                                            value={
                                                propertyAddress
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                setPropertyAddress(
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            placeholder="Property address"
                                        />
                                    </div>

                                    {/* RATING */}

                                    <div className="form-group">
                                        <label htmlFor="propertyRating">
                                            Rating
                                        </label>

                                        <input
                                            id="propertyRating"
                                            type="number"
                                            min="1"
                                            max="10"
                                            step="0.1"
                                            value={
                                                propertyRating
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                setPropertyRating(
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            placeholder="1 - 10"
                                        />
                                    </div>

                                    {/* PRICE */}

                                    <div className="form-group">
                                        <label htmlFor="propertyPrice">
                                            Price per night
                                        </label>

                                        <input
                                            id="propertyPrice"
                                            type="number"
                                            min="1"
                                            value={
                                                propertyPrice
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                setPropertyPrice(
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            placeholder="Price in EUR"
                                        />
                                    </div>

                                    {/* IMAGE */}

                                    <div className="form-group">
                                        <label htmlFor="propertyImage">
                                            Image path
                                        </label>

                                        <input
                                            id="propertyImage"
                                            type="text"
                                            value={
                                                propertyImage
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                setPropertyImage(
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            placeholder="/hotel-example.jpg"
                                        />
                                    </div>

                                </div>

                                <div className="admin-form-actions">

                                    <button
                                        type="submit"
                                        className="admin-save-button"
                                    >
                                        {
                                            editingPropertyId !==
                                            null
                                                ? "Save changes"
                                                : "Add property"
                                        }
                                    </button>

                                    <button
                                        type="button"
                                        className="admin-cancel-button"
                                        onClick={() => {
                                            resetPropertyForm();

                                            setIsPropertyFormOpen(
                                                false
                                            );
                                        }}
                                    >
                                        Cancel
                                    </button>

                                </div>

                            </form>
                        )}

                        {/* PROPERTY SEARCH / FILTER / SORT */}

                        <div className="admin-property-filters">

                            <input
                                type="text"
                                placeholder="Search properties..."
                                value={propertySearch}
                                onChange={(event) =>
                                    setPropertySearch(
                                        event.target.value
                                    )
                                }
                            />

                            <select
                                value={
                                    propertyDestinationFilter
                                }
                                onChange={(event) =>
                                    setPropertyDestinationFilter(
                                        event.target.value
                                    )
                                }
                            >
                                <option value="All">
                                    All destinations
                                </option>

                                {allDestinations.map(
                                    (destination) => (
                                        <option
                                            key={
                                                destination.id
                                            }
                                            value={
                                                destination.name
                                            }
                                        >
                                            {
                                                destination.name
                                            }
                                        </option>
                                    )
                                )}
                            </select>

                            <select
                                value={propertySort}
                                onChange={(event) =>
                                    setPropertySort(
                                        event.target.value
                                    )
                                }
                            >
                                <option value="default">
                                    Sort by
                                </option>

                                <option value="priceAsc">
                                    Price: Low to High
                                </option>

                                <option value="priceDesc">
                                    Price: High to Low
                                </option>

                                <option value="ratingDesc">
                                    Rating: High to Low
                                </option>

                                <option value="nameAsc">
                                    Name: A–Z
                                </option>
                            </select>

                        </div>

                        {/* PROPERTY TABLE */}

                        <div className="admin-table">

                            <div className="admin-table-header">

                                <span>
                                    Name
                                </span>

                                <span>
                                    Location
                                </span>

                                <span>
                                    Rating
                                </span>

                                <span>
                                    Price
                                </span>

                                <span>
                                    Actions
                                </span>

                            </div>

                            {allProperties.length === 0 ? (
                                <div className="admin-empty-state">

                                    <p>
                                        No properties
                                        available.
                                    </p>

                                    <button
                                        type="button"
                                        className="admin-action-button"
                                        onClick={() => {
                                            resetPropertyForm();

                                            setIsPropertyFormOpen(
                                                true
                                            );
                                        }}
                                    >
                                        Add first property
                                    </button>

                                </div>
                            ) : filteredProperties.length === 0 ? (
                                <div className="admin-empty-state">

                                    <p>
                                        No properties found.
                                    </p>

                                    <button
                                        type="button"
                                        className="admin-cancel-button"
                                        onClick={() => {
                                            setPropertySearch("");
                                            setPropertyDestinationFilter(
                                                "All"
                                            );
                                            setPropertySort(
                                                "default"
                                            );
                                        }}
                                    >
                                        Clear filters
                                    </button>

                                </div>
                            ) : (
                                filteredProperties.map(
                                    (property) => {
                                        const destination =
                                            allDestinations.find(
                                                (item) =>
                                                    item.id ===
                                                    property.destinationId
                                            );

                                        return (
                                            <div
                                                className="admin-table-row"
                                                key={property.id}
                                            >

                                                <strong>
                                                    {
                                                        property.name
                                                    }
                                                </strong>

                                                <span>
                                                    <strong>
                                                        {
                                                            destination?.name
                                                        }
                                                    </strong>

                                                    <br />

                                                    {
                                                        destination?.country
                                                    }

                                                    <br />

                                                    {
                                                        property.address
                                                    }
                                                </span>

                                                <span>
                                                    ★{" "}
                                                    {
                                                        property.rating
                                                    }
                                                </span>

                                                <span>
                                                    {formatPrice(
                                                        property.pricePerNight
                                                    )}{" "}
                                                    / night
                                                </span>

                                                <div className="admin-row-actions">

                                                    <button
                                                        type="button"
                                                        className="admin-edit-button"
                                                        onClick={() =>
                                                            handleEditProperty(
                                                                property
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="admin-delete-button"
                                                        onClick={() =>
                                                            handleDeleteProperty(
                                                                property
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </button>

                                                </div>

                                            </div>
                                        );
                                    }
                                )
                            )}

                        </div>

                    </section>

                    {/* USERS */}

                    <section className="admin-section">

                        <div className="admin-section-header">

                            <div>
                                <h2>
                                    Users
                                </h2>

                                <p>
                                    Users registered
                                    on StayWay.
                                </p>
                            </div>

                        </div>

                        {/* USER SEARCH / FILTER */}

                        <div className="admin-user-filters">

                            <input
                                type="text"
                                placeholder="Search users..."
                                value={userSearch}
                                onChange={(event) =>
                                    setUserSearch(
                                        event.target.value
                                    )
                                }
                            />

                            <select
                                value={userRoleFilter}
                                onChange={(event) =>
                                    setUserRoleFilter(
                                        event.target.value
                                    )
                                }
                            >
                                <option value="All">
                                    All roles
                                </option>

                                <option value="user">
                                    User
                                </option>

                                <option value="admin">
                                    Admin
                                </option>
                            </select>

                        </div>

                        <div className="admin-table">

                            <div className="admin-table-header">

                                <span>
                                    Name
                                </span>

                                <span>
                                    Email
                                </span>

                                <span>
                                    Role
                                </span>

                            </div>

                            {filteredUsers.length === 0 ? (
                                <div className="admin-empty-state">

                                    <p>
                                        No users found.
                                    </p>

                                    <button
                                        type="button"
                                        className="admin-cancel-button"
                                        onClick={() => {
                                            setUserSearch("");
                                            setUserRoleFilter(
                                                "All"
                                            );
                                        }}
                                    >
                                        Clear filters
                                    </button>

                                </div>
                            ) : (
                                filteredUsers.map(
                                    (user) => (
                                        <div
                                            className="admin-table-row"
                                            key={user.id}
                                        >

                                            <strong>
                                                {
                                                    user.name
                                                }
                                            </strong>

                                            <span>
                                                {
                                                    user.email
                                                }
                                            </span>

                                            <span
                                                className={
                                                    user.role ===
                                                    "admin"
                                                        ? "role-badge role-admin"
                                                        : "role-badge"
                                                }
                                            >
                                                {
                                                    user.role
                                                }
                                            </span>

                                        </div>
                                    )
                                )
                            )}

                        </div>

                    </section>

                    {/* BOOKINGS */}

                    <section className="admin-section">

                        <div className="admin-section-header">

                            <div>
                                <h2>
                                    Bookings
                                </h2>

                                <p>
                                    Recent
                                    reservations.
                                </p>
                            </div>

                        </div>

                        {/* BOOKING SEARCH / FILTER / SORT */}

                        <div className="admin-property-filters">

                            <input
                                type="text"
                                placeholder="Search bookings..."
                                value={bookingSearch}
                                onChange={(event) =>
                                    setBookingSearch(
                                        event.target.value
                                    )
                                }
                            />

                            <select
                                value={bookingStatusFilter}
                                onChange={(event) =>
                                    setBookingStatusFilter(
                                        event.target.value
                                    )
                                }
                            >
                                <option value="All">
                                    All statuses
                                </option>

                                <option value="confirmed">
                                    Confirmed
                                </option>

                                <option value="cancelled">
                                    Cancelled
                                </option>
                            </select>

                            <select
                                value={bookingSort}
                                onChange={(event) =>
                                    setBookingSort(
                                        event.target.value
                                    )
                                }
                            >
                                <option value="newest">
                                    Newest first
                                </option>

                                <option value="oldest">
                                    Oldest first
                                </option>

                                <option value="totalDesc">
                                    Total: High to Low
                                </option>

                                <option value="totalAsc">
                                    Total: Low to High
                                </option>
                            </select>

                        </div>

                        <div className="admin-table">

                            <div className="admin-table-header">

                                <span>
                                    Property
                                </span>

                                <span>
                                    User
                                </span>

                                <span>
                                    Dates
                                </span>

                                <span>
                                    Total
                                </span>

                                <span>
                                    Status
                                </span>

                            </div>

                            {filteredBookings.length === 0 ? (
                                <div className="admin-empty-state">

                                    <p>
                                        No bookings found.
                                    </p>

                                    <button
                                        type="button"
                                        className="admin-cancel-button"
                                        onClick={() => {
                                            setBookingSearch("");
                                            setBookingStatusFilter(
                                                "All"
                                            );
                                            setBookingSort(
                                                "newest"
                                            );
                                        }}
                                    >
                                        Clear filters
                                    </button>

                                </div>
                            ) : (
                                filteredBookings.map(
                                    (booking) => {

                                        const user =
                                            users.find(
                                                (item) =>
                                                    item.id ===
                                                    booking.userId
                                            );

                                        const property =
                                            allProperties.find(
                                                (item) =>
                                                    item.id ===
                                                    booking.propertyId
                                            );

                                        const isConfirmed =
                                            booking.status ===
                                            "confirmed";

                                        return (
                                            <div
                                                className="admin-table-row"
                                                key={booking.id}
                                            >

                                                <strong>
                                                    {
                                                        property?.name
                                                    }
                                                </strong>

                                                <span>
                                                    {
                                                        user?.name
                                                    }
                                                </span>

                                                <span>
                                                    {new Date(
                                                        booking.checkIn
                                                    ).toLocaleDateString(
                                                        "ro-RO"
                                                    )}{" "}
                                                    →{" "}
                                                    {new Date(
                                                        booking.checkOut
                                                    ).toLocaleDateString(
                                                        "ro-RO"
                                                    )}
                                                </span>

                                                <span>
                                                    {formatPrice(
                                                        booking.totalPrice
                                                    )}
                                                </span>

                                                <span
                                                    className="status-badge"
                                                    style={{
                                                        color:
                                                            isConfirmed
                                                                ? "#15803d"
                                                                : "#dc2626",
                                                        backgroundColor:
                                                            isConfirmed
                                                                ? "#eaf7ee"
                                                                : "#fef0f0",
                                                    }}
                                                >
                                                    {
                                                        booking.status
                                                    }
                                                </span>

                                            </div>
                                        );
                                    }
                                )
                            )}

                        </div>

                    </section>

                    {/* CURRENT MOCK USER */}

                    <section className="admin-user-card">

                        <div>

                            <p className="admin-label">
                                CURRENT MOCK USER
                            </p>

                            <h2>
                                {
                                    currentUser.name
                                }
                            </h2>

                            <p>
                                {
                                    currentUser.email
                                }
                            </p>

                        </div>

                        <div className="mock-role">

                            <span>
                                Role
                            </span>

                            <strong>
                                {
                                    currentUser.role
                                }
                            </strong>

                        </div>

                    </section>

                </div>
            </section>
        </main>
    );
}
