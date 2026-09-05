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
    destinations,
} from "../../data/mockData";

import { useUser } from "../../context/UserContext";

import { useSettings } from "../../context/SettingsContext";
import { currencyInfo } from "../../data/currency";

import {
    Booking,
    Property,
} from "../../types/types";

import {
    createProperty,
    deleteProperty,
    getProperties,
    updateProperty,
} from "../../services/propertyService";

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

    const [isPropertyFormOpen, setIsPropertyFormOpen] =
        useState(false);

    const [editingPropertyId, setEditingPropertyId] =
        useState<number | null>(null);

    const [propertyName, setPropertyName] =
        useState("");

    const [propertyCountry, setPropertyCountry] =
        useState("France");

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
    // CITIES FOR SELECTED COUNTRY
    // =========================================

    const availableCities = useMemo(() => {
        return destinations
            .filter(
                (destination) =>
                    destination.country ===
                    propertyCountry
            )
            .sort((a, b) =>
                a.name.localeCompare(b.name)
            );
    }, [propertyCountry]);

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
    }, []);

    // =========================================
    // RESET FORM
    // =========================================

    const resetPropertyForm = () => {
        setPropertyName("");
        setPropertyCountry("France");
        setPropertyDestinationId("1");
        setPropertyAddress("");
        setPropertyRating("");
        setPropertyPrice("");
        setPropertyImage("");
        setPropertyError("");
        setEditingPropertyId(null);
    };

    // =========================================
    // COUNTRY CHANGE
    // =========================================

    const handleCountryChange = (
        value: string
    ) => {
        setPropertyCountry(value);

        const firstCity =
            destinations.find(
                (destination) =>
                    destination.country ===
                    value
            );

        if (firstCity) {
            setPropertyDestinationId(
                String(firstCity.id)
            );
        } else {
            setPropertyDestinationId("");
        }
    };

    // =========================================
    // CITY CHANGE
    // =========================================

    const handleCityChange = (
        value: string
    ) => {
        setPropertyDestinationId(value);
    };

    // =========================================
    // SUBMIT PROPERTY
    // =========================================

    const handlePropertySubmit = (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setPropertyError("");

        if (
            !propertyName.trim() ||
            !propertyCountry ||
            !propertyDestinationId ||
            !propertyAddress.trim() ||
            !propertyRating ||
            !propertyPrice ||
            !propertyImage.trim()
        ) {
            setPropertyError(
                "Please complete all fields."
            );
            return;
        }

        const selectedDestination =
            destinations.find(
                (destination) =>
                    destination.id ===
                    Number(
                        propertyDestinationId
                    )
            );

        if (
            !selectedDestination ||
            selectedDestination.country !==
            propertyCountry
        ) {
            setPropertyError(
                "Please select a valid city for the selected country."
            );
            return;
        }

        const rating =
            Number(propertyRating);

        const price =
            Number(propertyPrice);

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

        if (
            Number.isNaN(price) ||
            price <= 0
        ) {
            setPropertyError(
                "Price must be greater than 0."
            );
            return;
        }

        const propertyData = {
            name: propertyName.trim(),

            destinationId:
                Number(
                    propertyDestinationId
                ),

            address:
                propertyAddress.trim(),

            rating,

            pricePerNight:
            price,

            image:
                propertyImage.trim(),
        };

        if (
            editingPropertyId !== null
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

        setAllProperties(
            getProperties()
        );

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
            destinations.find(
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

        setPropertyCountry(
            destination?.country ??
            "France"
        );

        setPropertyDestinationId(
            String(
                property.destinationId
            )
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
                                Bookings
                            </span>

                            <strong>
                                {
                                    allBookings.length
                                }
                            </strong>
                        </div>

                        <div className="admin-stat-card">
                            <span>
                                Admins
                            </span>

                            <strong>
                                {
                                    adminUsers.length
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
                                                propertyDestinationId
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                handleCityChange(
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                        >
                                            {availableCities.map(
                                                (
                                                    city
                                                ) => (
                                                    <option
                                                        key={
                                                            city.id
                                                        }
                                                        value={
                                                            city.id
                                                        }
                                                    >
                                                        {
                                                            city.name
                                                        }
                                                    </option>
                                                )
                                            )}
                                        </select>
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

                            {allProperties.length ===
                            0 ? (
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
                            ) : (
                                allProperties.map(
                                    (
                                        property
                                    ) => {
                                        const destination =
                                            destinations.find(
                                                (
                                                    item
                                                ) =>
                                                    item.id ===
                                                    property.destinationId
                                            );

                                        return (
                                            <div
                                                className="admin-table-row"
                                                key={
                                                    property.id
                                                }
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
                                                    {formatPrice(property.pricePerNight)}{" "}
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

                            {users.map(
                                (user) => (
                                    <div
                                        className="admin-table-row"
                                        key={
                                            user.id
                                        }
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

                            {allBookings.map(
                                (
                                    booking
                                ) => {

                                    const user =
                                        users.find(
                                            (
                                                item
                                            ) =>
                                                item.id ===
                                                booking.userId
                                        );

                                    const property =
                                        allProperties.find(
                                            (
                                                item
                                            ) =>
                                                item.id ===
                                                booking.propertyId
                                        );

                                    return (
                                        <div
                                            className="admin-table-row"
                                            key={
                                                booking.id
                                            }
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
                                                {new Date(booking.checkIn).toLocaleDateString(
                                                    "ro-RO"
                                                )}{" "}
                                                →{" "}
                                                {new Date(booking.checkOut).toLocaleDateString(
                                                    "ro-RO"
                                                )}
                                            </span>

                                            <span>
                                                {formatPrice(booking.totalPrice)}
                                            </span>

                                            <span className="status-badge">
                                                {
                                                    booking.status
                                                }
                                            </span>

                                        </div>
                                    );
                                }
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
