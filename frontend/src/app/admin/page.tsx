"use client";

import "./admin.css";

import {
    FormEvent,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import { useUser } from "../../context/UserContext";

import { useSettings } from "../../context/SettingsContext";

import api from "../../lib/api";

import {
    getDestinationUiTranslation,
    getLocalizedCountryName,
    getLocalizedCityName,
} from "../../data/translations";
import { currencyInfo } from "../../data/currency";

import {
    Property,
    Destination,
    Room,
    User,
} from "../../types/types";

import {
    getBookingsFromApi,
    updateBookingInApi,
    type Booking,
} from "../../services/bookingService";

import {
    createPropertyInApi,
    deletePropertyInApi,
    getPropertiesFromApi,
    updatePropertyInApi,
} from "../../services/propertyService";

import {
    createRoomInApi,
    deleteRoomInApi,
    getRoomsFromApi,
    updateRoomInApi,
} from "../../services/roomService";

import {
    createDestinationInApi,
    getDestinationsFromApi,
    updateDestinationInApi,
} from "../../services/destinationService";

import {
    createTransferVehicleInApi,
    deleteTransferVehicleInApi,
    getTransferVehiclesFromApi,
    updateTransferVehicleInApi,
} from "../../services/transferVehicleService";

import {
    createTransferDriverInApi,
    deleteTransferDriverInApi,
    getTransferDriversFromApi,
    updateTransferDriverInApi,
    TransferDriver,
} from "../../services/transferDriverService";

import { TransferVehicle } from "../../data/transferVehicles";

import {
    getTransferBookingsFromApi,
    updateTransferBookingInApi,
    TransferBooking,
} from "../../services/transferService";

import { useRouter } from "next/navigation";

type AdminBooking = Booking & {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
};


export default function AdminPage() {
    const {
        currentUser,
        isLoading,
    } = useUser();

    const router = useRouter();

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

    const formatTransferDate = (date: string) => {
        const parts = date.split("-");

        if (parts.length === 3 && parts[0].length === 4) {
            return `${parts[2]}.${parts[1]}.${parts[0]}`;
        }

        return date;
    };

    const [allBookings, setAllBookings] =
        useState<Booking[]>([]);

    const [allProperties, setAllProperties] =
        useState<Property[]>([]);

    const [activeAdminTab, setActiveAdminTab] =
        useState<"stays" | "transfers" | "users">("stays");

    const [allDestinations, setAllDestinations] =
        useState<Destination[]>([]);

    const [allRooms, setAllRooms] =
        useState<Room[]>([]);

    const [allTransferVehicles, setAllTransferVehicles] =
        useState<TransferVehicle[]>([]);

    const [allTransferDrivers, setAllTransferDrivers] =
        useState<TransferDriver[]>([]);

    const [allTransferBookings, setAllTransferBookings] =
        useState<TransferBooking[]>([]);

    const [adminUsers, setAdminUsers] =
        useState<User[]>([]);

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

    const [selectedScheduleDriverId, setSelectedScheduleDriverId] =
        useState<string | null>(null);

    const formatScheduleDate = (date: string) => {
        const parsedDate = new Date(`${date}T00:00:00`);

        if (Number.isNaN(parsedDate.getTime())) {
            return date;
        }

        return parsedDate.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const getScheduleBookings = (driverId: string) => {
        return allTransferBookings
            .filter(
                (booking) =>
                    booking.driverId === driverId &&
                    booking.status !== "cancelled" &&
                    Boolean(booking.date && booking.time)
            )
            .sort((a, b) => {
                const first = new Date(
                    `${a.date}T${a.time}`
                ).getTime();

                const second = new Date(
                    `${b.date}T${b.time}`
                ).getTime();

                return first - second;
            });
    };

    const getBookingDuration = (booking: TransferBooking) => {
        return booking.optionTitle
            .toLowerCase()
            .includes("family")
            ? 40
            : 35;
    };

    const getAdminTransferDriverStatus = (
        driver: TransferDriver
    ): "available" | "busy" | "inactive" => {
        if (driver.status === "inactive") {
            return "inactive";
        }

        if (driver.status === "busy") {
            return "busy";
        }

        const now = Date.now();
        const bookings = allTransferBookings.filter(
            (booking) =>
                booking.driverId === driver.id &&
                booking.status !== "cancelled"
        );

        const isLegActive = (
            date?: string,
            time?: string,
            durationMinutes: number = 35
        ) => {
            if (!date || !time) {
                return false;
            }

            const start = new Date(
                `${date}T${time}`
            ).getTime();

            if (Number.isNaN(start)) {
                return false;
            }

            const end =
                start +
                durationMinutes * 60 * 1000;

            return now >= start && now <= end;
        };

        const isCurrentlyBusy = bookings.some((booking) => {
            const duration = getBookingDuration(booking);

            if (
                isLegActive(
                    booking.date,
                    booking.time,
                    duration
                )
            ) {
                return true;
            }

            return (
                booking.transferType === "return" &&
                isLegActive(
                    booking.returnDate,
                    booking.returnTime,
                    duration
                )
            );
        });

        return isCurrentlyBusy
            ? "busy"
            : "available";
    };

    const handleTransferVehicleSubmit = async (
        event: FormEvent
    ) => {
        event.preventDefault();

        setVehicleError("");

        if (!vehicleName.trim()) {
            setVehicleError(
                "Enter vehicle name."
            );
            return;
        }

        if (!vehicleLicensePlate.trim()) {
            setVehicleError(
                "Enter license plate."
            );
            return;
        }

        const vehicleData: TransferVehicle = {
            id: editingVehicleId ?? "",
            city: vehicleCity,
            name: vehicleName.trim(),
            licensePlate:
                vehicleLicensePlate.trim(),
            category: vehicleCategory,
            passengers:
                Number(vehiclePassengers),
            luggage:
                Number(vehicleLuggage),
            image:
                getTransferImagePath(
                    vehicleImage
                ),
            driverId:
                editingVehicleId
                    ? allTransferVehicles.find(
                        (vehicle) =>
                            vehicle.id ===
                            editingVehicleId
                    )?.driverId
                    : undefined,
        };

        try {
            if (editingVehicleId) {
                await updateTransferVehicleInApi(
                    editingVehicleId,
                    vehicleData
                );
            } else {
                await createTransferVehicleInApi(
                    vehicleData
                );
            }

            setAllTransferVehicles(
                await getTransferVehiclesFromApi()
            );

            setVehicleName("");
            setVehicleLicensePlate("");
            setVehicleCategory("Private");
            setVehiclePassengers("3");
            setVehicleLuggage("2");
            setVehicleImage("");
            setVehicleCity(
                selectedTransferCity
            );
            setEditingVehicleId(null);
            setIsVehicleFormOpen(false);
        } catch {
            setVehicleError(
                "Could not save the vehicle. Please try again."
            );
        }
    };

    const handleDeleteTransferVehicle = async (
        vehicleId: string
    ) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this vehicle?"
        );

        if (!confirmed) return;

        try {
            await deleteTransferVehicleInApi(
                vehicleId
            );

            setAllTransferVehicles(
                await getTransferVehiclesFromApi()
            );
        } catch {
            window.alert(
                "Could not delete the vehicle. Please try again."
            );
        }
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

    const handleTransferDriverSubmit = async (event: FormEvent) => {
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

        const driverId =
            editingDriverId || `driver-${Date.now()}`;

        const selectedVehicle = transferDriverVehicleId
            ? allTransferVehicles.find(
                (vehicle) =>
                    vehicle.id === transferDriverVehicleId
            )
            : undefined;

        if (
            selectedVehicle &&
            selectedVehicle.city !== driverCity
        ) {
            setDriverError(
                "Please select a valid vehicle from the same city."
            );
            return;
        }

        if (
            selectedVehicle?.driverId &&
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

        try {
            if (editingDriverId) {
                await updateTransferDriverInApi(
                    editingDriverId,
                    driverData
                );
            } else {
                await createTransferDriverInApi(
                    driverData
                );
            }

            const previousVehicles =
                allTransferVehicles.filter(
                    (vehicle) =>
                        vehicle.driverId === driverId &&
                        vehicle.id !== selectedVehicle?.id
                );

            await Promise.all(
                previousVehicles.map((vehicle) =>
                    updateTransferVehicleInApi(
                        vehicle.id,
                        {
                            ...vehicle,
                            driverId: undefined,
                        }
                    )
                )
            );

            if (
                selectedVehicle &&
                selectedVehicle.driverId !== driverId
            ) {
                await updateTransferVehicleInApi(
                    selectedVehicle.id,
                    {
                        ...selectedVehicle,
                        driverId,
                    }
                );
            }

            setAllTransferDrivers(
                await getTransferDriversFromApi()
            );

            setAllTransferVehicles(
                await getTransferVehiclesFromApi()
            );

            setDriverName("");
            setDriverPhone("");
            setDriverStatus("available");
            setDriverCity(selectedTransferCity);
            setTransferDriverVehicleId("");
            setEditingDriverId(null);
            setIsDriverFormOpen(false);
        } catch {
            setDriverError(
                "Could not save the driver. Please try again."
            );
        }
    };

    const handleDeleteTransferDriver = async (
        driverId: string
    ) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this driver?"
        );

        if (!confirmed) return;

        try {
            const assignedVehicles =
                allTransferVehicles.filter(
                    (vehicle) =>
                        vehicle.driverId === driverId
                );

            await Promise.all(
                assignedVehicles.map((vehicle) =>
                    updateTransferVehicleInApi(
                        vehicle.id,
                        {
                            ...vehicle,
                            driverId: undefined,
                        }
                    )
                )
            );

            await deleteTransferDriverInApi(
                driverId
            );

            setAllTransferDrivers(
                await getTransferDriversFromApi()
            );

            setAllTransferVehicles(
                await getTransferVehiclesFromApi()
            );
        } catch {
            window.alert(
                "Could not delete the driver. Please try again."
            );
        }
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

    const bookingCustomers = useMemo(() => {
        const customers = new Map<
            string,
            {
                key: string;
                name: string;
                email: string;
                phone: string;
            }
        >();

        allBookings.forEach((booking) => {
            const customer = booking as AdminBooking;
            const fallbackUser = adminUsers.find(
                (user) =>
                    String(user.id) ===
                    String(booking.userId)
            );

            const name = [
                customer.firstName,
                customer.lastName,
            ]
                .filter(Boolean)
                .join(" ")
                .trim() || fallbackUser?.name || "Unknown user";

            const email =
                customer.email?.trim() ||
                fallbackUser?.email ||
                "";

            const phone = customer.phone?.trim() || "";

            const key =
                customer.firstName ||
                customer.lastName ||
                customer.email ||
                customer.phone
                    ? `customer:${name}|${email}|${phone}`
                    : `user:${booking.userId}`;

            if (!customers.has(key)) {
                customers.set(key, {
                    key,
                    name,
                    email,
                    phone,
                });
            }
        });

        return Array.from(customers.values()).sort((a, b) =>
            a.name.localeCompare(b.name)
        );
    }, [allBookings, adminUsers]);

    const [transferBookingStatusFilter, setTransferBookingStatusFilter] =
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

        return adminUsers.filter((user) => {
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
    }, [adminUsers, userSearch, userRoleFilter]);


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

            const customer = booking as AdminBooking;

            const user = adminUsers.find(
                (user) =>
                    String(user.id) ===
                    String(booking.userId)
            );

            const propertyName =
                property?.name.toLowerCase() ?? "";

            const bookingGuestName = [
                customer.firstName,
                customer.lastName,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            const bookingGuestEmail =
                customer.email?.toLowerCase() ?? "";

            const bookingGuestPhone =
                customer.phone?.toLowerCase() ?? "";

            const userName =
                user?.name.toLowerCase() ?? "";

            const userEmail =
                user?.email.toLowerCase() ?? "";

            const checkIn =
                booking.checkIn.toLowerCase();

            const checkOut =
                booking.checkOut.toLowerCase();

            const status =
                booking.status.toLowerCase();

            const matchesSearch =
                !search ||
                propertyName.includes(search) ||
                bookingGuestName.includes(search) ||
                bookingGuestEmail.includes(search) ||
                bookingGuestPhone.includes(search) ||
                userName.includes(search) ||
                userEmail.includes(search) ||
                checkIn.includes(search) ||
                checkOut.includes(search) ||
                status.includes(search);

            const bookingCustomerKey =
                customer.firstName ||
                customer.lastName ||
                customer.email ||
                customer.phone
                    ? `customer:${[
                        customer.firstName,
                        customer.lastName,
                    ]
                        .filter(Boolean)
                        .join(" ")
                        .trim() || "Unknown user"}|${
                        customer.email?.trim() ?? ""
                    }|${customer.phone?.trim() ?? ""}`
                    : `user:${booking.userId}`;

            const matchesUser =
                bookingUserFilter === "All" ||
                bookingCustomerKey === bookingUserFilter;

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
        adminUsers,
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

        const confirmedTransferBookings =
            allTransferBookings.filter(
                (booking) =>
                    booking.status ===
                    "confirmed"
            );

        const confirmedTotal =
            confirmedStayBookings + confirmedTransferBookings.length;

        const totalRevenue =
            confirmedRevenue +
            confirmedTransferBookings.reduce(
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
            .filter(
                (booking) =>
                    booking.status ===
                    "confirmed"
            )
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

            if (date === null || date < start) {
                return false;
            }

            // For the 12-month view, include the entire current month,
            // including future bookings already made for this month.
            if (analyticsPeriod === "12m") {
                return true;
            }

            // For 7 Days / 30 Days, keep the period up to today.
            return date <= now;
        });

        const filteredTransferBookings = allTransferBookings.filter((booking) => {
            const date = getDate(booking.date);

            if (date === null || date < start) {
                return false;
            }

            // For the 12-month view, include the entire current month,
            // including future transfer bookings already made for this month.
            if (analyticsPeriod === "12m") {
                return true;
            }

            return date <= now;
        });

        const confirmed =
            filteredStayBookings.filter(
                (booking) => booking.status === "confirmed"
            ).length +
            filteredTransferBookings.filter(
                (booking) =>
                    booking.status ===
                    "confirmed"
            ).length;

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

        const transferRevenue = filteredTransferBookings
            .filter(
                (booking) =>
                    booking.status ===
                    "confirmed"
            )
            .reduce(
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
            /*
             * A return reservation contains two transfer legs:
             * the outbound leg and the return leg.
             * Therefore it must count as 1 in ONE-WAY and 1 in RETURN.
             */
            oneWayTransfers: filteredTransferBookings.length,
            returnTransfers: filteredTransferBookings.filter(
                (booking) => booking.transferType === "return"
            ).length,
            totalRevenue: totalRevenue + transferRevenue,
            transferRevenue,
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
        if (
            isLoading ||
            !currentUser ||
            currentUser.role !== "admin"
        ) {
            return;
        }

        const loadStayBookingsFromBackend = async () => {
            try {
                const loadedBookings =
                    await getBookingsFromApi();

                setAllBookings(
                    loadedBookings
                );
            } catch (error) {
                console.error(
                    "Could not load stay bookings from the backend.",
                    error
                );

                setAllBookings([]);
            }
        };

        const loadPropertiesFromBackend = async () => {
            try {
                const loadedProperties =
                    await getPropertiesFromApi();

                setAllProperties(
                    loadedProperties
                );
            } catch (error) {
                console.error(
                    "Could not load properties from the backend.",
                    error
                );

                setAllProperties([]);
            }
        };

        const loadRoomsFromBackend = async () => {
            try {
                const loadedRooms =
                    await getRoomsFromApi();

                setAllRooms(
                    loadedRooms
                );
            } catch (error) {
                console.error(
                    "Could not load rooms from the backend.",
                    error
                );

                setAllRooms([]);
            }
        };

        const loadDestinationsFromBackend = async () => {
            try {
                const loadedDestinations =
                    await getDestinationsFromApi();

                setAllDestinations(
                    loadedDestinations
                );
            } catch (error) {
                console.error(
                    "Could not load destinations from the backend.",
                    error
                );

                setAllDestinations([]);
            }
        };

        const loadTransferVehiclesFromBackend = async () => {
            try {
                const loadedVehicles =
                    await getTransferVehiclesFromApi();

                setAllTransferVehicles(
                    loadedVehicles
                );
            } catch (error) {
                console.error(
                    "Could not load transfer vehicles from the backend.",
                    error
                );

                setAllTransferVehicles([]);
            }
        };

        const loadTransferDriversFromBackend = async () => {
            try {
                const loadedDrivers =
                    await getTransferDriversFromApi();

                setAllTransferDrivers(
                    loadedDrivers
                );
            } catch (error) {
                console.error(
                    "Could not load transfer drivers from the backend.",
                    error
                );

                setAllTransferDrivers([]);
            }
        };

        const loadTransferBookingsFromBackend = async () => {
            try {
                const loadedTransferBookings =
                    await getTransferBookingsFromApi();

                setAllTransferBookings(
                    loadedTransferBookings
                );
            } catch (error) {
                console.error(
                    "Could not load transfer bookings from the backend.",
                    error
                );

                setAllTransferBookings([]);
            }
        };

        const loadRegisteredUsers = async () => {
            try {
                const response =
                    await api.get<User[]>(
                        "/api/Users"
                    );

                setAdminUsers(
                    response.data
                );
            } catch (error) {
                console.error(
                    "Could not load users from the backend.",
                    error
                );

                setAdminUsers([]);
            }
        };

        const loadDashboardBookings = async () => {
            await Promise.all([
                loadStayBookingsFromBackend(),
                loadTransferBookingsFromBackend(),
            ]);
        };

        void loadStayBookingsFromBackend();
        void loadPropertiesFromBackend();
        void loadRoomsFromBackend();
        void loadDestinationsFromBackend();
        void loadTransferVehiclesFromBackend();
        void loadTransferDriversFromBackend();
        void loadTransferBookingsFromBackend();
        void loadRegisteredUsers();

        const handleRegisteredUsersChange = () => {
            void loadRegisteredUsers();
            void loadDashboardBookings();
        };

        const handleDashboardBookingsChange = () => {
            void loadDashboardBookings();
        };

        const handleWindowFocus = () => {
            void loadRegisteredUsers();
            void loadDashboardBookings();
            void loadPropertiesFromBackend();
            void loadRoomsFromBackend();
            void loadDestinationsFromBackend();
            void loadTransferVehiclesFromBackend();
            void loadTransferDriversFromBackend();
        };

        const handleVisibilityChange = () => {
            if (
                document.visibilityState ===
                "visible"
            ) {
                void loadRegisteredUsers();
                void loadDashboardBookings();
                void loadPropertiesFromBackend();
                void loadRoomsFromBackend();
                void loadDestinationsFromBackend();
                void loadTransferVehiclesFromBackend();
                void loadTransferDriversFromBackend();
            }
        };

        window.addEventListener(
            "stayway_registered_users_changed",
            handleRegisteredUsersChange
        );

        window.addEventListener(
            "stayway_bookings_changed",
            handleDashboardBookingsChange
        );

        window.addEventListener(
            "stayway_transfers_changed",
            handleDashboardBookingsChange
        );

        window.addEventListener(
            "focus",
            handleWindowFocus
        );

        document.addEventListener(
            "visibilitychange",
            handleVisibilityChange
        );

        return () => {
            window.removeEventListener(
                "stayway_registered_users_changed",
                handleRegisteredUsersChange
            );

            window.removeEventListener(
                "stayway_bookings_changed",
                handleDashboardBookingsChange
            );

            window.removeEventListener(
                "stayway_transfers_changed",
                handleDashboardBookingsChange
            );

            window.removeEventListener(
                "focus",
                handleWindowFocus
            );

            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );
        };
    }, [
        currentUser,
        isLoading,
    ]);

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

        // Căutăm dacă primul oraș din catalogul Admin
        // există deja în destinations încărcate din backend.
        const firstAdminCity = adminCities[value]?.[0];

        if (!firstAdminCity) {
            setPropertyDestinationId("");
            setPropertyCity("");
            return;
        }

        const existingDestination = allDestinations.find(
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

        const destination = allDestinations.find(
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

    const handlePropertySubmit = async (
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
         * Create/update destination first, then save the property.
         * Both operations now go through the backend.
         */
        try {
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
                    await createDestinationInApi({
                        id: 0,
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
                const existingDestination =
                    allDestinations.find(
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

                await updateDestinationInApi({
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

            if (
                editingPropertyId !==
                null
            ) {
                await updatePropertyInApi(
                    editingPropertyId,
                    propertyData
                );
            } else {
                await createPropertyInApi(
                    propertyData
                );
            }

            setAllProperties(
                await getPropertiesFromApi()
            );

            setAllDestinations(
                await getDestinationsFromApi()
            );

            resetPropertyForm();

            setIsPropertyFormOpen(
                false
            );
        } catch {
            setPropertyError(
                "Could not save the property or destination. Please try again."
            );
        }
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

    const handleDeleteProperty = async (
        property: Property
    ) => {
        const confirmed =
            window.confirm(
                `Are you sure you want to delete "${property.name}"?`
            );

        if (!confirmed) {
            return;
        }

        try {
            await deletePropertyInApi(
                property.id
            );

            setAllProperties(
                await getPropertiesFromApi()
            );
        } catch {
            window.alert(
                "Could not delete the property. Please try again."
            );
        }
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
    // BOOKING CONFIRMATION
    // =========================================

    const updateStayBookingStatus = async (
        bookingId: number,
        status: "pending" | "confirmed" | "cancelled"
    ) => {
        const booking =
            allBookings.find(
                (item) => item.id === bookingId
            );

        if (!booking) {
            return;
        }

        try {
            const updatedBooking =
                await updateBookingInApi(
                    bookingId,
                    {
                        userId: booking.userId,
                        propertyId: booking.propertyId,
                        roomId: booking.roomId,
                        checkIn: booking.checkIn,
                        checkOut: booking.checkOut,
                        adults: booking.adults,
                        children: booking.children,
                        infants: booking.infants,
                        guests: booking.guests,
                        totalPrice: booking.totalPrice,
                        status,
                        firstName: booking.firstName,
                        lastName: booking.lastName,
                        email: booking.email,
                        phone: booking.phone,
                        specialRequests:
                        booking.specialRequests,
                    }
                );

            const updatedBookings =
                allBookings.map((item) =>
                    item.id === bookingId
                        ? updatedBooking
                        : item
                );

            setAllBookings(
                updatedBookings
            );

            window.dispatchEvent(
                new Event(
                    "stayway_bookings_changed"
                )
            );
        } catch (error) {
            console.error(
                "Could not update the stay booking status through the backend.",
                error
            );

            window.alert(
                "Could not update the booking status. Please try again."
            );
        }
    };

    const updateTransferBookingStatus = async (
        bookingId: string,
        status: "pending" | "confirmed" | "cancelled"
    ) => {
        const booking =
            allTransferBookings.find(
                (item) => item.id === bookingId
            );

        if (!booking) {
            return;
        }

        try {
            const updatedBooking =
                await updateTransferBookingInApi(
                    bookingId,
                    {
                        ...booking,
                        status,
                    }
                );

            setAllTransferBookings(
                (currentBookings) =>
                    currentBookings.map(
                        (item) =>
                            item.id === bookingId
                                ? updatedBooking
                                : item
                    )
            );

            window.dispatchEvent(
                new Event(
                    "stayway_transfers_changed"
                )
            );
        } catch (error) {
            console.error(
                "Could not update the transfer booking status through the backend.",
                error
            );

            window.alert(
                "Could not update the transfer booking status. Please try again."
            );
        }
    };

    // =========================================
    // TRANSFER FILTERS
    // =========================================

    const filteredTransferBookings = (() => {
        const search = transferBookingSearch.trim().toLowerCase();

        /*
         * Transfer bookings are global admin data.
         * The City selector above controls vehicles and drivers,
         * but it must NOT hide a booking made in another city.
         */
        return allTransferBookings.filter((booking) => {
            if (
                transferBookingTypeFilter !== "all" &&
                booking.transferType !== transferBookingTypeFilter
            ) {
                return false;
            }

            const bookingStatus =
                booking.status;

            if (
                transferBookingStatusFilter !== "All" &&
                bookingStatus !== transferBookingStatusFilter
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

    useEffect(() => {
        if (isLoading) {
            return;
        }

        if (!currentUser) {
            router.replace("/login");
            return;
        }

        if (currentUser.role !== "admin") {
            router.replace("/403");
        }
    }, [
        currentUser,
        isLoading,
        router,
    ]);

    // =========================================
    // ACCESS CONTROL
    // =========================================

    if (
        isLoading ||
        !currentUser ||
        currentUser.role !== "admin"
    ) {
        return null;
    }

    // =========================================
    // ADMIN USERS
    // =========================================

    const adminAccounts =
        adminUsers.filter(
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
                                color: "var(--admin-color-777184)",
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
                                    background: "var(--admin-background-7059e8)",
                                    boxShadow: "0 0 0 5px var(--admin-boxshadow-rgba-112-89-232-0-10)",
                                    flexShrink: 0,
                                }}
                            />
                            ADMIN PANEL
                        </p>

                        <h1
                            style={{
                                margin: 0,
                                color: "var(--admin-color-292532)",
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
                                color: "var(--admin-color-746d80)",
                                fontSize: "19px",
                                lineHeight: 1.55,
                                fontWeight: 500,
                            }}
                        >
                            Manage users, stays and bookings on{" "}
                            <strong
                                style={{
                                    color: "var(--admin-color-654fe0)",
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
                                className="admin-management-badge"
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "7px",
                                    minHeight: "32px",
                                    padding: "0 12px",
                                    borderRadius: "999px",
                                    background: "var(--admin-background-rgba-255-255-255-0-72)",
                                    border: "1px solid var(--admin-border-rgba-108-92-231-0-14)",
                                    boxShadow: "0 6px 18px var(--admin-boxshadow-rgba-78-64-125-0-05)",
                                    color: "var(--admin-color-5f596d)",
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
                                        background: "var(--admin-background-22a05a)",
                                    }}
                                />
                                Management overview
                            </span>

                            <span
                                className="admin-control-center-text"
                                style={{
                                    color: "var(--admin-color-938da0)",
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
                            <strong>{adminUsers.length}</strong>
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
                                        color: "var(--admin-color-817b90)",
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
                                        color: "var(--admin-color-292532)",
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
                                    background: "var(--admin-background-rgba-255-255-255-0-72)",
                                    border: "1px solid var(--admin-border-rgba-108-92-231-0-12)",
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
                                                    ? "var(--admin-background-ffffff)"
                                                    : "transparent",
                                            color:
                                                analyticsPeriod === value
                                                    ? "var(--admin-color-5b4bc4)"
                                                    : "var(--admin-color-817b90)",
                                            fontSize: "12px",
                                            fontWeight: 800,
                                            cursor: "pointer",
                                            boxShadow:
                                                analyticsPeriod === value
                                                    ? "0 5px 16px var(--admin-boxshadow-rgba-78-64-125-0-10)"
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
                                className="admin-revenue-card"
                                style={{
                                    minWidth: 0,
                                    padding: "24px",
                                    borderRadius: "24px",
                                    background: "linear-gradient(135deg, var(--admin-background-ffffff) 0%, var(--admin-background-faf8ff) 100%)",
                                    border: "1px solid var(--admin-border-rgba-108-92-231-0-12)",
                                    boxShadow: "0 14px 38px var(--admin-boxshadow-rgba-78-64-125-0-07)",
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
                                                color: "var(--admin-color-817b90)",
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
                                                color: "var(--admin-color-292532)",
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
                                                color: "var(--admin-color-8a8298)",
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
                                            background: "var(--admin-background-f0ebff)",
                                            color: "var(--admin-color-6854df)",
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
                                                stroke="var(--admin-stroke-eeeaf6)"
                                                strokeWidth="1"
                                            />
                                        ))}

                                        <path
                                            d={`${revenuePath} L ${revenueChartPoints[revenueChartPoints.length - 1]?.x ?? 724} 222 L ${revenueChartPoints[0]?.x ?? 36} 222 Z`}
                                            fill="var(--admin-fill-rgba-111-88-232-0-09)"
                                            stroke="none"
                                        />

                                        <path
                                            d={revenuePath}
                                            fill="none"
                                            stroke="var(--admin-stroke-7059e8)"
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
                                                fill="var(--admin-fill-ffffff)"
                                                stroke="var(--admin-stroke-7059e8)"
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
                                        color: "var(--admin-color-91899d)",
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
                                    background: "var(--admin-background-ffffff)",
                                    border: "1px solid var(--admin-border-rgba-108-92-231-0-12)",
                                    boxShadow: "0 14px 38px var(--admin-boxshadow-rgba-78-64-125-0-07)",
                                }}
                            >
                                <span
                                    style={{
                                        color: "var(--admin-color-817b90)",
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
                                            background: `conic-gradient(var(--admin-background-7059e8) 0 ${analyticsData.confirmationRate}%, var(--admin-background-eeeaf6) ${analyticsData.confirmationRate}% 100%)`,
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: "112px",
                                                height: "112px",
                                                borderRadius: "50%",
                                                display: "grid",
                                                placeItems: "center",
                                                background: "var(--admin-background-ffffff)",
                                                textAlign: "center",
                                            }}
                                        >
                                            <div>
                                                <strong
                                                    style={{
                                                        display: "block",
                                                        color: "var(--admin-color-292532)",
                                                        fontSize: "26px",
                                                    }}
                                                >
                                                    {analyticsData.confirmationRate}%
                                                </strong>
                                                <span
                                                    style={{
                                                        color: "var(--admin-color-8a8298)",
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
                                            background: "var(--admin-background-f7f5ff)",
                                        }}
                                    >
                                        <span style={{ color: "var(--admin-color-5e5868)", fontSize: "12px", fontWeight: 700 }}>
                                            <span style={{ color: "var(--admin-color-7059e8)", marginRight: "7px" }}>●</span>
                                            Confirmed
                                        </span>
                                        <strong style={{ color: "var(--admin-color-292532)", fontSize: "14px" }}>
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
                                            background: "var(--admin-background-faf9fc)",
                                        }}
                                    >
                                        <span style={{ color: "var(--admin-color-5e5868)", fontSize: "12px", fontWeight: 700 }}>
                                            <span style={{ color: "var(--admin-color-d7d1e3)", marginRight: "7px" }}>●</span>
                                            Cancelled
                                        </span>
                                        <strong style={{ color: "var(--admin-color-292532)", fontSize: "14px" }}>
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
                                    background: "var(--admin-background-ffffff)",
                                    border: "1px solid var(--admin-border-rgba-108-92-231-0-12)",
                                    boxShadow: "0 14px 38px var(--admin-boxshadow-rgba-78-64-125-0-07)",
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
                                        <span style={{ color: "var(--admin-color-817b90)", fontSize: "12px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                                            Bookings over time
                                        </span>
                                        <strong style={{ display: "block", marginTop: "5px", color: "var(--admin-color-292532)", fontSize: "21px" }}>
                                            Stays vs transfers
                                        </strong>
                                    </div>
                                    <span style={{ color: "var(--admin-color-8a8298)", fontSize: "11px", fontWeight: 700 }}>
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
                                        borderBottom: "1px solid var(--admin-misc-eeeaf6)",
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
                                                        background: "var(--admin-background-f1eef8)",
                                                    }}
                                                    title={`${bucket.label}: ${bucket.stays} stays, ${bucket.transfers} transfers`}
                                                >
                                                    <div style={{ height: `${stayHeight}px`, background: "var(--admin-background-7059e8)" }} />
                                                    <div style={{ height: `${transferHeight}px`, background: "var(--admin-background-b9aaf7)" }} />
                                                </div>
                                                <span
                                                    style={{
                                                        color: "var(--admin-color-91899d)",
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
                                    <span style={{ color: "var(--admin-color-6e6878)", fontSize: "11px", fontWeight: 700 }}>
                                        <span style={{ color: "var(--admin-color-7059e8)", marginRight: "6px" }}>●</span> Stays
                                    </span>
                                    <span style={{ color: "var(--admin-color-6e6878)", fontSize: "11px", fontWeight: 700 }}>
                                        <span style={{ color: "var(--admin-color-b9aaf7)", marginRight: "6px" }}>●</span> Transfers
                                    </span>
                                </div>
                            </div>

                            <div
                                style={{
                                    padding: "24px",
                                    borderRadius: "24px",
                                    background: "var(--admin-background-ffffff)",
                                    border: "1px solid var(--admin-border-rgba-108-92-231-0-12)",
                                    boxShadow: "0 14px 38px var(--admin-boxshadow-rgba-78-64-125-0-07)",
                                }}
                            >
                                <span style={{ color: "var(--admin-color-817b90)", fontSize: "12px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                                    Popular destinations
                                </span>
                                <strong style={{ display: "block", marginTop: "5px", color: "var(--admin-color-292532)", fontSize: "21px" }}>
                                    Where guests stay
                                </strong>

                                <div style={{ display: "grid", gap: "15px", marginTop: "22px" }}>
                                    {analyticsData.popularDestinations.length === 0 ? (
                                        <span style={{ color: "var(--admin-color-91899d)", fontSize: "12px" }}>
                                            No destination data yet.
                                        </span>
                                    ) : (
                                        analyticsData.popularDestinations.map(([name, count], index) => {
                                            const max = analyticsData.popularDestinations[0]?.[1] ?? 1;
                                            return (
                                                <div key={name}>
                                                    <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", marginBottom: "6px" }}>
                                                        <span style={{ color: "var(--admin-color-5e5868)", fontSize: "12px", fontWeight: 700 }}>
                                                            {index + 1}. {name}
                                                        </span>
                                                        <strong style={{ color: "var(--admin-color-292532)", fontSize: "12px" }}>{count}</strong>
                                                    </div>
                                                    <div style={{ height: "7px", borderRadius: "999px", background: "var(--admin-background-eeeaf6)", overflow: "hidden" }}>
                                                        <div style={{ width: `${(count / max) * 100}%`, height: "100%", borderRadius: "999px", background: "linear-gradient(90deg, var(--admin-background-7059e8), var(--admin-background-a08cf2))" }} />
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
                                background: "linear-gradient(135deg, var(--admin-background-ffffff) 0%, var(--admin-background-faf8ff) 100%)",
                                border: "1px solid var(--admin-border-rgba-108-92-231-0-12)",
                                boxShadow: "0 14px 38px var(--admin-boxshadow-rgba-78-64-125-0-07)",
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
                                <div>
                                    <span style={{ color: "var(--admin-color-817b90)", fontSize: "12px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                                        Transfer analytics
                                    </span>
                                    <strong style={{ display: "block", marginTop: "5px", color: "var(--admin-color-292532)", fontSize: "21px" }}>
                                        {dashboardStatistics.totalTransferBookings} transfer reservations
                                    </strong>
                                </div>
                                <div style={{ padding: "8px 12px", borderRadius: "999px", background: "var(--admin-background-f0ebff)", color: "var(--admin-color-6854df)", fontSize: "11px", fontWeight: 800 }}>
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
                                <div style={{ padding: "16px", borderRadius: "16px", background: "var(--admin-background-rgba-255-255-255-0-76)", border: "1px solid var(--admin-border-eeeaf6)" }}>
                                    <span style={{ color: "var(--admin-color-8a8298)", fontSize: "11px", fontWeight: 800 }}>ONE-WAY</span>
                                    <strong style={{ display: "block", marginTop: "7px", color: "var(--admin-color-292532)", fontSize: "24px" }}>{analyticsData.oneWayTransfers}</strong>
                                    <div style={{ height: "6px", marginTop: "10px", borderRadius: "999px", background: "var(--admin-background-eeeaf6)", overflow: "hidden" }}>
                                        <div style={{ width: `${allTransferBookings.length ? (analyticsData.oneWayTransfers / allTransferBookings.length) * 100 : 0}%`, height: "100%", borderRadius: "999px", background: "var(--admin-background-7059e8)" }} />
                                    </div>
                                </div>

                                <div style={{ padding: "16px", borderRadius: "16px", background: "var(--admin-background-rgba-255-255-255-0-76)", border: "1px solid var(--admin-border-eeeaf6)" }}>
                                    <span style={{ color: "var(--admin-color-8a8298)", fontSize: "11px", fontWeight: 800 }}>RETURN</span>
                                    <strong style={{ display: "block", marginTop: "7px", color: "var(--admin-color-292532)", fontSize: "24px" }}>{analyticsData.returnTransfers}</strong>
                                    <div style={{ height: "6px", marginTop: "10px", borderRadius: "999px", background: "var(--admin-background-eeeaf6)", overflow: "hidden" }}>
                                        <div style={{ width: `${allTransferBookings.length ? (analyticsData.returnTransfers / allTransferBookings.length) * 100 : 0}%`, height: "100%", borderRadius: "999px", background: "var(--admin-background-a08cf2)" }} />
                                    </div>
                                </div>

                                <div style={{ padding: "16px", borderRadius: "16px", background: "var(--admin-background-rgba-255-255-255-0-76)", border: "1px solid var(--admin-border-eeeaf6)" }}>
                                    <span style={{ color: "var(--admin-color-8a8298)", fontSize: "11px", fontWeight: 800 }}>TRANSFER REVENUE</span>
                                    <strong style={{ display: "block", marginTop: "7px", color: "var(--admin-color-292532)", fontSize: "24px" }}>
                                        {formatPrice(analyticsData.transferRevenue)}
                                    </strong>
                                    <span style={{ display: "block", marginTop: "5px", color: "var(--admin-color-91899d)", fontSize: "10px" }}>
                                        confirmed transfer reservations
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
                            background: "var(--admin-background-rgba-255-255-255-0-58)",
                            border: "1px solid var(--admin-border-rgba-108-92-231-0-12)",
                            boxShadow: "0 8px 28px var(--admin-boxshadow-rgba-78-64-125-0-07)",
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
                                        ? "var(--admin-background-ffffff)"
                                        : "transparent",
                                color:
                                    activeAdminTab === "stays"
                                        ? "var(--admin-color-5b4bc4)"
                                        : "var(--admin-color-777184)",
                                fontSize: "15px",
                                fontWeight: 800,
                                cursor: "pointer",
                                boxShadow:
                                    activeAdminTab === "stays"
                                        ? "0 6px 18px var(--admin-boxshadow-rgba-78-64-125-0-10)"
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
                                        ? "var(--admin-background-ffffff)"
                                        : "transparent",
                                color:
                                    activeAdminTab === "transfers"
                                        ? "var(--admin-color-5b4bc4)"
                                        : "var(--admin-color-777184)",
                                fontSize: "15px",
                                fontWeight: 800,
                                cursor: "pointer",
                                boxShadow:
                                    activeAdminTab === "transfers"
                                        ? "0 6px 18px var(--admin-boxshadow-rgba-78-64-125-0-10)"
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
                                        ? "var(--admin-background-ffffff)"
                                        : "transparent",
                                color:
                                    activeAdminTab === "users"
                                        ? "var(--admin-color-5b4bc4)"
                                        : "var(--admin-color-777184)",
                                fontSize: "15px",
                                fontWeight: 800,
                                cursor: "pointer",
                                boxShadow:
                                    activeAdminTab === "users"
                                        ? "0 6px 18px var(--admin-boxshadow-rgba-78-64-125-0-10)"
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
                                                    onClick={async () => {

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

                                                        try {
                                                            if (editingRoomId === null) {
                                                                await createRoomInApi(
                                                                    roomData
                                                                );
                                                            } else {
                                                                await updateRoomInApi(
                                                                    editingRoomId,
                                                                    roomData
                                                                );
                                                            }

                                                            setAllRooms(
                                                                await getRoomsFromApi()
                                                            );
                                                            setIsRoomFormOpen(false);
                                                            setEditingRoomId(null);
                                                            setRoomError("");
                                                        } catch {
                                                            setRoomError(
                                                                "Could not save the room. Please try again."
                                                            );
                                                        }
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
                                                            onClick={async () => {
                                                                const confirmed =
                                                                    window.confirm(
                                                                        `Delete "${room.name}"?`
                                                                    );

                                                                if (!confirmed) {
                                                                    return;
                                                                }

                                                                try {
                                                                    await deleteRoomInApi(
                                                                        room.id
                                                                    );

                                                                    setAllRooms(
                                                                        await getRoomsFromApi()
                                                                    );
                                                                } catch {
                                                                    window.alert(
                                                                        "Could not delete the room. Please try again."
                                                                    );
                                                                }
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
                                        background: "linear-gradient(135deg, var(--admin-background-ffffff) 0%, var(--admin-background-faf8ff) 100%)",
                                        border: "1px solid var(--admin-border-ebe6f5)",
                                        boxShadow: "0 8px 24px var(--admin-boxshadow-rgba-78-64-125-0-05)",
                                    }}
                                >
                                    <span style={{ color: "var(--admin-color-8a8298)", fontSize: "11px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                                        Total users
                                    </span>
                                    <strong style={{ display: "block", marginTop: "7px", color: "var(--admin-color-292532)", fontSize: "26px", lineHeight: 1 }}>
                                        {adminUsers.length}
                                    </strong>
                                </div>

                                <div
                                    style={{
                                        padding: "18px 20px",
                                        borderRadius: "18px",
                                        background: "linear-gradient(135deg, var(--admin-background-ffffff) 0%, var(--admin-background-faf8ff) 100%)",
                                        border: "1px solid var(--admin-border-ebe6f5)",
                                        boxShadow: "0 8px 24px var(--admin-boxshadow-rgba-78-64-125-0-05)",
                                    }}
                                >
                                    <span style={{ color: "var(--admin-color-8a8298)", fontSize: "11px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                                        Admin accounts
                                    </span>
                                    <strong style={{ display: "block", marginTop: "7px", color: "var(--admin-color-292532)", fontSize: "26px", lineHeight: 1 }}>
                                        {adminAccounts.length}
                                    </strong>
                                </div>

                                <div
                                    style={{
                                        padding: "18px 20px",
                                        borderRadius: "18px",
                                        background: "linear-gradient(135deg, var(--admin-background-ffffff) 0%, var(--admin-background-faf8ff) 100%)",
                                        border: "1px solid var(--admin-border-ebe6f5)",
                                        boxShadow: "0 8px 24px var(--admin-boxshadow-rgba-78-64-125-0-05)",
                                    }}
                                >
                                    <span style={{ color: "var(--admin-color-8a8298)", fontSize: "11px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                                        Current account
                                    </span>
                                    <strong
                                        style={{
                                            display: "block",
                                            marginTop: "7px",
                                            color: "var(--admin-color-654fe0)",
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
                                        border: "1px solid var(--admin-border-ebe6f5)",
                                        borderRadius: "20px",
                                        background: "var(--admin-background-ffffff)",
                                        boxShadow: "0 8px 24px var(--admin-boxshadow-rgba-78-64-125-0-05)",
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
                                            <h3 style={{ margin: 0, color: "var(--admin-color-292532)", fontSize: "20px" }}>
                                                Registered users
                                            </h3>
                                            <p style={{ margin: "5px 0 0", color: "var(--admin-color-817b90)", fontSize: "13px" }}>
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
                                                                background: "var(--admin-background-f0ebff)",
                                                                color: "var(--admin-color-6954db)",
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
                                        border: "1px solid var(--admin-border-ebe6f5)",
                                        borderRadius: "20px",
                                        background: "linear-gradient(145deg, var(--admin-background-faf8ff) 0%, var(--admin-background-f3efff) 100%)",
                                        boxShadow: "0 8px 24px var(--admin-boxshadow-rgba-78-64-125-0-05)",
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
                                                background: "var(--admin-background-ffffff)",
                                                color: "var(--admin-color-6652d7)",
                                                fontSize: "20px",
                                                fontWeight: 900,
                                                boxShadow: "0 8px 20px var(--admin-boxshadow-rgba-78-64-125-0-08)",
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
                                                    color: "var(--admin-color-8b8499)",
                                                    marginBottom: "4px",
                                                }}
                                            >
                                                Current logged user
                                            </div>
                                            <h3
                                                style={{
                                                    margin: 0,
                                                    fontSize: "20px",
                                                    color: "var(--admin-color-292532)",
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
                                                background: "var(--admin-background-ffffff)",
                                                border: "1px solid var(--admin-border-eee9f7)",
                                            }}
                                        >
                                            <div style={{ fontSize: "11px", fontWeight: 800, color: "var(--admin-color-91899f)", textTransform: "uppercase", marginBottom: "5px" }}>
                                                Email
                                            </div>
                                            <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--admin-color-302a3d)", overflowWrap: "anywhere" }}>
                                                {currentUser.email}
                                            </div>
                                        </div>

                                        <div
                                            style={{
                                                padding: "15px 16px",
                                                borderRadius: "14px",
                                                background: "var(--admin-background-ffffff)",
                                                border: "1px solid var(--admin-border-eee9f7)",
                                            }}
                                        >
                                            <div style={{ fontSize: "11px", fontWeight: 800, color: "var(--admin-color-91899f)", textTransform: "uppercase", marginBottom: "5px" }}>
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
                                                background: "var(--admin-background-faf8ff)",
                                                border: "1px solid var(--admin-border-eee9f7)",
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
                                                        color: "var(--admin-color-5f596d)",
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
                                                        color: "var(--admin-color-5f596d)",
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
                                                                    background: "var(--admin-background-f1edff)",
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
                                                                    background: "var(--admin-background-f1edff)",
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
                                                                    color: "var(--admin-color-302c3a)",
                                                                }}
                                                            >
                                                                {vehicle.name}
                                                            </strong>

                                                            <span
                                                                style={{
                                                                    display: "block",
                                                                    marginTop: "4px",
                                                                    color: "var(--admin-color-777182)",
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
                                                                            color: "var(--admin-color-8a8298)",
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
                                                        )?.id || ""
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
                                                background: "var(--admin-background-faf8ff)",
                                                border: "1px solid var(--admin-border-eee9f7)",
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
                                                        color: "var(--admin-color-5f596d)",
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
                                                        color: "var(--admin-color-5f596d)",
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
                                                    <option value="pending">Pending</option>
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

                                                const status = getAdminTransferDriverStatus(driver);

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
                                                                        getAdminTransferDriverStatus(driver) === "available"
                                                                            ? "var(--admin-color-16a34a)"
                                                                            : getAdminTransferDriverStatus(driver) === "busy"
                                                                                ? "var(--admin-color-f59e0b)"
                                                                                : "var(--admin-misc-dc2626)",
                                                                    fontWeight: 700,
                                                                }}
                                                            >
                                                                {getAdminTransferDriverStatus(driver)}
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
                                                                        color: "var(--admin-color-5f596d)",
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

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setSelectedScheduleDriverId(
                                                                    driver.id
                                                                )
                                                            }
                                                            style={{
                                                                display: "inline-flex",
                                                                alignItems: "center",
                                                                gap: "6px",
                                                                marginTop: "9px",
                                                                padding: 0,
                                                                border: "none",
                                                                background: "transparent",
                                                                color: "var(--admin-color-6652d7)",
                                                                fontSize: "12px",
                                                                fontWeight: 800,
                                                                cursor: "pointer",
                                                            }}
                                                        >
                                                            📅 View schedule
                                                        </button>
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
                                         background: "var(--admin-background-rgba-255-255-255-0-92)",
                                         border: "1px solid var(--admin-border-e7e0f5)",
                                         boxShadow: "0 16px 40px var(--admin-boxshadow-rgba-75-55-125-0-07)",
                                     }}
                            >

                                <div
                                    className="admin-section-header"
                                    style={{
                                        marginBottom: "22px",
                                        paddingBottom: "20px",
                                        borderBottom: "1px solid var(--admin-boxshadow-eee9f6)",
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
                                                    background: "var(--admin-background-f0ebff)",
                                                    fontSize: "21px",
                                                }}
                                            >
                                                🚘
                                            </span>
                                            <h2 style={{ margin: 0 }}>Transfer Bookings</h2>
                                        </div>
                                        <p style={{ margin: 0 }}>
                                            All transfer bookings made on StayWay.
                                        </p>
                                    </div>
                                </div>

                                <div
                                    style={{
                                        marginBottom: "18px",
                                        padding: "16px",
                                        borderRadius: "18px",
                                        border: "1px solid var(--admin-border-ebe5f5)",
                                        background: "var(--admin-background-fbf9ff)",
                                        display: "grid",
                                        gridTemplateColumns: "minmax(260px, 1fr) 170px 170px",
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
                                                color: "var(--admin-color-5f596d)",
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
                                            htmlFor="transferBookingStatusFilter"
                                            style={{
                                                display: "block",
                                                marginBottom: "7px",
                                                fontSize: "12px",
                                                fontWeight: 800,
                                                color: "var(--admin-color-5f596d)",
                                            }}
                                        >
                                            Status
                                        </label>
                                        <select
                                            id="transferBookingStatusFilter"
                                            style={{ width: "100%", boxSizing: "border-box" }}
                                            value={transferBookingStatusFilter}
                                            onChange={(event) =>
                                                setTransferBookingStatusFilter(
                                                    event.target.value
                                                )
                                            }
                                        >
                                            <option value="All">All statuses</option>
                                            <option value="pending">Pending</option>
                                            <option value="confirmed">Confirmed</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </div>

                                    <div className="form-group" style={{ margin: 0 }}>
                                        <label
                                            htmlFor="transferBookingTypeFilter"
                                            style={{
                                                display: "block",
                                                marginBottom: "7px",
                                                fontSize: "12px",
                                                fontWeight: 800,
                                                color: "var(--admin-color-5f596d)",
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
                                            const bookingStatus =
                                                booking.status;
                                            const isPending = bookingStatus === "pending";

                                            return (
                                                <div
                                                    key={booking.id}
                                                    style={{
                                                        position: "relative",
                                                        padding: "16px 18px",
                                                        borderRadius: "20px",
                                                        border: "1px solid var(--admin-border-ebe5f5)",
                                                        background: "var(--admin-background-ffffff)",
                                                        boxShadow: "0 8px 24px var(--admin-boxshadow-rgba-73-55-116-0-055)",
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
                                                                    background: "linear-gradient(135deg, var(--admin-background-eee8ff), var(--admin-background-f7f4ff))",
                                                                    color: "var(--admin-color-7055e8)",
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
                                                                        color: "var(--admin-color-2c2935)",
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
                                                                        color: "var(--admin-color-777182)",
                                                                        fontSize: "13px",
                                                                    }}
                                                                >
                                                                    {booking.email}
                                                                </span>
                                                                <span
                                                                    style={{
                                                                        display: "block",
                                                                        marginTop: "3px",
                                                                        color: "var(--admin-color-777182)",
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
                                                                        background: "var(--admin-background-f2effa)",
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
                                                                        background: "var(--admin-background-f2effa)",
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
                                                                        color: "var(--admin-color-8a8298)",
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
                                                                        color: "var(--admin-color-302c3a)",
                                                                        fontSize: "14px",
                                                                    }}
                                                                >
                                                                    {booking.vehicleName || vehicle?.name || "Unknown vehicle"}
                                                                </strong>
                                                                <span
                                                                    style={{
                                                                        display: "block",
                                                                        marginTop: "3px",
                                                                        color: "var(--admin-color-777182)",
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
                                                                    color: "var(--admin-color-8a8298)",
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
                                                                    color: "var(--admin-color-373241)",
                                                                    fontSize: "13px",
                                                                    lineHeight: 1.45,
                                                                }}
                                                            >
                                                                <strong>{booking.pickup}</strong>
                                                                <span style={{ color: "var(--admin-color-7055e8)", margin: "0 6px", fontWeight: 800 }}>→</span>
                                                                <strong>{booking.destination}</strong>
                                                            </div>
                                                            <div
                                                                style={{
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    gap: "8px",
                                                                    marginTop: "9px",
                                                                    color: "var(--admin-color-777182)",
                                                                    fontSize: "12px",
                                                                }}
                                                            >
                                                                <strong
                                                                    style={{
                                                                        color: "var(--admin-color-5f586c)",
                                                                        fontWeight: 800,
                                                                    }}
                                                                >
                                                                    Plecare:
                                                                </strong>
                                                                <span>📅 {formatTransferDate(booking.date)}</span>
                                                                <span>·</span>
                                                                <span>🕐 {booking.time}</span>
                                                            </div>
                                                            {isReturn && booking.returnDate && booking.returnTime && (
                                                                <div
                                                                    style={{
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                        gap: "8px",
                                                                        marginTop: "5px",
                                                                        color: "var(--admin-color-777182)",
                                                                        fontSize: "12px",
                                                                    }}
                                                                >
                                                                    <strong
                                                                        style={{
                                                                            color: "var(--admin-color-5f586c)",
                                                                            fontWeight: 800,
                                                                        }}
                                                                    >
                                                                        Return:
                                                                    </strong>
                                                                    <span>📅 {formatTransferDate(booking.returnDate)}</span>
                                                                    <span>·</span>
                                                                    <span>🕐 {booking.returnTime}</span>
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
                                                                    background:
                                                                        bookingStatus === "confirmed"
                                                                            ? "var(--admin-background-eaf8f0)"
                                                                            : bookingStatus === "pending"
                                                                                ? "var(--admin-background-fff7e6)"
                                                                                : "var(--admin-background-fef0f0)",
                                                                    color:
                                                                        bookingStatus === "confirmed"
                                                                            ? "var(--admin-color-16804a)"
                                                                            : bookingStatus === "pending"
                                                                                ? "var(--admin-color-b77900)"
                                                                                : "var(--admin-color-dc2626)",
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
                                                                        background:
                                                                            bookingStatus === "confirmed"
                                                                                ? "var(--admin-background-22a05a)"
                                                                                : bookingStatus === "pending"
                                                                                    ? "var(--admin-background-f59e0b)"
                                                                                    : "var(--admin-misc-ef4444)",
                                                                    }}
                                                                />
                                                                {bookingStatus}
                                                            </span>
                                                            <strong
                                                                style={{
                                                                    display: "block",
                                                                    color: "var(--admin-color-654fe0)",
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
                                                                    color: "var(--admin-color-8a8298)",
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
                                                            borderTop: "1px solid var(--admin-misc-f0ecf6)",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "space-between",
                                                            gap: "12px",
                                                            flexWrap: "wrap",
                                                        }}
                                                    >
                                                        <span
                                                            style={{
                                                                color: "var(--admin-color-938da0)",
                                                                fontSize: "11px",
                                                            }}
                                                        >
                                                            {isReturn ? "Return transfer" : "One-way transfer"}
                                                        </span>

                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                gap: "8px",
                                                                flexWrap: "wrap",
                                                            }}
                                                        >
                                                            {bookingStatus === "pending" && (
                                                                <button
                                                                    type="button"
                                                                    className="admin-save-button"
                                                                    style={{
                                                                        minHeight: "38px",
                                                                        padding: "0 14px",
                                                                    }}
                                                                    onClick={() =>
                                                                        updateTransferBookingStatus(
                                                                            booking.id,
                                                                            "confirmed"
                                                                        )
                                                                    }
                                                                >
                                                                    Confirm booking
                                                                </button>
                                                            )}

                                                            {(bookingStatus === "pending" || bookingStatus === "confirmed") && (
                                                                <button
                                                                    type="button"
                                                                    className="admin-cancel-button"
                                                                    style={{
                                                                        minHeight: "38px",
                                                                        padding: "0 14px",
                                                                    }}
                                                                    onClick={() =>
                                                                        updateTransferBookingStatus(
                                                                            booking.id,
                                                                            "cancelled"
                                                                        )
                                                                    }
                                                                >
                                                                    Cancel booking
                                                                </button>
                                                            )}

                                                        </div>
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
                                    background: "var(--admin-background-rgba-255-255-255-0-94)",
                                    border: "1px solid var(--admin-border-e7e0f5)",
                                    boxShadow: "0 16px 40px var(--admin-boxshadow-rgba-75-55-125-0-07)",
                                }}
                            >
                                <div
                                    className="admin-section-header"
                                    style={{
                                        marginBottom: "22px",
                                        paddingBottom: "20px",
                                        borderBottom: "1px solid var(--admin-boxshadow-eee9f6)",
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
                                                        background: "var(--admin-background-f0ebff)",
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
                                        border: "1px solid var(--admin-border-ebe5f5)",
                                        background: "var(--admin-background-fbf9ff)",
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
                                                color: "var(--admin-color-5f596d)",
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
                                                color: "var(--admin-color-5f596d)",
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
                                            {bookingCustomers.map((customer) => (
                                                <option
                                                    key={customer.key}
                                                    value={customer.key}
                                                >
                                                    {customer.name}
                                                    {customer.email ? ` · ${customer.email}` : ""}
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
                                                color: "var(--admin-color-5f596d)",
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
                                            <option value="pending">Pending</option>
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
                                                color: "var(--admin-color-5f596d)",
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
                                        color: "var(--admin-color-777182)",
                                        fontSize: "13px",
                                    }}
                                >
                                        <span>
                                            Showing <strong style={{ color: "var(--admin-color-302c3a)" }}>{filteredBookings.length}</strong> of{" "}
                                            <strong style={{ color: "var(--admin-color-302c3a)" }}>{allBookings.length}</strong> bookings
                                        </span>
                                    <span
                                        style={{
                                            padding: "6px 10px",
                                            borderRadius: "999px",
                                            background: "var(--admin-background-f3efff)",
                                            color: "var(--admin-color-6552d7)",
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
                                            const customer = booking as AdminBooking;
                                            const user = adminUsers.find(
                                                (user) =>
                                                    String(user.id) ===
                                                    String(booking.userId)
                                            );
                                            const property = allProperties.find(
                                                (item) => item.id === booking.propertyId
                                            );
                                            const isConfirmed = booking.status === "confirmed";
                                            const isPending = booking.status === "pending";

                                            return (
                                                <div
                                                    key={booking.id}
                                                    style={{
                                                        display: "grid",
                                                        gridTemplateColumns: "minmax(280px, 1.45fr) minmax(180px, 0.85fr) minmax(170px, 0.8fr) 120px",
                                                        gap: "18px",
                                                        alignItems: "center",
                                                        padding: "18px",
                                                        border: "1px solid var(--admin-border-ece7f5)",
                                                        borderRadius: "18px",
                                                        background: "var(--admin-background-ffffff)",
                                                        boxShadow: "0 6px 18px var(--admin-boxshadow-rgba-73-55-116-0-04)",
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
                                                                    background: "var(--admin-background-f2effa)",
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
                                                                    background: "var(--admin-background-f2effa)",
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
                                                                        color: "var(--admin-color-8a8298)",
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
                                                                    color: "var(--admin-color-302c3a)",
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
                                                                        color: "var(--admin-color-f2b94b)",
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
                                                                    color: "var(--admin-color-8a8298)",
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
                                                                        background: "var(--admin-background-f0ebff)",
                                                                        color: "var(--admin-color-6954db)",
                                                                        fontSize: "12px",
                                                                        fontWeight: 900,
                                                                        flexShrink: 0,
                                                                    }}
                                                                >
                                                                    {(customer.firstName?.[0] || customer.lastName?.[0] || user?.name?.[0] || "U").toUpperCase()}
                                                                </span>
                                                            <div style={{ minWidth: 0 }}>
                                                                <strong
                                                                    style={{
                                                                        display: "block",
                                                                        color: "var(--admin-color-3b3645)",
                                                                        fontSize: "13px",
                                                                        overflow: "hidden",
                                                                        textOverflow: "ellipsis",
                                                                        whiteSpace: "nowrap",
                                                                    }}
                                                                >
                                                                    {[customer.firstName, customer.lastName]
                                                                        .filter(Boolean)
                                                                        .join(" ") || user?.name || "Unknown user"}
                                                                </strong>
                                                                <span
                                                                    style={{
                                                                        display: "block",
                                                                        marginTop: "2px",
                                                                        color: "var(--admin-color-8a8298)",
                                                                        fontSize: "11px",
                                                                        overflow: "hidden",
                                                                        textOverflow: "ellipsis",
                                                                        whiteSpace: "nowrap",
                                                                    }}
                                                                >
                                                                    {customer.email || user?.email || "—"}
                                                                </span>
                                                                <span
                                                                    style={{
                                                                        display: "block",
                                                                        marginTop: "2px",
                                                                        color: "var(--admin-color-8a8298)",
                                                                        fontSize: "11px",
                                                                        overflow: "hidden",
                                                                        textOverflow: "ellipsis",
                                                                        whiteSpace: "nowrap",
                                                                    }}
                                                                >
                                                                    {customer.phone || "—"}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* DATES */}
                                                    <div style={{ minWidth: 0 }}>
                                                            <span
                                                                style={{
                                                                    display: "block",
                                                                    color: "var(--admin-color-8a8298)",
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
                                                                color: "var(--admin-color-3b3645)",
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
                                                                    color:
                                                                        isConfirmed
                                                                            ? "var(--admin-color-16804a)"
                                                                            : isPending
                                                                                ? "var(--admin-color-b77900)"
                                                                                : "var(--admin-color-dc2626)",
                                                                    background:
                                                                        isConfirmed
                                                                            ? "var(--admin-background-eaf8f0)"
                                                                            : isPending
                                                                                ? "var(--admin-background-fff7e6)"
                                                                                : "var(--admin-background-fef0f0)",
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
                                                                        background:
                                                                            isConfirmed
                                                                                ? "var(--admin-background-22a05a)"
                                                                                : isPending
                                                                                    ? "var(--admin-background-f59e0b)"
                                                                                    : "var(--admin-background-ef4444)",
                                                                    }}
                                                                />
                                                                {booking.status}
                                                            </span>
                                                        <strong
                                                            style={{
                                                                display: "block",
                                                                color: "var(--admin-color-654fe0)",
                                                                fontSize: "20px",
                                                                lineHeight: 1.1,
                                                            }}
                                                        >
                                                            {formatPrice(booking.totalPrice)}
                                                        </strong>

                                                        {booking.status === "pending" && (
                                                            <button
                                                                type="button"
                                                                className="admin-save-button"
                                                                style={{
                                                                    minHeight: "36px",
                                                                    padding: "0 12px",
                                                                    marginTop: "9px",
                                                                    fontSize: "12px",
                                                                }}
                                                                onClick={() =>
                                                                    updateStayBookingStatus(
                                                                        booking.id,
                                                                        "confirmed"
                                                                    )
                                                                }
                                                            >
                                                                Confirm booking
                                                            </button>
                                                        )}

                                                        {(booking.status === "pending" || booking.status === "confirmed") && (
                                                            <button
                                                                type="button"
                                                                className="admin-cancel-button"
                                                                style={{
                                                                    minHeight: "36px",
                                                                    padding: "0 12px",
                                                                    marginTop: "9px",
                                                                    fontSize: "12px",
                                                                }}
                                                                onClick={() =>
                                                                    updateStayBookingStatus(
                                                                        booking.id,
                                                                        "cancelled"
                                                                    )
                                                                }
                                                            >
                                                                Cancel booking
                                                            </button>
                                                        )}

                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </section>


                        </>
                    )}

                    {selectedScheduleDriverId && (
                        <div
                            className="driver-schedule-overlay"
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="driver-schedule-title"
                            onClick={(event) => {
                                if (event.target === event.currentTarget) {
                                    setSelectedScheduleDriverId(null);
                                }
                            }}
                            style={{
                                position: "fixed",
                                inset: 0,
                                zIndex: 1000,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "24px",
                                background: "var(--admin-background-rgba-39-32-57-0-42)",
                                backdropFilter: "blur(7px)",
                            }}
                        >
                            {(() => {
                                const scheduleDriver =
                                    allTransferDrivers.find(
                                        (driver) =>
                                            driver.id ===
                                            selectedScheduleDriverId
                                    );

                                if (!scheduleDriver) {
                                    return null;
                                }

                                const assignedVehicle =
                                    allTransferVehicles.find(
                                        (vehicle) =>
                                            vehicle.driverId ===
                                            scheduleDriver.id
                                    );

                                const scheduleBookings =
                                    getScheduleBookings(
                                        scheduleDriver.id
                                    );

                                return (
                                    <div
                                        className="driver-schedule-modal"
                                        style={{
                                            width: "min(720px, 100%)",
                                            maxHeight: "min(720px, 90vh)",
                                            overflowY: "auto",
                                            borderRadius: "24px",
                                            background: "var(--admin-background-ffffff)",
                                            border: "1px solid var(--admin-border-e8e2f2)",
                                            boxShadow:
                                                "0 30px 90px var(--admin-boxshadow-rgba-43-32-72-0-24)",
                                        }}
                                    >
                                        {/* Header */}
                                        <div
                                            className="driver-schedule-header"
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent:
                                                    "space-between",
                                                gap: "20px",
                                                padding: "22px 24px 20px",
                                                borderBottom:
                                                    "1px solid var(--admin-misc-eee9f6)",
                                                background:
                                                    "linear-gradient(135deg, var(--admin-background-ffffff) 0%, var(--admin-background-faf8ff) 100%)",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    minWidth: 0,
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        flexWrap: "wrap",
                                                        gap: "10px",
                                                    }}
                                                >
                                            <span
                                                className="driver-schedule-eyebrow"
                                                style={{
                                                    color: "var(--admin-color-7055e8)",
                                                    fontSize: "10px",
                                                    fontWeight: 900,
                                                    letterSpacing:
                                                        "0.12em",
                                                }}
                                            >
                                                DRIVER SCHEDULE
                                            </span>

                                                    <span
                                                        style={{
                                                            padding:
                                                                "4px 8px",
                                                            borderRadius:
                                                                "999px",
                                                            background:
                                                                scheduleDriver.status ===
                                                                "inactive"
                                                                    ? "var(--admin-background-fff0f0)"
                                                                    : scheduleDriver.status ===
                                                                    "busy"
                                                                        ? "var(--admin-background-fff7e6)"
                                                                        : "var(--admin-misc-eaf8f0)",
                                                            color:
                                                                scheduleDriver.status ===
                                                                "inactive"
                                                                    ? "var(--admin-color-c73535)"
                                                                    : scheduleDriver.status ===
                                                                    "busy"
                                                                        ? "var(--admin-color-b77900)"
                                                                        : "var(--admin-misc-16804a)",
                                                            fontSize: "9px",
                                                            fontWeight: 800,
                                                            textTransform:
                                                                "uppercase",
                                                        }}
                                                    >
                                                {scheduleDriver.status}
                                            </span>
                                                </div>

                                                <h2
                                                    id="driver-schedule-title"
                                                    style={{
                                                        margin: "7px 0 0",
                                                        color: "var(--admin-color-292532)",
                                                        fontSize: "25px",
                                                        lineHeight: 1.15,
                                                        fontWeight: 800,
                                                    }}
                                                >
                                                    {scheduleDriver.name}
                                                </h2>

                                                <div
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        flexWrap: "wrap",
                                                        gap: "7px",
                                                        marginTop: "7px",
                                                        color: "var(--admin-color-777182)",
                                                        fontSize: "11px",
                                                    }}
                                                >
                                            <span>
                                                {scheduleDriver.phone}
                                            </span>
                                                    <span>·</span>
                                                    <span>
                                                {scheduleDriver.city}
                                            </span>

                                                    {assignedVehicle && (
                                                        <>
                                                            <span>·</span>
                                                            <span>
                                                        🚘{" "}
                                                                {
                                                                    assignedVehicle.name
                                                                }
                                                                {" · "}
                                                                {
                                                                    assignedVehicle.licensePlate
                                                                }
                                                    </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            <button
                                                className="driver-schedule-close"
                                                type="button"
                                                aria-label="Close schedule"
                                                onClick={() =>
                                                    setSelectedScheduleDriverId(
                                                        null
                                                    )
                                                }
                                                style={{
                                                    width: "36px",
                                                    height: "36px",
                                                    flexShrink: 0,
                                                    borderRadius: "11px",
                                                    border:
                                                        "1px solid var(--admin-border-e9e4f3)",
                                                    background: "var(--admin-background-ffffff)",
                                                    color: "var(--admin-color-665f72)",
                                                    fontSize: "19px",
                                                    lineHeight: 1,
                                                    cursor: "pointer",
                                                }}
                                            >
                                                ×
                                            </button>
                                        </div>

                                        {/* Schedule content */}
                                        <div
                                            className="driver-schedule-content"
                                            style={{
                                                padding: "20px 24px 24px",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "flex-end",
                                                    justifyContent:
                                                        "space-between",
                                                    gap: "12px",
                                                    marginBottom: "13px",
                                                }}
                                            >
                                                <div>
                                                    <strong
                                                        style={{
                                                            display: "block",
                                                            color: "var(--admin-color-302c3a)",
                                                            fontSize: "15px",
                                                        }}
                                                    >
                                                        Upcoming transfers
                                                    </strong>

                                                    <span
                                                        style={{
                                                            display: "block",
                                                            marginTop: "3px",
                                                            color: "var(--admin-color-91899d)",
                                                            fontSize: "11px",
                                                        }}
                                                    >
                                                {scheduleBookings.length}{" "}
                                                        {scheduleBookings.length ===
                                                        1
                                                            ? "scheduled transfer"
                                                            : "scheduled transfers"}
                                            </span>
                                                </div>
                                            </div>

                                            {scheduleBookings.length === 0 ? (
                                                <div
                                                    className="driver-schedule-empty"
                                                    style={{
                                                        padding: "34px 22px",
                                                        borderRadius: "16px",
                                                        background: "var(--admin-background-faf8ff)",
                                                        border: "1px solid var(--admin-border-eee9f7)",
                                                        textAlign: "center",
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            marginBottom:
                                                                "8px",
                                                            fontSize: "27px",
                                                        }}
                                                    >
                                                        📅
                                                    </div>

                                                    <strong
                                                        style={{
                                                            display: "block",
                                                            color: "var(--admin-color-302c3a)",
                                                            fontSize: "14px",
                                                        }}
                                                    >
                                                        No upcoming transfers
                                                    </strong>

                                                    <span
                                                        style={{
                                                            display: "block",
                                                            marginTop: "4px",
                                                            color: "var(--admin-color-91899d)",
                                                            fontSize: "11px",
                                                        }}
                                                    >
                                                This driver currently has
                                                no active scheduled bookings.
                                            </span>
                                                </div>
                                            ) : (
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        gap: "10px",
                                                    }}
                                                >
                                                    {scheduleBookings.map(
                                                        (booking) => {
                                                            const bookingStatus =
                                                                booking.status ??
                                                                "confirmed";
                                                            const duration =
                                                                getBookingDuration(
                                                                    booking
                                                                );
                                                            const isReturn =
                                                                booking.transferType ===
                                                                "return";

                                                            return (
                                                                <div
                                                                    key={booking.id}
                                                                    className="driver-schedule-booking"
                                                                    style={{
                                                                        borderRadius:
                                                                            "16px",
                                                                        border:
                                                                            "1px solid var(--admin-border-e9e4f3)",
                                                                        overflow:
                                                                            "hidden",
                                                                        background:
                                                                            "var(--admin-background-ffffff)",
                                                                    }}
                                                                >
                                                                    {/* Main transfer */}
                                                                    <div
                                                                        style={{
                                                                            padding:
                                                                                "15px 17px 16px",
                                                                        }}
                                                                    >
                                                                        <div
                                                                            style={{
                                                                                display:
                                                                                    "flex",
                                                                                alignItems:
                                                                                    "flex-start",
                                                                                justifyContent:
                                                                                    "space-between",
                                                                                gap: "15px",
                                                                            }}
                                                                        >
                                                                            <div
                                                                                style={{
                                                                                    minWidth: 0,
                                                                                }}
                                                                            >
                                                                                <div
                                                                                    style={{
                                                                                        display:
                                                                                            "flex",
                                                                                        alignItems:
                                                                                            "center",
                                                                                        flexWrap:
                                                                                            "wrap",
                                                                                        gap: "8px",
                                                                                    }}
                                                                                >
                                                                                    <strong
                                                                                        style={{
                                                                                            color:
                                                                                                "var(--admin-color-302c3a)",
                                                                                            fontSize:
                                                                                                "15px",
                                                                                        }}
                                                                                    >
                                                                                        {formatScheduleDate(
                                                                                            booking.date
                                                                                        )}
                                                                                    </strong>

                                                                                    <span
                                                                                        style={{
                                                                                            padding:
                                                                                                "4px 8px",
                                                                                            borderRadius:
                                                                                                "999px",
                                                                                            background:
                                                                                                bookingStatus ===
                                                                                                "confirmed"
                                                                                                    ? "var(--admin-background-eaf8f0)"
                                                                                                    : bookingStatus ===
                                                                                                    "cancelled"
                                                                                                        ? "var(--admin-misc-fff0f0)"
                                                                                                        : "var(--admin-misc-fff7e6)",
                                                                                            color:
                                                                                                bookingStatus ===
                                                                                                "confirmed"
                                                                                                    ? "var(--admin-color-16804a)"
                                                                                                    : bookingStatus ===
                                                                                                    "cancelled"
                                                                                                        ? "var(--admin-misc-c73535)"
                                                                                                        : "var(--admin-misc-b77900)",
                                                                                            fontSize:
                                                                                                "9px",
                                                                                            fontWeight:
                                                                                                800,
                                                                                            textTransform:
                                                                                                "uppercase",
                                                                                        }}
                                                                                    >
                                                                                {
                                                                                    bookingStatus
                                                                                }
                                                                            </span>
                                                                                </div>

                                                                                <div
                                                                                    style={{
                                                                                        display:
                                                                                            "flex",
                                                                                        alignItems:
                                                                                            "center",
                                                                                        flexWrap:
                                                                                            "wrap",
                                                                                        gap: "8px",
                                                                                        marginTop:
                                                                                            "5px",
                                                                                        color:
                                                                                            "var(--admin-color-6d6678)",
                                                                                        fontSize:
                                                                                            "11px",
                                                                                        fontWeight:
                                                                                            700,
                                                                                    }}
                                                                                >
                                                                            <span>
                                                                                🕐{" "}
                                                                                {
                                                                                    booking.time
                                                                                }
                                                                            </span>
                                                                                    <span>
                                                                                ·{" "}
                                                                                        {
                                                                                            duration
                                                                                        }{" "}
                                                                                        min
                                                                            </span>
                                                                                    <span>
                                                                                ·{" "}
                                                                                        {isReturn
                                                                                            ? "Return"
                                                                                            : "One-way"}
                                                                            </span>
                                                                                </div>
                                                                            </div>

                                                                            <div
                                                                                style={{
                                                                                    flexShrink:
                                                                                        0,
                                                                                    textAlign:
                                                                                        "right",
                                                                                }}
                                                                            >
                                                                        <span
                                                                            style={{
                                                                                display:
                                                                                    "block",
                                                                                color:
                                                                                    "var(--admin-color-9a93a5)",
                                                                                fontSize:
                                                                                    "9px",
                                                                                fontWeight:
                                                                                    800,
                                                                                letterSpacing:
                                                                                    "0.05em",
                                                                                textTransform:
                                                                                    "uppercase",
                                                                            }}
                                                                        >
                                                                            Passenger
                                                                        </span>

                                                                                <strong
                                                                                    style={{
                                                                                        display:
                                                                                            "block",
                                                                                        marginTop:
                                                                                            "3px",
                                                                                        color:
                                                                                            "var(--admin-color-403b4a)",
                                                                                        fontSize:
                                                                                            "11px",
                                                                                    }}
                                                                                >
                                                                                    {
                                                                                        booking.firstName
                                                                                    }{" "}
                                                                                    {
                                                                                        booking.lastName
                                                                                    }
                                                                                </strong>
                                                                            </div>
                                                                        </div>

                                                                        <div
                                                                            style={{
                                                                                display:
                                                                                    "grid",
                                                                                gridTemplateColumns:
                                                                                    "1fr 28px 1fr",
                                                                                alignItems:
                                                                                    "center",
                                                                                gap: "10px",
                                                                                marginTop:
                                                                                    "14px",
                                                                                paddingTop:
                                                                                    "12px",
                                                                                borderTop:
                                                                                    "1px solid var(--admin-misc-f1edf6)",
                                                                            }}
                                                                        >
                                                                            <div
                                                                                style={{
                                                                                    minWidth: 0,
                                                                                }}
                                                                            >
                                                                        <span
                                                                            style={{
                                                                                display:
                                                                                    "block",
                                                                                color:
                                                                                    "var(--admin-color-9a93a5)",
                                                                                fontSize:
                                                                                    "9px",
                                                                                fontWeight:
                                                                                    800,
                                                                                letterSpacing:
                                                                                    "0.05em",
                                                                                textTransform:
                                                                                    "uppercase",
                                                                            }}
                                                                        >
                                                                            Pick-up
                                                                        </span>

                                                                                <strong
                                                                                    style={{
                                                                                        display:
                                                                                            "block",
                                                                                        marginTop:
                                                                                            "4px",
                                                                                        color:
                                                                                            "var(--admin-color-403b4a)",
                                                                                        fontSize:
                                                                                            "11px",
                                                                                        lineHeight:
                                                                                            1.35,
                                                                                    }}
                                                                                >
                                                                                    {
                                                                                        booking.pickup
                                                                                    }
                                                                                </strong>
                                                                            </div>

                                                                            <span
                                                                                style={{
                                                                                    display:
                                                                                        "flex",
                                                                                    alignItems:
                                                                                        "center",
                                                                                    justifyContent:
                                                                                        "center",
                                                                                    color:
                                                                                        "var(--admin-color-7055e8)",
                                                                                    fontSize:
                                                                                        "17px",
                                                                                }}
                                                                            >
                                                                        →
                                                                    </span>

                                                                            <div
                                                                                style={{
                                                                                    minWidth: 0,
                                                                                }}
                                                                            >
                                                                        <span
                                                                            style={{
                                                                                display:
                                                                                    "block",
                                                                                color:
                                                                                    "var(--admin-color-9a93a5)",
                                                                                fontSize:
                                                                                    "9px",
                                                                                fontWeight:
                                                                                    800,
                                                                                letterSpacing:
                                                                                    "0.05em",
                                                                                textTransform:
                                                                                    "uppercase",
                                                                            }}
                                                                        >
                                                                            Destination
                                                                        </span>

                                                                                <strong
                                                                                    style={{
                                                                                        display:
                                                                                            "block",
                                                                                        marginTop:
                                                                                            "4px",
                                                                                        color:
                                                                                            "var(--admin-color-403b4a)",
                                                                                        fontSize:
                                                                                            "11px",
                                                                                        lineHeight:
                                                                                            1.35,
                                                                                    }}
                                                                                >
                                                                                    {
                                                                                        booking.destination
                                                                                    }
                                                                                </strong>
                                                                            </div>
                                                                        </div>

                                                                        <div
                                                                            style={{
                                                                                display:
                                                                                    "flex",
                                                                                alignItems:
                                                                                    "center",
                                                                                flexWrap:
                                                                                    "wrap",
                                                                                gap: "8px",
                                                                                marginTop:
                                                                                    "11px",
                                                                                color:
                                                                                    "var(--admin-color-91899d)",
                                                                                fontSize:
                                                                                    "10px",
                                                                            }}
                                                                        >
                                                                    <span>
                                                                        👤{" "}
                                                                        {
                                                                            booking.passengers
                                                                        }{" "}
                                                                        passenger
                                                                        {booking.passengers ===
                                                                        1
                                                                            ? ""
                                                                            : "s"}
                                                                    </span>

                                                                            <span>
                                                                        ·
                                                                    </span>

                                                                            <span>
                                                                        {
                                                                            booking.email
                                                                        }
                                                                    </span>
                                                                        </div>
                                                                    </div>

                                                                    {/* Return journey */}
                                                                    {isReturn &&
                                                                        booking.returnDate &&
                                                                        booking.returnTime && (
                                                                            <div
                                                                                className="driver-schedule-return"
                                                                                style={{
                                                                                    display:
                                                                                        "flex",
                                                                                    alignItems:
                                                                                        "center",
                                                                                    justifyContent:
                                                                                        "space-between",
                                                                                    gap: "16px",
                                                                                    padding:
                                                                                        "11px 17px 12px",
                                                                                    borderTop:
                                                                                        "1px solid var(--admin-misc-eee9f6)",
                                                                                    background:
                                                                                        "var(--admin-background-faf8ff)",
                                                                                }}
                                                                            >
                                                                                <div
                                                                                    style={{
                                                                                        display:
                                                                                            "flex",
                                                                                        alignItems:
                                                                                            "center",
                                                                                        gap: "10px",
                                                                                    }}
                                                                                >
                                                                            <span
                                                                                className="driver-schedule-return-label"
                                                                                style={{
                                                                                    color:
                                                                                        "var(--admin-color-7055e8)",
                                                                                    fontSize:
                                                                                        "10px",
                                                                                    fontWeight:
                                                                                        900,
                                                                                    letterSpacing:
                                                                                        "0.08em",
                                                                                    textTransform:
                                                                                        "uppercase",
                                                                                }}
                                                                            >
                                                                                Return
                                                                            </span>

                                                                                    <span
                                                                                        style={{
                                                                                            color:
                                                                                                "var(--admin-color-d5cfdf)",
                                                                                        }}
                                                                                    >
                                                                                |
                                                                            </span>

                                                                                    <strong
                                                                                        style={{
                                                                                            color:
                                                                                                "var(--admin-color-4a4453)",
                                                                                            fontSize:
                                                                                                "11px",
                                                                                        }}
                                                                                    >
                                                                                        📅{" "}
                                                                                        {formatScheduleDate(
                                                                                            booking.returnDate
                                                                                        )}
                                                                                    </strong>

                                                                                    <strong
                                                                                        style={{
                                                                                            color:
                                                                                                "var(--admin-color-4a4453)",
                                                                                            fontSize:
                                                                                                "11px",
                                                                                        }}
                                                                                    >
                                                                                        🕐{" "}
                                                                                        {
                                                                                            booking.returnTime
                                                                                        }
                                                                                    </strong>
                                                                                </div>

                                                                                <span
                                                                                    style={{
                                                                                        color:
                                                                                            "var(--admin-color-91899d)",
                                                                                        fontSize:
                                                                                            "10px",
                                                                                    }}
                                                                                >
                                                                            Same driver
                                                                        </span>
                                                                            </div>
                                                                        )}
                                                                </div>
                                                            );
                                                        }
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                    )}

                </div>
            </section>

        </main>
    );
}
