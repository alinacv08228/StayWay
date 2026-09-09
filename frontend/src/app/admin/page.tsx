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

import {
    getDestinationUiTranslation,
    getLocalizedCountryName,
    getLocalizedCityName,
} from "../../data/translations";
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
    createRoom,
    deleteRoom,
    getRooms,
    updateRoom,
} from "../../services/roomService";

import {
    createDestination,
    getDestinations,
    updateDestination,
} from "../../services/destinationService";


export default function AdminPage() {
    const { currentUser } = useUser();

    const { currency, language } = useSettings();

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

    const [allRooms, setAllRooms] =
        useState<Room[]>(getRooms());

    const [selectedPropertyId, setSelectedPropertyId] =
        useState<number | null>(null);

    const [isRoomFormOpen, setIsRoomFormOpen] =
        useState(false);

    const [editingRoomId, setEditingRoomId] =
        useState<number | null>(null);

    const [roomName, setRoomName] =
        useState("");

    const [roomDescription, setRoomDescription] =
        useState("");

    const [roomGuests, setRoomGuests] =
        useState("2");

    const [roomSize, setRoomSize] =
        useState("");

    const [roomBed, setRoomBed] =
        useState("");

    const [roomPrice, setRoomPrice] =
        useState("");

    const [roomImage, setRoomImage] =
        useState("");

    const [roomFeatures, setRoomFeatures] =
        useState("");

    const [roomFreeCancellation, setRoomFreeCancellation] =
        useState(true);

    const [roomNoPrepayment, setRoomNoPrepayment] =
        useState(true);

    const [roomError, setRoomError] =
        useState("");

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

    const [cityImage, setCityImage] =
        useState("");

    const [countryImage, setCountryImage] =
        useState("");

    const [propertyDestinationId, setPropertyDestinationId] =
        useState("1");

    const [propertyAddress, setPropertyAddress] =
        useState("");

    const [propertyStars, setPropertyStars] =
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

    const [bookingSearch, setBookingSearch] = useState("");
    const [bookingStatusFilter, setBookingStatusFilter] =
        useState("All");
    const [bookingSort, setBookingSort] = useState("newest");
    const [bookingUserFilter, setBookingUserFilter] =
        useState("All");

    // =========================================
// ADMIN COUNTRIES
// =========================================

    const adminCountries = [
        "France",
        "Italy",
        "Spain",
        "Germany",
        "United Kingdom",
        "Greece",
        "Portugal",
        "Austria",
        "Netherlands",
        "Czech Republic",
    ];

    // =========================================
    // CITIES FOR SELECTED COUNTRY
    // =========================================

    const adminCities: Record<string, string[]> = {
        France: [
            "Paris",
            "Nice",
            "Lyon",
            "Marseille",
        ],

        Italy: [
            "Rome",
            "Milan",
            "Venice",
            "Florence",
        ],

        Spain: [
            "Madrid",
            "Barcelona",
            "Valencia",
            "Seville",
        ],

        Germany: [
            "Berlin",
            "Munich",
            "Hamburg",
            "Frankfurt",
        ],

        "United Kingdom": [
            "London",
            "Edinburgh",
            "Manchester",
            "Liverpool",
        ],

        Greece: [
            "Athens",
            "Thessaloniki",
            "Santorini",
            "Mykonos",
        ],

        Portugal: [
            "Lisbon",
            "Porto",
            "Faro",
            "Braga",
        ],

        Austria: [
            "Vienna",
            "Salzburg",
            "Innsbruck",
            "Graz",
        ],

        Netherlands: [
            "Amsterdam",
            "Rotterdam",
            "The Hague",
            "Utrecht",
        ],

        "Czech Republic": [
            "Prague",
            "Brno",
            "Ostrava",
            "Karlovy Vary",
        ],
    };
    const adminAvailableCities = useMemo(() => {
        const existingDestinations =
            allDestinations.filter(
                (destination) =>
                    destination.country === propertyCountry
            );

        const cities =
            adminCities[propertyCountry] ?? [];

        return cities.map((city) => {
            const existingDestination =
                existingDestinations.find(
                    (destination) =>
                        destination.name
                            .toLowerCase()
                            .trim() ===
                        city
                            .toLowerCase()
                            .trim()
                );

            if (existingDestination) {
                return {
                    id: existingDestination.id,
                    name: existingDestination.name,
                };
            }

            const cityIndex = Object.values(adminCities)
                .flat()
                .indexOf(city);

            return {
                id: -(cityIndex + 1),
                name: city,
            };
        });
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

        let result = allBookings.filter((booking) => {
            const property = allProperties.find(
                (item) => item.id === booking.propertyId
            );

            const user = users.find(
                (item) => item.id === booking.userId
            );

            const propertyName =
                property?.name.toLowerCase() ?? "";

            const userName =
                user?.name.toLowerCase() ?? "";

            const checkIn =
                booking.checkIn.toLowerCase();

            const checkOut =
                booking.checkOut.toLowerCase();

            const status =
                booking.status.toLowerCase();

            const matchesSearch =
                !search ||
                propertyName.includes(search) ||
                userName.includes(search) ||
                checkIn.includes(search) ||
                checkOut.includes(search) ||
                status.includes(search);

            const matchesUser =
                bookingUserFilter === "All" ||
                booking.userId === Number(bookingUserFilter);

            const matchesStatus =
                bookingStatusFilter === "All" ||
                booking.status === bookingStatusFilter;

            return (
                matchesSearch &&
                matchesUser &&
                matchesStatus
            );
        });

        result = [...result].sort((a, b) => {
            if (bookingSort === "oldest") {
                return (
                    new Date(a.checkIn).getTime() -
                    new Date(b.checkIn).getTime()
                );
            }

            if (bookingSort === "totalDesc") {
                return b.totalPrice - a.totalPrice;
            }

            if (bookingSort === "totalAsc") {
                return a.totalPrice - b.totalPrice;
            }

            return (
                new Date(b.checkIn).getTime() -
                new Date(a.checkIn).getTime()
            );
        });

        return result;
    }, [
        allBookings,
        allProperties,
        users,
        currentUser,
        bookingSearch,
        bookingStatusFilter,
        bookingSort,
        bookingUserFilter,
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


        setCityImage("");

        setCountryImage("");

        setPropertyAddress("");

        setPropertyStars("");

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

    const handleCountryChange = (value: string) => {
        setPropertyError("");
        setPropertyCountry(value);

        setCityImage("");
        setCountryImage("");

        const destinations = getDestinations();

        // Căutăm dacă primul oraș din catalogul Admin
        // există deja în destinations.
        const firstAdminCity = adminCities[value]?.[0];

        if (!firstAdminCity) {
            setPropertyDestinationId("");
            setPropertyCity("");
            return;
        }

        const existingDestination = destinations.find(
            (destination) =>
                destination.country === value &&
                destination.name.toLowerCase().trim() ===
                firstAdminCity.toLowerCase().trim()
        );

        // Dacă orașul există deja, folosim ID-ul real.
        if (existingDestination) {
            setPropertyDestinationId(
                String(existingDestination.id)
            );
            setPropertyCity(
                existingDestination.name
            );
            setCityImage(
                existingDestination.image
            );
            setCountryImage(
                existingDestination.countryImage
            );

            return;
        }

        // Dacă orașul nu există încă,
        // folosim un ID temporar negativ.
        const cityIndex = Object.values(adminCities)
            .flat()
            .indexOf(firstAdminCity);

        const temporaryCityId = -(cityIndex + 1);

        setPropertyDestinationId(
            String(temporaryCityId)
        );
        setPropertyCity(firstAdminCity);
    };

    // =========================================
    // CITY CHANGE
    // =========================================

    const handleCityChange = (value: string) => {
        setPropertyError("");

        if (value === "__new__") {
            setPropertyDestinationId("");
            setPropertyCity("");
            setCityImage("");
            return;
        }

        const numericValue = Number(value);

        // Oraș predefinit care încă nu există
        if (numericValue < 0) {
            const city = adminAvailableCities.find(
                (item) => item.id === numericValue
            );

            if (city) {
                // Păstrăm ID-ul temporar negativ,
                // pentru ca orașul să poată fi creat
                // atunci când salvăm proprietatea.
                setPropertyDestinationId(value);
                setPropertyCity(city.name);
                setCityImage("");

                return;
            }
        }

        // Oraș care există deja
        setPropertyDestinationId(value);

        const destination = getDestinations().find(
            (item) => item.id === numericValue
        );

        if (destination) {
            setPropertyCity(destination.name);
            setCityImage(destination.image);
            setCountryImage(destination.countryImage);
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
            !propertyStars ||
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
        if (!propertyDestinationId) {
            setPropertyError(
                "Please select a valid city."
            );
            return;
        }

        if (
            Number(propertyDestinationId) < 0 &&
            !cityImage.trim()
        ) {
            setPropertyError(
                "Please enter an image for the city."
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
 * NUMBER OF STARS
 */
        const stars =
            Number(
                propertyStars
            );

        if (
            Number.isNaN(stars) ||
            stars < 1 ||
            stars > 5 ||
            !Number.isInteger(stars)
        ) {
            setPropertyError(
                "Number of stars must be a whole number between 1 and 5."
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
        /*
  * SELECTED CITY
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

        /*
         * Oraș predefinit care încă
         * nu există în destinations.
         */
        if (destinationId < 0) {
            const selectedCity =
                adminAvailableCities.find(
                    (city) =>
                        city.id ===
                        destinationId
                );

            if (!selectedCity) {
                setPropertyError(
                    "Please select a valid city."
                );

                return;
            }

            const newDestination =
                createDestination({
                    id: Date.now(),
                    name:
                    selectedCity.name,
                    country:
                    propertyCountry,
                    image:
                        cityImage.trim(),
                    countryImage:
                        countryImage.trim(),
                });

            destinationId =
                newDestination.id;
        } else {
            /*
             * Oraș care există deja.
             */
            const existingDestination =
                getDestinations().find(
                    (destination) =>
                        destination.id ===
                        destinationId
                );

            if (!existingDestination) {
                setPropertyError(
                    "Please select a valid city."
                );

                return;
            }

            /*
             * Actualizăm imaginile
             * orașului și țării.
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
            stars,
            rating:
                editingPropertyId !== null
                    ? allProperties.find(
                    (property) =>
                        property.id ===
                        editingPropertyId
                )?.rating ?? 0
                    : 0,
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

        setCityImage(
            destination?.image ?? ""
        );

        setCountryImage(
            destination?.countryImage ?? ""
        );

        setPropertyAddress(
            property.address
        );

        setPropertyStars(
            String(property.stars)
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

    const handleAddRoom = () => {
        setEditingRoomId(null);

        setRoomName("");
        setRoomDescription("");
        setRoomGuests("2");
        setRoomSize("");
        setRoomBed("");
        setRoomPrice("");
        setRoomImage("");
        setRoomFeatures("");
        setRoomFreeCancellation(true);
        setRoomNoPrepayment(true);
        setRoomError("");

        setIsRoomFormOpen(true);
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
                                            {getDestinationUiTranslation(language, "country")}
                                        </label>

                                        <select
                                            id="propertyCountry"
                                            value={propertyCountry}
                                            onChange={(event) =>
                                                handleCountryChange(
                                                    event.target.value
                                                )
                                            }
                                        >
                                            {adminCountries.map(
                                                (country) => (
                                                    <option
                                                        key={country}
                                                        value={country}
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

                                    {/* CITY */}

                                    <div className="form-group">
                                        <label htmlFor="propertyCity">
                                            {getDestinationUiTranslation(language, "city")}
                                        </label>

                                        <select
                                            id="propertyCity"
                                            value={propertyDestinationId}
                                            onChange={(event) =>
                                                handleCityChange(
                                                    event.target.value
                                                )
                                            }
                                        >
                                            {adminAvailableCities.map(
                                                (city) => (
                                                    <option
                                                        key={city.id}
                                                        value={city.id}
                                                    >
                                                        {getLocalizedCityName(
                                                            city.name,
                                                            language
                                                        )}
                                                    </option>
                                                )
                                            )}

                                        </select>
                                    </div>


                                    {/* CITY IMAGE */}

                                    <div className="form-group">
                                        <label htmlFor="cityImage">
                                            {getDestinationUiTranslation(language, "cityImage")}
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
                                            {getDestinationUiTranslation(language, "countryImage")}
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

                                    {/* NUMBER OF STARS */}

                                    <div className="form-group">
                                        <label htmlFor="propertyStars">
                                            Number of stars
                                        </label>

                                        <input
                                            id="propertyStars"
                                            type="number"
                                            min="1"
                                            max="5"
                                            step="1"
                                            value={propertyStars}
                                            onChange={(event) =>
                                                setPropertyStars(
                                                    event.target.value
                                                )
                                            }
                                            placeholder="1 - 5"
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
                                    {getDestinationUiTranslation(
                                        language,
                                        "allDestinations"
                                    )}
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
                                            {getLocalizedCityName(
                                                destination.name,
                                                language
                                            )}
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
                                    Stars
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
                                                        {getLocalizedCityName(
                                                            destination?.name ?? "",
                                                            language
                                                        )}
                                                    </strong>

                                                    <br />

                                                    {getLocalizedCountryName(
                                                        destination?.country ?? "",
                                                        language
                                                    )}

                                                    <br />

                                                    {
                                                        property.address
                                                    }
                                                </span>

                                                <span>
                                                    {"★".repeat(property.stars)}
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
                                                        className="admin-action-button"
                                                        onClick={() => {
                                                            setSelectedPropertyId(
                                                                property.id
                                                            );
                                                        }}
                                                    >
                                                        Manage rooms
                                                    </button>

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

                    {/* ROOMS */}

                    {selectedPropertyId !== null && (
                        <section className="admin-section">

                            {isRoomFormOpen && (
                                <div className="admin-room-form">

                                    <div className="admin-room-form-header">
                                        <div>
                                            <h3>
                                                {editingRoomId === null
                                                    ? "Add room"
                                                    : "Edit room"}
                                            </h3>

                                            <p>
                                                {editingRoomId === null
                                                    ? "Add a new room and provide its details."
                                                    : "Update the details and facilities of this room."}
                                            </p>
                                        </div>
                                    </div>

                                    {roomError && (
                                        <p className="admin-form-error">
                                            {roomError}
                                        </p>
                                    )}

                                    <div className="admin-room-fields-grid">

                                        {/* Room name */}
                                        <div className="admin-room-field">
                                            <label>Room name</label>

                                            <input
                                                type="text"
                                                value={roomName}
                                                onChange={(e) =>
                                                    setRoomName(e.target.value)
                                                }
                                                placeholder="Deluxe Double Room"
                                            />
                                        </div>

                                        {/* Guests */}
                                        <div className="admin-room-field">
                                            <label>Maximum guests</label>

                                            <input
                                                type="number"
                                                min="1"
                                                value={roomGuests}
                                                onChange={(e) =>
                                                    setRoomGuests(e.target.value)
                                                }
                                                placeholder="2"
                                            />
                                        </div>

                                        {/* Size */}
                                        <div className="admin-room-field">
                                            <label>Room size (m²)</label>

                                            <input
                                                type="text"
                                                value={roomSize}
                                                onChange={(e) =>
                                                    setRoomSize(e.target.value)
                                                }
                                                placeholder="28"
                                            />
                                        </div>

                                        {/* Bed */}
                                        <div className="admin-room-field">
                                            <label>Bed type</label>

                                            <input
                                                type="text"
                                                value={roomBed}
                                                onChange={(e) =>
                                                    setRoomBed(e.target.value)
                                                }
                                                placeholder="1 king bed"
                                            />
                                        </div>

                                        {/* Price */}
                                        <div className="admin-room-field">
                                            <label>Room price per night</label>

                                            <input
                                                type="number"
                                                min="0"
                                                value={roomPrice}
                                                onChange={(e) =>
                                                    setRoomPrice(e.target.value)
                                                }
                                                placeholder="150"
                                            />
                                        </div>

                                        {/* Image */}
                                        <div className="admin-room-field">
                                            <label>Room image</label>

                                            <input
                                                type="text"
                                                value={roomImage}
                                                onChange={(e) =>
                                                    setRoomImage(e.target.value)
                                                }
                                                placeholder="/hotel-paris.jpg"
                                            />
                                        </div>

                                        {/* Description */}
                                        <div className="admin-room-field admin-room-field-full">
                                            <label>Room description</label>

                                            <textarea
                                                value={roomDescription}
                                                onChange={(e) =>
                                                    setRoomDescription(e.target.value)
                                                }
                                                placeholder="Comfortable room with modern facilities."
                                                rows={5}
                                            />
                                        </div>

                                    </div>

                                    {/* Facilities */}
                                    <div className="admin-room-facilities">
                                        <label className="admin-room-section-label">
                                            Facilities
                                        </label>

                                        <div className="admin-room-facilities-grid">

                                            {[
                                                "Free Wi-Fi",
                                                "Air conditioning",
                                                "Private bathroom",
                                                "TV",
                                                "Private balcony",
                                                "Parking",
                                                "Room service",
                                                "Breakfast included",
                                            ].map((facility) => {

                                                const selectedFeatures =
                                                    roomFeatures
                                                        .split(",")
                                                        .map((feature) => feature.trim())
                                                        .filter(Boolean);

                                                const isSelected =
                                                    selectedFeatures.includes(facility);

                                                return (
                                                    <label
                                                        key={facility}
                                                        className={`admin-room-feature ${
                                                            isSelected
                                                                ? "selected"
                                                                : ""
                                                        }`}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={isSelected}
                                                            onChange={(e) => {
                                                                const currentFeatures =
                                                                    roomFeatures
                                                                        .split(",")
                                                                        .map((feature) =>
                                                                            feature.trim()
                                                                        )
                                                                        .filter(Boolean);

                                                                const updatedFeatures =
                                                                    e.target.checked
                                                                        ? [
                                                                            ...currentFeatures,
                                                                            facility,
                                                                        ]
                                                                        : currentFeatures.filter(
                                                                            (feature) =>
                                                                                feature !==
                                                                                facility
                                                                        );

                                                                setRoomFeatures(
                                                                    updatedFeatures.join(", ")
                                                                );
                                                            }}
                                                        />

                                                        <span>{facility}</span>
                                                    </label>
                                                );
                                            })}

                                        </div>
                                    </div>

                                    {/* Booking options */}
                                    <div className="admin-room-options">

                                        <label className="admin-room-option">
                                            <input
                                                type="checkbox"
                                                checked={roomFreeCancellation}
                                                onChange={(e) =>
                                                    setRoomFreeCancellation(
                                                        e.target.checked
                                                    )
                                                }
                                            />

                                            <span>Free cancellation</span>
                                        </label>

                                        <label className="admin-room-option">
                                            <input
                                                type="checkbox"
                                                checked={roomNoPrepayment}
                                                onChange={(e) =>
                                                    setRoomNoPrepayment(
                                                        e.target.checked
                                                    )
                                                }
                                            />

                                            <span>No prepayment needed</span>
                                        </label>

                                    </div>

                                    <div className="admin-room-form-actions">

                                        <button
                                            type="button"
                                            className="admin-room-cancel-button"
                                            onClick={() => {
                                                setIsRoomFormOpen(false);
                                                setEditingRoomId(null);
                                                setRoomError("");
                                            }}
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            type="button"
                                            className="admin-room-save-button"
                                            onClick={() => {

                                                if (!roomName.trim()) {
                                                    setRoomError(
                                                        "Room name is required."
                                                    );
                                                    return;
                                                }

                                                if (!roomPrice.trim()) {
                                                    setRoomError(
                                                        "Room price is required."
                                                    );
                                                    return;
                                                }

                                                if (selectedPropertyId === null) {
                                                    return;
                                                }

                                                const roomData = {
                                                    propertyId: selectedPropertyId,
                                                    name: roomName.trim(),
                                                    description:
                                                        roomDescription.trim(),
                                                    guests:
                                                        Number(roomGuests) || 1,
                                                    size: roomSize.trim(),
                                                    bed: roomBed.trim(),
                                                    pricePerNight:
                                                        Number(roomPrice) || 0,
                                                    image: roomImage.trim(),
                                                    features:
                                                        roomFeatures
                                                            .split(",")
                                                            .map((feature) =>
                                                                feature.trim()
                                                            )
                                                            .filter(Boolean),
                                                    freeCancellation:
                                                    roomFreeCancellation,
                                                    noPrepayment:
                                                    roomNoPrepayment,
                                                };

                                                if (editingRoomId === null) {
                                                    createRoom(roomData);
                                                } else {
                                                    updateRoom(
                                                        editingRoomId,
                                                        roomData
                                                    );
                                                }

                                                setAllRooms(getRooms());
                                                setIsRoomFormOpen(false);
                                                setEditingRoomId(null);
                                                setRoomError("");
                                            }}
                                        >
                                            {editingRoomId === null
                                                ? "Add room"
                                                : "Save changes"}
                                        </button>

                                    </div>

                                </div>
                            )}

                            <div className="admin-section-header">

                                <div>
                                    <h2>Rooms</h2>

                                    <p>
                                        Manage rooms for{" "}
                                        {
                                            allProperties.find(
                                                (property) =>
                                                    property.id ===
                                                    selectedPropertyId
                                            )?.name
                                        }
                                        .
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    className="admin-action-button"
                                    onClick={handleAddRoom}
                                >
                                    + Add room
                                </button>

                            </div>

                            <div className="admin-room-table">

                                <div className="admin-room-table-header">
                                    <span>Room</span>
                                    <span>Guests</span>
                                    <span>Size</span>
                                    <span>Price</span>
                                    <span>Actions</span>
                                </div>

                                {allRooms
                                    .filter(
                                        (room) =>
                                            room.propertyId ===
                                            selectedPropertyId
                                    )
                                    .map((room) => (

                                        <div
                                            className="admin-room-table-row"
                                            key={room.id}
                                        >

                                            <strong>
                                                {room.name}
                                            </strong>

                                            <span>
                            {room.guests} guests
                        </span>

                                            <span>
    {room.size !== undefined &&
    room.size !== null &&
    room.size !== ""
        ? typeof room.size === "number"
            ? `${room.size} m²`
            : String(room.size).trim().endsWith("m²")
                ? String(room.size).trim()
                : `${String(room.size).trim()} m²`
        : ""}
</span>

                                            <span>
                            {formatPrice(
                                room.pricePerNight
                            )}{" "}
                                                / night
                        </span>

                                            <div className="admin-row-actions">

                                                <button
                                                    type="button"
                                                    className="admin-edit-button"
                                                    onClick={() => {
                                                        setEditingRoomId(room.id);

                                                        setRoomName(room.name);
                                                        setRoomDescription(
                                                            room.description
                                                        );
                                                        setRoomGuests(
                                                            String(room.guests)
                                                        );
                                                        setRoomSize(
                                                            String(room.size)
                                                        );
                                                        setRoomBed(room.bed);
                                                        setRoomPrice(
                                                            String(
                                                                room.pricePerNight
                                                            )
                                                        );
                                                        setRoomImage(room.image);
                                                        setRoomFeatures(
                                                            room.features.join(", ")
                                                        );
                                                        setRoomFreeCancellation(
                                                            room.freeCancellation ??
                                                            true
                                                        );
                                                        setRoomNoPrepayment(
                                                            room.noPrepayment ??
                                                            true
                                                        );

                                                        setRoomError("");
                                                        setIsRoomFormOpen(true);
                                                    }}
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    className="admin-delete-button"
                                                    onClick={() => {
                                                        const confirmed =
                                                            window.confirm(
                                                                `Delete "${room.name}"?`
                                                            );

                                                        if (!confirmed) {
                                                            return;
                                                        }

                                                        deleteRoom(room.id);
                                                        setAllRooms(getRooms());
                                                    }}
                                                >
                                                    Delete
                                                </button>

                                            </div>

                                        </div>
                                    ))}

                            </div>

                        </section>
                    )}

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

                    <section className="admin-section admin-bookings-section">

                        <div className="admin-section-header">

                            <div>
                                <h2>
                                    Bookings
                                </h2>

                                <p>
                                    Manage all reservations.
                                </p>
                            </div>

                        </div>


                        {/* BOOKING FILTERS */}

                        <div className="admin-booking-filters">

                            <input
                                type="text"
                                placeholder="Search by hotel, user or date..."
                                value={bookingSearch}
                                onChange={(event) =>
                                    setBookingSearch(
                                        event.target.value
                                    )
                                }
                            />

                            <select
                                value={bookingUserFilter}
                                onChange={(event) =>
                                    setBookingUserFilter(
                                        event.target.value
                                    )
                                }
                            >
                                <option value="All">
                                    All users
                                </option>

                                {users.map((user) => (
                                    <option
                                        key={user.id}
                                        value={user.id}
                                    >
                                        {user.name}
                                    </option>
                                ))}
                            </select>

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
                                    Price: High to Low
                                </option>

                                <option value="totalAsc">
                                    Price: Low to High
                                </option>
                            </select>

                            <button
                                type="button"
                                className="admin-booking-clear"
                                onClick={() => {
                                    setBookingSearch("");
                                    setBookingStatusFilter("All");
                                    setBookingSort("newest");
                                    setBookingUserFilter("All");
                                }}
                            >
                                Clear
                            </button>

                        </div>

                        {/* RESULTS COUNT */}

                        <div className="admin-booking-results">

                            Showing{" "}
                            <strong>
                                {filteredBookings.length}
                            </strong>{" "}
                            of{" "}
                            <strong>
                                {allBookings.length}
                            </strong>{" "}
                            bookings

                        </div>

                        {/* BOOKINGS TABLE */}

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
                                            setBookingUserFilter("All");
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
                                                    {property?.name ??
                                                        "Unknown property"}
                                                </strong>

                                                <span>
                                {user?.name ??
                                    "Unknown user"}
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
                                {booking.status}
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

