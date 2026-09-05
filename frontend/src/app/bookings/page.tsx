"use client";

import ProtectedRoute from "../../components/ProtectedRoute";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
    Building2,
    DoorOpen,
    User,
    CalendarDays,
    Users,
    Tag,
    Circle,
    Search,
    SlidersHorizontal,
    X,
} from "lucide-react";

import {
    bookings as mockBookings,
    properties,
    users,
    rooms,
} from "../../data/mockData";

import { useSettings } from "../../context/SettingsContext";
import { useUser } from "../../context/UserContext";
import { currencyInfo } from "../../data/currency";
import { getTranslation } from "../../data/translations";

type Booking = {
    id: number;
    userId: number;
    propertyId: number;
    roomId?: number;
    checkIn: string;
    checkOut: string;
    adults?: number;
    children?: number;
    infants?: number;
    guests: number;
    totalPrice: number;
    status: "confirmed" | "cancelled" | string;
};

function formatDate(date: string) {
    const [year, month, day] = date.split("-");
    return `${day}.${month}.${year}`;
}

export default function BookingsPage() {
    return (
        <ProtectedRoute>
            <BookingsContent />
        </ProtectedRoute>
    );
}

function BookingsContent() {
    const { language, currency } = useSettings();
    const { currentUser } = useUser();

    const [userBookings, setUserBookings] = useState<Booking[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [sortBy, setSortBy] = useState("newest");

    const selectedCurrency =
        currencyInfo[currency] ?? currencyInfo["Euro"];

    useEffect(() => {
        if (!currentUser) {
            return;
        }

        const savedBookings =
            localStorage.getItem("stayway_bookings");

        let allBookings: Booking[] = [];

        if (savedBookings) {
            try {
                allBookings = JSON.parse(savedBookings) as Booking[];
            } catch {
                allBookings = mockBookings as Booking[];
            }
        } else {
            allBookings = mockBookings as Booking[];

            localStorage.setItem(
                "stayway_bookings",
                JSON.stringify(allBookings)
            );
        }

        const visibleBookings =
            currentUser.role === "admin"
                ? allBookings
                : allBookings.filter(
                    (booking) =>
                        booking.userId === currentUser.id
                );

        setUserBookings(visibleBookings);
        setIsLoaded(true);
    }, [currentUser]);

    const formatPrice = (price: number) => {
        const convertedPrice =
            price * selectedCurrency.rate;

        return `${selectedCurrency.symbol}${Math.round(
            convertedPrice
        ).toLocaleString()}`;
    };

    const getStatusText = (status: string) => {
        if (status === "confirmed") {
            return (
                getTranslation(
                    language,
                    "confirmed"
                ) || "confirmed"
            );
        }

        if (status === "cancelled") {
            return (
                getTranslation(
                    language,
                    "cancelled"
                ) || "cancelled"
            );
        }

        return status;
    };

    const getGuestText = (booking: Booking) => {
        if (
            booking.adults !== undefined ||
            booking.children !== undefined ||
            booking.infants !== undefined
        ) {
            const adults = booking.adults ?? 0;
            const children = booking.children ?? 0;
            const infants = booking.infants ?? 0;

            return `${adults} ${
                adults === 1 ? "adult" : "adults"
            } · ${children} ${
                children === 1 ? "child" : "children"
            } · ${infants} ${
                infants === 1 ? "infant" : "infants"
            }`;
        }

        return `${booking.guests} ${
            booking.guests === 1 ? "guest" : "guests"
        }`;
    };

    const filteredBookings = useMemo(() => {
        const query = search.trim().toLowerCase();

        const result = userBookings.filter((booking) => {
            const user = users.find(
                (item) => item.id === booking.userId
            );

            const property = properties.find(
                (item) => item.id === booking.propertyId
            );

            const room = rooms.find(
                (item) =>
                    item.id === booking.roomId &&
                    item.propertyId === booking.propertyId
            );

            const searchableText = [
                property?.name ?? "",
                room?.name ?? "",
                user?.name ?? "",
                user?.email ?? "",
                booking.status,
                booking.checkIn,
                booking.checkOut,
                formatDate(booking.checkIn),
                formatDate(booking.checkOut),
                String(booking.totalPrice),
            ]
                .join(" ")
                .toLowerCase();

            const matchesSearch =
                query === "" ||
                searchableText.includes(query);

            const matchesStatus =
                statusFilter === "All" ||
                booking.status === statusFilter;

            return matchesSearch && matchesStatus;
        });

        return [...result].sort((a, b) => {
            if (sortBy === "oldest") {
                return (
                    new Date(a.checkIn).getTime() -
                    new Date(b.checkIn).getTime()
                );
            }

            if (sortBy === "totalHigh") {
                return b.totalPrice - a.totalPrice;
            }

            if (sortBy === "totalLow") {
                return a.totalPrice - b.totalPrice;
            }

            return (
                new Date(b.checkIn).getTime() -
                new Date(a.checkIn).getTime()
            );
        });
    }, [
        userBookings,
        search,
        statusFilter,
        sortBy,
    ]);

    const clearFilters = () => {
        setSearch("");
        setStatusFilter("All");
        setSortBy("newest");
    };

    const hasActiveFilters =
        search.trim() !== "" ||
        statusFilter !== "All" ||
        sortBy !== "newest";

    const handleCancelBooking = (bookingId: number) => {
        const confirmed = window.confirm(
            getTranslation(
                language,
                "cancelQuestion"
            )
        );

        if (!confirmed) {
            return;
        }

        const savedBookings =
            localStorage.getItem("stayway_bookings");

        if (!savedBookings) {
            return;
        }

        let allBookings: Booking[];

        try {
            allBookings = JSON.parse(
                savedBookings
            ) as Booking[];
        } catch {
            return;
        }

        const updatedAllBookings = allBookings.map(
            (booking) =>
                booking.id === bookingId
                    ? {
                        ...booking,
                        status: "cancelled",
                    }
                    : booking
        );

        localStorage.setItem(
            "stayway_bookings",
            JSON.stringify(updatedAllBookings)
        );

        const visibleBookings =
            currentUser?.role === "admin"
                ? updatedAllBookings
                : updatedAllBookings.filter(
                    (booking) =>
                        booking.userId ===
                        currentUser?.id
                );

        setUserBookings(visibleBookings);
    };

    if (!isLoaded) {
        return (
            <main className="bookings-loading-page">
                <section className="section">
                    <div className="container bookings-page">
                        <p>
                            {getTranslation(
                                language,
                                "loading"
                            )}
                        </p>
                    </div>
                </section>
            </main>
        );
    }

    return (
        <main>
            <section className="section">
                <div className="container bookings-page">

                    <h1
                        className="page-title bookings-title-animation"
                        style={{
                            animation:
                                "heroFadeUp 0.8s ease both",
                        }}
                    >
                        {getTranslation(
                            language,
                            "myBookings"
                        )}
                    </h1>

                    {/* SEARCH + FILTERS */}

                    <div
                        className="bookings-filters"
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "minmax(260px, 1fr) 220px 220px auto",
                            gap: "12px",
                            alignItems: "stretch",
                            marginBottom: "32px",
                            animation:
                                "heroFadeUp 0.8s ease 0.16s both",
                        }}
                    >
                        {/* SEARCH */}

                        <div
                            style={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                background: "#ffffff",
                                border:
                                    "1px solid #ddd8ec",
                                borderRadius: "16px",
                                minHeight: "58px",
                                boxShadow:
                                    "0 8px 24px rgba(78, 64, 125, 0.06)",
                                transition:
                                    "border-color 0.2s ease, box-shadow 0.2s ease",
                            }}
                        >
                            <Search
                                size={20}
                                style={{
                                    marginLeft: "18px",
                                    color: "#6c5ce7",
                                    flexShrink: 0,
                                }}
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={(event) =>
                                    setSearch(
                                        event.target.value
                                    )
                                }
                                placeholder="Search by hotel, room, guest or date..."
                                aria-label="Search bookings"
                                style={{
                                    width: "100%",
                                    height: "56px",
                                    border: "none",
                                    outline: "none",
                                    background:
                                        "transparent",
                                    padding:
                                        "0 16px 0 12px",
                                    fontSize: "15px",
                                    color: "#302d3a",
                                    boxSizing:
                                        "border-box",
                                }}
                            />

                            {search && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        setSearch("")
                                    }
                                    aria-label="Clear search"
                                    style={{
                                        border: "none",
                                        background:
                                            "transparent",
                                        cursor: "pointer",
                                        marginRight:
                                            "12px",
                                        padding: "6px",
                                        color: "#777184",
                                        display: "flex",
                                    }}
                                >
                                    <X size={18} />
                                </button>
                            )}
                        </div>

                        {/* STATUS */}

                        <div
                            style={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                background: "#ffffff",
                                border:
                                    "1px solid #ddd8ec",
                                borderRadius: "16px",
                                minHeight: "58px",
                                boxShadow:
                                    "0 8px 24px rgba(78, 64, 125, 0.06)",
                            }}
                        >
                            <Circle
                                size={17}
                                style={{
                                    marginLeft: "16px",
                                    color: "#6c5ce7",
                                    flexShrink: 0,
                                }}
                            />

                            <select
                                value={statusFilter}
                                onChange={(event) =>
                                    setStatusFilter(
                                        event.target.value
                                    )
                                }
                                aria-label="Filter by status"
                                style={{
                                    width: "100%",
                                    height: "56px",
                                    border: "none",
                                    outline: "none",
                                    background:
                                        "transparent",
                                    padding:
                                        "0 14px 0 10px",
                                    fontSize: "15px",
                                    color: "#302d3a",
                                    cursor: "pointer",
                                }}
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
                        </div>

                        {/* SORT */}

                        <div
                            style={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                background: "#ffffff",
                                border:
                                    "1px solid #ddd8ec",
                                borderRadius: "16px",
                                minHeight: "58px",
                                boxShadow:
                                    "0 8px 24px rgba(78, 64, 125, 0.06)",
                            }}
                        >
                            <SlidersHorizontal
                                size={18}
                                style={{
                                    marginLeft: "16px",
                                    color: "#6c5ce7",
                                    flexShrink: 0,
                                }}
                            />

                            <select
                                value={sortBy}
                                onChange={(event) =>
                                    setSortBy(
                                        event.target.value
                                    )
                                }
                                aria-label="Sort bookings"
                                style={{
                                    width: "100%",
                                    height: "56px",
                                    border: "none",
                                    outline: "none",
                                    background:
                                        "transparent",
                                    padding:
                                        "0 14px 0 10px",
                                    fontSize: "15px",
                                    color: "#302d3a",
                                    cursor: "pointer",
                                }}
                            >
                                <option value="newest">
                                    Check-in: newest
                                </option>

                                <option value="oldest">
                                    Check-in: oldest
                                </option>

                                <option value="totalHigh">
                                    Total: high to low
                                </option>

                                <option value="totalLow">
                                    Total: low to high
                                </option>
                            </select>
                        </div>

                        {/* CLEAR */}

                        <button
                            type="button"
                            onClick={clearFilters}
                            disabled={!hasActiveFilters}
                            style={{
                                minHeight: "58px",
                                padding:
                                    "0 22px",
                                border:
                                    "1px solid #ddd8ec",
                                borderRadius: "16px",
                                background:
                                    hasActiveFilters
                                        ? "#ffffff"
                                        : "#f7f5fb",
                                color:
                                    hasActiveFilters
                                        ? "#5b526b"
                                        : "#aaa4b4",
                                fontSize: "15px",
                                fontWeight: 700,
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

                    {userBookings.length > 0 && (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent:
                                    "space-between",
                                gap: "12px",
                                marginBottom:
                                    "18px",
                                color: "#777184",
                                fontSize: "14px",
                                animation:
                                    "heroFadeUp 0.7s ease 0.24s both",
                            }}
                        >
                            <span>
                                Showing{" "}
                                <strong
                                    style={{
                                        color: "#393343",
                                    }}
                                >
                                    {
                                        filteredBookings.length
                                    }
                                </strong>{" "}
                                of{" "}
                                <strong
                                    style={{
                                        color: "#393343",
                                    }}
                                >
                                    {
                                        userBookings.length
                                    }
                                </strong>{" "}
                                bookings
                            </span>
                        </div>
                    )}

                    {/* NO BOOKINGS */}

                    {userBookings.length === 0 ? (
                        <p
                            className="bookings-description-animation"
                            style={{
                                animation:
                                    "heroFadeUp 0.8s ease 0.16s both",
                            }}
                        >
                            {getTranslation(
                                language,
                                "noBookings"
                            )}
                        </p>
                    ) : filteredBookings.length === 0 ? (
                        <div
                            className="home-empty-state"
                            style={{
                                animation:
                                    "heroFadeUp 0.7s ease both",
                            }}
                        >
                            <h3>
                                No bookings found
                            </h3>

                            <p>
                                Try another search
                                term or change the
                                filters.
                            </p>
                        </div>
                    ) : (
                        <div className="bookings-list">

                            {filteredBookings.map(
                                (
                                    booking,
                                    index
                                ) => {
                                    const user =
                                        users.find(
                                            (item) =>
                                                item.id ===
                                                booking.userId
                                        );

                                    const property =
                                        properties.find(
                                            (item) =>
                                                item.id ===
                                                booking.propertyId
                                        );

                                    const room =
                                        rooms.find(
                                            (item) =>
                                                item.id ===
                                                booking.roomId &&
                                                item.propertyId ===
                                                booking.propertyId
                                        );

                                    const isConfirmed =
                                        booking.status ===
                                        "confirmed";

                                    return (
                                        <div
                                            className="booking-card"
                                            key={
                                                booking.id
                                            }
                                            style={{
                                                animation:
                                                    "heroFadeUp 0.7s ease both",
                                                animationDelay:
                                                    `${0.12 + index * 0.1}s`,
                                            }}
                                        >
                                            <div className="booking-content">

                                                <h2>
                                                    {
                                                        property?.name
                                                    }
                                                </h2>

                                                <div className="booking-info">

                                                    {/* PROPERTY */}

                                                    <div className="booking-info-row">
                                                        <Building2 className="booking-info-icon" />

                                                        <div>
                                                            <strong>
                                                                {
                                                                    getTranslation(
                                                                        language,
                                                                        "property"
                                                                    )
                                                                }
                                                            </strong>

                                                            <span>
                                                                {
                                                                    property?.name
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* ROOM */}

                                                    <div className="booking-info-row">
                                                        <DoorOpen className="booking-info-icon" />

                                                        <div>
                                                            <strong>
                                                                {
                                                                    getTranslation(
                                                                        language,
                                                                        "room"
                                                                    )
                                                                }
                                                            </strong>

                                                            <span>
                                                                {
                                                                    room?.name ??
                                                                    getTranslation(
                                                                        language,
                                                                        "roomNotSpecified"
                                                                    )
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* USER */}

                                                    <div className="booking-info-row">
                                                        <User className="booking-info-icon" />

                                                        <div>
                                                            <strong>
                                                                {
                                                                    getTranslation(
                                                                        language,
                                                                        "user"
                                                                    )
                                                                }
                                                            </strong>

                                                            <span>
                                                                {
                                                                    user?.name ??
                                                                    "Unknown user"
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* CHECK-IN */}

                                                    <div className="booking-info-row">
                                                        <CalendarDays className="booking-info-icon" />

                                                        <div>
                                                            <strong>
                                                                {
                                                                    getTranslation(
                                                                        language,
                                                                        "checkIn"
                                                                    )
                                                                }
                                                            </strong>

                                                            <span>
                                                                {
                                                                    formatDate(
                                                                        booking.checkIn
                                                                    )
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* CHECK-OUT */}

                                                    <div className="booking-info-row">
                                                        <CalendarDays className="booking-info-icon" />

                                                        <div>
                                                            <strong>
                                                                {
                                                                    getTranslation(
                                                                        language,
                                                                        "checkOut"
                                                                    )
                                                                }
                                                            </strong>

                                                            <span>
                                                                {
                                                                    formatDate(
                                                                        booking.checkOut
                                                                    )
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* GUESTS */}

                                                    <div className="booking-info-row">
                                                        <Users className="booking-info-icon" />

                                                        <div>
                                                            <strong>
                                                                {
                                                                    getTranslation(
                                                                        language,
                                                                        "guests"
                                                                    )
                                                                }
                                                            </strong>

                                                            <span>
                                                                {
                                                                    getGuestText(
                                                                        booking
                                                                    )
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* TOTAL */}

                                                    <div className="booking-info-row">
                                                        <Tag className="booking-info-icon" />

                                                        <div>
                                                            <strong>
                                                                {
                                                                    getTranslation(
                                                                        language,
                                                                        "total"
                                                                    )
                                                                }
                                                            </strong>

                                                            <span>
                                                                {
                                                                    formatPrice(
                                                                        booking.totalPrice
                                                                    )
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* STATUS */}

                                                    <div className="booking-info-row">
                                                        <Circle className="booking-info-icon status-icon" />

                                                        <div>
                                                            <strong>
                                                                {
                                                                    getTranslation(
                                                                        language,
                                                                        "status"
                                                                    )
                                                                }
                                                            </strong>

                                                            <span
                                                                className={
                                                                    isConfirmed
                                                                        ? "booking-status status-confirmed"
                                                                        : "booking-status status-cancelled"
                                                                }
                                                            >
                                                                {
                                                                    getStatusText(
                                                                        booking.status
                                                                    )
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>

                                                </div>

                                                <div className="booking-actions">

                                                    {property && (
                                                        <Link
                                                            href={`/stays/${property.id}`}
                                                            className="button"
                                                        >
                                                            {
                                                                getTranslation(
                                                                    language,
                                                                    "viewProperty"
                                                                )
                                                            }
                                                        </Link>
                                                    )}

                                                    {booking.status !==
                                                        "cancelled" && (
                                                            <button
                                                                type="button"
                                                                className="cancel-button"
                                                                onClick={() =>
                                                                    handleCancelBooking(
                                                                        booking.id
                                                                    )
                                                                }
                                                            >
                                                                {
                                                                    getTranslation(
                                                                        language,
                                                                        "cancelBooking"
                                                                    )
                                                                }
                                                            </button>
                                                        )}

                                                </div>

                                            </div>
                                        </div>
                                    );
                                }
                            )}

                        </div>
                    )}

                </div>
            </section>
        </main>
    );
}