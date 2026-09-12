"use client";

import {
    FormEvent,
    useEffect,
    useMemo,
    useRef,
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

import {
    createTransferVehicle,
    deleteTransferVehicle,
    getTransferVehicles,
    updateTransferVehicle,
} from "../../services/transferVehicleService";

import {
    createTransferDriver,
    deleteTransferDriver,
    getTransferDriverBookings,
    getTransferDriverStatus,
    getTransferDrivers,
    updateTransferDriver,
    TransferDriver,
} from "../../services/transferDriverService";

import { TransferVehicle } from "../../data/transferVehicles";

import {
    getTransferBookings,
    TransferBooking,
} from "../../services/transferService";


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

    const [activeAdminTab, setActiveAdminTab] =
        useState<"stays" | "transfers" | "users">("stays");

    const [allDestinations, setAllDestinations] =
        useState<Destination[]>(mockDestinations);

    const [allRooms, setAllRooms] =
        useState<Room[]>(getRooms());

    const [allTransferVehicles, setAllTransferVehicles] =
        useState<TransferVehicle[]>(getTransferVehicles());

    const [allTransferDrivers, setAllTransferDrivers] =
        useState<TransferDriver[]>(getTransferDrivers());

    const [allTransferBookings, setAllTransferBookings] =
        useState<TransferBooking[]>(getTransferBookings());

    const [selectedTransferCity, setSelectedTransferCity] =
        useState("Athens");

    const [transferVehicleSearch, setTransferVehicleSearch] =
        useState("");

    const [transferVehicleCategoryFilter, setTransferVehicleCategoryFilter] =
        useState<"all" | "Private" | "Comfort" | "Family">("all");

    const [transferDriverSearch, setTransferDriverSearch] =
        useState("");

    const [transferDriverStatusFilter, setTransferDriverStatusFilter] =
        useState<"all" | "available" | "busy" | "inactive">("all");

    const [transferDriverVehicleId, setTransferDriverVehicleId] =
        useState("");

    const [transferBookingSearch, setTransferBookingSearch] =
        useState("");

    const [transferBookingTypeFilter, setTransferBookingTypeFilter] =
        useState<"all" | "one-way" | "return">("all");

    const [isVehicleFormOpen, setIsVehicleFormOpen] =
        useState(false);

    const [editingVehicleId, setEditingVehicleId] =
        useState<string | null>(null);

    const TRANSFER_IMAGE_BASE_PATH = "/transfers/";

    const getTransferImagePath = (value: string) => {
        const filename = value
            .trim()
            .replace(/^\/?(?:public\/)?transfers\//i, "");

        return filename
            ? `${TRANSFER_IMAGE_BASE_PATH}${filename}`
            : "";
    };

    const [vehicleCity, setVehicleCity] =
        useState("Athens");

    const [vehicleName, setVehicleName] =
        useState("");

    const [vehicleLicensePlate, setVehicleLicensePlate] =
        useState("");

    const [vehicleCategory, setVehicleCategory] =
        useState<"Private" | "Comfort" | "Family">("Private");

    const [vehiclePassengers, setVehiclePassengers] =
        useState("3");

    const [vehicleLuggage, setVehicleLuggage] =
        useState("2");

    const [vehicleImage, setVehicleImage] =
        useState("");

    const [vehicleError, setVehicleError] =
        useState("");

    const [isDriverFormOpen, setIsDriverFormOpen] =
        useState(false);

    const [driverCity, setDriverCity] =
        useState("Athens");

    const [driverName, setDriverName] =
        useState("");

    const [driverPhone, setDriverPhone] =
        useState("");

    const [driverStatus, setDriverStatus] =
        useState<"available" | "busy" | "inactive">("available");

    const [driverError, setDriverError] =
        useState("");

    const handleTransferVehicleSubmit = (event: FormEvent) => {
        event.preventDefault();

        setVehicleError("");

        if (!vehicleName.trim()) {
            setVehicleError("Enter vehicle name.");
            return;
        }

        const vehicleData: TransferVehicle = {
            id: editingVehicleId || `vehicle-${Date.now()}`,
            city: vehicleCity,
            name: vehicleName.trim(),
            licensePlate: vehicleLicensePlate.trim(),
            category: vehicleCategory,
            passengers: Number(vehiclePassengers),
            luggage: Number(vehicleLuggage),
            image: getTransferImagePath(vehicleImage),
            driverId: editingVehicleId
                ? allTransferVehicles.find(
                    (vehicle) => vehicle.id === editingVehicleId
                )?.driverId
                : undefined,
        };

        if (editingVehicleId) {
            const updatedVehicle = updateTransferVehicle(
                editingVehicleId,
                vehicleData
            );

            if (updatedVehicle) {
                setAllTransferVehicles(getTransferVehicles());
            }
        } else {
            createTransferVehicle(vehicleData);
            setAllTransferVehicles(getTransferVehicles());
        }

        setVehicleName("");
        setVehicleLicensePlate("");
        setVehicleCategory("Private");
        setVehiclePassengers("3");
        setVehicleLuggage("2");
        setVehicleImage("");
        setVehicleCity(selectedTransferCity);
        setEditingVehicleId(null);
        setIsVehicleFormOpen(false);
    };

    const handleDeleteTransferVehicle = (vehicleId: string) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this vehicle?"
        );

        if (!confirmed) return;

        deleteTransferVehicle(vehicleId);
        setAllTransferVehicles(getTransferVehicles());
    };

    const handleEditTransferVehicle = (vehicle: TransferVehicle) => {
        setEditingVehicleId(vehicle.id);
        setVehicleCity(vehicle.city);
        setVehicleName(vehicle.name);
        setVehicleLicensePlate(vehicle.licensePlate);
        setVehicleCategory(vehicle.category);
        setVehiclePassengers(String(vehicle.passengers));
        setVehicleLuggage(String(vehicle.luggage));
        setVehicleImage(
            vehicle.image.replace(/^\/?(?:public\/)?transfers\//i, "")
        );
        setVehicleError("");
        setIsVehicleFormOpen(true);
    };

    const handleTransferDriverSubmit = (event: FormEvent) => {
        event.preventDefault();

        setDriverError("");

        if (!driverName.trim()) {
            setDriverError("Enter driver name.");
            return;
        }

        if (!driverPhone.trim()) {
            setDriverError("Enter driver phone.");
            return;
        }

        if (!transferDriverVehicleId) {
            setDriverError("Please assign a vehicle to this driver.");
            return;
        }

        const driverId =
            editingDriverId || `driver-${Date.now()}`;

        const selectedVehicle = allTransferVehicles.find(
            (vehicle) => vehicle.id === transferDriverVehicleId
        );

        if (!selectedVehicle || selectedVehicle.city !== driverCity) {
            setDriverError("Please select a valid vehicle from the same city.");
            return;
        }

        if (
            selectedVehicle.driverId &&
            selectedVehicle.driverId !== driverId
        ) {
            setDriverError(
                "This vehicle is already assigned to another driver."
            );
            return;
        }

        const driverData: TransferDriver = {
            id: driverId,
            city: driverCity,
            name: driverName.trim(),
            phone: driverPhone.trim(),
            status: driverStatus,
        };

        if (editingDriverId) {
            updateTransferDriver(editingDriverId, driverData);
        } else {
            createTransferDriver(driverData);
        }

        // Remove this driver from any previous vehicle.
        allTransferVehicles
            .filter((vehicle) => vehicle.driverId === driverId)
            .forEach((vehicle) => {
                updateTransferVehicle(vehicle.id, {
                    ...vehicle,
                    driverId: undefined,
                });
            });

        // Assign the selected vehicle to this driver.
        updateTransferVehicle(selectedVehicle.id, {
            ...selectedVehicle,
            driverId,
        });

        setAllTransferDrivers(getTransferDrivers());
        setAllTransferVehicles(getTransferVehicles());

        setDriverName("");
        setDriverPhone("");
        setDriverStatus("available");
        setDriverCity(selectedTransferCity);
        setTransferDriverVehicleId("");
        setEditingDriverId(null);
        setIsDriverFormOpen(false);
    };

    const handleDeleteTransferDriver = (driverId: string) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this driver?"
        );

        if (!confirmed) return;

        deleteTransferDriver(driverId);

        allTransferVehicles
            .filter((vehicle) => vehicle.driverId === driverId)
            .forEach((vehicle) => {
                updateTransferVehicle(vehicle.id, {
                    ...vehicle,
                    driverId: undefined,
                });
            });

        setAllTransferDrivers(getTransferDrivers());
        setAllTransferVehicles(getTransferVehicles());
    };

    const handleEditTransferDriver = (driver: TransferDriver) => {
        const assignedVehicle = allTransferVehicles.find(
            (vehicle) => vehicle.driverId === driver.id
        );

        setEditingDriverId(driver.id);
        setDriverCity(driver.city);
        setDriverName(driver.name);
        setDriverPhone(driver.phone);
        setDriverStatus(driver.status);
        setTransferDriverVehicleId(assignedVehicle?.id || "");
        setDriverError("");
        setIsDriverFormOpen(true);
    };

    const [editingDriverId, setEditingDriverId] =
        useState<string | null>(null);
    const [selectedPropertyId, setSelectedPropertyId] =
        useState<number | null>(null);

    const roomsSectionRef =
        useRef<HTMLElement | null>(null);

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

    useEffect(() => {
        if (selectedPropertyId === null) {
            return;
        }

        const timer = window.setTimeout(() => {
            roomsSectionRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }, 50);

        return () => {
            window.clearTimeout(timer);
        };
    }, [selectedPropertyId]);

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

    const dashboardStatistics = useMemo(() => {
        const totalStayBookings = allBookings.length;
        const totalTransferBookings = allTransferBookings.length;
        const totalBookings =
            totalStayBookings + totalTransferBookings;

        const cancelledStayBookings = allBookings.filter(
            (booking) => booking.status === "cancelled"
        ).length;

        const confirmedStayBookings = allBookings.filter(
            (booking) => booking.status === "confirmed"
        ).length;

        const confirmedTotal =
            confirmedStayBookings + totalTransferBookings;

        const totalRevenue =
            confirmedRevenue +
            allTransferBookings.reduce(
                (total, booking) => total + booking.price,
                0
            );

        const averageBookingValue =
            confirmedTotal > 0
                ? totalRevenue / confirmedTotal
                : 0;

        const confirmationRate =
            totalBookings > 0
                ? Math.round(
                    (confirmedTotal / totalBookings) * 100
                )
                : 0;

        const cityCounts = allTransferBookings.reduce<
            Record<string, number>
        >((acc, booking) => {
            const destinationText =
                `${booking.pickup} ${booking.destination}`.toLowerCase();

            const cities = [
                "Athens",
                "Barcelona",
                "Lisbon",
                "Munich",
                "Paris",
                "Rome",
            ];

            const matchedCity =
                cities.find((city) =>
                    destinationText.includes(city.toLowerCase())
                ) ?? "Other";

            acc[matchedCity] =
                (acc[matchedCity] ?? 0) + 1;

            return acc;
        }, {});

        const topTransferCity =
            Object.entries(cityCounts).sort(
                (a, b) => b[1] - a[1]
            )[0]?.[0] ?? "—";

        return {
            totalBookings,
            totalTransferBookings,
            cancelledStayBookings,
            confirmedTotal,
            totalRevenue,
            averageBookingValue,
            confirmationRate,
            topTransferCity,
        };
    }, [
        allBookings,
        allTransferBookings,
        confirmedRevenue,
    ]);

    // =========================================
    // DYNAMIC DASHBOARD ANALYTICS
    // =========================================

    type AnalyticsPeriod = "7d" | "30d" | "12m";

    const [analyticsPeriod, setAnalyticsPeriod] =
        useState<AnalyticsPeriod>("12m");

    const analyticsData = useMemo(() => {
        const now = new Date();
        now.setHours(23, 59, 59, 999);

        const periodDays: Record<AnalyticsPeriod, number> = {
            "7d": 7,
            "30d": 30,
            "12m": 365,
        };

        const days = periodDays[analyticsPeriod];
        const start = new Date(now);

        if (analyticsPeriod === "12m") {
            start.setMonth(start.getMonth() - 11);
            start.setDate(1);
            start.setHours(0, 0, 0, 0);
        } else {
            start.setDate(start.getDate() - (days - 1));
            start.setHours(0, 0, 0, 0);
        }

        const getDate = (value: string) => {
            const date = new Date(value);
            return Number.isNaN(date.getTime()) ? null : date;
        };

        const stayEvents = allBookings
            .map((booking) => ({
                date: getDate(booking.checkIn),
                revenue:
                    booking.status === "confirmed"
                        ? booking.totalPrice
                        : 0,
            }))
            .filter(
                (event): event is {
                    date: Date;
                    revenue: number;
                } => event.date !== null
            );

        const transferEvents = allTransferBookings
            .map((booking) => ({
                date: getDate(booking.date),
                revenue: booking.price,
            }))
            .filter(
                (event): event is {
                    date: Date;
                    revenue: number;
                } => event.date !== null
            );

        const bucketCount =
            analyticsPeriod === "7d"
                ? 7
                : analyticsPeriod === "30d"
                    ? 6
                    : 12;

        const buckets = Array.from(
            { length: bucketCount },
            (_, index) => {
                let bucketStart: Date;
                let bucketEnd: Date;

                if (analyticsPeriod === "12m") {
                    bucketStart = new Date(start);
                    bucketStart.setMonth(start.getMonth() + index);
                    bucketStart.setDate(1);
                    bucketStart.setHours(0, 0, 0, 0);

                    bucketEnd = new Date(bucketStart);
                    bucketEnd.setMonth(bucketEnd.getMonth() + 1);
                    bucketEnd.setMilliseconds(-1);
                } else {
                    const bucketSize =
                        analyticsPeriod === "7d" ? 1 : 5;

                    bucketStart = new Date(start);
                    bucketStart.setDate(
                        start.getDate() + index * bucketSize
                    );
                    bucketStart.setHours(0, 0, 0, 0);

                    bucketEnd = new Date(bucketStart);
                    bucketEnd.setDate(
                        bucketEnd.getDate() + bucketSize
                    );
                    bucketEnd.setMilliseconds(-1);
                }

                const inBucket = (date: Date) =>
                    date >= bucketStart && date <= bucketEnd;

                const stays = stayEvents.filter((event) =>
                    inBucket(event.date)
                );
                const transfers = transferEvents.filter((event) =>
                    inBucket(event.date)
                );

                return {
                    label:
                        analyticsPeriod === "12m"
                            ? bucketStart.toLocaleDateString("en-US", {
                                month: "short",
                            })
                            : bucketStart.toLocaleDateString("en-US", {
                                day: "numeric",
                                month: "short",
                            }),
                    revenue: stays.reduce(
                        (sum, event) => sum + event.revenue,
                        0
                    ) + transfers.reduce(
                        (sum, event) => sum + event.revenue,
                        0
                    ),
                    stays: stays.length,
                    transfers: transfers.length,
                };
            }
        );

        // All analytics below use ONLY bookings inside the selected period.
        // This keeps the period selector consistent across the whole dashboard.
        const filteredStayBookings = allBookings.filter((booking) => {
            const date = getDate(booking.checkIn);
            return date !== null && date >= start && date <= now;
        });

        const filteredTransferBookings = allTransferBookings.filter((booking) => {
            const date = getDate(booking.date);
            return date !== null && date >= start && date <= now;
        });

        const confirmed =
            filteredStayBookings.filter(
                (booking) => booking.status === "confirmed"
            ).length + filteredTransferBookings.length;

        const cancelled = filteredStayBookings.filter(
            (booking) => booking.status === "cancelled"
        ).length;

        const destinationCounts = filteredStayBookings.reduce<
            Record<string, number>
        >((acc, booking) => {
            const property = allProperties.find(
                (item) => item.id === booking.propertyId
            );

            const destination = allDestinations.find(
                (item) => item.id === property?.destinationId
            );

            const name = destination?.name ?? "Unknown destination";
            acc[name] = (acc[name] ?? 0) + 1;
            return acc;
        }, {});

        const popularDestinations = Object.entries(
            destinationCounts
        )
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        // Calculate transfer types directly from the selected period.
        // Keeping these values inline in the returned object avoids scope/HMR
        // issues when the analytics block is edited during development.

        const totalBookings =
            filteredStayBookings.length + filteredTransferBookings.length;

        const totalRevenue = filteredStayBookings
            .filter(
                (booking) => booking.status === "confirmed"
            )
            .reduce(
                (sum, booking) => sum + booking.totalPrice,
                0
            );

        const transferRevenue = filteredTransferBookings.reduce(
            (sum, booking) => sum + booking.price,
            0
        );

        const revenueValues = buckets.map(
            (bucket) => bucket.revenue
        );

        return {
            buckets,
            confirmed,
            cancelled,
            totalBookings,
            popularDestinations,
            oneWayTransfers: filteredTransferBookings.filter(
                (booking) => booking.transferType !== "return"
            ).length,
            returnTransfers: filteredTransferBookings.filter(
                (booking) => booking.transferType === "return"
            ).length,
            totalRevenue: totalRevenue + transferRevenue,
            maxRevenue: Math.max(...revenueValues, 1),
            maxBookings: Math.max(
                ...buckets.map(
                    (bucket) => bucket.stays + bucket.transfers
                ),
                1
            ),
            confirmationRate:
                totalBookings > 0
                    ? Math.round((confirmed / totalBookings) * 100)
                    : 0,
        };
    }, [
        analyticsPeriod,
        allBookings,
        allTransferBookings,
        allProperties,
        allDestinations,
    ]);

    const revenueChartPoints = useMemo(() => {
        const width = 760;
        const height = 250;
        const paddingX = 36;
        const paddingY = 28;
        const chartWidth = width - paddingX * 2;
        const chartHeight = height - paddingY * 2;
        const count = analyticsData.buckets.length;

        return analyticsData.buckets.map((bucket, index) => {
            const x =
                paddingX +
                (count === 1
                    ? chartWidth / 2
                    : (index / (count - 1)) * chartWidth);
            const y =
                paddingY +
                chartHeight -
                (bucket.revenue / analyticsData.maxRevenue) *
                chartHeight;

            return { x, y, ...bucket };
        });
    }, [analyticsData]);

    const revenuePath = revenueChartPoints
        .map((point, index) =>
            `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`
        )
        .join(" ");

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

        setAllTransferBookings(
            getTransferBookings()
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
    // TRANSFER FILTERS
    // =========================================

    const filteredTransferBookings = (() => {
        const city = selectedTransferCity.toLowerCase();
        const search = transferBookingSearch.trim().toLowerCase();

        return allTransferBookings.filter((booking) => {
            if (!booking.vehicleId) {
                return false;
            }

            const vehicle = allTransferVehicles.find(
                (item) => item.id === booking.vehicleId
            );

            if (vehicle?.city.toLowerCase() !== city) {
                return false;
            }

            if (
                transferBookingTypeFilter !== "all" &&
                booking.transferType !== transferBookingTypeFilter
            ) {
                return false;
            }

            if (!search) {
                return true;
            }

            const searchableText = [
                booking.firstName,
                booking.lastName,
                booking.email,
                booking.phone,
                booking.vehicleName,
                booking.licensePlate,
                booking.driverName,
                booking.pickup,
                booking.destination,
                booking.date,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return searchableText.includes(search);
        });
    })();

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
            <style>{`
                /* ADMIN PAGE LOAD ANIMATIONS */
                @keyframes adminPageEnter {
                    from {
                        opacity: 0;
                        transform: translateY(22px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .admin-load-in {
                    opacity: 0;
                    animation: adminPageEnter 0.8s ease both;
                    will-change: opacity, transform;
                }

                .admin-load-1 { animation-delay: 0s; }
                .admin-load-2 { animation-delay: 0.12s; }
                .admin-load-3 { animation-delay: 0.18s; }
                .admin-load-4 { animation-delay: 0.24s; }
                .admin-load-5 { animation-delay: 0.30s; }
                .admin-load-6 { animation-delay: 0.36s; }
                .admin-load-7 { animation-delay: 0.44s; }
                .admin-load-8 { animation-delay: 0.52s; }

                @media (prefers-reduced-motion: reduce) {
                    .admin-load-in {
                        opacity: 1 !important;
                        animation: none !important;
                        transform: none !important;
                    }
                }

                @media (max-width: 900px) {
                    .admin-analytics-primary,
                    .admin-analytics-secondary,
                    .admin-users-grid {
                        grid-template-columns: 1fr !important;
                    }

                    .admin-user-overview {
                        grid-template-columns: 1fr 1fr !important;
                    }

                    .admin-transfer-analytics-grid {
                        grid-template-columns: 1fr 1fr !important;
                    }
                }

                @media (max-width: 600px) {
                    .admin-user-overview {
                        grid-template-columns: 1fr !important;
                    }

                    .admin-transfer-analytics-grid {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>

            <section className="section">
                <div className="container admin-page">

                    {/* HEADER */}

                    <div
                        className="admin-header admin-load-in admin-load-1"
                        style={{
                            position: "relative",
                            paddingBottom: "6px",
                        }}
                    >
                        <p
                            className="admin-label"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "9px",
                                marginBottom: "12px",
                                color: "#777184",
                                fontSize: "13px",
                                fontWeight: 900,
                                letterSpacing: "0.12em",
                            }}
                        >
                            <span
                                aria-hidden="true"
                                style={{
                                    width: "9px",
                                    height: "9px",
                                    borderRadius: "50%",
                                    background: "#7059e8",
                                    boxShadow: "0 0 0 5px rgba(112, 89, 232, 0.10)",
                                    flexShrink: 0,
                                }}
                            />
                            ADMIN PANEL
                        </p>

                        <h1
                            style={{
                                margin: 0,
                                color: "#292532",
                                fontSize: "52px",
                                lineHeight: 1.04,
                                fontWeight: 800,
                                letterSpacing: "-0.035em",
                            }}
                        >
                            Admin Dashboard
                        </h1>

                        <p
                            className="admin-description"
                            style={{
                                marginTop: "16px",
                                marginBottom: 0,
                                maxWidth: "720px",
                                color: "#746d80",
                                fontSize: "19px",
                                lineHeight: 1.55,
                                fontWeight: 500,
                            }}
                        >
                            Manage users, stays and bookings on{" "}
                            <strong
                                style={{
                                    color: "#654fe0",
                                    fontWeight: 800,
                                }}
                            >
                                StayWay.
                            </strong>
                        </p>

                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                marginTop: "18px",
                                flexWrap: "wrap",
                            }}
                        >
                            <span
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "7px",
                                    minHeight: "32px",
                                    padding: "0 12px",
                                    borderRadius: "999px",
                                    background: "rgba(255,255,255,0.72)",
                                    border: "1px solid rgba(108,92,231,0.14)",
                                    boxShadow: "0 6px 18px rgba(78,64,125,0.05)",
                                    color: "#5f596d",
                                    fontSize: "11px",
                                    fontWeight: 800,
                                }}
                            >
                                <span
                                    aria-hidden="true"
                                    style={{
                                        width: "6px",
                                        height: "6px",
                                        borderRadius: "50%",
                                        background: "#22a05a",
                                    }}
                                />
                                Management overview
                            </span>

                            <span
                                style={{
                                    color: "#938da0",
                                    fontSize: "12px",
                                    fontWeight: 700,
                                }}
                            >
                                StayWay control center
                            </span>
                        </div>

                    </div>

                    {/* STATISTICS */}

                    <div
                        className="admin-stats admin-load-in admin-load-2"
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "16px",
                        }}
                    >

                        <div
                            className="admin-stat-card admin-load-in admin-load-3"
                            style={{ flex: "1 1 170px", minWidth: "150px" }}
                        >
                            <span>Properties</span>
                            <strong>{allProperties.length}</strong>
                        </div>

                        <div
                            className="admin-stat-card admin-load-in admin-load-4"
                            style={{ flex: "1 1 170px", minWidth: "150px" }}
                        >
                            <span>Vehicles</span>
                            <strong>{allTransferVehicles.length}</strong>
                        </div>

                        <div
                            className="admin-stat-card admin-load-in admin-load-5"
                            style={{ flex: "1 1 170px", minWidth: "150px" }}
                        >
                            <span>Drivers</span>
                            <strong>{allTransferDrivers.length}</strong>
                        </div>

                        <div
                            className="admin-stat-card admin-load-in admin-load-6"
                            style={{ flex: "1 1 170px", minWidth: "150px" }}
                        >
                            <span>Users</span>
                            <strong>{users.length}</strong>
                        </div>

                        <div
                            className="admin-stat-card admin-load-in admin-load-7"
                            style={{ flex: "1 1 170px", minWidth: "150px" }}
                        >
                            <span>Revenue</span>
                            <strong>{formatPrice(confirmedRevenue)}</strong>
                        </div>

                    </div>

                    {/* DYNAMIC DASHBOARD ANALYTICS */}

                    <div
                        className="admin-load-in admin-load-6"
                        style={{
                            marginTop: "18px",
                            marginBottom: "34px",
                        }}
                    >
                        {/* PERIOD FILTER */}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: "16px",
                                marginBottom: "16px",
                                flexWrap: "wrap",
                            }}
                        >
                            <div>
                                <span
                                    style={{
                                        display: "block",
                                        color: "#817b90",
                                        fontSize: "12px",
                                        fontWeight: 900,
                                        textTransform: "uppercase",
                                        letterSpacing: "0.08em",
                                    }}
                                >
                                    Performance
                                </span>
                                <strong
                                    style={{
                                        display: "block",
                                        marginTop: "4px",
                                        color: "#292532",
                                        fontSize: "22px",
                                    }}
                                >
                                    StayWay analytics
                                </strong>
                            </div>

                            <div
                                style={{
                                    display: "inline-flex",
                                    gap: "4px",
                                    padding: "4px",
                                    borderRadius: "14px",
                                    background: "rgba(255,255,255,0.72)",
                                    border: "1px solid rgba(108,92,231,0.12)",
                                }}
                            >
                                {(
                                    [
                                        ["7d", "7 Days"],
                                        ["30d", "30 Days"],
                                        ["12m", "12 Months"],
                                    ] as [AnalyticsPeriod, string][]
                                ).map(([value, label]) => (
                                    <button
                                        key={value}
                                        type="button"
                                        onClick={() => setAnalyticsPeriod(value)}
                                        style={{
                                            border: "0",
                                            borderRadius: "10px",
                                            padding: "9px 13px",
                                            background:
                                                analyticsPeriod === value
                                                    ? "#ffffff"
                                                    : "transparent",
                                            color:
                                                analyticsPeriod === value
                                                    ? "#5b4bc4"
                                                    : "#817b90",
                                            fontSize: "12px",
                                            fontWeight: 800,
                                            cursor: "pointer",
                                            boxShadow:
                                                analyticsPeriod === value
                                                    ? "0 5px 16px rgba(78,64,125,0.10)"
                                                    : "none",
                                        }}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* REVENUE + STATUS */}
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "minmax(0, 2fr) minmax(280px, 0.85fr)",
                                gap: "16px",
                            }}
                            className="admin-analytics-primary"
                        >
                            <div
                                style={{
                                    minWidth: 0,
                                    padding: "24px",
                                    borderRadius: "24px",
                                    background: "linear-gradient(135deg, #ffffff 0%, #faf8ff 100%)",
                                    border: "1px solid rgba(108,92,231,0.12)",
                                    boxShadow: "0 14px 38px rgba(78,64,125,0.07)",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        justifyContent: "space-between",
                                        gap: "16px",
                                    }}
                                >
                                    <div>
                                        <span
                                            style={{
                                                color: "#817b90",
                                                fontSize: "12px",
                                                fontWeight: 900,
                                                textTransform: "uppercase",
                                                letterSpacing: "0.08em",
                                            }}
                                        >
                                            Revenue overview
                                        </span>
                                        <strong
                                            style={{
                                                display: "block",
                                                marginTop: "7px",
                                                color: "#292532",
                                                fontSize: "30px",
                                                lineHeight: 1.1,
                                            }}
                                        >
                                            {formatPrice(analyticsData.totalRevenue)}
                                        </strong>
                                        <span
                                            style={{
                                                display: "block",
                                                marginTop: "5px",
                                                color: "#8a8298",
                                                fontSize: "12px",
                                            }}
                                        >
                                            Confirmed stays + transfer revenue
                                        </span>
                                    </div>

                                    <div
                                        style={{
                                            width: "44px",
                                            height: "44px",
                                            borderRadius: "14px",
                                            display: "grid",
                                            placeItems: "center",
                                            background: "#f0ebff",
                                            color: "#6854df",
                                            fontSize: "20px",
                                            flexShrink: 0,
                                        }}
                                    >
                                        ↗
                                    </div>
                                </div>

                                <div
                                    style={{
                                        marginTop: "22px",
                                        width: "100%",
                                        overflow: "hidden",
                                    }}
                                >
                                    <svg
                                        viewBox="0 0 760 250"
                                        width="100%"
                                        height="250"
                                        role="img"
                                        aria-label="Revenue over time"
                                        preserveAspectRatio="none"
                                    >
                                        {[0, 1, 2, 3].map((line) => (
                                            <line
                                                key={line}
                                                x1="36"
                                                x2="724"
                                                y1={28 + line * 64.7}
                                                y2={28 + line * 64.7}
                                                stroke="#eeeaf6"
                                                strokeWidth="1"
                                            />
                                        ))}

                                        <path
                                            d={`${revenuePath} L ${revenueChartPoints[revenueChartPoints.length - 1]?.x ?? 724} 222 L ${revenueChartPoints[0]?.x ?? 36} 222 Z`}
                                            fill="rgba(111,88,232,0.09)"
                                            stroke="none"
                                        />

                                        <path
                                            d={revenuePath}
                                            fill="none"
                                            stroke="#7059e8"
                                            strokeWidth="4"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />

                                        {revenueChartPoints.map((point) => (
                                            <circle
                                                key={`${point.label}-${point.x}`}
                                                cx={point.x}
                                                cy={point.y}
                                                r="5"
                                                fill="#ffffff"
                                                stroke="#7059e8"
                                                strokeWidth="3"
                                            >
                                                <title>
                                                    {point.label}: {formatPrice(point.revenue)}
                                                </title>
                                            </circle>
                                        ))}
                                    </svg>
                                </div>

                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        gap: "8px",
                                        marginTop: "-2px",
                                        color: "#91899d",
                                        fontSize: "10px",
                                        fontWeight: 700,
                                    }}
                                >
                                    {analyticsData.buckets.map((bucket) => (
                                        <span key={bucket.label}>{bucket.label}</span>
                                    ))}
                                </div>
                            </div>

                            <div
                                style={{
                                    padding: "24px",
                                    borderRadius: "24px",
                                    background: "#ffffff",
                                    border: "1px solid rgba(108,92,231,0.12)",
                                    boxShadow: "0 14px 38px rgba(78,64,125,0.07)",
                                }}
                            >
                                <span
                                    style={{
                                        color: "#817b90",
                                        fontSize: "12px",
                                        fontWeight: 900,
                                        textTransform: "uppercase",
                                        letterSpacing: "0.08em",
                                    }}
                                >
                                    Booking status
                                </span>

                                <div
                                    style={{
                                        display: "grid",
                                        placeItems: "center",
                                        margin: "22px 0 20px",
                                    }}
                                >
                                    <div
                                        style={{
                                            width: "164px",
                                            height: "164px",
                                            borderRadius: "50%",
                                            display: "grid",
                                            placeItems: "center",
                                            background: `conic-gradient(#7059e8 0 ${analyticsData.confirmationRate}%, #eeeaf6 ${analyticsData.confirmationRate}% 100%)`,
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: "112px",
                                                height: "112px",
                                                borderRadius: "50%",
                                                display: "grid",
                                                placeItems: "center",
                                                background: "#ffffff",
                                                textAlign: "center",
                                            }}
                                        >
                                            <div>
                                                <strong
                                                    style={{
                                                        display: "block",
                                                        color: "#292532",
                                                        fontSize: "26px",
                                                    }}
                                                >
                                                    {analyticsData.confirmationRate}%
                                                </strong>
                                                <span
                                                    style={{
                                                        color: "#8a8298",
                                                        fontSize: "10px",
                                                        fontWeight: 800,
                                                    }}
                                                >
                                                    confirmed
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    style={{
                                        display: "grid",
                                        gap: "10px",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            padding: "10px 12px",
                                            borderRadius: "12px",
                                            background: "#f7f5ff",
                                        }}
                                    >
                                        <span style={{ color: "#5e5868", fontSize: "12px", fontWeight: 700 }}>
                                            <span style={{ color: "#7059e8", marginRight: "7px" }}>●</span>
                                            Confirmed
                                        </span>
                                        <strong style={{ color: "#292532", fontSize: "14px" }}>
                                            {analyticsData.confirmed}
                                        </strong>
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            padding: "10px 12px",
                                            borderRadius: "12px",
                                            background: "#faf9fc",
                                        }}
                                    >
                                        <span style={{ color: "#5e5868", fontSize: "12px", fontWeight: 700 }}>
                                            <span style={{ color: "#d7d1e3", marginRight: "7px" }}>●</span>
                                            Cancelled
                                        </span>
                                        <strong style={{ color: "#292532", fontSize: "14px" }}>
                                            {analyticsData.cancelled}
                                        </strong>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* BOOKINGS + DESTINATIONS */}
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "minmax(0, 1.35fr) minmax(300px, 0.9fr)",
                                gap: "16px",
                                marginTop: "16px",
                            }}
                            className="admin-analytics-secondary"
                        >
                            <div
                                style={{
                                    minWidth: 0,
                                    padding: "24px",
                                    borderRadius: "24px",
                                    background: "#ffffff",
                                    border: "1px solid rgba(108,92,231,0.12)",
                                    boxShadow: "0 14px 38px rgba(78,64,125,0.07)",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        gap: "12px",
                                        marginBottom: "20px",
                                    }}
                                >
                                    <div>
                                        <span style={{ color: "#817b90", fontSize: "12px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                                            Bookings over time
                                        </span>
                                        <strong style={{ display: "block", marginTop: "5px", color: "#292532", fontSize: "21px" }}>
                                            Stays vs transfers
                                        </strong>
                                    </div>
                                    <span style={{ color: "#8a8298", fontSize: "11px", fontWeight: 700 }}>
                                        {analyticsData.totalBookings} total
                                    </span>
                                </div>

                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "flex-end",
                                        gap: analyticsPeriod === "12m" ? "10px" : "16px",
                                        height: "230px",
                                        padding: "8px 4px 0",
                                        borderBottom: "1px solid #eeeaf6",
                                    }}
                                >
                                    {analyticsData.buckets.map((bucket) => {
                                        const total = bucket.stays + bucket.transfers;
                                        const height = total > 0
                                            ? Math.max((total / analyticsData.maxBookings) * 175, 8)
                                            : 4;
                                        const stayHeight = total > 0
                                            ? Math.max((bucket.stays / total) * height, bucket.stays > 0 ? 5 : 0)
                                            : 0;
                                        const transferHeight = total > 0
                                            ? Math.max((bucket.transfers / total) * height, bucket.transfers > 0 ? 5 : 0)
                                            : 0;

                                        return (
                                            <div
                                                key={bucket.label}
                                                style={{
                                                    flex: 1,
                                                    minWidth: 0,
                                                    height: "100%",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "center",
                                                    justifyContent: "flex-end",
                                                    gap: "7px",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        width: "100%",
                                                        maxWidth: "44px",
                                                        height: `${height}px`,
                                                        display: "flex",
                                                        flexDirection: "column-reverse",
                                                        borderRadius: "10px 10px 4px 4px",
                                                        overflow: "hidden",
                                                        background: "#f1eef8",
                                                    }}
                                                    title={`${bucket.label}: ${bucket.stays} stays, ${bucket.transfers} transfers`}
                                                >
                                                    <div style={{ height: `${stayHeight}px`, background: "#7059e8" }} />
                                                    <div style={{ height: `${transferHeight}px`, background: "#b9aaf7" }} />
                                                </div>
                                                <span
                                                    style={{
                                                        color: "#91899d",
                                                        fontSize: analyticsPeriod === "12m" ? "9px" : "10px",
                                                        fontWeight: 700,
                                                        whiteSpace: "nowrap",
                                                    }}
                                                >
                                                    {bucket.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div style={{ display: "flex", gap: "18px", marginTop: "16px" }}>
                                    <span style={{ color: "#6e6878", fontSize: "11px", fontWeight: 700 }}>
                                        <span style={{ color: "#7059e8", marginRight: "6px" }}>●</span> Stays
                                    </span>
                                    <span style={{ color: "#6e6878", fontSize: "11px", fontWeight: 700 }}>
                                        <span style={{ color: "#b9aaf7", marginRight: "6px" }}>●</span> Transfers
                                    </span>
                                </div>
                            </div>

                            <div
                                style={{
                                    padding: "24px",
                                    borderRadius: "24px",
                                    background: "#ffffff",
                                    border: "1px solid rgba(108,92,231,0.12)",
                                    boxShadow: "0 14px 38px rgba(78,64,125,0.07)",
                                }}
                            >
                                <span style={{ color: "#817b90", fontSize: "12px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                                    Popular destinations
                                </span>
                                <strong style={{ display: "block", marginTop: "5px", color: "#292532", fontSize: "21px" }}>
                                    Where guests stay
                                </strong>

                                <div style={{ display: "grid", gap: "15px", marginTop: "22px" }}>
                                    {analyticsData.popularDestinations.length === 0 ? (
                                        <span style={{ color: "#91899d", fontSize: "12px" }}>
                                            No destination data yet.
                                        </span>
                                    ) : (
                                        analyticsData.popularDestinations.map(([name, count], index) => {
                                            const max = analyticsData.popularDestinations[0]?.[1] ?? 1;
                                            return (
                                                <div key={name}>
                                                    <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", marginBottom: "6px" }}>
                                                        <span style={{ color: "#5e5868", fontSize: "12px", fontWeight: 700 }}>
                                                            {index + 1}. {name}
                                                        </span>
                                                        <strong style={{ color: "#292532", fontSize: "12px" }}>{count}</strong>
                                                    </div>
                                                    <div style={{ height: "7px", borderRadius: "999px", background: "#eeeaf6", overflow: "hidden" }}>
                                                        <div style={{ width: `${(count / max) * 100}%`, height: "100%", borderRadius: "999px", background: "linear-gradient(90deg, #7059e8, #a08cf2)" }} />
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* TRANSFER ANALYTICS */}
                        <div
                            style={{
                                marginTop: "16px",
                                padding: "24px",
                                borderRadius: "24px",
                                background: "linear-gradient(135deg, #ffffff 0%, #faf8ff 100%)",
                                border: "1px solid rgba(108,92,231,0.12)",
                                boxShadow: "0 14px 38px rgba(78,64,125,0.07)",
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
                                <div>
                                    <span style={{ color: "#817b90", fontSize: "12px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                                        Transfer analytics
                                    </span>
                                    <strong style={{ display: "block", marginTop: "5px", color: "#292532", fontSize: "21px" }}>
                                        {dashboardStatistics.totalTransferBookings} transfer reservations
                                    </strong>
                                </div>
                                <div style={{ padding: "8px 12px", borderRadius: "999px", background: "#f0ebff", color: "#6854df", fontSize: "11px", fontWeight: 800 }}>
                                    Top city: {dashboardStatistics.topTransferCity}
                                </div>
                            </div>

                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                                    gap: "14px",
                                    marginTop: "20px",
                                }}
                                className="admin-transfer-analytics-grid"
                            >
                                <div style={{ padding: "16px", borderRadius: "16px", background: "rgba(255,255,255,0.76)", border: "1px solid #eeeaf6" }}>
                                    <span style={{ color: "#8a8298", fontSize: "11px", fontWeight: 800 }}>ONE-WAY</span>
                                    <strong style={{ display: "block", marginTop: "7px", color: "#292532", fontSize: "24px" }}>{analyticsData.oneWayTransfers}</strong>
                                    <div style={{ height: "6px", marginTop: "10px", borderRadius: "999px", background: "#eeeaf6", overflow: "hidden" }}>
                                        <div style={{ width: `${allTransferBookings.length ? (analyticsData.oneWayTransfers / allTransferBookings.length) * 100 : 0}%`, height: "100%", borderRadius: "999px", background: "#7059e8" }} />
                                    </div>
                                </div>

                                <div style={{ padding: "16px", borderRadius: "16px", background: "rgba(255,255,255,0.76)", border: "1px solid #eeeaf6" }}>
                                    <span style={{ color: "#8a8298", fontSize: "11px", fontWeight: 800 }}>RETURN</span>
                                    <strong style={{ display: "block", marginTop: "7px", color: "#292532", fontSize: "24px" }}>{analyticsData.returnTransfers}</strong>
                                    <div style={{ height: "6px", marginTop: "10px", borderRadius: "999px", background: "#eeeaf6", overflow: "hidden" }}>
                                        <div style={{ width: `${allTransferBookings.length ? (analyticsData.returnTransfers / allTransferBookings.length) * 100 : 0}%`, height: "100%", borderRadius: "999px", background: "#a08cf2" }} />
                                    </div>
                                </div>

                                <div style={{ padding: "16px", borderRadius: "16px", background: "rgba(255,255,255,0.76)", border: "1px solid #eeeaf6" }}>
                                    <span style={{ color: "#8a8298", fontSize: "11px", fontWeight: 800 }}>TRANSFER REVENUE</span>
                                    <strong style={{ display: "block", marginTop: "7px", color: "#292532", fontSize: "24px" }}>
                                        {formatPrice(allTransferBookings.reduce((sum, booking) => sum + booking.price, 0))}
                                    </strong>
                                    <span style={{ display: "block", marginTop: "5px", color: "#91899d", fontSize: "10px" }}>
                                        across all transfer reservations
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ADMIN TABS */}
                    <div
                        className="bookings-tabs admin-load-in admin-load-7"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            padding: "5px",
                            marginBottom: "30px",
                            borderRadius: "18px",
                            background: "rgba(255, 255, 255, 0.58)",
                            border: "1px solid rgba(108, 92, 231, 0.12)",
                            boxShadow: "0 8px 28px rgba(78, 64, 125, 0.07)",
                            backdropFilter: "blur(12px)",
                            WebkitBackdropFilter: "blur(12px)",
                        }}
                    >
                        <button
                            type="button"
                            className="bookings-tab"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "8px",
                                minHeight: "46px",
                                padding: "0 20px",
                                border: "1px solid transparent",
                                borderRadius: "13px",
                                background:
                                    activeAdminTab === "stays"
                                        ? "#ffffff"
                                        : "transparent",
                                color:
                                    activeAdminTab === "stays"
                                        ? "#5b4bc4"
                                        : "#777184",
                                fontSize: "15px",
                                fontWeight: 800,
                                cursor: "pointer",
                                boxShadow:
                                    activeAdminTab === "stays"
                                        ? "0 6px 18px rgba(78, 64, 125, 0.10)"
                                        : "none",
                                transition: "all 0.2s ease",
                            }}
                            onClick={() => setActiveAdminTab("stays")}
                        >
                            <span aria-hidden="true">🏨</span>
                            <span>Stays</span>
                        </button>

                        <button
                            type="button"
                            className="bookings-tab"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "8px",
                                minHeight: "46px",
                                padding: "0 20px",
                                border: "1px solid transparent",
                                borderRadius: "13px",
                                background:
                                    activeAdminTab === "transfers"
                                        ? "#ffffff"
                                        : "transparent",
                                color:
                                    activeAdminTab === "transfers"
                                        ? "#5b4bc4"
                                        : "#777184",
                                fontSize: "15px",
                                fontWeight: 800,
                                cursor: "pointer",
                                boxShadow:
                                    activeAdminTab === "transfers"
                                        ? "0 6px 18px rgba(78, 64, 125, 0.10)"
                                        : "none",
                                transition: "all 0.2s ease",
                            }}
                            onClick={() => setActiveAdminTab("transfers")}
                        >
                            <span aria-hidden="true">🚘</span>
                            <span>Transfers</span>
                        </button>

                        <button
                            type="button"
                            className="bookings-tab"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "8px",
                                minHeight: "46px",
                                padding: "0 20px",
                                border: "1px solid transparent",
                                borderRadius: "13px",
                                background:
                                    activeAdminTab === "users"
                                        ? "#ffffff"
                                        : "transparent",
                                color:
                                    activeAdminTab === "users"
                                        ? "#5b4bc4"
                                        : "#777184",
                                fontSize: "15px",
                                fontWeight: 800,
                                cursor: "pointer",
                                boxShadow:
                                    activeAdminTab === "users"
                                        ? "0 6px 18px rgba(78, 64, 125, 0.10)"
                                        : "none",
                                transition: "all 0.2s ease",
                            }}
                            onClick={() => setActiveAdminTab("users")}
                        >
                            <span aria-hidden="true">👤</span>
                            <span>Users</span>
                        </button>
                    </div>

                    {activeAdminTab === "stays" && (
                        <>

                            {/* PROPERTIES */}

                            <section className="admin-section admin-load-in admin-load-8">

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
                                <section
                                    ref={roomsSectionRef}
                                    className="admin-section"
                                >

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

                        </>
                    )}

                    {activeAdminTab === "users" && (
                        <section className="admin-section">

                            <div className="admin-section-header">
                                <div>
                                    <h2>Users</h2>
                                    <p>Manage registered users and view the currently logged-in account.</p>
                                </div>
                            </div>

                            {/* USER OVERVIEW */}
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                                    gap: "14px",
                                    marginBottom: "22px",
                                }}
                                className="admin-user-overview"
                            >
                                <div
                                    style={{
                                        padding: "18px 20px",
                                        borderRadius: "18px",
                                        background: "linear-gradient(135deg, #ffffff 0%, #faf8ff 100%)",
                                        border: "1px solid #ebe6f5",
                                        boxShadow: "0 8px 24px rgba(78, 64, 125, 0.05)",
                                    }}
                                >
                                    <span style={{ color: "#8a8298", fontSize: "11px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                                        Total users
                                    </span>
                                    <strong style={{ display: "block", marginTop: "7px", color: "#292532", fontSize: "26px", lineHeight: 1 }}>
                                        {users.length}
                                    </strong>
                                </div>

                                <div
                                    style={{
                                        padding: "18px 20px",
                                        borderRadius: "18px",
                                        background: "linear-gradient(135deg, #ffffff 0%, #faf8ff 100%)",
                                        border: "1px solid #ebe6f5",
                                        boxShadow: "0 8px 24px rgba(78, 64, 125, 0.05)",
                                    }}
                                >
                                    <span style={{ color: "#8a8298", fontSize: "11px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                                        Admin accounts
                                    </span>
                                    <strong style={{ display: "block", marginTop: "7px", color: "#292532", fontSize: "26px", lineHeight: 1 }}>
                                        {adminUsers.length}
                                    </strong>
                                </div>

                                <div
                                    style={{
                                        padding: "18px 20px",
                                        borderRadius: "18px",
                                        background: "linear-gradient(135deg, #ffffff 0%, #faf8ff 100%)",
                                        border: "1px solid #ebe6f5",
                                        boxShadow: "0 8px 24px rgba(78, 64, 125, 0.05)",
                                    }}
                                >
                                    <span style={{ color: "#8a8298", fontSize: "11px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                                        Current account
                                    </span>
                                    <strong
                                        style={{
                                            display: "block",
                                            marginTop: "7px",
                                            color: "#654fe0",
                                            fontSize: "16px",
                                            lineHeight: 1.25,
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {currentUser.name}
                                    </strong>
                                </div>
                            </div>

                            {/* USER MANAGEMENT + CURRENT ACCOUNT */}
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "minmax(0, 1.55fr) minmax(280px, 0.75fr)",
                                    gap: "22px",
                                    alignItems: "stretch",
                                }}
                                className="admin-users-grid"
                            >
                                {/* USER LIST */}
                                <div
                                    style={{
                                        minWidth: 0,
                                        padding: "22px",
                                        border: "1px solid #ebe6f5",
                                        borderRadius: "20px",
                                        background: "#ffffff",
                                        boxShadow: "0 8px 24px rgba(78, 64, 125, 0.05)",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            gap: "16px",
                                            marginBottom: "18px",
                                        }}
                                    >
                                        <div>
                                            <h3 style={{ margin: 0, color: "#292532", fontSize: "20px" }}>
                                                Registered users
                                            </h3>
                                            <p style={{ margin: "5px 0 0", color: "#817b90", fontSize: "13px" }}>
                                                Search and filter StayWay accounts.
                                            </p>
                                        </div>
                                    </div>

                                    <div
                                        className="admin-user-filters"
                                        style={{ marginBottom: "16px" }}
                                    >
                                        <input
                                            type="text"
                                            placeholder="Search users..."
                                            value={userSearch}
                                            onChange={(event) =>
                                                setUserSearch(event.target.value)
                                            }
                                        />

                                        <select
                                            value={userRoleFilter}
                                            onChange={(event) =>
                                                setUserRoleFilter(event.target.value)
                                            }
                                        >
                                            <option value="All">All roles</option>
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>

                                    <div className="admin-table">
                                        <div className="admin-table-header">
                                            <span>Name</span>
                                            <span>Email</span>
                                            <span>Role</span>
                                        </div>

                                        {filteredUsers.length === 0 ? (
                                            <div className="admin-empty-state">
                                                <p>No users found.</p>
                                                <button
                                                    type="button"
                                                    className="admin-cancel-button"
                                                    onClick={() => {
                                                        setUserSearch("");
                                                        setUserRoleFilter("All");
                                                    }}
                                                >
                                                    Clear filters
                                                </button>
                                            </div>
                                        ) : (
                                            filteredUsers.map((user) => (
                                                <div
                                                    className="admin-table-row"
                                                    key={user.id}
                                                >
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: "10px",
                                                            minWidth: 0,
                                                        }}
                                                    >
                                                        <span
                                                            style={{
                                                                width: "34px",
                                                                height: "34px",
                                                                borderRadius: "11px",
                                                                display: "inline-flex",
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                                background: "#f0ebff",
                                                                color: "#6954db",
                                                                fontSize: "12px",
                                                                fontWeight: 900,
                                                                flexShrink: 0,
                                                            }}
                                                        >
                                                            {(user.name?.[0] || "U").toUpperCase()}
                                                        </span>
                                                        <strong style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                            {user.name}
                                                        </strong>
                                                    </div>

                                                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                        {user.email}
                                                    </span>

                                                    <span
                                                        className={
                                                            user.role === "admin"
                                                                ? "role-badge role-admin"
                                                                : "role-badge"
                                                        }
                                                    >
                                                        {user.role}
                                                    </span>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* CURRENT ACCOUNT */}
                                <div
                                    style={{
                                        minWidth: 0,
                                        padding: "24px",
                                        border: "1px solid #ebe6f5",
                                        borderRadius: "20px",
                                        background: "linear-gradient(145deg, #faf8ff 0%, #f3efff 100%)",
                                        boxShadow: "0 8px 24px rgba(78, 64, 125, 0.05)",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "14px",
                                            marginBottom: "22px",
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: "58px",
                                                height: "58px",
                                                borderRadius: "17px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                background: "#ffffff",
                                                color: "#6652d7",
                                                fontSize: "20px",
                                                fontWeight: 900,
                                                boxShadow: "0 8px 20px rgba(78, 64, 125, 0.08)",
                                            }}
                                        >
                                            {currentUser.name
                                                .split(" ")
                                                .map((part) => part[0])
                                                .join("")
                                                .slice(0, 2)
                                                .toUpperCase()}
                                        </div>

                                        <div style={{ minWidth: 0 }}>
                                            <div
                                                style={{
                                                    fontSize: "11px",
                                                    fontWeight: 900,
                                                    letterSpacing: "0.08em",
                                                    textTransform: "uppercase",
                                                    color: "#8b8499",
                                                    marginBottom: "4px",
                                                }}
                                            >
                                                Current logged user
                                            </div>
                                            <h3
                                                style={{
                                                    margin: 0,
                                                    fontSize: "20px",
                                                    color: "#292532",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    whiteSpace: "nowrap",
                                                }}
                                            >
                                                {currentUser.name}
                                            </h3>
                                        </div>
                                    </div>

                                    <div style={{ display: "grid", gap: "12px" }}>
                                        <div
                                            style={{
                                                padding: "15px 16px",
                                                borderRadius: "14px",
                                                background: "#ffffff",
                                                border: "1px solid #eee9f7",
                                            }}
                                        >
                                            <div style={{ fontSize: "11px", fontWeight: 800, color: "#91899f", textTransform: "uppercase", marginBottom: "5px" }}>
                                                Email
                                            </div>
                                            <div style={{ fontSize: "14px", fontWeight: 700, color: "#302a3d", overflowWrap: "anywhere" }}>
                                                {currentUser.email}
                                            </div>
                                        </div>

                                        <div
                                            style={{
                                                padding: "15px 16px",
                                                borderRadius: "14px",
                                                background: "#ffffff",
                                                border: "1px solid #eee9f7",
                                            }}
                                        >
                                            <div style={{ fontSize: "11px", fontWeight: 800, color: "#91899f", textTransform: "uppercase", marginBottom: "5px" }}>
                                                Role
                                            </div>
                                            <span
                                                className={currentUser.role === "admin" ? "role-badge role-admin" : "role-badge"}
                                            >
                                                {currentUser.role}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {activeAdminTab === "transfers" && (
                        <>

                            {/* TRANSFER MANAGEMENT */}

                            <section className="admin-section admin-transfer-section">

                                <div className="admin-section-header">
                                    <div>
                                        <h2>Transfer Management</h2>
                                        <p>Manage transfer vehicles and drivers.</p>
                                    </div>
                                </div>

                                <div className="admin-transfer-city-selector">
                                    <label htmlFor="transferCity">
                                        City
                                    </label>

                                    <select
                                        id="transferCity"
                                        value={selectedTransferCity}
                                        onChange={(event) => {
                                            const city = event.target.value;

                                            setSelectedTransferCity(city);
                                            setVehicleCity(city);
                                            setDriverCity(city);
                                        }}
                                    >
                                        {allDestinations
                                            .filter((destination) =>
                                                allProperties.some(
                                                    (property) =>
                                                        property.destinationId === destination.id
                                                )
                                            )
                                            .map((destination) => (
                                                <option
                                                    key={destination.id}
                                                    value={destination.name}
                                                >
                                                    {destination.name}
                                                </option>
                                            ))}
                                    </select>
                                </div>

                                <div className="admin-transfer-columns">

                                    {/* VEHICLES */}

                                    <div className="admin-transfer-card">

                                        <div className="admin-transfer-card-header">
                                            <div>
                                                <h3>Vehicles</h3>
                                                <p>
                                                    Vehicles available for transfers in{" "}
                                                    <strong>{selectedTransferCity}</strong>.
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                className="admin-action-button"
                                                onClick={() => {
                                                    setEditingVehicleId(null);
                                                    setVehicleCity(selectedTransferCity);
                                                    setVehicleName("");
                                                    setVehicleLicensePlate("");
                                                    setVehicleCategory("Private");
                                                    setVehiclePassengers("3");
                                                    setVehicleLuggage("2");
                                                    setVehicleImage("");
                                                    setVehicleError("");
                                                    setIsVehicleFormOpen(true);
                                                }}
                                            >
                                                + Add vehicle
                                            </button>
                                        </div>

                                        <div
                                            style={{
                                                display: "grid",
                                                gridTemplateColumns: "minmax(0, 1fr) 165px",
                                                gap: "10px",
                                                marginTop: "16px",
                                                padding: "12px",
                                                borderRadius: "14px",
                                                background: "#faf8ff",
                                                border: "1px solid #eee9f7",
                                            }}
                                        >
                                            <div className="form-group" style={{ margin: 0 }}>
                                                <label
                                                    htmlFor="transferVehicleSearch"
                                                    style={{
                                                        display: "block",
                                                        marginBottom: "7px",
                                                        fontSize: "12px",
                                                        fontWeight: 800,
                                                        color: "#5f596d",
                                                    }}
                                                >
                                                    Search vehicles
                                                </label>
                                                <input
                                                    id="transferVehicleSearch"
                                                    style={{ width: "100%", boxSizing: "border-box" }}
                                                    type="text"
                                                    value={transferVehicleSearch}
                                                    onChange={(event) =>
                                                        setTransferVehicleSearch(event.target.value)
                                                    }
                                                    placeholder="Name or license plate..."
                                                />
                                            </div>

                                            <div className="form-group" style={{ margin: 0 }}>
                                                <label
                                                    htmlFor="transferVehicleCategoryFilter"
                                                    style={{
                                                        display: "block",
                                                        marginBottom: "7px",
                                                        fontSize: "12px",
                                                        fontWeight: 800,
                                                        color: "#5f596d",
                                                    }}
                                                >
                                                    Category
                                                </label>
                                                <select
                                                    id="transferVehicleCategoryFilter"
                                                    style={{ width: "100%", boxSizing: "border-box" }}
                                                    value={transferVehicleCategoryFilter}
                                                    onChange={(event) =>
                                                        setTransferVehicleCategoryFilter(
                                                            event.target.value as typeof transferVehicleCategoryFilter
                                                        )
                                                    }
                                                >
                                                    <option value="all">All categories</option>
                                                    <option value="Private">Private</option>
                                                    <option value="Comfort">Comfort</option>
                                                    <option value="Family">Family</option>
                                                </select>
                                            </div>
                                        </div>

                                        {isVehicleFormOpen && (
                                            <form
                                                className="admin-transfer-form"
                                                onSubmit={handleTransferVehicleSubmit}
                                            >
                                                <h4>
                                                    {editingVehicleId
                                                        ? "Edit vehicle"
                                                        : "Add vehicle"}
                                                </h4>

                                                {vehicleError && (
                                                    <p className="admin-form-error">
                                                        {vehicleError}
                                                    </p>
                                                )}

                                                <div className="admin-transfer-form-grid">

                                                    <div className="form-group">
                                                        <label htmlFor="vehicleCity">
                                                            City
                                                        </label>

                                                        <select
                                                            id="vehicleCity"
                                                            value={vehicleCity}
                                                            onChange={(event) =>
                                                                setVehicleCity(event.target.value)
                                                            }
                                                        >
                                                            {allDestinations
                                                                .filter((destination) =>
                                                                    allProperties.some(
                                                                        (property) =>
                                                                            property.destinationId === destination.id
                                                                    )
                                                                )
                                                                .map((destination) => (
                                                                    <option
                                                                        key={destination.id}
                                                                        value={destination.name}
                                                                    >
                                                                        {destination.name}
                                                                    </option>
                                                                ))}
                                                        </select>
                                                    </div>

                                                    <div className="form-group">
                                                        <label htmlFor="vehicleName">
                                                            Vehicle
                                                        </label>

                                                        <input
                                                            id="vehicleName"
                                                            type="text"
                                                            value={vehicleName}
                                                            onChange={(event) =>
                                                                setVehicleName(event.target.value)
                                                            }
                                                            placeholder="Mercedes-Benz E-Class"
                                                        />
                                                    </div>

                                                    <div className="form-group">
                                                        <label htmlFor="vehicleLicensePlate">
                                                            License plate
                                                        </label>

                                                        <input
                                                            id="vehicleLicensePlate"
                                                            type="text"
                                                            value={vehicleLicensePlate}
                                                            onChange={(event) =>
                                                                setVehicleLicensePlate(event.target.value)
                                                            }
                                                            placeholder="e.g. AB-241-KL"
                                                        />
                                                    </div>

                                                    <div className="form-group">
                                                        <label htmlFor="vehicleCategory">
                                                            Category
                                                        </label>

                                                        <select
                                                            id="vehicleCategory"
                                                            value={vehicleCategory}
                                                            onChange={(event) =>
                                                                setVehicleCategory(
                                                                    event.target.value as
                                                                        | "Private"
                                                                        | "Comfort"
                                                                        | "Family"
                                                                )
                                                            }
                                                        >
                                                            <option value="Private">
                                                                Private
                                                            </option>
                                                            <option value="Comfort">
                                                                Comfort
                                                            </option>
                                                            <option value="Family">
                                                                Family
                                                            </option>
                                                        </select>
                                                    </div>

                                                    <div className="form-group">
                                                        <label htmlFor="vehiclePassengers">
                                                            Passengers
                                                        </label>

                                                        <input
                                                            id="vehiclePassengers"
                                                            type="number"
                                                            min="1"
                                                            value={vehiclePassengers}
                                                            onChange={(event) =>
                                                                setVehiclePassengers(
                                                                    event.target.value
                                                                )
                                                            }
                                                        />
                                                    </div>

                                                    <div className="form-group">
                                                        <label htmlFor="vehicleLuggage">
                                                            Luggage
                                                        </label>

                                                        <input
                                                            id="vehicleLuggage"
                                                            type="number"
                                                            min="0"
                                                            value={vehicleLuggage}
                                                            onChange={(event) =>
                                                                setVehicleLuggage(
                                                                    event.target.value
                                                                )
                                                            }
                                                        />
                                                    </div>

                                                    <div className="form-group">
                                                        <label htmlFor="vehicleImage">
                                                            Image filename
                                                        </label>

                                                        <input
                                                            id="vehicleImage"
                                                            type="text"
                                                            value={vehicleImage}
                                                            onChange={(event) =>
                                                                setVehicleImage(event.target.value)
                                                            }
                                                            placeholder="e.g. athens-private-1.jpg"
                                                        />
                                                    </div>

                                                </div>

                                                <div className="admin-form-actions">

                                                    <button
                                                        type="submit"
                                                        className="admin-save-button"
                                                    >
                                                        {editingVehicleId
                                                            ? "Save changes"
                                                            : "Add vehicle"}
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="admin-cancel-button"
                                                        onClick={() => {
                                                            setIsVehicleFormOpen(false);
                                                            setEditingVehicleId(null);
                                                            setVehicleError("");
                                                        }}
                                                    >
                                                        Cancel
                                                    </button>

                                                </div>
                                            </form>
                                        )}

                                        {allTransferVehicles
                                            .filter((vehicle) => {
                                                if (
                                                    vehicle.city.toLowerCase() !==
                                                    selectedTransferCity.toLowerCase()
                                                ) {
                                                    return false;
                                                }

                                                if (
                                                    transferVehicleCategoryFilter !== "all" &&
                                                    vehicle.category !== transferVehicleCategoryFilter
                                                ) {
                                                    return false;
                                                }

                                                const search = transferVehicleSearch.trim().toLowerCase();
                                                if (!search) {
                                                    return true;
                                                }

                                                return [
                                                    vehicle.name,
                                                    vehicle.licensePlate,
                                                    vehicle.category,
                                                ]
                                                    .filter(Boolean)
                                                    .join(" ")
                                                    .toLowerCase()
                                                    .includes(search);
                                            })
                                            .map((vehicle) => (
                                                <div
                                                    className="admin-transfer-item"
                                                    key={vehicle.id}
                                                >
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: "12px",
                                                            minWidth: 0,
                                                        }}
                                                    >
                                                        {vehicle.image ? (
                                                            <img
                                                                src={vehicle.image}
                                                                alt={vehicle.name}
                                                                style={{
                                                                    width: "72px",
                                                                    height: "48px",
                                                                    borderRadius: "10px",
                                                                    objectFit: "cover",
                                                                    flexShrink: 0,
                                                                    background: "#f1edff",
                                                                }}
                                                            />
                                                        ) : (
                                                            <div
                                                                style={{
                                                                    width: "72px",
                                                                    height: "48px",
                                                                    borderRadius: "10px",
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "center",
                                                                    background: "#f1edff",
                                                                    fontSize: "22px",
                                                                    flexShrink: 0,
                                                                }}
                                                            >
                                                                🚘
                                                            </div>
                                                        )}
                                                        <div style={{ minWidth: 0 }}>
                                                            <strong
                                                                style={{
                                                                    display: "block",
                                                                    fontSize: "14px",
                                                                    color: "#302c3a",
                                                                }}
                                                            >
                                                                {vehicle.name}
                                                            </strong>

                                                            <span
                                                                style={{
                                                                    display: "block",
                                                                    marginTop: "4px",
                                                                    color: "#777182",
                                                                    fontSize: "12px",
                                                                }}
                                                            >
                                                                {vehicle.licensePlate} ·{" "}
                                                                {vehicle.category} ·{" "}
                                                                {vehicle.passengers} passengers ·{" "}
                                                                {vehicle.luggage} luggage
                                                            </span>

                                                            {(() => {
                                                                const assignedDriver =
                                                                    allTransferDrivers.find(
                                                                        (driver) =>
                                                                            driver.id === vehicle.driverId
                                                                    );

                                                                return (
                                                                    <small
                                                                        style={{
                                                                            display: "block",
                                                                            marginTop: "4px",
                                                                            color: "#8a8298",
                                                                            fontSize: "11px",
                                                                        }}
                                                                    >
                                                                        👤{" "}
                                                                        {assignedDriver
                                                                            ? assignedDriver.name
                                                                            : "No driver assigned"}
                                                                    </small>
                                                                );
                                                            })()}
                                                        </div>
                                                    </div>

                                                    <div className="admin-row-actions">
                                                        <button
                                                            type="button"
                                                            className="admin-edit-button"
                                                            onClick={() =>
                                                                handleEditTransferVehicle(vehicle)
                                                            }
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="admin-delete-button"
                                                            onClick={() =>
                                                                handleDeleteTransferVehicle(vehicle.id)
                                                            }
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}

                                    </div>

                                    {/* DRIVERS */}

                                    <div className="admin-transfer-card">

                                        <div className="admin-transfer-card-header">
                                            <div>
                                                <h3>Drivers</h3>
                                                <p>
                                                    Drivers available in{" "}
                                                    <strong>{selectedTransferCity}</strong>.
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                className="admin-action-button"
                                                onClick={() => {
                                                    setEditingDriverId(null);
                                                    setDriverCity(selectedTransferCity);
                                                    setDriverName("");
                                                    setDriverPhone("");
                                                    setDriverStatus("available");
                                                    setTransferDriverVehicleId(
                                                        allTransferVehicles.find(
                                                            (vehicle) =>
                                                                vehicle.city.toLowerCase() ===
                                                                selectedTransferCity.toLowerCase() &&
                                                                !vehicle.driverId
                                                        )?.id ||
                                                        allTransferVehicles.find(
                                                            (vehicle) =>
                                                                vehicle.city.toLowerCase() ===
                                                                selectedTransferCity.toLowerCase()
                                                        )?.id ||
                                                        ""
                                                    );
                                                    setDriverError("");
                                                    setIsDriverFormOpen(true);
                                                }}
                                            >
                                                + Add driver
                                            </button>
                                        </div>

                                        <div
                                            style={{
                                                display: "grid",
                                                gridTemplateColumns: "minmax(0, 1fr) 165px",
                                                gap: "10px",
                                                marginTop: "16px",
                                                padding: "12px",
                                                borderRadius: "14px",
                                                background: "#faf8ff",
                                                border: "1px solid #eee9f7",
                                            }}
                                        >
                                            <div className="form-group" style={{ margin: 0 }}>
                                                <label
                                                    htmlFor="transferDriverSearch"
                                                    style={{
                                                        display: "block",
                                                        marginBottom: "7px",
                                                        fontSize: "12px",
                                                        fontWeight: 800,
                                                        color: "#5f596d",
                                                    }}
                                                >
                                                    Search drivers
                                                </label>
                                                <input
                                                    id="transferDriverSearch"
                                                    style={{ width: "100%", boxSizing: "border-box" }}
                                                    type="text"
                                                    value={transferDriverSearch}
                                                    onChange={(event) =>
                                                        setTransferDriverSearch(event.target.value)
                                                    }
                                                    placeholder="Name or phone..."
                                                />
                                            </div>

                                            <div className="form-group" style={{ margin: 0 }}>
                                                <label
                                                    htmlFor="transferDriverStatusFilter"
                                                    style={{
                                                        display: "block",
                                                        marginBottom: "7px",
                                                        fontSize: "12px",
                                                        fontWeight: 800,
                                                        color: "#5f596d",
                                                    }}
                                                >
                                                    Status
                                                </label>
                                                <select
                                                    id="transferDriverStatusFilter"
                                                    style={{ width: "100%", boxSizing: "border-box" }}
                                                    value={transferDriverStatusFilter}
                                                    onChange={(event) =>
                                                        setTransferDriverStatusFilter(
                                                            event.target.value as typeof transferDriverStatusFilter
                                                        )
                                                    }
                                                >
                                                    <option value="all">All statuses</option>
                                                    <option value="available">Available</option>
                                                    <option value="busy">Busy</option>
                                                    <option value="inactive">Inactive</option>
                                                </select>
                                            </div>
                                        </div>

                                        {isDriverFormOpen && (
                                            <form
                                                className="admin-transfer-form"
                                                onSubmit={handleTransferDriverSubmit}
                                            >
                                                <h4>
                                                    {editingDriverId
                                                        ? "Edit driver"
                                                        : "Add driver"}
                                                </h4>

                                                {driverError && (
                                                    <p className="admin-form-error">
                                                        {driverError}
                                                    </p>
                                                )}

                                                <div className="admin-transfer-form-grid">

                                                    <div className="form-group">
                                                        <label htmlFor="driverCity">
                                                            City
                                                        </label>

                                                        <select
                                                            id="driverCity"
                                                            value={driverCity}
                                                            onChange={(event) => {
                                                                setDriverCity(event.target.value);
                                                                setTransferDriverVehicleId("");
                                                            }}
                                                        >
                                                            {allDestinations
                                                                .filter((destination) =>
                                                                    allProperties.some(
                                                                        (property) =>
                                                                            property.destinationId === destination.id
                                                                    )
                                                                )
                                                                .map((destination) => (
                                                                    <option
                                                                        key={destination.id}
                                                                        value={destination.name}
                                                                    >
                                                                        {destination.name}
                                                                    </option>
                                                                ))}
                                                        </select>
                                                    </div>

                                                    <div className="form-group">
                                                        <label htmlFor="driverVehicle">
                                                            Assigned vehicle
                                                        </label>
                                                        <select
                                                            id="driverVehicle"
                                                            value={transferDriverVehicleId}
                                                            onChange={(event) =>
                                                                setTransferDriverVehicleId(
                                                                    event.target.value
                                                                )
                                                            }
                                                        >
                                                            <option value="">
                                                                Select a vehicle
                                                            </option>
                                                            {allTransferVehicles
                                                                .filter(
                                                                    (vehicle) =>
                                                                        vehicle.city.toLowerCase() ===
                                                                        driverCity.toLowerCase() &&
                                                                        (!vehicle.driverId ||
                                                                            vehicle.driverId ===
                                                                            editingDriverId)
                                                                )
                                                                .map((vehicle) => (
                                                                    <option
                                                                        key={vehicle.id}
                                                                        value={vehicle.id}
                                                                    >
                                                                        {vehicle.name} ·{" "}
                                                                        {vehicle.licensePlate} ·{" "}
                                                                        {vehicle.category}
                                                                    </option>
                                                                ))}
                                                        </select>
                                                    </div>

                                                    <div className="form-group">
                                                        <label htmlFor="driverName">
                                                            Name
                                                        </label>

                                                        <input
                                                            id="driverName"
                                                            type="text"
                                                            value={driverName}
                                                            onChange={(event) =>
                                                                setDriverName(event.target.value)
                                                            }
                                                            placeholder="Driver name"
                                                        />
                                                    </div>

                                                    <div className="form-group">
                                                        <label htmlFor="driverPhone">
                                                            Phone
                                                        </label>

                                                        <input
                                                            id="driverPhone"
                                                            type="tel"
                                                            value={driverPhone}
                                                            onChange={(event) =>
                                                                setDriverPhone(event.target.value)
                                                            }
                                                            placeholder="+30 690 123 4567"
                                                        />
                                                    </div>

                                                    <div className="form-group">
                                                        <label htmlFor="driverStatus">
                                                            Status
                                                        </label>

                                                        <select
                                                            id="driverStatus"
                                                            value={driverStatus}
                                                            onChange={(event) =>
                                                                setDriverStatus(
                                                                    event.target.value as
                                                                        | "available"
                                                                        | "busy"
                                                                        | "inactive"
                                                                )
                                                            }
                                                        >
                                                            <option value="available">
                                                                Available
                                                            </option>
                                                            <option value="busy">
                                                                Busy
                                                            </option>
                                                            <option value="inactive">
                                                                Inactive
                                                            </option>
                                                        </select>
                                                    </div>

                                                </div>

                                                <div className="admin-form-actions">

                                                    <button
                                                        type="submit"
                                                        className="admin-save-button"
                                                    >
                                                        {editingDriverId
                                                            ? "Save changes"
                                                            : "Add driver"}
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="admin-cancel-button"
                                                        onClick={() => {
                                                            setIsDriverFormOpen(false);
                                                            setEditingDriverId(null);
                                                            setDriverError("");
                                                        }}
                                                    >
                                                        Cancel
                                                    </button>

                                                </div>
                                            </form>
                                        )}

                                        {allTransferDrivers
                                            .filter((driver) => {
                                                if (
                                                    driver.city.toLowerCase() !==
                                                    selectedTransferCity.toLowerCase()
                                                ) {
                                                    return false;
                                                }

                                                const status = getTransferDriverStatus(driver.id);

                                                if (
                                                    transferDriverStatusFilter !== "all" &&
                                                    status !== transferDriverStatusFilter
                                                ) {
                                                    return false;
                                                }

                                                const search = transferDriverSearch.trim().toLowerCase();
                                                if (!search) {
                                                    return true;
                                                }

                                                return [driver.name, driver.phone, status]
                                                    .filter(Boolean)
                                                    .join(" ")
                                                    .toLowerCase()
                                                    .includes(search);
                                            })
                                            .map((driver) => (
                                                <div
                                                    className="admin-transfer-item"
                                                    key={driver.id}
                                                >
                                                    <div>
                                                        <strong>{driver.name}</strong>

                                                        <span>
                                                            {driver.phone} ·{" "}
                                                            <span
                                                                style={{
                                                                    color:
                                                                        getTransferDriverStatus(driver.id) === "available"
                                                                            ? "#16a34a"
                                                                            : getTransferDriverStatus(driver.id) === "busy"
                                                                                ? "#f59e0b"
                                                                                : "#dc2626",
                                                                    fontWeight: 700,
                                                                }}
                                                            >
                                                                {getTransferDriverStatus(driver.id)}
                                                            </span>
                                                        </span>

                                                        {(() => {
                                                            const assignedVehicle =
                                                                allTransferVehicles.find(
                                                                    (vehicle) =>
                                                                        vehicle.driverId === driver.id
                                                                );

                                                            return (
                                                                <span
                                                                    style={{
                                                                        display: "block",
                                                                        marginTop: "5px",
                                                                        color: "#5f596d",
                                                                        fontSize: "12px",
                                                                    }}
                                                                >
                                                                    🚘{" "}
                                                                    {assignedVehicle
                                                                        ? `${assignedVehicle.name} · ${assignedVehicle.licensePlate}`
                                                                        : "No vehicle assigned"}
                                                                </span>
                                                            );
                                                        })()}

                                                        {getTransferDriverStatus(driver.id) === "busy" &&
                                                            getTransferDriverBookings(driver.id).map(
                                                                (booking) => (
                                                                    <small key={booking.id}>
                                                                        {booking.date} · {booking.time}
                                                                    </small>
                                                                )
                                                            )}
                                                    </div>

                                                    <div className="admin-row-actions">
                                                        <button
                                                            type="button"
                                                            className="admin-edit-button"
                                                            onClick={() =>
                                                                handleEditTransferDriver(driver)
                                                            }
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="admin-delete-button"
                                                            onClick={() =>
                                                                handleDeleteTransferDriver(driver.id)
                                                            }
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}

                                    </div>

                                </div>

                            </section>

                            {/* TRANSFER BOOKINGS */}

                            <section className="admin-section admin-bookings-section admin-load-in admin-load-8"
                                     style={{
                                         marginTop: "34px",
                                         padding: "28px",
                                         borderRadius: "24px",
                                         background: "rgba(255,255,255,0.92)",
                                         border: "1px solid #e7e0f5",
                                         boxShadow: "0 16px 40px rgba(75, 55, 125, 0.07)",
                                     }}
                            >

                                <div
                                    className="admin-section-header"
                                    style={{
                                        marginBottom: "22px",
                                        paddingBottom: "20px",
                                        borderBottom: "1px solid #eee9f6",
                                    }}
                                >
                                    <div>
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "12px",
                                                marginBottom: "7px",
                                            }}
                                        >
                                            <span
                                                style={{
                                                    width: "42px",
                                                    height: "42px",
                                                    borderRadius: "13px",
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    background: "#f0ebff",
                                                    fontSize: "21px",
                                                }}
                                            >
                                                🚘
                                            </span>
                                            <h2 style={{ margin: 0 }}>Transfer Bookings</h2>
                                        </div>
                                        <p style={{ margin: 0 }}>
                                            Users who booked a taxi in <strong>{selectedTransferCity}</strong>.
                                        </p>
                                    </div>
                                </div>

                                <div
                                    style={{
                                        marginBottom: "18px",
                                        padding: "16px",
                                        borderRadius: "18px",
                                        border: "1px solid #ebe5f5",
                                        background: "#fbf9ff",
                                        display: "grid",
                                        gridTemplateColumns: "minmax(280px, 1fr) 190px",
                                        gap: "12px",
                                        alignItems: "end",
                                    }}
                                >
                                    <div className="form-group" style={{ margin: 0 }}>
                                        <label
                                            htmlFor="transferBookingSearch"
                                            style={{
                                                display: "block",
                                                marginBottom: "7px",
                                                fontSize: "12px",
                                                fontWeight: 800,
                                                color: "#5f596d",
                                            }}
                                        >
                                            Search bookings
                                        </label>
                                        <input
                                            id="transferBookingSearch"
                                            style={{ width: "100%", boxSizing: "border-box" }}
                                            type="text"
                                            value={transferBookingSearch}
                                            onChange={(event) =>
                                                setTransferBookingSearch(event.target.value)
                                            }
                                            placeholder="Name, email, phone, vehicle, route..."
                                        />
                                    </div>

                                    <div className="form-group" style={{ margin: 0 }}>
                                        <label
                                            htmlFor="transferBookingTypeFilter"
                                            style={{
                                                display: "block",
                                                marginBottom: "7px",
                                                fontSize: "12px",
                                                fontWeight: 800,
                                                color: "#5f596d",
                                            }}
                                        >
                                            Transfer type
                                        </label>
                                        <select
                                            id="transferBookingTypeFilter"
                                            style={{ width: "100%", boxSizing: "border-box" }}
                                            value={transferBookingTypeFilter}
                                            onChange={(event) =>
                                                setTransferBookingTypeFilter(
                                                    event.target.value as typeof transferBookingTypeFilter
                                                )
                                            }
                                        >
                                            <option value="all">All transfers</option>
                                            <option value="one-way">One-way</option>
                                            <option value="return">Return</option>
                                        </select>
                                    </div>
                                </div>

                                {filteredTransferBookings.length === 0 ? (
                                    <div className="admin-empty-state">
                                        <p>No transfer bookings for this city.</p>
                                    </div>
                                ) : (
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "16px",
                                        }}
                                    >
                                        {filteredTransferBookings.map((booking) => {
                                            const vehicle = allTransferVehicles.find(
                                                (item) => item.id === booking.vehicleId
                                            );

                                            const driver = allTransferDrivers.find(
                                                (item) => item.id === booking.driverId
                                            );

                                            const vehicleImage = vehicle?.image;
                                            const isReturn = booking.transferType === "return";

                                            return (
                                                <div
                                                    key={booking.id}
                                                    style={{
                                                        position: "relative",
                                                        padding: "16px 18px",
                                                        borderRadius: "20px",
                                                        border: "1px solid #ebe5f5",
                                                        background: "#ffffff",
                                                        boxShadow: "0 8px 24px rgba(73, 55, 116, 0.055)",
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            display: "grid",
                                                            gridTemplateColumns: "minmax(190px, 1.05fr) minmax(205px, 1.1fr) minmax(250px, 1.4fr) 96px",
                                                            gap: "14px",
                                                            alignItems: "center",
                                                        }}
                                                    >
                                                        {/* USER */}
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                gap: "11px",
                                                                minWidth: 0,
                                                            }}
                                                        >
                                                            <div
                                                                style={{
                                                                    width: "46px",
                                                                    height: "46px",
                                                                    borderRadius: "15px",
                                                                    flexShrink: 0,
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "center",
                                                                    background: "linear-gradient(135deg, #eee8ff, #f7f4ff)",
                                                                    color: "#7055e8",
                                                                    fontSize: "19px",
                                                                    fontWeight: 800,
                                                                }}
                                                            >
                                                                {(booking.firstName?.[0] || "U").toUpperCase()}
                                                                {(booking.lastName?.[0] || "").toUpperCase()}
                                                            </div>
                                                            <div style={{ minWidth: 0 }}>
                                                                <strong
                                                                    style={{
                                                                        display: "block",
                                                                        color: "#2c2935",
                                                                        fontSize: "15px",
                                                                        lineHeight: 1.3,
                                                                    }}
                                                                >
                                                                    {booking.firstName} {booking.lastName}
                                                                </strong>
                                                                <span
                                                                    style={{
                                                                        display: "block",
                                                                        marginTop: "5px",
                                                                        color: "#777182",
                                                                        fontSize: "13px",
                                                                    }}
                                                                >
                                                                    {booking.email}
                                                                </span>
                                                                <span
                                                                    style={{
                                                                        display: "block",
                                                                        marginTop: "3px",
                                                                        color: "#777182",
                                                                        fontSize: "13px",
                                                                    }}
                                                                >
                                                                    {booking.phone}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* VEHICLE */}
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                gap: "10px",
                                                                minWidth: 0,
                                                            }}
                                                        >
                                                            {vehicleImage ? (
                                                                <img
                                                                    src={vehicleImage}
                                                                    alt={booking.vehicleName || vehicle?.name || "Transfer vehicle"}
                                                                    style={{
                                                                        width: "76px",
                                                                        height: "54px",
                                                                        objectFit: "cover",
                                                                        borderRadius: "13px",
                                                                        flexShrink: 0,
                                                                        background: "#f2effa",
                                                                    }}
                                                                />
                                                            ) : (
                                                                <div
                                                                    style={{
                                                                        width: "76px",
                                                                        height: "54px",
                                                                        borderRadius: "13px",
                                                                        flexShrink: 0,
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                        justifyContent: "center",
                                                                        background: "#f2effa",
                                                                        fontSize: "24px",
                                                                    }}
                                                                >
                                                                    🚘
                                                                </div>
                                                            )}
                                                            <div style={{ minWidth: 0 }}>
                                                                <span
                                                                    style={{
                                                                        display: "block",
                                                                        color: "#8a8298",
                                                                        fontSize: "11px",
                                                                        fontWeight: 800,
                                                                        textTransform: "uppercase",
                                                                        letterSpacing: "0.08em",
                                                                    }}
                                                                >
                                                                    Vehicle
                                                                </span>
                                                                <strong
                                                                    style={{
                                                                        display: "block",
                                                                        marginTop: "4px",
                                                                        color: "#302c3a",
                                                                        fontSize: "14px",
                                                                    }}
                                                                >
                                                                    {booking.vehicleName || vehicle?.name || "Unknown vehicle"}
                                                                </strong>
                                                                <span
                                                                    style={{
                                                                        display: "block",
                                                                        marginTop: "3px",
                                                                        color: "#777182",
                                                                        fontSize: "12px",
                                                                    }}
                                                                >
                                                                    {booking.licensePlate || vehicle?.licensePlate || ""}
                                                                    {driver ? ` · ${driver.name}` : ""}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* ROUTE + DATE */}
                                                        <div style={{ minWidth: 0 }}>
                                                            <span
                                                                style={{
                                                                    display: "block",
                                                                    color: "#8a8298",
                                                                    fontSize: "11px",
                                                                    fontWeight: 800,
                                                                    textTransform: "uppercase",
                                                                    letterSpacing: "0.08em",
                                                                }}
                                                            >
                                                                Route
                                                            </span>
                                                            <div
                                                                style={{
                                                                    marginTop: "7px",
                                                                    color: "#373241",
                                                                    fontSize: "13px",
                                                                    lineHeight: 1.45,
                                                                }}
                                                            >
                                                                <strong>{booking.pickup}</strong>
                                                                <span style={{ color: "#7055e8", margin: "0 6px", fontWeight: 800 }}>→</span>
                                                                <strong>{booking.destination}</strong>
                                                            </div>
                                                            <div
                                                                style={{
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    gap: "8px",
                                                                    marginTop: "9px",
                                                                    color: "#777182",
                                                                    fontSize: "12px",
                                                                }}
                                                            >
                                                                <span>📅 {booking.date}</span>
                                                                <span>·</span>
                                                                <span>🕐 {booking.time}</span>
                                                            </div>
                                                            {isReturn && booking.returnDate && booking.returnTime && (
                                                                <div
                                                                    style={{
                                                                        marginTop: "4px",
                                                                        color: "#777182",
                                                                        fontSize: "12px",
                                                                    }}
                                                                >
                                                                    Return: {booking.returnDate} · {booking.returnTime}
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* TOTAL + STATUS */}
                                                        <div
                                                            style={{
                                                                minWidth: "90px",
                                                                textAlign: "right",
                                                            }}
                                                        >
                                                            <span
                                                                style={{
                                                                    display: "inline-flex",
                                                                    alignItems: "center",
                                                                    gap: "6px",
                                                                    padding: "7px 10px",
                                                                    borderRadius: "999px",
                                                                    background: "#eaf8f0",
                                                                    color: "#16804a",
                                                                    fontSize: "11px",
                                                                    fontWeight: 800,
                                                                    marginBottom: "10px",
                                                                }}
                                                            >
                                                                <span
                                                                    style={{
                                                                        width: "7px",
                                                                        height: "7px",
                                                                        borderRadius: "50%",
                                                                        background: "#22a05a",
                                                                    }}
                                                                />
                                                                Confirmed
                                                            </span>
                                                            <strong
                                                                style={{
                                                                    display: "block",
                                                                    color: "#654fe0",
                                                                    fontSize: "23px",
                                                                    lineHeight: 1,
                                                                }}
                                                            >
                                                                {formatPrice(booking.price)}
                                                            </strong>
                                                            <span
                                                                style={{
                                                                    display: "block",
                                                                    marginTop: "5px",
                                                                    color: "#8a8298",
                                                                    fontSize: "11px",
                                                                }}
                                                            >
                                                                {booking.passengers} passenger{booking.passengers === 1 ? "" : "s"}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div
                                                        style={{
                                                            marginTop: "17px",
                                                            paddingTop: "13px",
                                                            borderTop: "1px solid #f0ecf6",
                                                            display: "flex",
                                                            justifyContent: "flex-end",
                                                            color: "#938da0",
                                                            fontSize: "11px",
                                                        }}
                                                    >
                                                        {isReturn ? "Return transfer" : "One-way transfer"}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                            </section>

                        </>
                    )}

                    {activeAdminTab === "stays" && (
                        <>

                            {/* BOOKINGS */}

                            <section
                                className="admin-section admin-bookings-section"
                                style={{
                                    padding: "28px",
                                    borderRadius: "24px",
                                    background: "rgba(255,255,255,0.94)",
                                    border: "1px solid #e7e0f5",
                                    boxShadow: "0 16px 40px rgba(75, 55, 125, 0.07)",
                                }}
                            >
                                <div
                                    className="admin-section-header"
                                    style={{
                                        marginBottom: "22px",
                                        paddingBottom: "20px",
                                        borderBottom: "1px solid #eee9f6",
                                    }}
                                >
                                    <div>
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "12px",
                                                marginBottom: "7px",
                                            }}
                                        >
                                                <span
                                                    style={{
                                                        width: "42px",
                                                        height: "42px",
                                                        borderRadius: "13px",
                                                        display: "inline-flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        background: "#f0ebff",
                                                        fontSize: "21px",
                                                    }}
                                                >
                                                    🏨
                                                </span>
                                            <h2 style={{ margin: 0 }}>Bookings</h2>
                                        </div>
                                        <p style={{ margin: 0 }}>
                                            Manage all stay reservations on StayWay.
                                        </p>
                                    </div>
                                </div>

                                {/* BOOKING FILTERS */}
                                <div
                                    style={{
                                        marginBottom: "18px",
                                        padding: "16px",
                                        borderRadius: "18px",
                                        border: "1px solid #ebe5f5",
                                        background: "#fbf9ff",
                                        display: "grid",
                                        gridTemplateColumns: "minmax(260px, 1.7fr) minmax(150px, 0.8fr) minmax(150px, 0.8fr) minmax(170px, 0.9fr) auto",
                                        gap: "12px",
                                        alignItems: "end",
                                    }}
                                >
                                    <div className="form-group" style={{ margin: 0 }}>
                                        <label
                                            htmlFor="bookingSearch"
                                            style={{
                                                display: "block",
                                                marginBottom: "7px",
                                                fontSize: "12px",
                                                fontWeight: 800,
                                                color: "#5f596d",
                                            }}
                                        >
                                            Search bookings
                                        </label>
                                        <input
                                            id="bookingSearch"
                                            type="text"
                                            value={bookingSearch}
                                            onChange={(event) =>
                                                setBookingSearch(event.target.value)
                                            }
                                            placeholder="Hotel, user or date..."
                                            style={{ width: "100%", boxSizing: "border-box" }}
                                        />
                                    </div>

                                    <div className="form-group" style={{ margin: 0 }}>
                                        <label
                                            htmlFor="bookingUserFilter"
                                            style={{
                                                display: "block",
                                                marginBottom: "7px",
                                                fontSize: "12px",
                                                fontWeight: 800,
                                                color: "#5f596d",
                                            }}
                                        >
                                            User
                                        </label>
                                        <select
                                            id="bookingUserFilter"
                                            value={bookingUserFilter}
                                            onChange={(event) =>
                                                setBookingUserFilter(event.target.value)
                                            }
                                            style={{ width: "100%", boxSizing: "border-box" }}
                                        >
                                            <option value="All">All users</option>
                                            {users.map((user) => (
                                                <option key={user.id} value={user.id}>
                                                    {user.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group" style={{ margin: 0 }}>
                                        <label
                                            htmlFor="bookingStatusFilter"
                                            style={{
                                                display: "block",
                                                marginBottom: "7px",
                                                fontSize: "12px",
                                                fontWeight: 800,
                                                color: "#5f596d",
                                            }}
                                        >
                                            Status
                                        </label>
                                        <select
                                            id="bookingStatusFilter"
                                            value={bookingStatusFilter}
                                            onChange={(event) =>
                                                setBookingStatusFilter(event.target.value)
                                            }
                                            style={{ width: "100%", boxSizing: "border-box" }}
                                        >
                                            <option value="All">All statuses</option>
                                            <option value="confirmed">Confirmed</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </div>

                                    <div className="form-group" style={{ margin: 0 }}>
                                        <label
                                            htmlFor="bookingSort"
                                            style={{
                                                display: "block",
                                                marginBottom: "7px",
                                                fontSize: "12px",
                                                fontWeight: 800,
                                                color: "#5f596d",
                                            }}
                                        >
                                            Sort by
                                        </label>
                                        <select
                                            id="bookingSort"
                                            value={bookingSort}
                                            onChange={(event) =>
                                                setBookingSort(event.target.value)
                                            }
                                            style={{ width: "100%", boxSizing: "border-box" }}
                                        >
                                            <option value="newest">Newest first</option>
                                            <option value="oldest">Oldest first</option>
                                            <option value="totalDesc">Price: High to Low</option>
                                            <option value="totalAsc">Price: Low to High</option>
                                        </select>
                                    </div>

                                    <button
                                        type="button"
                                        className="admin-booking-clear"
                                        onClick={() => {
                                            setBookingSearch("");
                                            setBookingStatusFilter("All");
                                            setBookingSort("newest");
                                            setBookingUserFilter("All");
                                        }}
                                        style={{
                                            minHeight: "46px",
                                            padding: "0 18px",
                                            borderRadius: "12px",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        Clear
                                    </button>
                                </div>

                                {/* RESULTS SUMMARY */}
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        gap: "12px",
                                        marginBottom: "14px",
                                        padding: "0 3px",
                                        color: "#777182",
                                        fontSize: "13px",
                                    }}
                                >
                                        <span>
                                            Showing <strong style={{ color: "#302c3a" }}>{filteredBookings.length}</strong> of{" "}
                                            <strong style={{ color: "#302c3a" }}>{allBookings.length}</strong> bookings
                                        </span>
                                    <span
                                        style={{
                                            padding: "6px 10px",
                                            borderRadius: "999px",
                                            background: "#f3efff",
                                            color: "#6552d7",
                                            fontWeight: 800,
                                            fontSize: "11px",
                                        }}
                                    >
                                            Stay reservations
                                        </span>
                                </div>

                                {/* BOOKINGS */}
                                {filteredBookings.length === 0 ? (
                                    <div className="admin-empty-state">
                                        <p>No bookings found.</p>
                                        <button
                                            type="button"
                                            className="admin-cancel-button"
                                            onClick={() => {
                                                setBookingSearch("");
                                                setBookingStatusFilter("All");
                                                setBookingSort("newest");
                                                setBookingUserFilter("All");
                                            }}
                                        >
                                            Clear filters
                                        </button>
                                    </div>
                                ) : (
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "12px",
                                        }}
                                    >
                                        {filteredBookings.map((booking) => {
                                            const user = users.find(
                                                (item) => item.id === booking.userId
                                            );
                                            const property = allProperties.find(
                                                (item) => item.id === booking.propertyId
                                            );
                                            const isConfirmed = booking.status === "confirmed";

                                            return (
                                                <div
                                                    key={booking.id}
                                                    style={{
                                                        display: "grid",
                                                        gridTemplateColumns: "minmax(280px, 1.45fr) minmax(180px, 0.85fr) minmax(170px, 0.8fr) 120px",
                                                        gap: "18px",
                                                        alignItems: "center",
                                                        padding: "18px",
                                                        border: "1px solid #ece7f5",
                                                        borderRadius: "18px",
                                                        background: "#ffffff",
                                                        boxShadow: "0 6px 18px rgba(73, 55, 116, 0.04)",
                                                    }}
                                                >
                                                    {/* PROPERTY */}
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: "14px",
                                                            minWidth: 0,
                                                        }}
                                                    >
                                                        {property?.image ? (
                                                            <img
                                                                src={property.image}
                                                                alt={property.name}
                                                                style={{
                                                                    width: "82px",
                                                                    height: "64px",
                                                                    objectFit: "cover",
                                                                    borderRadius: "13px",
                                                                    flexShrink: 0,
                                                                    background: "#f2effa",
                                                                }}
                                                            />
                                                        ) : (
                                                            <div
                                                                style={{
                                                                    width: "82px",
                                                                    height: "64px",
                                                                    borderRadius: "13px",
                                                                    flexShrink: 0,
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "center",
                                                                    background: "#f2effa",
                                                                    fontSize: "25px",
                                                                }}
                                                            >
                                                                🏨
                                                            </div>
                                                        )}
                                                        <div style={{ minWidth: 0 }}>
                                                                <span
                                                                    style={{
                                                                        display: "block",
                                                                        color: "#8a8298",
                                                                        fontSize: "10px",
                                                                        fontWeight: 800,
                                                                        textTransform: "uppercase",
                                                                        letterSpacing: "0.08em",
                                                                        marginBottom: "4px",
                                                                    }}
                                                                >
                                                                    Property
                                                                </span>
                                                            <strong
                                                                style={{
                                                                    display: "block",
                                                                    color: "#302c3a",
                                                                    fontSize: "15px",
                                                                    lineHeight: 1.3,
                                                                    overflow: "hidden",
                                                                    textOverflow: "ellipsis",
                                                                    whiteSpace: "nowrap",
                                                                }}
                                                            >
                                                                {property?.name ?? "Unknown property"}
                                                            </strong>
                                                            {property?.stars ? (
                                                                <span
                                                                    style={{
                                                                        display: "block",
                                                                        marginTop: "5px",
                                                                        color: "#f2b94b",
                                                                        fontSize: "12px",
                                                                        letterSpacing: "1px",
                                                                    }}
                                                                >
                                                                        {"★".repeat(property.stars)}
                                                                    </span>
                                                            ) : null}
                                                        </div>
                                                    </div>

                                                    {/* USER */}
                                                    <div style={{ minWidth: 0 }}>
                                                            <span
                                                                style={{
                                                                    display: "block",
                                                                    color: "#8a8298",
                                                                    fontSize: "10px",
                                                                    fontWeight: 800,
                                                                    textTransform: "uppercase",
                                                                    letterSpacing: "0.08em",
                                                                    marginBottom: "5px",
                                                                }}
                                                            >
                                                                Guest
                                                            </span>
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                gap: "9px",
                                                                minWidth: 0,
                                                            }}
                                                        >
                                                                <span
                                                                    style={{
                                                                        width: "34px",
                                                                        height: "34px",
                                                                        borderRadius: "11px",
                                                                        display: "inline-flex",
                                                                        alignItems: "center",
                                                                        justifyContent: "center",
                                                                        background: "#f0ebff",
                                                                        color: "#6954db",
                                                                        fontSize: "12px",
                                                                        fontWeight: 900,
                                                                        flexShrink: 0,
                                                                    }}
                                                                >
                                                                    {(user?.name?.[0] || "U").toUpperCase()}
                                                                </span>
                                                            <div style={{ minWidth: 0 }}>
                                                                <strong
                                                                    style={{
                                                                        display: "block",
                                                                        color: "#3b3645",
                                                                        fontSize: "13px",
                                                                        overflow: "hidden",
                                                                        textOverflow: "ellipsis",
                                                                        whiteSpace: "nowrap",
                                                                    }}
                                                                >
                                                                    {user?.name ?? "Unknown user"}
                                                                </strong>
                                                                <span
                                                                    style={{
                                                                        display: "block",
                                                                        marginTop: "2px",
                                                                        color: "#8a8298",
                                                                        fontSize: "11px",
                                                                        overflow: "hidden",
                                                                        textOverflow: "ellipsis",
                                                                        whiteSpace: "nowrap",
                                                                    }}
                                                                >
                                                                        {user?.email ?? ""}
                                                                    </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* DATES */}
                                                    <div style={{ minWidth: 0 }}>
                                                            <span
                                                                style={{
                                                                    display: "block",
                                                                    color: "#8a8298",
                                                                    fontSize: "10px",
                                                                    fontWeight: 800,
                                                                    textTransform: "uppercase",
                                                                    letterSpacing: "0.08em",
                                                                    marginBottom: "6px",
                                                                }}
                                                            >
                                                                Stay dates
                                                            </span>
                                                        <strong
                                                            style={{
                                                                display: "block",
                                                                color: "#3b3645",
                                                                fontSize: "13px",
                                                            }}
                                                        >
                                                            {new Date(booking.checkIn).toLocaleDateString("ro-RO")} →{" "}
                                                            {new Date(booking.checkOut).toLocaleDateString("ro-RO")}
                                                        </strong>
                                                    </div>

                                                    {/* TOTAL + STATUS */}
                                                    <div
                                                        style={{
                                                            textAlign: "right",
                                                            minWidth: 0,
                                                        }}
                                                    >
                                                            <span
                                                                style={{
                                                                    display: "inline-flex",
                                                                    alignItems: "center",
                                                                    gap: "5px",
                                                                    padding: "6px 9px",
                                                                    borderRadius: "999px",
                                                                    color: isConfirmed ? "#16804a" : "#dc2626",
                                                                    background: isConfirmed ? "#eaf8f0" : "#fef0f0",
                                                                    fontSize: "10px",
                                                                    fontWeight: 800,
                                                                    textTransform: "capitalize",
                                                                    marginBottom: "8px",
                                                                }}
                                                            >
                                                                <span
                                                                    style={{
                                                                        width: "6px",
                                                                        height: "6px",
                                                                        borderRadius: "50%",
                                                                        background: isConfirmed ? "#22a05a" : "#ef4444",
                                                                    }}
                                                                />
                                                                {booking.status}
                                                            </span>
                                                        <strong
                                                            style={{
                                                                display: "block",
                                                                color: "#654fe0",
                                                                fontSize: "20px",
                                                                lineHeight: 1.1,
                                                            }}
                                                        >
                                                            {formatPrice(booking.totalPrice)}
                                                        </strong>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </section>


                        </>
                    )}

                </div>
            </section>
        </main>
    );
}
