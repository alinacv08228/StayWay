"use client";

import { useEffect, useState } from "react";
import { bookings as mockBookings, properties, users } from "../../data/mockData";
import { useUser } from "../../context/UserContext";
import { Booking } from "../../types/types";

export default function AdminPage() {
    const { currentUser } = useUser();

    const [allBookings, setAllBookings] = useState<Booking[]>(mockBookings);

    useEffect(() => {
        const savedBookings = localStorage.getItem("stayway_bookings");

        const saved: Booking[] = savedBookings
            ? JSON.parse(savedBookings)
            : [];

        setAllBookings([...mockBookings, ...saved]);
    }, []);

    if (currentUser.role !== "admin") {
        return (
            <main>
                <section className="section">
                    <div className="container">
                        <h1>Access denied</h1>

                        <p>
                            You don't have permission to access the admin panel.
                        </p>
                    </div>
                </section>
            </main>
        );
    }

    const adminUsers = users.filter(
        (user) => user.role === "admin"
    );

    return (
        <main>
            <section className="section">
                <div className="container admin-page">

                    <div className="admin-header">
                        <div>
                            <p className="admin-label">
                                ADMIN PANEL
                            </p>

                            <h1>Admin Dashboard</h1>

                            <p className="admin-description">
                                Manage users, stays and bookings on StayWay.
                            </p>
                        </div>
                    </div>

                    {/* STATISTICS */}

                    <div className="admin-stats">

                        <div className="admin-stat-card">
                            <span>Properties</span>
                            <strong>{properties.length}</strong>
                        </div>

                        <div className="admin-stat-card">
                            <span>Users</span>
                            <strong>{users.length}</strong>
                        </div>

                        <div className="admin-stat-card">
                            <span>Bookings</span>
                            <strong>{allBookings.length}</strong>
                        </div>

                        <div className="admin-stat-card">
                            <span>Admins</span>
                            <strong>{adminUsers.length}</strong>
                        </div>

                    </div>

                    {/* PROPERTIES */}

                    <section className="admin-section">

                        <div className="admin-section-header">
                            <div>
                                <h2>Properties</h2>

                                <p>
                                    Manage available stays.
                                </p>
                            </div>
                        </div>

                        <div className="admin-table">

                            <div className="admin-table-header">
                                <span>Name</span>
                                <span>Location</span>
                                <span>Rating</span>
                                <span>Price</span>
                            </div>

                            {properties.map((property) => (
                                <div
                                    className="admin-table-row"
                                    key={property.id}
                                >
                                    <strong>
                                        {property.name}
                                    </strong>

                                    <span>
                                        {property.address}
                                    </span>

                                    <span>
                                        ★ {property.rating}
                                    </span>

                                    <span>
                                        €{property.pricePerNight} / night
                                    </span>
                                </div>
                            ))}

                        </div>

                    </section>

                    {/* USERS */}

                    <section className="admin-section">

                        <div className="admin-section-header">
                            <div>
                                <h2>Users</h2>

                                <p>
                                    Users registered on StayWay.
                                </p>
                            </div>
                        </div>

                        <div className="admin-table">

                            <div className="admin-table-header">
                                <span>Name</span>
                                <span>Email</span>
                                <span>Role</span>
                            </div>

                            {users.map((user) => (
                                <div
                                    className="admin-table-row"
                                    key={user.id}
                                >
                                    <strong>
                                        {user.name}
                                    </strong>

                                    <span>
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
                            ))}

                        </div>

                    </section>

                    {/* BOOKINGS */}

                    <section className="admin-section">

                        <div className="admin-section-header">
                            <div>
                                <h2>Bookings</h2>

                                <p>
                                    Recent reservations.
                                </p>
                            </div>
                        </div>

                        <div className="admin-table">

                            <div className="admin-table-header">
                                <span>Property</span>
                                <span>User</span>
                                <span>Dates</span>
                                <span>Total</span>
                                <span>Status</span>
                            </div>

                            {allBookings.map((booking) => {

                                const user = users.find(
                                    (item) =>
                                        item.id === booking.userId
                                );

                                const property = properties.find(
                                    (item) =>
                                        item.id === booking.propertyId
                                );

                                return (
                                    <div
                                        className="admin-table-row"
                                        key={booking.id}
                                    >
                                        <strong>
                                            {property?.name}
                                        </strong>

                                        <span>
                                            {user?.name}
                                        </span>

                                        <span>
                                            {booking.checkIn} →{" "}
                                            {booking.checkOut}
                                        </span>

                                        <span>
                                            €{booking.totalPrice}
                                        </span>

                                        <span className="status-badge">
                                            {booking.status}
                                        </span>
                                    </div>
                                );
                            })}

                        </div>

                    </section>

                    {/* CURRENT MOCK USER */}

                    <section className="admin-user-card">

                        <div>

                            <p className="admin-label">
                                CURRENT MOCK USER
                            </p>

                            <h2>
                                {currentUser.name}
                            </h2>

                            <p>
                                {currentUser.email}
                            </p>

                        </div>

                        <div className="mock-role">

                            <span>
                                Role
                            </span>

                            <strong>
                                {currentUser.role}
                            </strong>

                        </div>

                    </section>

                </div>
            </section>
        </main>
    );
}